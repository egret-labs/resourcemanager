import { ResVinylFile, ResourceConfig } from '../';
export declare type PluginContext = {
    projectRoot: string;
    resourceFolder: string;
    userConfig: ResourceConfig.UserConfig;
};
export declare type Plugin = {
    name: string;
    onFile: (file: ResVinylFile) => Promise<ResVinylFile | null>;
    onFinish: (param: PluginContext) => void | Promise<void>;
};
export declare function init(__projectRoot: any, __resourceFolder: any, userConfig: ResourceConfig.UserConfig): void;
export declare function createPlugin(plugin: Plugin): void;
export declare function getPlugin(name: string): any;
