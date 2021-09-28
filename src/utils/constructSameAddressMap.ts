export function constructSameAddressMap<T extends string>(address: T): { [chainId in any]: T } {
  return {
    [137]: address,
  }
}
