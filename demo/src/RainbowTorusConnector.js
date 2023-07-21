import { UpbondWalletConnector } from "@upbond/rainbow-connector";

export const rainbowTorusConnector = ({ chains }) => ({
  id: "upbond",
  name: "Upbond",
  iconUrl: "https://i.ibb.co/wBmybLc/company-button-logo-sample.png",
  iconBackground: "#fff",
  createConnector: () => {
    const connector = new UpbondWalletConnector({
      chainsHeadshot: chains,
      options: {
        chainId: 137,
        host: "matic",
        dappRedirectUri: window.location.origin,
        modalZIndex: 99999999999,
      }
    });
    return {
      connector,
    };
  },
});
