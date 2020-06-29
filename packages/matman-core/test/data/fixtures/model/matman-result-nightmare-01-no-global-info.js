module.exports = {
  runnerName: 'nightmare',
  data: [
    {
      searchInputInfo: {keyWorld: '', searchBtnText: '百度一下'},
      searchResultInfo: {isExist: false, list: []},
      title: '百度一下，你就知道',
    },
    {
      searchInputInfo: {keyWorld: 'matman', searchBtnText: '百度一下'},
      searchResultInfo: {isExist: false, list: []},
      title: '百度一下，你就知道',
    },
    {
      searchInputInfo: {keyWorld: 'matman', searchBtnText: '百度一下'},
      searchResultInfo: {isExist: true},
      title: 'matman_百度搜索',
    },
  ],
  dataIndexMap: {
    init: 0,
    input_key_word: 1,
    click_to_search: 2,
  },
  globalInfo: {},
};
