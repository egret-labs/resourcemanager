/// <reference types="node" />
import { ResVinylFile } from '../';
export declare type PluginContext = {
    projectRoot: string;
    resourceFolder: string;
    buildConfig: {
        command: "build" | "publish";
    };
    createFile: (relativePath: string, content: Buffer) => void;
};
export declare type Plugin = {
    onFile: (file: ResVinylFile) => Promise<ResVinylFile | null>;
    onFileLater?: (file: ResVinylFile) => Promise<ResVinylFile | null>;
    onFinish: (param: PluginContext) => void | Promise<void>;
};
export declare function init(__projectRoot: any, __resourceFolder: any, __buildConfig: {
    command: "build" | "publish";
}): void;
export declare function createPlugin(p: Plugin): any;
