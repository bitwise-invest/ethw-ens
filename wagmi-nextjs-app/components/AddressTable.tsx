import { useEffect, useState } from "react";

import { useEnsAddress } from "wagmi";
import { http, createConfig, getBalance } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";

import { formatEther } from "viem";

interface Address {
  name: string;
  address: string;
  balance: bigint;
}

const viemConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

export function AddressTable() {
  const [prefix, setPrefix] = useState(1);
  const [ensAddresses, setEnsAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [stopFetching, setStopFetching] = useState(false);

  const ETHW_ENS_PARENT = "ethw.bitwise.eth";

  const { data: fetchedAddress, error } = useEnsAddress({
    name: `${prefix}.${ETHW_ENS_PARENT}`,
    chainId: mainnet.id,
  });

  useEffect(() => {
    // Stop fetching if no address is found
    if (stopFetching) return;

    // Update state and increment prefix otherwise
    const fetchAddress = async () => {
      if (fetchedAddress) {
        const balance = (
          await getBalance(viemConfig, {
            address: fetchedAddress,
          })
        ).value;
        setEnsAddresses((prev) => [
          ...prev,
          {
            name: `${prefix}.${ETHW_ENS_PARENT}`,
            address: fetchedAddress,
            balance: balance,
          },
        ]);
        setPrefix((prevPrefix) => prevPrefix + 1);
        setLoading(true);
      } else if (fetchedAddress === null) {
        setStopFetching(true);
        setLoading(false);
      } else if (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchAddress();
  }, [fetchedAddress, error, prefix, stopFetching]);

  if (loading) {
    return <div className="my-6">Loading...</div>;
  }

  return (
    <div className="container my-6">
      <p className="text-gray-400 text-left">
        Total: {ensAddresses.length} addresses
      </p>
      <table className="my-2 w-full text-lg overflow-x-scroll">
        <thead>
          <tr className="bg-white text-black">
            <th className="text-left">ENS</th>
            <th className="text-left">Address</th>
            <th className="text-left">Balance</th>
          </tr>
        </thead>
        <tbody>
          {ensAddresses.map((address) => (
            <tr className="border-b hover:bg-gray-900" key={address.name}>
              <td>{address.name}</td>
              <td>
                <a
                  target="_blank"
                  href={`https://etherscan.io/address/${address.address}`}
                >
                  {address.address}
                </a>
              </td>
              <td>{formatEther(address.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
