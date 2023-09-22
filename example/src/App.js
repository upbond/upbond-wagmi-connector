//useclient
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import "@rainbow-me/rainbowkit/styles.css";

import { ConnectButton, connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { createConfig, WagmiConfig, configureChains } from "wagmi";
import {
  mainnet,
  polygon,
  polygonMumbai,
  goerli
} from 'wagmi/chains';
import { upbondConnector } from "./upbondConnector";
import { useAccount, useConnect } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { useEffect } from "react";

const { chains, publicClient } = configureChains([mainnet, polygon, polygonMumbai, goerli], [publicProvider()]);
const projectId = process.env.REACT_APP_PROJECT_ID;

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      upbondConnector({ projectId, chains })
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

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
    if(localStorageWallet && localStorageWallet === '"upbond"') {
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
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} initialChain={mainnet}>
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