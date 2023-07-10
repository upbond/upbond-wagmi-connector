/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createTheme, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';

import ModalWrapper from '../components/ModalWrapper';
import Navbar from '../components/Nav';
import { chains } from '../config/wagmi';
import UpbondWagmiConnector from '@upbond/wagmi-connector';

const theme = createTheme({
  palette: {
    primary: {
      main: '#061022',
    },
    secondary: {
      main: '#7680BC',
    },
  },
});

const ConnectorLayout = ({
  children,
  wagmiClient,
}: {
  children: React.ReactNode;
  wagmiClient: any;
}) => {
  const upbondConnector = new UpbondWagmiConnector({
    chains,
    options: {
      host: 'mumbai',
      chainId: 80001,
      buttonPosition: 'bottom-left',
    },
  });

  const [openConnectModal, setOpenConnectModal] = useState(false);
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const onConnectClicked = (connector: Connector) => {
    if (!isConnected) {
      setOpenConnectModal(false);
      connect({ connector });
    } else {
      disconnect();
    }
  };

  // const params = new URLSearchParams(window.location.search);
  // useEffect(() => {
  //   if (params.get('selectedAddress')) {
  //     const autoLoginData = JSON.stringify({
  //       selectedAddress: params.get('selectedAddress'),
  //       verifier: params.get('verifier'),
  //       loggedIn: params.get('loggedIn'),
  //       rehydrate: params.get('rehydrate'),
  //       state: params.get('state'),
  //     });
  //     localStorage.setItem('autoLogin', autoLoginData);
  //     connect({ connector: upbondConnector });
  //   }
  // }, [params.get('selectedAddress')]);

  useEffect(() => {
    const initConnector = async () => {
      const isAuthorized = await upbondConnector.isAuthorized();
      console.log(isAuthorized, '@isAuthorized?');
      if (isAuthorized) {
        connect({ connector: upbondConnector });
      }
    };

    initConnector();
  }, [upbondConnector.isConnected]);

  return (
    <ThemeProvider theme={theme}>
      <Navbar
        onConnectClicked={() => {
          if (isConnected) {
            disconnect();
            return;
          }
          setOpenConnectModal(true);
        }}
      />
      <div className='container mx-auto pt-10'>{children}</div>
      <ModalWrapper
        open={openConnectModal}
        handleClose={() => setOpenConnectModal(false)}
        title='Connect Wallet'
      >
        {connectors.map((connector) => (
          <div
            key={connector.id}
            className='flex flex-row justify-between py-2 hover:bg-gray-200 cursor-pointer rounded-md'
            onClick={() => {
              if (isConnected) {
                disconnect();
                return;
              }
              onConnectClicked(connector);
            }}
          >
            <p className='font-poppins font-bold mx-2'>{connector.name}</p>
          </div>
        ))}
      </ModalWrapper>
    </ThemeProvider>
  );
};

export default ConnectorLayout;
