import type {
  ETHEREUM_NETWORK_TYPE,
  IUpbondEmbedParams,
  TorusCtorArgs,
} from '@upbond/upbond-embed';

export interface Options extends TorusCtorArgs {
  host: ETHEREUM_NETWORK_TYPE | string;
  /**
   * ChainId in hex/number that you want to connect with.
   */
  chainId?: number;
  UpbondParams?: Omit<IUpbondEmbedParams, 'network'>;
}
