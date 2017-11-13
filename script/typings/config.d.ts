import { ResourceConfig } from './';
export declare function printConfig(egretRoot: any): Promise<void>;
export declare function getDist(): {
    folder: string;
    bundleFiles: string[];
    minFiles: string[];
    declareFiles: string[];
};
export declare function getConfigViaFile(configFileName: string, target: string, command: string): Promise<{
    resourceRoot: string;
    resourceConfigFileName: any;
    typeSelector: (p: string) => string;
    mergeSelector: any;
    nameSelector: any;
    userConfig: ResourceConfig.UserConfig;
}>;
