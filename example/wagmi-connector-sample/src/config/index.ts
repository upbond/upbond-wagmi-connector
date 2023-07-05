export const lineLoginConfig = {
  name: 'LINE', //button login title
  description: 'LINE with UPBOND Identity',
  typeOfLogin: 'line',
  loginProvider: 'upbond-line',
  jwtParameters: {
    domain: process.env.NEXT_PUBLIC_LOGIN_DOMAIN,
    connection: 'line',
    clientId: process.env.NEXT_PUBLIC_LINE_CLIENTID,
    client_id: process.env.NEXT_PUBLIC_LINE_CLIENTID,
    scope: 'openid email profile offline_access',
  },
  showOnModal: true,
  showOnDesktop: true,
  showOnMobile: true,
  mainOption: true,
  priority: 1, // are in the first pile in login modal
  logo: 'https://elvira.co.th/wp-content/uploads/2016/02/line-icon.png',
  buttonBgColor: '#289B2A',
  buttonTextColor: '#f3f3f3',
  clientId: process.env.NEXT_PUBLIC_LINE_CLIENTID,
};

export const googleLoginConfig = {
  name: 'Google',
  description: 'Google',
  typeOfLogin: 'jwt',
  loginProvider: 'upbond-google',
  jwtParameters: {
    domain: process.env.NEXT_PUBLIC_LOGIN_DOMAIN,
    connection: 'line',
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    scope: 'openid email profile offline_access',
  },
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  showOnModal: true,
  showOnDesktop: true,
  showOnMobile: true,
  mainOption: true,
  priority: 2,
  logo: 'https://www.seekpng.com/png/full/788-7887426_google-g-png-google-logo-white-png.png',
  buttonBgColor: '#4B68AE',
  buttonTextColor: '#FFF',
};

export const walletThemeConfig = {
  logo: 'https://nftasset.s3.ap-northeast-1.amazonaws.com/UPBONDbondcustomer.png',
  buttonLogo:
    'https://nftasset.s3.ap-northeast-1.amazonaws.com/webinar/Round+Logo.png',
  isActive: true,
  lang: 'ja', //make your wallet language to japanese or english, default "en"
  modalColor: '#fffff',
  bgColor: '#4B68AE',
  bgColorHover: '#214999',
  textColor: '#f3f3f3',
  textColorHover: '#214999',
  upbondLogin: {
    globalBgColor: '#ffffff',
    globalTextColor: '#4B68AE',
  },
};

export const networkConfig = {
  /**
   * If you need the embed give your different network for daaps
   * Default "mumbai network"
   *
   */
  host: process.env.NEXT_PUBLIC_NETWORK_NAME,
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
  networkName: process.env.NEXT_PUBLIC_NETWORK_NAME,
  blockExplorer: '',
  ticker: process.env.NEXT_PUBLIC_NETWORK_NAME,
  tickerName: process.env.NEXT_PUBLIC_NETWORK_NAME,
  rpcUrl: process.env.NEXT_PUBLIC_POLYGON_PROVIDER,
};
