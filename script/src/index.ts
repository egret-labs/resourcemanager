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

    getTypeByFileExtensionName?: (extName: string) => string;

    publishPlugins?: { test: any, plugin: Function[] }[]

    executeGulp?: Function;

    filter?: (file: any, env: any, plugins: any) => Promise<File>;

    resources: vfs.Dictionary,

    groups?: {
        [groupName: string]: string[]
    },

    alias?: {
        [aliasName: string]: string
    }

}


export var data: Data;

// export function getResourceInfo(url: string): File {
//     return ResourceConfig.getFile(url);
// }

export function print() {
    console.log(data);
}


export namespace ResourceConfig {

    export var config: Data;


    var resourcePath: string;

    export function addFile(r) {
        vfs.addFile(r);
    }

    export function getFile(filename: string): vfs.File {
        return vfs.getFile(filename);
    }

    export async function init(filename, resourceRootPath) {
        resourcePath = resourceRootPath;
        if (!fs.existsSync(filename)) {
            console.info(`${filename}不存在，创建文件`)
            await createResourceConfigFile(filename);
        }
        let data: Data = require(filename);
        data.resources = {};
        vfs.init(data.resources);
        config = data;
    }



    async function createResourceConfigFile(filename) {


        let obj = {
            groups: {},
            alias: {},
            resources: {}
        };
        let content = `exports.groups = ${JSON.stringify(obj.groups, null, "\t")};
exports.alias = ${JSON.stringify(obj.alias, null, "\t")};
exports.getTypeByFileExtensionName = function(ext) {
    var type;
    switch (ext) {
        case "png":
        case "jpg":
            type = "image";
            break;
        case "fnt":
            type = "font";
            break;
        case "mp3":
            type = "sound";
            break;
        case "pvr":
            type = "pvr";
            break;
    }
    return type;
}
exports.filter = function(file, env, plugins) {

    return new Promise((reslove, reject) => {
        var type;
        var doNotExportType = true;
        var ext = file.ext;
        var p = file.path;
        //console.log(file)
        type = exports.getTypeByFileExtensionName(ext);
        if (!type) {
            switch (ext) {
                case "json":
                    if (p.indexOf("sheet") >= 0) {
                        type = "sheet";
                    } else if (p.indexOf("movieclip") >= 0) {
                        type = "movieclip";
                    } else {
                        type = "json";
                    }
                    break;
            }
            doNotExportType = false;
        }
        if (type) {

                var url = p;//plugins.crc32(p) + "." + ext;
                //console.log(url)
                // plugins.add(url)
                if (doNotExportType) {
                    type = ""
                }
                plugins.add({ url, type, name: p })
                reslove();
                // reslove({ url, type });
    
        }
        else {
            reslove(null);
        }
    });
}
exports.resources = ${JSON.stringify(obj.resources, null, "\t")};`
        await fs.writeFileAsync(filename, content);
    }



    
}

export var build = _build;

export var upgrade = _upgrade;