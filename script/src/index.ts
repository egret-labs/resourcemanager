import { Data } from './index';
import * as path from 'path';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';


import * as _config from './config';
import * as _build from './build';
import * as _upgrade from './upgrade';
import * as vfs from './FileSystem'

export var config = _config;




enum ResourceNodeType {
    FILE, DICTIONARY
}

export interface Data {

    resources: vfs.Dictionary,

    groups?: {
        [groupName: string]: string[]
    },

    alias?: {
        [aliasName: string]: string
    }

}


export var data: Data;

export function print() {
    console.log(data);
}


export namespace ResourceConfig {

    export var config: Data;

    export var typeSelector: (path: string) => string;

    var resourcePath: string;

    export function addFile(r) {

        var f = r.url;
        var ext = f.substr(f.lastIndexOf(".") + 1);
        if (r.type == typeSelector(ext)) {
            r.type = "";
        }
        vfs.addFile(r);
    }

    export function getFile(filename: string): vfs.File {
        return vfs.getFile(filename);
    }

    export async function init(filename, resourceRootPath) {
        resourcePath = resourceRootPath;
        let data: Data;
        try {
            data = await fs.readJSONAsync(filename);
        }
        catch (e) {
            console.warn(`${filename}解析失败,使用初始值`)
            data = { alias: {}, groups: {}, resources: {} };
        }
        vfs.init(data.resources);
        config = data;
    }
}

export var build = _build;

export var upgrade = _upgrade;