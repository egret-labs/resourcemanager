import { Data, Plugin } from './index';
import * as path from 'path';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as vfs from './FileSystem';
import * as _config from './config';
import * as VinylFile from 'vinyl';

export * from './watch';
export * from './config';
export * from './build';
export * from './plugin';


export const minimatch = require('minimatch');
export const glob = require('glob')

export let handleException = (e: string | Error) => {
    if (typeof e == 'string') {
        console.error(`错误:${e}`);
    }
    else {
        console.error(`错误:${e.stack}`);
    }
}

export type BuildConfig = { projectRoot: string, debug: boolean, matcher?: string, command: "build" | "publish", target: string }

export interface ResVinylFile extends VinylFile {

    isDirty: boolean

    origin: string;

    isExistedInResourceFolder: boolean;
}

export interface ResourceManagerUserConfig {

    publish_path: string;

    texture_merger_path?: string;



}


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

export namespace legacy {


    export interface Info {
        groups: GroupInfo[],
        resources: ResourceInfo[],
    }

    export interface GroupInfo {
        keys: string,
        name: string
    }

    export interface ResourceInfo {
        name: string;
        type: string;
        url: string;
        subkeys?: string
    }
}

export namespace ResourceConfig {


    function loop(r: vfs.Dictionary, callback: (file: vfs.File) => void) {
        for (var key in r) {
            var f = r[key];
            if (isFile(f)) {
                callback(f);
            }
            else {
                loop(f, callback);
            }

        }
    }

    function isFile(r: any): r is vfs.File {
        return r.url;
    }

    export function getConfig() {
        return config;
    }

    export async function generateClassicalConfig() {
        let result: legacy.Info = {
            groups: [],
            resources: []
        }
        let resources = config.resources;

        let alias = {};
        for (var aliasName in config.alias) {
            alias[config.alias[aliasName]] = aliasName;
        }

        loop(resources, (f) => {
            let r: legacy.ResourceInfo = f;
            if (alias[r.name]) {
                r.name = alias[r.name]
            }
            result.resources.push(r);
            // console.log(f.name)
        })
        return JSON.stringify(result, null, "\t");
    }

    export function generateConfig(debug: boolean): GeneratedData {

        let loop = (r: GeneratedDictionary) => {
            for (var key in r) {
                var f = r[key];
                if (isFile(f)) {
                    if (typeof (f) == "string") {
                        continue;
                    }

                    if (!debug) {
                        delete f.name;
                        // console.log 
                        if (ResourceConfig.typeSelector(f.url) == f.type) {
                            delete f.type;
                        }
                        if (Object.keys(f).length == 1) {
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

    export var nameSelector: (path: string) => string;

    export var mergeSelector: (path: string) => string | null;

    export type UserConfig = {
        outputDir: string,
        commands: Plugin[]
    }


    export var userConfig: UserConfig


    export async function init(projectPath: string, buildConfig: BuildConfig) {
        const configFile1 = buildConfig.target == 'web' ? `scripts/config.ts` : `scripts/config.${buildConfig.target}.ts`;
        const configFile = path.join(projectPath, configFile1);
        if (!(await fs.existsAsync(configFile))) {
            throw `scripts 文件夹缺少 ${configFile1}`;
        }

        let parsedConfig = await _config.getConfigViaFile(configFile, buildConfig);
        typeSelector = parsedConfig.typeSelector;
        nameSelector = parsedConfig.nameSelector;
        mergeSelector = parsedConfig.mergeSelector;
        config = { alias: {}, groups: {}, resources: {} };
        userConfig = parsedConfig.userConfig;
        if (!userConfig) {
            userConfig = {
                outputDir: ".",
                commands: []
            }
        }
    }
}
