import { ResVinylFile } from '../';
export declare type Plugin = {
    onFile: (file: ResVinylFile) => void;
    onFinish: () => void;
};
export declare function createPlugin(): Plugin;
