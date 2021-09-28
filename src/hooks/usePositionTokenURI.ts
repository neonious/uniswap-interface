import { BigNumber } from 'ethers'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'

type TokenId = number | JSBI | BigNumber

const STARTS_WITH = 'data:application/json;base64,'

type UsePositionTokenURIResult =
  | {
      valid: true
      loading: false
      result: {
        name: string
        description: string
        image: string
      }
    }
  | {
      valid: false
      loading: false
    }
  | {
      valid: true
      loading: true
    }

export function usePositionTokenURI(tokenId: TokenId | undefined): UsePositionTokenURIResult {
  return { valid: false, loading: false }
}
