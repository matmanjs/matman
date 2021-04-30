export interface IArgv {
  [x: string]: unknown;
  type: string | undefined;
  dev: boolean | undefined;
  _: string[];
  $0: string;
}

export interface IDealWith {
  init: (argv: IArgv) => Promise<void>;
  build: (argv: IArgv) => Promise<void>;
}
