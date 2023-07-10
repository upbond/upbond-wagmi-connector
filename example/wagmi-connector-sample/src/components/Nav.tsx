import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { useAccount } from 'wagmi';

import clsxm from '../lib/clsxm';

export default function Navbar({
  onConnectClicked,
}: {
  onConnectClicked: () => void;
}) {
  const { isConnected, address } = useAccount();

  console.log(address, '@addresses');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <div className='flex-1'>
            <p className='text-2xl font-bold font-vt'>
              Example of UPBOND Wagmi Connector
            </p>
          </div>
          <button
            type='button'
            onClick={onConnectClicked}
            className={clsxm(
              'rounded-md font-vt px-5 py-1 text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              isConnected
                ? `bg-red-600 hover:bg-red-500`
                : `bg-indigo-600 hover:bg-indigo-500`
            )}
          >
            {isConnected ? `Disconnect` : `Connect`}
          </button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
