/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import "@rainbow-me/rainbowkit/styles.css";

import { ConnectButton, connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { rainbowWallet, metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { chain, createClient, WagmiConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { useEffect } from "react";
import UpbondWalletConnector from '@upbond/wagmi-connector'

const { chains, provider } = configureChains([chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum], [publicProvider()]);
const connector = new UpbondWalletConnector({
  chains: chains,
  options: {
    host: 'goerli',
    chainId: 5,
    buttonPosition: 'bottom-left',
    modalZIndex: 999999999999999999
  },
  upbondInitialParams: {
    buildEnv: 'development'
  }
});

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      rainbowWallet({ chains }),
      metaMaskWallet({ chains }),
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
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
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
      </RainbowKitProvider>
    </WagmiConfig>
  );
}