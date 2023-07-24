/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import "@rainbow-me/rainbowkit/styles.css";

import { ConnectButton, connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { chain, createClient, WagmiConfig, configureChains } from "wagmi";
import { rainbowTorusConnector } from "./RainbowTorusConnector";
import { useAccount, useConnect } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { useEffect } from "react";

const { chains, provider } = configureChains([chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.goerli], [publicProvider()]);
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [metaMaskWallet({ chains }), rainbowTorusConnector({ chains })],
  },
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function UpbondProvider({ children }) {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const localStorageWallet = localStorage.getItem("wagmi.wallet");
  useEffect(() => {
    localStorage.setItem("wagmi.wallet", "");
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("selectedAddress")) {
      connectors.map((connector) => {
        if (connector.id === "upbond") {
          if (!isConnected && connector.ready) connect({ connector });
        }
      });
    }
  }, []);

  useEffect(() => {
    if(localStorageWallet && localStorageWallet == '"upbond"') {
      connectors.map((connector) => {
        if (connector.id === "upbond") {
          if (!isConnected && connector.ready) connect({ connector });
        }
      });
    }
  }, [localStorageWallet])
  
  return children
}

export default function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <UpbondProvider>
        <div
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
          }}
        >
          <ConnectButton />
        </div></UpbondProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
