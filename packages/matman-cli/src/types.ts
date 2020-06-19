export interface Argv {
  [x: string]: unknown;
  type: string | undefined;
  dev: boolean | undefined;
  _: string[];
  $0: string;
}

export interface DealWith {
  init: (argv: Argv) => Promise<void>;
  build: (argv: Argv) => Promise<void>;
}
