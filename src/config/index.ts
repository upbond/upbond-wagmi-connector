import { IUpbondEmbedParams } from '@upbond/upbond-embed';

export const initialUpbondConfig = {
  buildEnv: 'local',
  network: {
    host: 'matic',
    chainId: 137,
    networkName: 'Polygon',
    blockExplorer: 'https://polygonscan.com/',
    ticker: 'MATIC',
    tickerName: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
  },
  whiteLabel: {
    walletTheme: {
      lang: `${window.navigator.language}`,
      logo: 'https://i.ibb.co/L6vHB5d/company-logo-sample.png',
      name: 'Company',
      buttonLogo: 'https://i.ibb.co/wBmybLc/company-button-logo-sample.png',
      isActive: true,
      modalColor: '#fffff',
      bgColor: '#4B68AE',
      bgColorHover: '#214999',
      textColor: '#f3f3f3',
      textColorHover: '#214999',
      upbondLogin: {
        globalBgColor: '#ffffff',
        globalTextColor: '#4B68AE',
      },
    },
  },
  widgetConfig: {
    showAfterLoggedIn: true,
    showBeforeLoggedIn: false,
  },
} as IUpbondEmbedParams;
