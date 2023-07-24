import {
  ChainId,
  ThirdwebProvider,
  ThirdwebSDKProvider,
} from '@thirdweb-dev/react';
import { Signer } from 'ethers';
import { ReactNode } from 'react';
import {
  configureChains,
  createConfig,
  useWalletClient,
  WagmiConfig,
} from 'wagmi';
import { polygon, mainnet, polygonMumbai, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import ConnectorLayout from './layouts/ConnectorLayout';
import UpbondWagmiConnector from '@upbond/wagmi-connector';
import { Home } from './pages/Home';
import { createStorage } from '@wagmi/core';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, polygonMumbai, goerli],
  [publicProvider()]
);

const upbondConnector = new UpbondWagmiConnector({
  chains,
  options: {
    host: 'goerli',
    chainId: 5,
    buttonPosition: 'bottom-left',
  },
});

upbondConnector.setStorage = () => true;

const wagmiClient = createConfig({
  autoConnect: false,
  connectors: [upbondConnector as any],
  publicClient,
  webSocketPublicClient,
  storage: createStorage({ storage: localStorage }),
});

function TwProvider({ children }: { children: ReactNode }) {
  const { data: userSigner } = useWalletClient();

  return (
    <ThirdwebProvider
      activeChain={ChainId.Goerli}
      queryClient={wagmiClient.queryClient}
      signer={userSigner as unknown as Signer}
    >
      <ThirdwebSDKProvider
        activeChain={ChainId.Goerli}
        signer={userSigner as unknown as Signer}
      >
        {children}
      </ThirdwebSDKProvider>
    </ThirdwebProvider>
  );
}

function MyApp() {
  return (
    <WagmiConfig config={wagmiClient}>
      <ConnectorLayout wagmiClient={wagmiClient}>
        <Home />
      </ConnectorLayout>
    </WagmiConfig>
  );
}

export default MyApp;
