
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

    switch (command) {
        case "upgrade":
            return res.upgrade(p);
            break;
        case "build":
        case "publish":
            return res.build(p);
            break;
        case "watch":
            return res.watch(p)
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