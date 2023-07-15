import { IUpbondEmbedParams, UpbondInpageProvider } from '@upbond/upbond-embed';
import { Chain, Connector, ConnectorData, WalletClient } from '@wagmi/core';
import { Signer } from 'ethers';
import { Address } from 'viem';
import { Options } from '../interfaces';
export default class UpbondWagmiConnector extends Connector<UpbondInpageProvider, Options> {
    ready: boolean;
    readonly id = "upbond";
    readonly name = "Upbond Wallet";
    protected provider: UpbondInpageProvider | null;
    private upbondInstance;
    isConnected: boolean;
    isConnectorInitialized: boolean;
    upbondInitialParams: IUpbondEmbedParams;
    private network;
    constructor(config: {
        chains?: Chain[];
        options: Options;
        upbondInitialParams?: IUpbondEmbedParams;
    });
    initConnector(): Promise<void>;
    setStorage(storage: {
        getItem<T>(key: string, defaultState?: T): T;
        setItem<T>(key: string, value: T): void;
        removeItem(key: string): void;
    }): boolean;
    getWalletClient({ chainId, }?: {
        chainId?: number;
    }): Promise<WalletClient>;
    connect(): Promise<Required<ConnectorData>>;
    getAccount(): Promise<Address>;
    getProvider(): Promise<UpbondInpageProvider>;
    getSigner(): Promise<Signer>;
    isAuthorized(): Promise<boolean>;
    getChainId(): Promise<number>;
    switchChain(chainId: number): Promise<Chain>;
    disconnect(): Promise<void>;
    protected isChainUnsupported(chainId: number): boolean;
    protected readonly onAccountsChanged: (...accounts: unknown[]) => void;
    protected readonly onChainChanged: (chainId: string | number) => void;
    protected readonly onDisconnect: () => void;
    protected readonly onConnect: () => void;
}
