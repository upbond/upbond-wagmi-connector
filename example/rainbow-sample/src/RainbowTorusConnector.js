import UpbondWalletConnector from "@upbond/wagmi-connector";

export const rainbowTorusConnector = ({ chains }) => ({
  id: "upbond",
  name: "Upbond",
  iconUrl: "https://i.ibb.co/wBmybLc/company-button-logo-sample.png",
  iconBackground: "#fff",
  createConnector: () => {
    const connector = new UpbondWalletConnector({
      chains: chains,
      options: {
        host: 'goerli',
        chainId: 5,
        buttonPosition: 'bottom-left',
      },
    });
    return {
      connector,
    };
  },
});
