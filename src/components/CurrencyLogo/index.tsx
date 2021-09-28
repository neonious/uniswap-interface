import { ChainId, Currency } from '@uniswap/sdk-core'
import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import EthereumLogo from '../../assets/images/matic.svg'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import Logo from '../Logo'

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

import QUICKSWAP_LIST from 'quickswap-default-token-list'

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  ...rest
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  let uri: any;
  if(currency instanceof WrappedTokenInfo && currency.logoURI)
    uri = currency.logoURI;

  // Hack here cause not sure how to fix nicely
  else if(currency && currency.symbol == 'MDSIM') uri = 'https://www.neonious.org/main/Neonious-Icon-64.png';
  else if(currency)
    for(let i = 0; i < QUICKSWAP_LIST.tokens.length; i++) {
      if(QUICKSWAP_LIST.tokens[i].symbol == currency.symbol) {
        uri = QUICKSWAP_LIST.tokens[i].logoURI;
        break;
      }
    }

  const uriLocations = useHttpLocations(uri);

  const srcs: string[] = useMemo(() => {
    if (!currency || currency.isEther) return []

    if (uriLocations)
      return [...uriLocations]
    return []
  }, [currency, uriLocations])

  if (currency?.isEther) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} {...rest} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} {...rest} />
}
