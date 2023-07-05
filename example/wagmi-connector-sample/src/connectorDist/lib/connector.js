var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Upbond from '@upbond/upbond-embed';
import { Connector, normalizeChainId, UserRejectedRequestError, } from '@wagmi/core';
import { ethers } from 'ethers';
import { initialUpbondConfig } from '../config';
const IS_SERVER = typeof window === 'undefined';
export default class UpbondWagmiConnector extends Connector {
    constructor(config) {
        var _a, _b, _c, _d;
        super({
            options: config.options,
            chains: config.chains,
        });
        this.ready = !IS_SERVER;
        this.id = 'upbond';
        this.name = 'Upbond Wallet';
        this.provider = null;
        this.isConnectorInitialized = true;
        this.upbondInitialParams = initialUpbondConfig;
        this.network = initialUpbondConfig.network;
        this.onAccountsChanged = (...accounts) => {
            this.emit('change', { account: accounts[0] });
        };
        this.onChainChanged = (chainId) => {
            const id = normalizeChainId(chainId);
            const unsupported = this.isChainUnsupported(id);
            this.emit('change', { chain: { id, unsupported } });
        };
        this.onDisconnect = () => {
            this.disconnect();
        };
        this.onConnect = () => {
            this.emit('connect', {});
        };
        const chainId = config.options.chainId ? config.options.chainId : 1;
        const host = config.options.host ? config.options.host : 'mainnet';
        this.upbondInstance = new Upbond({});
        this.torusOptions = config.options;
        this.isConnected = false;
        // set network according to chain details provided
        const chain = this.chains.find((x) => x.id === chainId);
        if (chain) {
            this.network = {
                host,
                chainId,
                networkName: chain.name,
                tickerName: (_a = chain.nativeCurrency) === null || _a === void 0 ? void 0 : _a.name,
                ticker: (_b = chain.nativeCurrency) === null || _b === void 0 ? void 0 : _b.symbol,
                blockExplorer: (_d = (_c = chain.blockExplorers) === null || _c === void 0 ? void 0 : _c.default) === null || _d === void 0 ? void 0 : _d.url,
            };
        }
        else {
            console.warn(`ChainId ${chainId} not found in chain list`);
            this.emit('disconnect');
        }
        this.isConnectorInitialized = true;
        if (config.upbondInitialParams &&
            Object.keys(config.upbondInitialParams).length > 0) {
            this.upbondInitialParams = Object.assign(Object.assign({}, this.upbondInitialParams), config.upbondInitialParams);
        }
    }
    initConnector() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('message', {
                type: 'connecting',
            });
            yield this.upbondInstance.init(this.upbondInitialParams);
            const isUpbondLoggedIn = this.upbondInstance.isLoggedIn && this.upbondInstance.isInitialized;
            if (isUpbondLoggedIn) {
                this.isConnected = true;
                this.onConnect();
                const provider = this.upbondInstance.provider;
                if (provider.on) {
                    provider.on('connect', this.onConnect);
                    provider.on('accountsChanged', this.onAccountsChanged);
                    provider.on('chainChanged', (res) => this.onChainChanged(res));
                    provider.on('disconnect', this.onDisconnect);
                }
            }
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('message', {
                    type: 'connecting',
                });
                if (!this.upbondInstance.isInitialized) {
                    yield this.upbondInstance.init(this.upbondInitialParams);
                }
                if (!this.upbondInstance.isLoggedIn)
                    yield this.upbondInstance.login();
                const provider = this.upbondInstance.provider;
                if (provider.on) {
                    provider.on('connect', () => {
                        // TODO: do anything with on connect emitter
                    });
                    provider.on('accountsChanged', this.onAccountsChanged);
                    provider.on('chainChanged', (res) => __awaiter(this, void 0, void 0, function* () {
                        this.onChainChanged(res);
                    }));
                    provider.on('disconnect', this.onDisconnect);
                }
                // Check if there is a user logged in
                const isAuthenticated = yield this.isAuthorized();
                // Check if we have a chainId, in case of error just assign 0 for legacy
                // if there is a user logged in, return the user
                if (isAuthenticated) {
                    this.onConnect();
                    const account = yield this.getAccount();
                    const getChainId = () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            return yield this.getChainId();
                        }
                        catch (error) {
                            return 0;
                        }
                    });
                    const chainId = yield getChainId();
                    return {
                        account,
                        chain: {
                            id: chainId,
                            unsupported: false,
                        },
                        provider,
                    };
                }
                throw new Error('Failed to login, Please try again');
            }
            catch (error) {
                console.error(error, '@connectError');
                throw new UserRejectedRequestError('Something went wrong');
            }
        });
    }
    getAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uProvider = yield this.getProvider();
                const provider = new ethers.providers.Web3Provider(uProvider);
                const signer = provider.getSigner();
                const account = yield signer.getAddress();
                return account;
            }
            catch (error) {
                console.error('Error: Cannot get account:', error);
                throw error;
            }
        });
    }
    getProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.provider) {
                return this.provider;
            }
            this.provider = this.upbondInstance.provider;
            return this.provider;
        });
    }
    getSigner() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = new ethers.providers.Web3Provider(yield this.getProvider());
                const signer = provider.getSigner();
                return signer;
            }
            catch (error) {
                console.error('Error: Cannot get signer:', error);
                throw error;
            }
        });
    }
    isAuthorized() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.upbondInstance.isInitialized) {
                yield this.upbondInstance.init(this.upbondInitialParams);
            }
            return this.upbondInstance.isLoggedIn && !!this.upbondInstance.provider;
        });
    }
    getChainId() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.getProvider();
                if (!provider && ((_a = this.network) === null || _a === void 0 ? void 0 : _a.chainId)) {
                    return normalizeChainId(this.network.chainId);
                }
                else if (provider) {
                    const chainId = yield provider.request({ method: 'eth_chainId' });
                    if (chainId) {
                        return normalizeChainId(chainId);
                    }
                }
                throw new Error('Chain ID is not defined');
            }
            catch (error) {
                console.error('Error: Cannot get Chain Id from the network.', error);
                throw error;
            }
        });
    }
    switchChain(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const upbondSupportedNetworks = [
                    { name: 'Ethereum Mainnet', chainId: 1, host: 'mainnet' },
                    { name: 'Goerli', chainId: 5, host: 'goerli' },
                    { name: 'Polygon', chainId: 137, host: 'matic' },
                    { name: 'Mumbai', chainId: 80001, host: 'mumbai' },
                    { name: 'Astar Mainnet', chainId: 80001, host: 'astar_mainnet' },
                ];
                const selectedNetwork = upbondSupportedNetworks.find((network) => network.chainId === chainId);
                const wagmiSelectedNetwork = this.chains.find((chain) => chain.id === chainId);
                if (!wagmiSelectedNetwork) {
                    throw new Error(`Network with chain id ${chainId} is not available, please configure your network first`);
                }
                if (!selectedNetwork) {
                    throw new Error(`Hold up! upbond does not support this network -> ${chainId}`);
                }
                if (!this.isAuthorized())
                    throw new Error('Please login first');
                yield this.upbondInstance.setProvider({
                    host: selectedNetwork.host,
                    chainId,
                    networkName: selectedNetwork.name,
                });
                return wagmiSelectedNetwork;
            }
            catch (error) {
                console.error('Error: Cannot change chain', error);
                throw error;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.upbondInstance.logout();
            yield this.upbondInstance.cleanUp();
            localStorage.clear();
            window.location.reload();
        });
    }
    isChainUnsupported(chainId) {
        return !this.chains.some((x) => x.id === chainId);
    }
}
//# sourceMappingURL=connector.js.map