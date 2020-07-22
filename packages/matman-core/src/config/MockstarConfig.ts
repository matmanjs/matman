import _ from 'lodash';
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

  update(queryDataMap: MockstarQueryDataMap): void {
    this.queryDataMap = _.merge({}, this.queryDataMap, queryDataMap);
  }
}
