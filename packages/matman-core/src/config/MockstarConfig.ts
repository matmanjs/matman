export interface MockstarQueryDataMap {
  [key: string]: string;
}

export type MockstarConfigOpts = {
  queryDataMap: MockstarQueryDataMap;
};

export default class MockstarConfig {
  queryDataMap: MockstarQueryDataMap;

  constructor(mockstarConfigOpts: MockstarConfigOpts) {
    this.queryDataMap = mockstarConfigOpts.queryDataMap;
  }
}
