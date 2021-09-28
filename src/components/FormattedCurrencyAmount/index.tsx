import JSBI from 'jsbi'
import React from 'react'
import { Currency, CurrencyAmount, Fraction } from '@uniswap/sdk-core'

const CURRENCY_AMOUNT_MIN = new Fraction(JSBI.BigInt(1) as any, JSBI.BigInt(1000000) as any)

export default function FormattedCurrencyAmount({
  currencyAmount,
  significantDigits = 4,
}: {
  currencyAmount: CurrencyAmount<Currency>
  significantDigits?: number
}) {
  return (
    <>
      {currencyAmount.equalTo(JSBI.BigInt(0) as any)
        ? '0'
        : currencyAmount.greaterThan(CURRENCY_AMOUNT_MIN)
        ? currencyAmount.toSignificant(significantDigits)
        : `<${CURRENCY_AMOUNT_MIN.toSignificant(1)}`}
    </>
  )
}
