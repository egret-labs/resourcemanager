#!/usr/bin/env node

import * as res from './';
import * as fs from 'fs-extra-promise';
import * as path from 'path';
import { handleException } from "./";

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

// import * as spritesheet from './plugin/spritesheet';
// spritesheet.generateSpriteSheet();

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

    let publishPath = properties.resourcemanager.resource_publish_path;
    switch (command) {
        case "upgrade":
            return res.upgrade(p);
            break;
        case "build":
        case "publish":
            if (!publishPath) {
                handleException('请设置发布目录');
            }
            return res.build(p, format, publishPath);
            break;
        case "watch":
            if (!publishPath) {
                handleException('请设置发布目录');
            }
            return res.watch(p, format, publishPath)
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