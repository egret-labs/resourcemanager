/// <reference types="vinyl" />
import { Data, Plugin } from './index';
import * as vfs from './FileSystem';
import * as VinylFile from 'vinyl';
export * from './watch';
export * from './config';
export * from './build';
export * from './plugin';
export declare const minimatch: any;
export declare const glob: any;
export declare let handleException: (e: string | Error) => void;
export declare type BuildConfig = {
    projectRoot: string;
    debug: boolean;
    command: "build" | "publish";
    target: string;
};
export interface ResVinylFile extends VinylFile {
    isDirty: boolean;
    origin: string;
    isExistedInResourceFolder: boolean;
}
export interface ResourceManagerUserConfig {
    publish_path: string;
    texture_merger_path?: string;
}
export interface Data {
    resources: vfs.Dictionary;
    groups: {
        [groupName: string]: string[];
    };
    alias: {
        [aliasName: string]: string;
    };
}
export interface GeneratedDictionary {
    [file: string]: GeneratedFile | GeneratedDictionary;
}
export declare type GeneratedFile = string | vfs.File;
export interface GeneratedData {
    resources: GeneratedDictionary;
    groups: {
        [groupName: string]: string[];
    };
    alias: {
        [aliasName: string]: string;
    };
}
export declare namespace legacy {
    interface Info {
        groups: GroupInfo[];
        resources: ResourceInfo[];
    }
    interface GroupInfo {
        keys: string;
        name: string;
    }
    interface ResourceInfo {
        name: string;
        type: string;
        url: string;
        subkeys?: string;
    }
}
export declare namespace ResourceConfig {
    function getConfig(): Data;
    function generateClassicalConfig(): Promise<string>;
    function generateConfig(debug: boolean): GeneratedData;
    var typeSelector: (path: string) => string;
    var nameSelector: (path: string) => string;
    var mergeSelector: (path: string) => string | null;
    type UserConfig = {
        outputDir: string;
        commands: Plugin[];
        matcher?: string;
    };
    var userConfig: UserConfig;
    function init(projectPath: string, buildConfig: BuildConfig): Promise<void>;
}
