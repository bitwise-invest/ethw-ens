import { http } from "viem";
import { mainnet } from "viem/chains";
import { createEnsPublicClient } from "@ensdomains/ensjs";

interface Address {
  name: string;
  address: string;
}

/**
 * Fetches Bitwise's ETHW Ethereum addresses.
 * @returns A promise that resolves to an array of Address objects.
 */
async function getEthwAddresses(): Promise<Address[]> {
  const ETHW_ENS_PARENT = "ethw.bitwise.eth";
  const client = createEnsPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const payload: Address[] = [];
  let prefix = 0;
  let address: Address | null = null;

  do {
    prefix++;
    try {
      address = await getAddressRecord(prefix, ETHW_ENS_PARENT, client);
      if (address && address.address) {
        payload.push(address);
      }
    } catch (error) {
      console.error(`Error fetching address for prefix ${prefix}:`, error);
      address = null; // Ensure loop can exit if an error occurs
    }
  } while (address && address.address);

  return payload;
}

/**
 * Retrieves an address record for a given prefix and parent domain.
 * @param prefix The prefix to query.
 * @param parentDomain The parent domain for the ENS record.
 * @param client The ENS client instance.
 * @returns A promise that resolves to an Address object.
 */
async function getAddressRecord(
  prefix: number,
  parentDomain: string,
  client: ReturnType<typeof createEnsPublicClient>
): Promise<Address> {
  const name = `${prefix}.${parentDomain}`;
  const record = await client.getAddressRecord({ name });
  return {
    name,
    address: record ? record.value : "",
  };
}

async function main() {
  try {
    const addresses = await getEthwAddresses();
    console.log(addresses);
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
  }
}

main();