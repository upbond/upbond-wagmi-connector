import { IUpbondEmbedParams, UpbondInpageProvider } from '@upbond/upbond-embed';
import { Chain, Connector, ConnectorData } from '@wagmi/core';
import { Signer } from 'ethers';
import { Options } from '../interfaces';
export default class UpbondWagmiConnector extends Connector {
    ready: boolean;
    readonly id = "upbond";
    readonly name = "Upbond Wallet";
    protected provider: UpbondInpageProvider | null;
    private upbondInstance;
    private torusOptions;
    isConnected: boolean;
    isConnectorInitialized: boolean;
    upbondInitialParams: IUpbondEmbedParams;
    private network;
    constructor(config: {
        chains: Chain[];
        options: Options;
        upbondInitialParams?: IUpbondEmbedParams;
    });
    initConnector(): Promise<void>;
    connect(): Promise<Required<ConnectorData>>;
    getAccount(): Promise<`0x${string}`>;
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
