import { Pool, Position } from '@uniswap/v3-sdk'
import { PositionDetails } from 'types/position'
import { useCurrency } from './Tokens'

export function useDerivedPositionInfo(
  positionDetails: PositionDetails | undefined
): {
  position: Position | undefined
  pool: Pool | undefined
} {
  const currency0 = useCurrency(positionDetails?.token0)
  const currency1 = useCurrency(positionDetails?.token1)

  // construct pool data
  let position = undefined
  return {
    position,
    pool: undefined
  }
}
