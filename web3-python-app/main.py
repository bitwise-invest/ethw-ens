from itertools import count

from ens import ENS
from web3 import Web3

from pprint import pprint


# More public RPC endpoints can be found here https://chainlist.org/chain/1
PUBLIC_RPC_ENDPOINT = "https://eth.llamarpc.com"


def get_ethw_addresses(ns: ENS) -> list:
    ETHW_ENS_PARENT = "ethw.bitwise.eth"

    payload = []
    for prefix in count(start=1):
        name = f"{prefix}.{ETHW_ENS_PARENT}"
        address = ns.address(name)
        if not address:
            break
        balance = w3.from_wei(w3.eth.get_balance(address), "ether")
        payload.append({"address": address, "name": name, "balance": balance})

    return payload


if __name__ == "__main__":
    w3 = Web3(Web3.HTTPProvider(PUBLIC_RPC_ENDPOINT))
    if w3.is_connected():
        ns = ENS.from_web3(w3)
        pprint(get_ethw_addresses(ns))
    else:
        print("Failed to connect to Ethereum network")
