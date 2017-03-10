import { Data } from './index';
import * as path from 'path';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';


import * as _config from './config';
import * as _build from './build';
import * as _upgrade from './upgrade';
import * as vfs from './FileSystem'
import * as _watch from './watch';

export var config = _config;
export var build = _build;
export var upgrade = _upgrade;
export var watch = _watch;




enum ResourceNodeType {
    FILE, DICTIONARY
}

export interface Data {

    resources: vfs.Dictionary,

    groups: {
        [groupName: string]: string[]
    },

    alias: {
        [aliasName: string]: string
    }

}


export interface GeneratedDictionary {

    [file: string]: GeneratedFile | GeneratedDictionary

}

export type GeneratedFile = string | vfs.File;

export interface GeneratedData {

    resources: GeneratedDictionary

    groups: {
        [groupName: string]: string[]
    },

    alias: {
        [aliasName: string]: string
    }

}

export namespace ResourceConfig {

    export function getConfig() {
        return config;
    }

    export function generateConfig(): GeneratedData {
        let loop = (r: GeneratedDictionary) => {
            for (var key in r) {
                var f = r[key];
                if (isFile(f)) {
                    if (typeof (f) != "string") {

                        if (ResourceConfig.typeSelector(f.url) == f.type) {

                            r[key] = f.url;
                        }
                    }


                    // if (typeof f === 'string') {
                    //     f = { url: f, name: p };
                    //     r[key] = f;
                    // }
                    // else {
                    //     f['name'] = p;
                    // }
                }
                else {
                    loop(f);
                }

            }
        }

        let isFile = (r: GeneratedDictionary[keyof GeneratedDictionary]): r is GeneratedFile => {
            if (r['url']) {
                return true;
            }
            else {
                return false;
            }
        }

        let generatedData: GeneratedDictionary = JSON.parse(JSON.stringify(config.resources));
        loop(generatedData);
        let result: GeneratedData = {
            alias: config.alias,
            groups: config.groups,
            resources: generatedData
        }
        return result;
    }

    var config: Data;

    export var typeSelector: (path: string) => string;

    var resourcePath: string;

    export function addFile(r) {
        vfs.addFile(r);
    }

    export function getFile(filename: string): vfs.File | undefined {
        return vfs.getFile(filename);
    }

    export async function init(projectPath) {
        let result = await _config.getConfigViaDecorator(projectPath);
        typeSelector = result.typeSelector;
        resourcePath = path.resolve(projectPath, result.resourceRoot);
        let filename = path.resolve(process.cwd(), projectPath, result.resourceRoot, result.resourceConfigFileName);;
        config = { alias: {}, groups: {}, resources: {} };
        vfs.init(config.resources);
        return result;

    }
}

