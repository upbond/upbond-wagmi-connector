import {
  ChainId,
  ThirdwebProvider,
  ThirdwebSDKProvider,
} from '@thirdweb-dev/react';
import { goerli, mainnet, polygon, polygonMumbai } from '@wagmi/core/chains';
import { Signer } from 'ethers';
import { ReactNode } from 'react';
import { configureChains, createClient, useSigner, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import ConnectorLayout from './layouts/ConnectorLayout';
import UpbondWagmiConnector from '@upbond/wagmi-connector';
import { Home } from './pages/Home';

const { chains, provider } = configureChains(
  // @ts-ignore
  [polygon, polygonMumbai, goerli, mainnet],
  [publicProvider()]
);

const upbondConnector = new UpbondWagmiConnector({
  chains: chains as any,
  options: {
    host: 'goerli',
    chainId: 5,
    buttonPosition: 'bottom-left',
  },
});

const wagmiClient = createClient({
  autoConnect: false,
  provider,
  connectors: [upbondConnector as any],
});

function TwProvider({ children }: { children: ReactNode }) {
  const { data: userSigner } = useSigner();

  return (
    <ThirdwebProvider
      activeChain={ChainId.Goerli}
      queryClient={wagmiClient.queryClient}
      signer={userSigner as Signer}
    >
      <ThirdwebSDKProvider
        activeChain={ChainId.Goerli}
        signer={userSigner as Signer}
      >
        {children}
      </ThirdwebSDKProvider>
    </ThirdwebProvider>
  );
}

function MyApp() {
  return (
    <WagmiConfig client={wagmiClient}>
      <TwProvider>
        <ConnectorLayout wagmiClient={wagmiClient}>
          <Home />
        </ConnectorLayout>
      </TwProvider>
    </WagmiConfig>
  );
}

export default MyApp;
