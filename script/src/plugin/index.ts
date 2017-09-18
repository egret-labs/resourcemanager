const through = require('through2');
import { ResVinylFile } from '../';

export type Plugin = {

    name: string;

    onFile: (file: ResVinylFile) => Promise<ResVinylFile | null>;

    onFinish: (param?: { projectRoot: string, resourceFolder: string, userConfig: any }) => void | Promise<void>
}

const plugins: { [name: string]: Plugin } = {};


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
    });
}

import convertFileName from './convertFileName';
import emitConfigJsonFile from './emitConfigJsonFile';
createPlugin(convertFileName);
createPlugin(emitConfigJsonFile);