/* eslint-disable no-console */
import {
  useAddress,
  useClaimNFT,
  useContract,
  useSDK,
} from '@thirdweb-dev/react';
import { Signer } from 'ethers';
import React, { useEffect } from 'react';
import {
  useAccount,
  useNetwork,
  useProvider,
  useSigner,
  useSwitchNetwork,
} from 'wagmi';

const contractAddress = '0x9d411E18AFe27E4CfEe7cc82977EB01f3b2D4102';

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
  const { contract } = useContract(contractAddress, 'nft-drop');
  const { mutate: claimNft } = useClaimNFT(contract);
  const userProvider = useProvider();
  const { data: userSigner } = useSigner();

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
    <div className='flex w-full items-center gap-4 flex-col'>
      {address ? (
        <>
          <div>
            <p>Current Chain Id: {chainWagmi?.id}</p>
          </div>
          <div>
            <label htmlFor='network'>Change Network:</label>
            <select
              id='network'
              onChange={(e) => {
                if (switchNetwork) {
                  switchNetwork(Number(e.target.value));
                }
                // switchChain(Number(e.target.value));
              }}
            >
              {chains.map((e) => {
                return (
                  <option value={e.id} key={e.name}>
                    {e.name}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={() => {
              try {
                claimNft({
                  to: address, // Use useAddress hook to get current wallet address
                  quantity: 1,
                });
              } catch (error) {
                console.log(error, '@59');
              }
            }}
          >
            Claim NFT
          </button>
          <button
            onClick={async () => {
              if (sdk) {
                sdk.updateSignerOrProvider(userSigner as Signer);
                sdk.emit('change', {
                  chain: { id: chainWagmi?.id, unsupported: false },
                });
                sdk.emit('chainChanged', {
                  chain: { id: chainWagmi?.id, unsupported: false },
                });
              }
            }}
          >
            check chain
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              console.log('sini');
              console.log(address, userAddress, '@39');
            }}
          >
            check address a
          </button>
          <p>Not Connected Yet</p>
        </>
      )}
    </div>
  );
};
