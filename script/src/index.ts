import * as path from 'path';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';


import * as _config from './config';
import * as _build from './build';

export var config = _config;


export interface File {

    url: string;

    type: string;

    name?: string;

}

export interface Dictionary {

    [file: string]: File | Dictionary

}

enum ResourceNodeType {
    FILE, DICTIONARY
}

export interface Data {

    getTypeByFileExtensionName?: (extName: string) => string;

    publishPlugins?: { test: any, plugin: Function[] }[]

    executeGulp?:Function;

    filter?: (file: any, env: any, plugins: any) => Promise<File>;

    resources: Dictionary,

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


    export async function execute() {
        if (!config.executeGulp) {
            return;
        }

        config.executeGulp();

        // let option: utils.walk.WalkOptions = {
        //     relative: true,
        //     ignoreHiddenFile: true
        // }

        // let list = await utils.walk(resourcePath, () => true, option);
        // for (let file of list) {
        //     for (let plugin of config.publishPlugins) {
        //         if (plugin.test(file)) {
        //             for (let p of plugin.plugin){
        //                 // await 
        //             }
        //         }
        //     }
        // }

    }

    export function addFile(r) {
        filesystem.addFile(r);
    }

    export function getFile(filename: string): File {
        return filesystem.getFile(filename);
    }

    export async function init(filename, r) {

        resourcePath = r;

        if (!fs.existsSync(filename)) {
            console.log(filename)
            await createResourceConfigFile(filename);
        }
        let data: Data = require(filename);
        data.resources = {};
        filesystem.data = data.resources;
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



    namespace filesystem {

        export var data: Dictionary = {};


        export function addFile(r: File) {

            var type = r.type;
            var filename = r.name;
            var url = r.url;
            if (!type) type = "";
            filename = normalize(filename);
            let basefilename = basename(filename);
            let folder = dirname(filename);
            if (!exists(folder)) {
                mkdir(folder);
            }
            let d = reslove(folder);
            //  console.log (type)
            if (type == "") {
                d[basefilename] = url;
            }
            else {
                d[basefilename] = { url: url, type };
            }
        }

        export function getFile(filename: string): File {
            return reslove(filename) as File;
        }

        function basename(filename: string) {
            return filename.substr(filename.lastIndexOf("/") + 1);
        }

        function normalize(filename: string) {
            return filename.split("/").filter(d => !!d).join("/");
        }

        function dirname(path: string) {
            return path.substr(0, path.lastIndexOf("/"));
        }

        function reslove(dirpath: string) {
            dirpath = normalize(dirpath);
            let list = dirpath.split("/");
            let current: File | Dictionary = data;
            for (let f of list) {
                current = current[f];
            }
            return current;
        }

        export function mkdir(dirpath: string) {
            dirpath = normalize(dirpath);
            let list = dirpath.split("/");
            let current = data;
            for (let f of list) {
                if (!current[f]) {
                    current[f] = {};
                }
                current = current[f] as Dictionary;
            }
        }

        export function exists(dirpath: string) {
            dirpath = normalize(dirpath);
            let list = dirpath.split("/");
            let current = data;
            for (let f of list) {
                if (!current[f]) {
                    return false;
                }
                current = current[f] as Dictionary;
            }
            return true;
        }

    }


}



export async function build(p: string, target?: string) {

    return _build.build(p, target);
}