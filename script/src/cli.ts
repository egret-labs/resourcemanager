#!/usr/bin/env node

import * as res from './';
import * as fs from 'fs-extra-promise';
import * as path from 'path';
import { handleException, ResourceManagerUserConfig } from "./";

function getProjectPath(p) {
    return p ? p : ".";
}


const format = process.argv.indexOf("-json") >= 0 ? "json" : "text";

let command = process.argv[2];
let p = getProjectPath(process.argv[3]);

let promise: Promise<void> | null = null;
if (command == 'version') {
    promise = res.version();
}

let egretPropertiesFile = path.join(p, "egretProperties.json")


if (!promise && p && fs.existsSync(egretPropertiesFile)) {
    executeCommand(command).catch(handleException);
}
else {
    handleException(`${path.join(process.cwd(), p)} 不是一个有效的 Egret 项目`)
}

async function executeCommand(command: string) {
    let properties = await fs.readJSONAsync(egretPropertiesFile);
    if (!properties.resourcemanager) {
        handleException(`egretProperties.json 中不存在 resourcemanager 相关配置`);
        return null;
    }
    let userConfig: ResourceManagerUserConfig = properties.resourcemanager;
    switch (command) {
        case "upgrade":
            return res.upgrade(p);
            break;
        case "build":
        case "publish":
            if (!userConfig.publish_path) {
                handleException('请设置发布目录');
                return null;
            }
            return res.build(p, format, userConfig);
            break;
        case "watch":
            if (!userConfig.publish_path) {
                handleException('请设置发布目录');
                return null;
            }
            return res.watch(p, format, userConfig)
            break;
        case "config":
            return res.printConfig(p);
            break;
        default:
            handleException(`找不到指定的命令{command}`);
            return null;
            break;
    }
}