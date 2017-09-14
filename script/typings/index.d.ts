/// <reference types="vinyl" />
import { Data } from './index';
import * as vfs from './FileSystem';
import * as VinylFile from 'vinyl';
export * from './watch';
export * from './config';
export * from './upgrade';
export * from './build';
export * from './version';
export * from './environment';
export declare let handleException: (e: string | Error) => void;
export interface ResVinylFile extends VinylFile {
    original_relative: string;
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
export declare namespace original {
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
    var resourceRoot: string;
    var typeSelector: (path: string) => string;
    var nameSelector: (path: string) => string;
    var mergeSelector: (path: string) => string | null;
    var resourceConfigFileName: string;
    type UserConfig = {
        outputDir: string;
        plugin: ("zip" | "spritesheet" | "convertFileName" | "emitConfigFile" | "html")[];
    };
    function getUserConfig(): UserConfig;
    var userConfigs: {
        build: UserConfig;
        publish: UserConfig;
    };
    function addFile(r: vfs.File, checkDuplicate: boolean): void;
    function getFile(filename: string): vfs.File | undefined;
    function init(projectPath: any): Promise<void>;
}
