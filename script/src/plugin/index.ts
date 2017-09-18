const through = require('through2');
import { ResVinylFile, ResourceConfig } from '../';

export type PluginContext = {
    projectRoot: string,
    resourceFolder: string,
    userConfig: ResourceConfig.UserConfig
}

export type Plugin = {

    name: string;

    onFile: (file: ResVinylFile) => Promise<ResVinylFile | null>;

    onFinish: (param: PluginContext) => void | Promise<void>
}

const plugins: { [name: string]: Plugin } = {};

let projectRoot: string;
let resourceFolder: string;
let userConfig: ResourceConfig.UserConfig;

export function init(__projectRoot, __resourceFolder, userConfig: ResourceConfig.UserConfig) {
    projectRoot = __projectRoot;
    resourceFolder = __resourceFolder;
}


export function createPlugin(plugin: Plugin) {
    plugins[plugin.name] = plugin;
}

export function getPlugin(name: string) {
    let p = plugins[name];
    const through = require('through2');
    return through.obj(async (file: ResVinylFile, enc, cb) => {
        let r = await p.onFile(file);
        if (r) {
            cb(null, file);
        }
        else {
            cb(null);
        }
    }, async function (cb) {

        let context: PluginContext = {
            resourceFolder, projectRoot, userConfig
        }
        await p.onFinish(context);
    });
}

import convertFileName from './convertFileName';
import emitConfigJsonFile from './emitConfigJsonFile';
createPlugin(convertFileName);
createPlugin(emitConfigJsonFile);