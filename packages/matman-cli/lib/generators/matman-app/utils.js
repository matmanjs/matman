'use strict';

const fs = require('fs');
const path = require('path');

class Utils {
  static read(root, filter, files, prefix) {
    prefix = prefix || '';
    files = files || [];
    filter = filter || Utils.noDotFiles;

    const dir = path.join(root, prefix);
    if (!fs.existsSync(dir)) return files;
    if (fs.statSync(dir).isDirectory())
      fs.readdirSync(dir)
        .filter(filter)
        .forEach(function (name) {
          Utils.read(root, filter, files, path.join(prefix, name));
        });
    else
      files.push(prefix);

    return files
  }

  static noDotFiles(x) {
    return x[0] !== '.';
  }

  static formatDate(fmt, date) {
    const o = {
      "M+" : date.getMonth() + 1,
      "d+" : date.getDate(),
      "h+" : date.getHours(),
      "m+" : date.getMinutes(),
      "s+" : date.getSeconds(),
      "q+" : Math.floor((date.getMonth() + 3) / 3),
      "S"  : date.getMilliseconds()
    };

    if(/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for(let k in o) {
      if(new RegExp("("+ k +")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00'+ o[k]).substr(('' + o[k]).length)));
      }
    }

    return fmt;
  }
}

module.exports = Utils;
