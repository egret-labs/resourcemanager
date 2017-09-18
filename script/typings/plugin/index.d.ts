import { ResVinylFile } from '../';
export declare type Plugin = {
    name: string;
    onFile: (file: ResVinylFile) => Promise<ResVinylFile> | Promise<null>;
    onFinish: () => void;
};
export declare function createPlugin(plugin: Plugin): void;
export declare function getPlugin(name: string): any;
