import { ethers } from 'ethers'

const POLLING_INTERVAL = 12000

const nodes = [
    "https://bsc-dataseed1.ninicoin.io",
    "https://nodes.pancakeswap.com/"
]
// const BASE_URL = 'https://pancakeswap.finance'

const BASE_BSC_SCAN_URL = 'https://bscscan.com';
// "97": 'https://testnet.bscscan.com',
/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
    const provider = window.ethereum
    if (provider) {
        const chainId = 56;
        try {
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: `0x${chainId.toString(16)}`,
                        chainName: 'Binance Smart Chain Mainnet',
                        nativeCurrency: {
                            name: 'BNB',
                            symbol: 'bnb',
                            decimals: 18,
                        },
                        rpcUrls: nodes,
                        blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
                    },
                ],
            })
            return true
        } catch (error) {
            console.error('Failed to setup the network in Metamask:', error)
            return false
        }
    } else {
        console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
        return false
    }
}

export const getLibrary = (provider) => {
    const library = new ethers.providers.Web3Provider(provider)
    library.pollingInterval = POLLING_INTERVAL
    return library
}