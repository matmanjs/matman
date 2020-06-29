import Generator from 'yeoman-generator';
import {basename, resolve} from 'path';
import glob from 'glob';
import {statSync} from 'fs';

function noop() {
  return true;
}

export class BasicGenerator extends Generator {
  opts: any;
  name: string;

  constructor(opts: any) {
    super([], opts);
    this.opts = opts;
    this.name = basename(opts.env.cwd);
  }

  writeFiles({context, filterFiles = noop}: {context: any; filterFiles?: any}): void {
    glob
      .sync('**/*', {
        cwd: resolve(this.opts.resolved),
        dot: true,
      })
      .filter(filterFiles)
      .forEach(file => {
        const filePath = resolve(this.opts.resolved, file);
        if (statSync(filePath).isFile()) {
          this.fs.copyTpl(
            this.templatePath(filePath),
            this.destinationPath(file.replace(/^_/, '.')),
            context,
          );
        }
      });
  }
}
