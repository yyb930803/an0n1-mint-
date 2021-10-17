import { useCallback } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { BscConnector, NoBscProviderError } from '@binance-chain/bsc-connector'
import {
    InjectedConnector,
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
    UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
    WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { setupNetwork } from '../utils/web3React'
import sample from 'lodash/sample'

const POLLING_INTERVAL = 12000
const nodes = [
    "https://bsc-dataseed1.ninicoin.io",    
    "https://nodes.pancakeswap.com/"
]

const getNodeUrl = () => {
    return sample(nodes)
}

const rpcUrl = getNodeUrl()

const chainId = 56

const injected = new InjectedConnector({ supportedChainIds: [chainId] })

const walletconnect = new WalletConnectConnector({
    rpc: { [chainId]: rpcUrl },
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
})

const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

const connectorsByName = {
    "injected": injected,
    "walletconnect": walletconnect,
    "bsc": bscConnector,
}

const connectorLocalStorageKey = "connectorIdv2";
const useAuth = () => {
    const { chainId, activate, deactivate } = useWeb3React()

    const login = useCallback(
        (connectorID) => {
            const connector = connectorsByName[connectorID]
            if (connector) {
                activate(connector, async (error) => {
                    if (error instanceof UnsupportedChainIdError) {
                        const hasSetup = await setupNetwork()
                        if (hasSetup) {
                            activate(connector)
                        }
                    } else {
                        window.localStorage.removeItem(connectorLocalStorageKey)
                        if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
                            console.log('Provider Error', 'No provider was found')
                        } else if (
                            error instanceof UserRejectedRequestErrorInjected ||
                            error instanceof UserRejectedRequestErrorWalletConnect
                        ) {
                            if (connector instanceof WalletConnectConnector) {
                                const walletConnector = connector
                                walletConnector.walletConnectProvider = null
                            }
                            console.error('Authorization Error', 'Please authorize to access your account')
                        } else {
                            console.error("Error 2", error.name, error.message)
                        }
                    }
                })
                window.localStorage.setItem('connectorIdv2', 'injected')
            } else {
                console.error('Unable to find connector', 'The connector config is wrong')
            }
        },
        [activate],
    )

    const logout = useCallback(() => {
        deactivate()
        // This localStorage key is set by @web3-react/walletconnect-connector
        if (window.localStorage.getItem('walletconnect')) {
            connectorsByName.walletconnect.close()
            connectorsByName.walletconnect.walletConnectProvider = null
        }
        window.localStorage.removeItem(connectorLocalStorageKey)
    }, [deactivate])

    return { login, logout }
}

export default useAuth
