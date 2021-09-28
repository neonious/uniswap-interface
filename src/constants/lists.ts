// used to mark unsupported tokens, these are hosted lists of unsupported tokens

const QUICKSWAP_LIST = 'https://unpkg.com/quickswap-default-token-list/build/quickswap-default.tokenlist.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  QUICKSWAP_LIST,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [QUICKSWAP_LIST]
