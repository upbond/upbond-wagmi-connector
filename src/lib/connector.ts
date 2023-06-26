import Upbond, {
  IUpbondEmbedParams,
  UpbondInpageProvider,
} from '@upbond/upbond-embed';
import {
  Chain,
  Connector,
  ConnectorData,
  normalizeChainId,
  UserRejectedRequestError,
} from '@wagmi/core';
import { ethers, Signer } from 'ethers';

import { initialUpbondConfig } from '../config';
import { Options } from '../interfaces';

const IS_SERVER = typeof window === 'undefined';

export default class UpbondWagmiConnector extends Connector<
  UpbondInpageProvider,
  Options,
  Signer
> {
  ready = !IS_SERVER;

  id = 'upbond';

  name = 'Upbond Wallet';

  provider: UpbondInpageProvider | null = null;

  upbondInstance!: Upbond;

  torusOptions: Options;

  isConnected: boolean;

  isConnectorInitialized = true;

  upbondInitialParams = initialUpbondConfig;

  network = {
    host: 'mainnet',
    chainId: 1,
    networkName: 'Ethereum Mainnet',
    blockExplorer: 'https://etherscan.io',
    ticker: 'ETH',
    tickerName: 'Ethereum',
  };

  chains: Chain[];

  constructor(config: {
    chains: Chain[];
    options: Options;
    upbondInitialParams?: IUpbondEmbedParams;
  }) {
    super({
      options: config.options,
      chains: config.chains,
    });

    const chainId = config.options.chainId ? config.options.chainId : 1;
    const host = config.options.host ? config.options.host : 'mainnet';

    this.upbondInstance = new Upbond({});
    this.torusOptions = config.options;
    this.isConnected = false;
    this.chains = config.chains;

    // set network according to chain details provided
    const chain = this.chains.find((x) => x.id === chainId);

    if (chain) {
      this.network = {
        host,
        chainId,
        networkName: chain.name,
        tickerName: chain.nativeCurrency?.name,
        ticker: chain.nativeCurrency?.symbol,
        blockExplorer: chain.blockExplorers?.default?.url as string,
      };
    } else {
      console.warn(`ChainId ${chainId} not found in chain list`);
      this.emit('disconnect');
    }

    this.isConnectorInitialized = true;

    if (
      config.upbondInitialParams &&
      Object.keys(config.upbondInitialParams).length > 0
    ) {
      this.upbondInitialParams = {
        ...this.upbondInitialParams,
        ...config.upbondInitialParams,
      };
    }
  }

  async initConnector() {
    this.emit('message', {
      type: 'connecting',
    });

    await this.upbondInstance.init(this.upbondInitialParams);
    const isUpbondLoggedIn =
      this.upbondInstance.isLoggedIn && this.upbondInstance.isInitialized;
    if (isUpbondLoggedIn) {
      this.isConnected = true;
      this.onConnect();

      const provider = this.upbondInstance.provider as UpbondInpageProvider;
      if (provider.on) {
        provider.on('connect', this.onConnect);
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', this.onChainChanged);
        provider.on('disconnect', this.onDisconnect);
      }
    }
  }

  async connect(): Promise<Required<ConnectorData>> {
    try {
      this.emit('message', {
        type: 'connecting',
      });

      if (!this.upbondInstance.isInitialized) {
        await this.upbondInstance.init(this.upbondInitialParams);
      }

      if (!this.upbondInstance.isLoggedIn) await this.upbondInstance.login();

      const provider = this.upbondInstance.provider as UpbondInpageProvider;
      if (provider.on) {
        provider.on('connect', () => {
          // TODO: do anything with on connect emitter
        });
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', async (res: string) => {
          this.onChainChanged(res);
        });
        provider.on('disconnect', this.onDisconnect);
      }

      // Check if there is a user logged in
      const isAuthenticated = await this.isAuthorized();

      // Check if we have a chainId, in case of error just assign 0 for legacy
      // if there is a user logged in, return the user
      if (isAuthenticated) {
        this.onConnect();
        const account = await this.getAccount();

        const getChainId = async () => {
          try {
            return await this.getChainId();
          } catch (error) {
            return 0;
          }
        };

        const chainId = await getChainId();

        return {
          account,
          chain: {
            id: chainId as number,
            unsupported: false,
          },
          provider,
        };
      }
      throw new Error('Failed to login, Please try again');
    } catch (error) {
      console.error(error, '@connectError');
      throw new UserRejectedRequestError('Something went wrong');
    }
  }

  async getAccount(): Promise<`0x${string}`> {
    try {
      const uProvider = await this.getProvider();
      const provider = new ethers.providers.Web3Provider(
        uProvider as UpbondInpageProvider
      );
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      return account as `0x${string}`;
    } catch (error) {
      console.error('Error: Cannot get account:', error);
      throw error;
    }
  }

  async getProvider() {
    if (this.provider) {
      return this.provider;
    }
    this.provider = this.upbondInstance.provider as UpbondInpageProvider;
    return this.provider;
  }

  async getSigner(): Promise<Signer> {
    try {
      const provider = new ethers.providers.Web3Provider(
        await this.getProvider()
      );
      const signer = provider.getSigner();
      return signer;
    } catch (error) {
      console.error('Error: Cannot get signer:', error);
      throw error;
    }
  }

  async isAuthorized(): Promise<boolean> {
    if (!this.upbondInstance.isInitialized) {
      await this.upbondInstance.init(this.upbondInitialParams);
    }
    return this.upbondInstance.isLoggedIn && !!this.upbondInstance.provider;
  }

  async getChainId(): Promise<number> {
    try {
      const provider = await this.getProvider();
      if (!provider && this.network.chainId) {
        return normalizeChainId(this.network.chainId);
      } else if (provider) {
        const chainId = await provider.request({ method: 'eth_chainId' });
        if (chainId) {
          return normalizeChainId(chainId as string);
        }
      }

      throw new Error('Chain ID is not defined');
    } catch (error) {
      console.error('Error: Cannot get Chain Id from the network.', error);
      throw error;
    }
  }

  async switchChain(chainId: number) {
    try {
      const upbondSupportedNetworks = [
        { name: 'Ethereum Mainnet', chainId: 1, host: 'mainnet' },
        { name: 'Goerli', chainId: 5, host: 'goerli' },
        { name: 'Polygon', chainId: 137, host: 'matic' },
        { name: 'Mumbai', chainId: 80001, host: 'mumbai' },
        { name: 'Astar Mainnet', chainId: 80001, host: 'astar_mainnet' },
      ];
      const selectedNetwork = upbondSupportedNetworks.find(
        (network) => network.chainId === chainId
      );
      const wagmiSelectedNetwork = this.chains.find(
        (chain) => chain.id === chainId
      );
      if (!wagmiSelectedNetwork) {
        throw new Error(
          `Network with chain id ${chainId} is not available, please configure your network first`
        );
      }
      if (!selectedNetwork) {
        throw new Error(
          `Hold up! upbond does not support this network -> ${chainId}`
        );
      }
      if (!this.isAuthorized()) throw new Error('Please login first');
      await this.upbondInstance.setProvider({
        host: selectedNetwork.host,
        chainId,
        networkName: selectedNetwork.name,
      });
      return wagmiSelectedNetwork;
    } catch (error) {
      console.error('Error: Cannot change chain', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.upbondInstance.logout();
    await this.upbondInstance.cleanUp();
    localStorage.clear();
    window.location.reload();
  }

  protected isChainUnsupported(chainId: number): boolean {
    return !this.chains.some((x) => x.id === chainId);
  }

  protected readonly onAccountsChanged = (...accounts: unknown[]) => {
    this.emit('change', { account: accounts[0] as `0x${string}` });
  };

  protected readonly onChainChanged = (chainId: string | number) => {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit('change', { chain: { id, unsupported } });
  };

  protected readonly onDisconnect = () => {
    this.disconnect();
  };

  protected readonly onConnect = () => {
    this.emit('connect', {});
  };
}
