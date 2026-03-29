declare const IS_PROD: boolean;
declare const IS_DEV: boolean;

declare module 'html360-gen' {
  export interface Html360Gen {
    getBinaryPath(): string;
  }

  export const html360Gen: Html360Gen;
}