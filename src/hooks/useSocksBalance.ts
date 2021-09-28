import JSBI from 'jsbi'
import { useMemo } from 'react'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { useActiveWeb3React } from './web3'

export default function useSocksBalance(): JSBI | undefined {
  return undefined
}

export function useHasSocks(): boolean | undefined {
  return false
}
