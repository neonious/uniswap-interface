import { ChainId } from '@uniswap/sdk-core'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import getLibrary from '../utils/getLibrary'

import { NetworkConnector } from './NetworkConnector'
import UNISWAP_LOGO_URL from '../assets/svg/logo.svg'

const WALLETCONNECT_BRIDGE_URL = process.env.REACT_APP_WALLETCONNECT_BRIDGE_URL

const NETWORK_URLS: {
  [chainId in any]: string
} = {
  137: `https://rpc-mainnet.maticvigil.com/v1/190f10f49d1407fa2f3e182d445b23da4aa0768a`,
}

const SUPPORTED_CHAIN_IDS = [137]

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: 137,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
})

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  rpc: {
    137: 'https://rpc-mainnet.maticvigil.com/v1/190f10f49d1407fa2f3e182d445b23da4aa0768a',
  },
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true,
  pollingInterval: 15000,
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URLS[137],
  appName: 'Uniswap',
  appLogoUrl: UNISWAP_LOGO_URL,
})
