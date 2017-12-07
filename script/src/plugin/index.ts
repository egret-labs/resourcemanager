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

export function getPlugin(name: string | Plugin) {
    let p: Plugin;
    if (typeof name == 'string') {
        p = plugins[name];
    }
    else {
        p = name;
    }
    const through = require('through2');
    return through.obj(async (file: ResVinylFile, enc, cb) => {
        try {
            let r = await p.onFile(file);
            if (r) {
                cb(null, file);
            }
            else {
                cb(null);
            }
        }
        catch (e) {
            console.log(e);
        }

    }, async function (cb) {
        let context: PluginContext = {
            resourceFolder, projectRoot, buildConfig, createFile: (relativePath, buffer) => {
                let newFile = new Vinyl({
                    cwd: resourceFolder,
                    base: resourceFolder,
                    path: path.join(resourceFolder, relativePath),
                    origin: relativePath,
                    contents: buffer,
                    isDirty: true
                });
                this.push(newFile);
            }
        }
        try {
            await p.onFinish(context);
            cb();
        }
        catch (e) {
            console.log(e);
        }
    });
}

import convertFileName from './convertFileName';
import emitConfigJsonFile from './emitConfigJsonFile';
import zip from './zip';
import spritesheet from './spritesheet';
import html from './html';
createPlugin(convertFileName);
createPlugin(emitConfigJsonFile);
createPlugin(zip);
createPlugin(spritesheet);
createPlugin(html);