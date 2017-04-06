#!/usr/bin/env node

import * as res from './';
import * as fs from 'fs-extra-promise';
import * as path from 'path';

function getProjectPath(p) {
    return p ? p : ".";
}

let handleExceiption = (e: string | Error) => {
    if (typeof e == 'string') {
        console.log(`错误:${e}`);
    }
    else {
        console.log(`错误:${e.stack}`);
    }
}

let getCommand = (command: string) => {

}

const format = process.argv.indexOf("-json") >= 0 ? "json" : "text";

let command = process.argv[2];
let p = getProjectPath(process.argv[3]);

let promise: Promise<void> | null = null;
if (command == 'version') {
    promise = res.version();
}

if (!promise && p && fs.existsSync(path.join(p, "egretProperties.json"))) {

    switch (command) {
        case "upgrade":
            promise = res.upgrade(p);
            break;
        case "build":
            promise = res.build(p, format, undefined, true);
            break;
        case "publish":
            let publishPath = process.argv[4];
            if (!publishPath) {
                handleExceiption('请设置发布目录');
            }
            promise = res.build(p, format, publishPath);
            break;
        case "watch":
            promise = res.watch(p, format)
            break;
        case "config":
            promise = res.printConfig(p);
            break;
        default:
            handleExceiption(`找不到指定的命令{command}`)
            break;
    }
}
else {
    handleExceiption(`${path.join(process.cwd(), p)} 不是一个有效的 Egret 项目`)
}
if (promise) {
    promise.catch(handleExceiption);
}