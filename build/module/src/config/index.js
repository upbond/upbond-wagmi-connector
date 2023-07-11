import { UPBOND_BUILD_ENV } from '@upbond/upbond-embed';
export const initialUpbondConfig = {
    buildEnv: UPBOND_BUILD_ENV.DEVELOPMENT,
    network: {
        host: 'mainnet',
        chainId: 1,
        networkName: 'Ethereum Mainnet',
        blockExplorer: 'https://etherscan.io',
        ticker: 'ETH',
        tickerName: 'Ethereum',
        rpcUrl: 'https://eth.llamarpc.com',
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
};
//# sourceMappingURL=index.js.map