const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const marked = require('marked');

const util = require('../util');
const mocker = require('../mocker');

export default class HandlerParser {
    constructor(basePath, dataPath) {
        this.basePath = basePath;

        this.dataPath = dataPath || basePath;
        this.handleModulesName = 'handle_modules';
        this.handlerConfigName = 'config.json';
        this.matmanJson = 'matman.json';
    }

    /**
     * 获取某个路径下的所有的 handler 信息
     */
    getAllHandler() {
        // 1. 获取所有的 handler name
        let handlerNameArr = [];

        util.file.getAll(this.basePath, { globs: ['*'] }).forEach((item) => {
            /**
             * 限制只处理文件夹类型的
             * 在根目录下，每个子文件夹就是一个 handler 单位，其名字即为文件夹名字
             */
            if (item.isDirectory()) {
                handlerNameArr.push(path.basename(item.relativePath));
            } else {
                // 正常情况下不允许在根目录下有非文件夹的存在，因此此处需要增加错误展示
                console.error(`${path.join(item.basePath, item.relativePath)} SHOULD BE Directory!`)
            }
        });

        // 打印一些结果
        console.log(handlerNameArr);

        // 2. 根据 handler name 获取该 handler 下的所有 handle_modules
        let handlerArr = [];

        handlerNameArr.forEach((handlerName) => {
            let handlerInfo = this.getHandlerInfo(handlerName);
            if (handlerInfo) {
                handlerArr.push(this.getHandlerInfo(handlerName));
            }
        });

        return handlerArr;
    }

    /**
     * 获取指定 handler 的信息，当然包括 handle_modules 信息
     * @param {String} handlerName 指定的 handler 的名字
     */
    getHandlerInfo(handlerName) {
        const CUR_HANDLER_PATH = path.join(this.basePath, handlerName);
        const CUR_HANDLE_MODULE_PATH = path.join(CUR_HANDLER_PATH, this.handleModulesName);
        const CUR_HANDLER_CONFIG = path.join(CUR_HANDLER_PATH, this.handlerConfigName);

        // 注意：handler 的 config.json 可能不存在，此时需要提示错误
        // 我们需要有个配置文件，用于指导如何匹配规则，因此是必须的
        if (!fs.existsSync(CUR_HANDLER_CONFIG)) {
            console.error(CUR_HANDLER_CONFIG + ' is not exist!');
            return;
        }

        // 获取这个 handler 模块的 config 信息
        let handlerConfigDB = mocker.db.getDB(CUR_HANDLER_CONFIG);
        let handlerConfigDBState = handlerConfigDB.getState();

        // 至少得有 route 字段，否则报错
        // 我们是需要 route 字段来匹配的，因此是必须的
        if (!handlerConfigDBState.route) {
            console.error(CUR_HANDLER_CONFIG + ' should define property of "route"! ');
            return;
        }

        // 注意 this.matmanJson 可能不存在，不过没关系，如果没存在，后续会新增
        let handlerDBFile = path.join(this.dataPath, handlerName, this.matmanJson);

        // 获取这个 handler 模块的详细信息，它就存储在 this.matmanJson 文件中
        let handlerDB = mocker.db.getDB(handlerDBFile);

        let handlerDBState;

        // 默认会使用到 config 文件内容，并且会覆盖掉原存储文件的内容
        if (!fs.existsSync(handlerDBFile)) {
            handlerDBState = _.merge({}, handlerConfigDBState);
        } else {
            handlerDBState = _.merge({}, handlerDB.getState(), handlerConfigDBState);
        }

        // 名字，默认为文件名
        handlerDBState.name = handlerDBState.name || handlerName;

        // 如果该值为 `true`，则会直接请求现网数据
        handlerDBState.disable = handlerDBState.disable || false;
        handlerDBState.description = handlerDBState.description || handlerDBState.name;
        handlerDBState.activeModule = handlerDBState.activeModule || handlerDBState.defaultModule;
        handlerDBState.method = handlerDBState.method || 'get';
        handlerDBState.priority = handlerDBState.priority || 0;

        // 标签，用于过滤，字符串数组
        handlerDBState.tags = _.union(['全部'], handlerDBState.tags || []);

        // 获取当前的 handler 下的 handle_modules 列表
        let modules = [];
        util.file.getAll(CUR_HANDLE_MODULE_PATH, { globs: ['*'] }).forEach((item) => {
            if (!item.isDirectory()) {
                console.error('SHOULD BE Directory!', item);
                return;
            }

            // 获取模块名
            let curHandleModuleName = path.basename(item.relativePath);

            // config.json 的作用是用于用户自定义，拥有最高的优先级
            let curHandleModuleDBFile = path.join(CUR_HANDLE_MODULE_PATH, curHandleModuleName, 'config.json');
            let curHandleModuleData;

            if (!fs.existsSync(curHandleModuleDBFile)) {
                // config.json不存在，则设置默认值
                curHandleModuleData = {};
            } else {
                // config.json存在，则获取这个模块的详细信息
                let mockModuleDB = mocker.db.getDB(curHandleModuleDBFile);

                curHandleModuleData = mockModuleDB.getState();
            }

            curHandleModuleData.name = curHandleModuleData.name || curHandleModuleName;
            curHandleModuleData.description = curHandleModuleData.description || curHandleModuleName;

            // TODO 如果是 /id/:id 类型的，则此处可能会有问题，或许还需要把请求值放入到query中
            curHandleModuleData.query = _.merge({}, curHandleModuleData.query, { _m_target: curHandleModuleName });

            curHandleModuleData.priority = curHandleModuleData.priority || 0;

            modules.push(curHandleModuleData);
        });

        // 如果不存在默认的 activeModule，则设置第一个 handle_module 为默认
        if (!handlerDBState.activeModule && modules.length) {
            handlerDBState.activeModule = modules[0].name;
        }

        // handle_modules 列表
        handlerDBState.modules = modules;

        // 更新 this.matmanJson
        handlerDB.setState(handlerDBState);

        // 如果是 id/:id 的形式，则params也需要有

        return _.merge({}, handlerDBState, {
            _fullPath: CUR_HANDLER_PATH,
        });
    }
}