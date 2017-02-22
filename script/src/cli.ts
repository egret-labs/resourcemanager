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

var command = process.argv[2];
var p = getProjectPath(process.argv[3]);
if (p && fs.existsSync(path.join(p, "egretProperties.json"))) {
    switch (command) {
        case "upgrade":
            res.upgrade.run(p).catch(handleExceiption)
            break;
        case "build":
            res.build.build(p).catch(handleExceiption)
            break;
        case "watch":
            res.watch.watch(p).catch(handleExceiption)
            break;
        default:
            handleExceiption(`找不到指定的命令{command}`)
            break;
    }
}
else {
    handleExceiption(`${path.join(process.cwd(), p)} 不是一个有效的 Egret 项目`)
}






