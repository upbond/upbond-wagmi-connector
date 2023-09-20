import {
  Account,
  Chain,
  Transport,
  WalletClient as WalletClient_,
} from 'viem'

export type WalletClient<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account,
> = WalletClient_<TTransport, TChain, TAccount>
