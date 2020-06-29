import path from 'path';

/**
 * 通过追加标签，获得新的文件名
 *
 * @param {String} filePath 文件名路径
 * @param {String} [tag] 标签
 * @return {String}
 */
export function getNewFilePathWithTag(filePath: string, tag?: string): string {
  if (!tag) {
    return filePath;
  }

  // 去掉 ./ ，例如 ./a/b 修改为 a/b
  const changedPath = filePath
    // linux 中去掉 ./ ，例如 ./a/b 修改为 a/b
    .replace(/^\.\//gi, '')
    // windows 中去掉 .\\ ，例如 .\\a\\b 修改为 a\\b
    .replace(/^\.\\\\/gi, '')
    // windows 中去掉 .\ ，例如 .\a\b 修改为 a\b
    .replace(/^\.\\/gi, '');

  const gap = '_';

  const curSep = /\//.test(changedPath) ? '/' : '\\';
  const arr = changedPath.split(curSep);

  // 获得新的文件名
  let newFileName = arr.pop();
  if (!newFileName) {
    return filePath;
  }
  const fileNameArr = newFileName.split('.');

  if (fileNameArr.length > 1) {
    const lastOne = fileNameArr.pop();
    newFileName = fileNameArr.join('.') + gap + tag + '.' + lastOne;
  } else {
    newFileName = newFileName + gap + tag;
  }

  arr.push(newFileName);

  return arr.join(curSep);
}

/**
 * 根据路径生成不带文件后缀的文件名
 *
 * 例如：
 *
 * /a/b/path -> root_a_b_path
 * a/b/path -> a_b_path
 * a/b/path/file.js -> a_b_path_file_js
 * ./a/b/path -> a_b_path
 * ../a/b/path -> parent_a_b_path
 * d:\\i\\am\\absolute -> d_i_am_absolute
 *
 * @param {String} targetPath 路径
 * @return {String}
 * @author {helinjiang}
 */
export function getFolderNameFromPath(targetPath: string): string {
  return (
    getSaveDirFromPath(targetPath)
      // linux 下的 / 修改为 _
      .replace(/\//gi, '_')

      // windows 下的 \\ 修改为 _
      .replace(/\\/gi, '_')
      .replace(/\\\\/gi, '_')

      // 将文件后缀的 . 修改为 _
      .replace(/\./gi, '_')
  );
}

/**
 * 根据目标路径获得保存路径
 *
 * 例如：
 * /a/b/path -> root/a/b/path
 * a/b/path -> a/b/path
 * ../a/b/path -> parent/a/b/path
 * .. -> parent
 * d:\\i\\am\\absolute -> d\\i\\am\\absolute
 *
 * @param {String} targetPath 路径
 * @return {String}
 * @author {helinjiang}
 */
export function getSaveDirFromPath(targetPath: string): string {
  // 找到相对路径，即从测试项目根目录到行为模块文件的路径，例如： page-xxx/cases/basic-check
  // 极端情况下可能存在下面几种类型的结果：
  //   a/b/path
  //   ../a/b/path
  //   ..
  // 截图保存的路径与源码路径一致，如果有 .. 则替换为 parent
  let changedPath = targetPath;

  // windows 下，去掉 : 符号，即将 d:\\a\\path 修改为 d\\a\\path
  if (/:\\/gi.test(changedPath)) {
    changedPath = changedPath.replace(/:\\/gi, '\\');
  } else if (path.isAbsolute(changedPath)) {
    // linux / macOS 下，将 /a/path 修改为 root/a/path
    changedPath = `root${changedPath}`;
  }

  return (
    changedPath
      // 将 .. 修改为 parent，例如 ../a/b 修改为 parent/a/b
      .replace(/\.\./gi, 'parent')

      // 去掉 ./ ，例如 ./a/b 修改为 a/b
      .replace(/^\.([^[\\|/])*[\\|/]/gi, '')

      // 将文件后缀的 . 修改为 _
      .replace(/\./gi, '_')
  );
}
