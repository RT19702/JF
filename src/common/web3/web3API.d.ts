declare module '@/common/web3/web3API' {
  export const env: any;
  export const CHAIN_NAME_SYMBOL: string;
  export const Account: any;
  export function check(): Promise<boolean>;
}