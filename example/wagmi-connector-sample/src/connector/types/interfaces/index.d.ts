import type { ETHEREUM_NETWORK_TYPE, IUpbondEmbedParams, TorusCtorArgs } from '@upbond/upbond-embed';
export type Options = TorusCtorArgs & {
    readonly host: ETHEREUM_NETWORK_TYPE | string;
    readonly chainId?: number;
    readonly UpbondParams?: Omit<IUpbondEmbedParams, 'network'>;
};
