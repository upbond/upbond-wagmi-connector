/* eslint-disable no-console */
import { useAddress, useSDK } from '@thirdweb-dev/react';
import React, { useEffect } from 'react';
import { useAccount, useNetwork, useProvider, useSwitchNetwork } from 'wagmi';
import clsxm from '../lib/clsxm';

export const Home = () => {
  const { address: userAddress } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('Connected', { address, connector, isReconnected });
    },
  });
  const sdk = useSDK();
  const { switchNetwork } = useSwitchNetwork();
  const address = useAddress();
  const { chain: chainWagmi, chains } = useNetwork();
  const userProvider = useProvider();

  useEffect(() => {
    if (sdk && sdk.on) {
      sdk.on('chainChanged', async (chainId) => {
        sdk.updateSignerOrProvider(userProvider);
      });
      sdk.on('change', () => {
        sdk.updateSignerOrProvider(userProvider);
      });
    }
  }, [sdk, sdk?.on]);

  return (
    <div className='flex w-full min-h-screen bg-gray-800 pt-10 items-center gap-4 flex-col'>
      <div className='flex flex-col justify-center items-center'>
        <p className='text-md text-zinc-50'>
          Example of{' '}
          <strong className='text-indigo-500'>upbond wagmi connector</strong>{' '}
          connected with{' '}
          <strong
            className='text-indigo-500 cursor-pointer'
            onClick={() => {
              window.open('https://wallet.upbond.io/wallet/home', '_blank');
            }}
          >
            UPBOND wallet
          </strong>{' '}
        </p>
      </div>
      {address ? (
        <>
          <img
            src='https://nftasset.s3.ap-northeast-1.amazonaws.com/UPBOND+LOGO.png'
            alt='upbond-image'
            className='w-96 h-96 object-cover'
          />
          <div className='p-2 px-5 rounded-lg bg-green-200'>
            <p className='text-green-700 text-xl font-bold'>
              Connected with {chainWagmi?.name}
            </p>
          </div>
          <div className='mt-2 mb-2 w-24 h-1 bg-zinc-50' />
          <div className='flex flex-col justify-center items-center'>
            <p className='text-md text-zinc-50'>Address</p>
          </div>
          <div className='p-2 px-5 rounded-lg bg-gray-200'>
            <p className='text-gray-700 text-sm font-bold'>{userAddress}</p>
          </div>
          <div className='grid grid-cols-4 gap-4'>
            {chains.map((chain, idx) => (
              <button
                type='button'
                key={idx}
                disabled={Number(chain.id) === Number(chainWagmi?.id)}
                onClick={() => switchNetwork && switchNetwork(Number(chain.id))}
                className={clsxm(
                  'rounded-md font-vt px-2 py-1 disabled:bg-gray-400 disabled:text-gray-900 text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                  `bg-indigo-600 hover:bg-indigo-500`
                )}
              >
                {Number(chain.id) === Number(chainWagmi?.id)
                  ? `Connected with ${chain.name}`
                  : `Switch to ${chain.name}`}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className='font-bold text-zinc-50'>Not Connected Yet</p>
        </>
      )}
    </div>
  );
};
