const pipeline = require('../matman-app/src/pipelines/d');

console.log(pipeline);

const list = [];

const demoMap = [{
  desc: 'src/materials',
  type: 'group',
  children: [{
    desc: 'app',
    type: 'folder',
    pluginName: 'PluginApp',
    children: [
      'dev',
      'prod',
    ],
  }, {
    desc: 'mocha',
    type: 'folder',
    pluginName: 'PluginMocha',
    children: [
      'all',
      'only-page-index',
    ],
  }],
}];

for (let index = 0; index < pipeline.matmanConfig.plugins.length; index++) {
  const plugin = pipeline.matmanConfig.plugins[index];

  const pluginName = plugin.name;
  console.log('\n===', pluginName);

  if (typeof plugin.getAllMaterial === 'function') {
    const allMaterial = plugin.getAllMaterial(pipeline.matmanConfig.matmanRootPath);
    console.log(allMaterial);

    allMaterial.forEach((item) => {
      // group 名字
      const groupDesc = item.materialFileItem.groupName;
      let groupItem = list.filter(i => i.desc === groupDesc)[0];
      if (!groupItem) {
        groupItem = {};
        list.push(groupItem);
      }

      groupItem.desc = groupDesc;
      groupItem.type = 'group';
      groupItem.children = groupItem.children || [];

      const folderDesc = item.materialFileItem.folderName;
      let folderItem = groupItem.children.filter(i => i.desc === folderDesc)[0];
      if (!folderItem) {
        folderItem = {};
        groupItem.children.push(folderItem);
      }

      folderItem.desc = folderDesc;
      folderItem.type = 'folder';
      folderItem.pluginName = pluginName;
      folderItem.children = folderItem.children || [];

      folderItem.children.push(item);

    });
  }

  if (typeof plugin.getCurMaterial === 'function') {
    const curMaterial = plugin.getCurMaterial();
    console.log(curMaterial);
  }
}

console.log('\n============================================');
console.log(JSON.stringify(list,null,2));


