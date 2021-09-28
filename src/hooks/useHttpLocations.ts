import { useMemo } from 'react'
import contenthashToUri from '../utils/contenthashToUri'
import uriToHttp from '../utils/uriToHttp'

export default function useHttpLocations(uri: string | undefined): string[] {
  return useMemo(() => {
      return uri ? uriToHttp(uri) : []
  }, [uri])
}
