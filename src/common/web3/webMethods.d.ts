declare module './webMethods.js' {
  const value: any
  export default value
}

declare const env: any
declare const CHAIN_NAME_SYMBOL: string
declare const Account: any
declare function check(): Promise<boolean>

export {
  env,
  CHAIN_NAME_SYMBOL,
  Account,
  check
}
