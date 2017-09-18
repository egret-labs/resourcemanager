import { ResVinylFile } from '../';
export declare type Plugin = {
    name: string;
    onFile: (file: ResVinylFile) => Promise<ResVinylFile | null>;
    onFinish: (param?: {
        projectRoot: string;
        resourceFolder: string;
        userConfig: any;
    }) => void | Promise<void>;
};
export declare function createPlugin(plugin: Plugin): void;
export declare function getPlugin(name: string): any;
