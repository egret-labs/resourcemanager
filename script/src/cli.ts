
import * as res from './';
import * as fs from 'fs-extra-promise';
import * as path from 'path';
import { handleException, ResourceManagerUserConfig } from "./";

function getProjectPath(p: string | null) {
    return p ? p : ".";
}

let command = process.argv[2];
let projectRoot = getProjectPath(process.argv[3]);
console.log('command:', command)


executeCommand(command).catch(handleException);

async function executeCommand(command: string) {

    switch (command) {
        case "version":
            return res.version();
            break;
        case "upgrade":
            return res.upgrade(projectRoot);
            break;
        case "build":
        case "publish":
            return res.build({ projectRoot, debug: true, command });
            break;
        case "watch":
            return res.watch(projectRoot)
            break;
        case "config":
            return res.printConfig(projectRoot);
            break;
        case "env":
            const key = process.argv[3];
            const value = process.argv[4];
            if (key != "texture_merger_path") {
                handleException(`找不到指定的命令{command}`);
                return null;
            }
            else {
                return res.setEnv(key, value);
            }

            break;
        default:
            handleException(`找不到指定的命令{command}`);
            return null;
            break;
    }
}