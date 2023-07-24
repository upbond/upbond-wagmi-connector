/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createTheme, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  configureChains,
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi';

import ModalWrapper from '../components/ModalWrapper';
import Navbar from '../components/Nav';
import UpbondWagmiConnector from '@upbond/wagmi-connector';
import { publicProvider } from 'wagmi/providers/public';
import { polygon, mainnet, polygonMumbai, goerli } from 'wagmi/chains';

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

const { chains } = configureChains(
  [polygon, mainnet, polygonMumbai, goerli],
  [publicProvider()]
);

const ConnectorLayout = ({
  children,
}: {
  children: React.ReactNode;
  wagmiClient: any;
}) => {
  const upbondConnector = new UpbondWagmiConnector({
    chains: chains,
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

  useEffect(() => {
    const initConnector = async () => {
      const isAuthorized = await upbondConnector.isAuthorized();
      if (isAuthorized) {
        connect({ connector: upbondConnector as any });
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
      <div>{children}</div>
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
