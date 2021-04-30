import _ from 'lodash';

export interface IMockstarQueryDataMap {
  [key: string]: string;
}

export type IMockstarConfigOpts = {
  queryDataMap: IMockstarQueryDataMap;
};

export default class MockstarConfig {
  public queryDataMap: IMockstarQueryDataMap;

  public constructor(mockstarConfigOpts: IMockstarConfigOpts) {
    this.queryDataMap = mockstarConfigOpts.queryDataMap;
  }

  /**
   * 更新
   *
   * @param {IMockstarQueryDataMap} queryDataMap
   */
  public update(queryDataMap: IMockstarQueryDataMap): void {
    this.queryDataMap = _.merge({}, this.queryDataMap, queryDataMap);
  }
}
