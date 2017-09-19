const through = require('through2');
import * as Vinyl from 'vinyl';
import * as path from 'path';
import { ResVinylFile, ResourceConfig, ResourceManagerUserConfig } from '../';

export type PluginContext = {
    projectRoot: string,
    resourceFolder: string,
    buildConfig: { command: "build" | "publish" },

    createFile: (relativePath: string, content: Buffer) => void
}

export type Plugin = {

    name: string;

    onFile: (file: ResVinylFile) => Promise<ResVinylFile | null>;

    onFinish: (param: PluginContext) => void | Promise<void>
}

const plugins: { [name: string]: Plugin } = {};

let projectRoot: string;
let resourceFolder: string;
let buildConfig: { command: "build" | "publish" };

export function init(__projectRoot, __resourceFolder, __buildConfig: { command: "build" | "publish" }) {
    projectRoot = __projectRoot;
    resourceFolder = __resourceFolder;
    buildConfig = __buildConfig;
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
        console.log(p)
        let context: PluginContext = {
            resourceFolder, projectRoot, buildConfig, createFile: (relativePath, buffer) => {
                let newFile = new Vinyl({
                    cwd: resourceFolder,
                    base: resourceFolder,
                    path: path.join(resourceFolder, relativePath),
                    original_relative: relativePath,
                    contents: buffer
                });
                this.push(newFile);
            }
        }
        await p.onFinish(context);
        cb();
    });
}

import convertFileName from './convertFileName';
import emitConfigJsonFile from './emitConfigJsonFile';
import zip from './zip';
import spritesheet from './spritesheet';
createPlugin(convertFileName);
createPlugin(emitConfigJsonFile);
createPlugin(zip);
createPlugin(spritesheet);