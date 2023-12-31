import UpbondWalletConnector from "@upbond/wagmi-connector";

export const upbondConnector = ({ chains }) => ({
  id: "upbond",
  name: "UPBOND",
  iconUrl: window.location.origin + "/logo.png",
  iconBackground: "#fff",
  createConnector: () => {
    const connector = new UpbondWalletConnector({
      chainList: chains,
      chains:chains,
      options: {
        chainId: 137,
        host: "matic",
        dappRedirectUri: window.location.origin,
        modalZIndex: 9999999998,
        UpbondParams: {
          buildEnv: "production",
          widgetConfig: {
            showAfterLoggedIn: false,
            showBeforeLoggedIn: false,
          },
        }
      }
    });

    return {
      connector,
    };
  },
});
