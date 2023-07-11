import { useAddress } from '@thirdweb-dev/react';
import { goerli, mainnet, polygon, polygonMumbai } from '@wagmi/core/chains';
import React, { useEffect } from 'react';
import { configureChains, useConnect, useDisconnect } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import UpbondWagmiConnector from '@upbond/wagmi-connector';

const Header = () => {
  const address = useAddress();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { chains } = configureChains(
    [polygon, polygonMumbai, goerli, mainnet],
    [publicProvider()]
  );
  const upbondLogin = new UpbondWagmiConnector({
    chains: chains as any,
    options: {
      host: 'mumbai',
      chainId: 80001,
      buttonPosition: 'bottom-left',
    },
  });

  const params = new URLSearchParams(window.location.search);
  useEffect(() => {
    if (params.get('selectedAddress')) {
      const autoLoginData = JSON.stringify({
        selectedAddress: params.get('selectedAddress'),
        verifier: params.get('verifier'),
        loggedIn: params.get('loggedIn'),
        rehydrate: params.get('rehydrate'),
        state: params.get('state'),
      });
      localStorage.setItem('autoLogin', autoLoginData);
      connect({ connector: upbondLogin } as any);
    }
  }, [params.get('selectedAddress')]);

  return (
    <div>
      {address ? (
        <div className='text-red-700 flex w-full justify-end'>
          <button onClick={() => disconnect()}> Disconnect Wallet </button>
          <p style={{ marginLeft: 8, marginRight: 8, color: 'grey' }}>|</p>
          <p>{address.slice(0, 6).concat('...').concat(address.slice(-4))}</p>
        </div>
      ) : (
        <>
          {connectors.map((connector) => (
            <div key={connector.id}>
              <button
                disabled={!connector.ready}
                className='block px-4 py-2 text-sm'
                onClick={() => connect({ connector })}
              >
                Login with: {connector.name}
                {isLoading &&
                  pendingConnector?.id === connector.id &&
                  ' (connecting)'}
              </button>
            </div>
          ))}
          <button
            onClick={() => console.log(upbondLogin.isAuthorized(), '@124')}
          >
            check UWC
          </button>
        </>
      )}
    </div>
  );
};

export default Header;
