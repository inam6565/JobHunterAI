declare module 'dotenv-safe' {
  export interface ConfigOptions {
    example?: string;
    path?: string | string[];
    allowEmptyValues?: boolean;
  }

  export function config(options?: ConfigOptions): void;
}
