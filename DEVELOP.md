# 开发指引

我们使用 [lerna](https://github.com/lerna/lerna) 来管理多个 npm 包。

## 1. 开发准备

### 1.1 安装依赖

```bash
$ npm install
```

### 1.2 初始化

项目依赖安装完成之后，`packages` 里面的组件还有自己的依赖，甚至有相互依赖的场景，因此还需要使用 lerna 初始化项目，这样就不需要去到各个包里面安装依赖了。

```bash
$ lerna bootstrap
```

## 2. 开发过程

### 2.1 如果相互依赖

使用 `module-2` 依赖了 `module-1` ，则可以使用 [lerna add](https://github.com/lerna/lerna/tree/master/commands/add#readme) 来快速加上依赖。

```bash
# Install module-1 to module-2 in devDependencies
$ lerna add module-1 --scope=module-2 --dev
```


