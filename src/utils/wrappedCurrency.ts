import {
  ChainId,
  Currency,
  ETHER,
  Token,
  CurrencyAmount,
  wrappedCurrency as wrappedCurrencyInternal,
  wrappedCurrencyAmount as wrappedCurrencyAmountInternal
} from '@uniswap/sdk-core'
import { supportedChainId } from './supportedChainId'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency ? wrappedCurrencyInternal(currency, chainId) : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Currency> | undefined,
  chainId: ChainId | undefined
): CurrencyAmount<Token> | undefined {
  return currencyAmount && chainId ? wrappedCurrencyAmountInternal(currencyAmount, chainId) : undefined
}

export const WMATIC = new Token(137, '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 18, 'WMATIC', 'Wrapped MATIC')

export function unwrappedToken(token: Token): Currency {
  if (token.isEther) return token
  const formattedChainId = supportedChainId(token.chainId)
  if (formattedChainId && token.equals(WMATIC)) return ETHER
  return token
}
