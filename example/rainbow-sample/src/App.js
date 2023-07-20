/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import "@rainbow-me/rainbowkit/styles.css";

import { ConnectButton, connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { rainbowWallet, metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { WagmiConfig, configureChains, createStorage, createConfig } from "wagmi";
import { useAccount, useConnect } from "wagmi";
import { publicProvider } from 'wagmi/providers/public';
import { useEffect } from "react";
import UpbondWalletConnector from "@upbond/wagmi-connector";
import { polygon, mainnet, polygonMumbai, goerli } from 'wagmi/chains';

const projectId = "be01ae256086eee8863f0612e8e9ddfa"

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, polygonMumbai, goerli],
  [publicProvider()]
);

const connector = new UpbondWalletConnector({
  chains: chains,
  options: {
    host: 'goerli',
    chainId: 5,
    buttonPosition: 'bottom-left'
  },
  upbondInitialParams: {
    buildEnv: 'development'
  }
});

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      rainbowWallet({ chains, projectId }),
      metaMaskWallet({ chains, projectId }),
      {
        id: "upbond",
        name: "Upbond",
        iconUrl: "https://i.ibb.co/wBmybLc/company-button-logo-sample.png",
        iconBackground: "#fff",
        createConnector: () => {
          connector.on("message", ({ type }) => {
            if (type === "connecting") {
              const upbondIframe = document.getElementById("upbondIframe");
              if (upbondIframe && upbondIframe?.style) {
                document.getElementById("upbondIframe").style.zIndex = "999999999999999999";
              }
            }
          })

          const wagmiStore = JSON.parse(localStorage.getItem('wagmi.store'));
          if (wagmiStore && wagmiStore?.state?.data?.account) {
            connector.getAccount = () => wagmiStore?.state?.data?.account;
          }

          return {
            connector,
          };
        },
      }
    ],
  },
]);

const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
  storage: createStorage({ storage: localStorage })
});


function UpbondProvider({ children }) {
  const { connect } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected && connector.ready) connect({ connector });
  }, []);

  return children
}

export default function App() {
  return (
    <WagmiConfig config={wagmiClient}>
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
          </div>
        </UpbondProvider>
      </RainbowKitProvider>
    </WagmiConfig >
  );
}
