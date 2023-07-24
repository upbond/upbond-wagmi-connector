/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Upbond, {
  UPBOND_BUILD_ENV,
  UpbondInpageProvider,
} from '@upbond/upbond-embed';
import { ethers, Signer } from 'ethers';
import log from 'loglevel';
import { Chain, Connector, ConnectorData } from 'wagmi';

import { Options } from '../interfaces';
const IS_SERVER = typeof window === 'undefined';

export default class UpbondWalletConnector extends Connector {
  ready = !IS_SERVER;

  readonly id = 'upbond';

  readonly name = 'Upbond';

  provider: UpbondInpageProvider | null = null;

  upbondInstance!: Upbond;

  upbondWalletOptions: Options;

  isConnected: boolean;

  configUpbond: any;

  network = {
    host: 'mumbai',
    chainId: 80001,
    networkName: 'mumbai',
    blockExplorer: 'https://mumbai.polygonscan.com/',
    ticker: 'MUMBAI',
    tickerName: 'MUMBAI',
    rpcUrl:
      'https://polygon-mumbai.infura.io/v3/74a97bae118345ecbadadaaeb1cf4a53',
  };

  chainList: Chain[];

  constructor(config: { chainList: Chain[]; options: Options }) {
    super(config);
    this.upbondWalletOptions = config.options;
    const chainId = config.options.chainId ? config.options.chainId : 1;
    const host = config.options.host ? config.options.host : 'mainnet';
    this.upbondInstance = new Upbond({
      modalZIndex: config.options.modalZIndex,
    });
    this.isConnected = false;
    this.chainList = config.chainList;
    this.configUpbond = {
      buildEnv: UPBOND_BUILD_ENV.DEVELOPMENT,
      network: this.network,
      dappRedirectUri: config.options.dappRedirectUri,
      whiteLabel: {
        walletTheme: {
          logo: 'https://i.ibb.co/L6vHB5d/company-logo-sample.png',
          name: 'Company',
          buttonLogo: 'https://i.ibb.co/wBmybLc/company-button-logo-sample.png',
          isActive: true,
          modalColor: '#fffff',
          bgColor: '#4B68AE',
          bgColorHover: '#214999',
          textColor: '#f3f3f3',
          textColorHover: '#214999',
          theme: config.options.theme,
          upbondLogin: {
            globalBgColor: '#ffffff',
            globalTextColor: '#4B68AE',
          },
        },
      },
      widgetConfig: {
        showAfterLoggedIn: true,
        showBeforeLoggedIn: true,
      },
    };
    // set network according to chain details provided
    const chain = Array.isArray(this.chainList)
      ? this.chainList.find((x) => x.id === chainId)
      : null;

    if (chain && config.options.host && config.options.dappRedirectUri) {
      this.network = {
        host,
        chainId,
        networkName: chain.name,
        tickerName: chain.nativeCurrency?.name,
        ticker: chain.nativeCurrency?.symbol,
        blockExplorer: chain.blockExplorers?.default?.url,
        rpcUrl: 'https://eth.llamarpc.com',
      };
      this.configUpbond.network = this.network;
    }
  }

  async init() {
    await this.upbondInstance.init(this.configUpbond);
  }

  normalizeChainId(chainId: any): number {
    if (typeof chainId === 'string')
      return Number.parseInt(
        chainId,
        chainId.trim().substring(0, 2) === '0x' ? 16 : 10
      );
    if (typeof chainId === 'bigint') return Number(chainId);
    return chainId;
  }

  async connect(): Promise<Required<ConnectorData>> {
    try {
      this.emit('message', {
        type: 'connecting',
      });
      if (!this.upbondInstance.isInitialized) {
        await this.upbondInstance.init(this.configUpbond);
      }

      if (this.upbondInstance.isInitialized && !this.upbondInstance.isLoggedIn)
        await this.upbondInstance.login();
      const { provider } = this.upbondInstance;
      if (provider.on) {
        provider.on('connect', (res: any) => {
          this.emit('connect', res);
        });
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', (res: any) => {
          this.onChainChanged(res as any);
        });
        provider.on('disconnect', this.onDisconnect);
      }
      // Check if there is a user logged in
      const isAuthenticated = await this.isAuthorized();

      this.emit('message', {
        type: 'initialized',
      });

      // Check if we have a chainId, in case of error just assign 0 for legacy
      // if there is a user logged in, return the user
      if (isAuthenticated) {
        const signer = await this.getSigner();
        const account: any = await signer.getAddress();
        let chainId;
        try {
          chainId = await this.getChainId();
        } catch (e) {
          chainId = 0;
        }
        return {
          account,
          chain: {
            id: chainId,
            unsupported: false,
          },
          provider,
        };
      }
    } catch (error: any) {
      localStorage.setItem('wagmi.wallet', JSON.stringify('upbond'));
      throw new Error(error.reason);
    }
    throw new Error(`failedToLogin`);
  }

  async getAccount(): Promise<any> {
    try {
      const uProvider = await this.getProvider();
      const provider = new ethers.providers.Web3Provider(uProvider as any);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      return account;
    } catch (error) {
      log.error('Error: Cannot get account:', error);
      throw error;
    }
  }

  async getProvider() {
    if (this.provider) {
      return this.provider;
    }
    this.provider = this.upbondInstance.provider as any;
    return this.provider;
  }

  async getSigner(): Promise<Signer> {
    try {
      const provider = new ethers.providers.Web3Provider(
        (await this.getProvider()) as any
      );
      const signer = provider.getSigner();
      return signer;
    } catch (error) {
      log.error('Error: Cannot get signer:', error);
      throw error;
    }
  }

  async isAuthorized() {
    return this.upbondInstance && this.upbondInstance.isLoggedIn;
  }

  async getChainId(): Promise<number> {
    try {
      const provider = await this.getProvider();
      if (!provider && this.network.chainId) {
        return this.normalizeChainId(this.network.chainId);
      } else if (provider) {
        const { chainId } = provider;
        if (chainId) {
          return this.normalizeChainId(chainId as string);
        }
        return this.normalizeChainId(this.network.chainId);
      }

      throw new Error('Chain ID is not defined');
    } catch (error) {
      log.error('Error: Cannot get Chain Id from the network.', error);
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
      const wagmiSelectedNetwork = Array.isArray(this.chainList)
        ? this.chainList.find((x) => x.id === chainId)
        : null;
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
      log.error('Error: Cannot change chain', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.upbondInstance instanceof Upbond) {
      window.parent.postMessage({ type: 'UPBOND_LOGOUT', value: '' }, '*');
      await this.upbondInstance.logout();
      await this.upbondInstance.cleanUp();

      localStorage.clear();
      sessionStorage.clear();
    }
  }

  protected isChainUnsupported(chainId: number): boolean {
    return Array.isArray(this.chainList)
        ? !this.chainList.some((x) => x.id === chainId)
        : null;
  }

  protected onAccountsChanged = (...accounts: unknown[]) => {
    if (accounts.length === 0) {
      this.emit('disconnect');
    } else {
      window.parent.postMessage(
        { type: 'UPBOND_SELECTED_ADDRESS', value: accounts[0] },
        '*'
      );
      this.emit('change', { account: accounts[0] as `0x${string}` });
    }
  };

  protected onChainChanged = (chainId: string | number): any => {
    const id: number = this.normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit('change', { chain: { id, unsupported } });
  };

  protected onDisconnect = () => {
    // this.disconnect();
  };
}
