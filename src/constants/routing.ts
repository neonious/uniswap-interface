// a list of tokens by chain
import { ChainId, Token } from '@uniswap/sdk-core'
import { DAI, WETH, WMATIC, QUICK, MDSIM, WBTC, USDC, USDT } from './tokens'

type ChainTokenList = {
  readonly [chainId in any]: Token[]
}
// List of all mirror's assets addresses.
// Last pulled from : https://whitelist.mirror.finance/eth/tokenlists.json
// TODO: Generate this programmatically ?
const mAssetsAdditionalBases: { [tokenAddress: string]: Token[] } = {
}
const WETH_ONLY: ChainTokenList = {
  [137]: [WETH]
}
// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [137]: [...WETH_ONLY[137], DAI, USDC, USDT, QUICK, WMATIC, WBTC],
}
export const ADDITIONAL_BASES: { [chainId in any]?: { [tokenAddress: string]: Token[] } } = {
  [137]: {
    ...mAssetsAdditionalBases
  },
}
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in any]?: { [tokenAddress: string]: Token[] } } = {
  [137]: {
  },
}
// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: Partial<ChainTokenList> = {
  [137]: [WETH, MDSIM, USDC, USDT, DAI],
}
// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [137]: [...WETH_ONLY[137], MDSIM, WMATIC, QUICK, DAI, USDC, USDT],
}

export const PINNED_PAIRS: { readonly [chainId in any]?: [Token, Token][] } = {
  [137]: [
  ],
}
