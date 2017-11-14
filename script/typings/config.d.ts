import { ResourceConfig } from './';
export declare function printConfig(projectRoot: any): Promise<void>;
export declare function getDist(): {
    folder: string;
    bundleFiles: string[];
    minFiles: string[];
    declareFiles: string[];
};
export declare function getConfigViaFile(configFileName: string, buildConfig: {
    projectRoot: string;
    target: string;
    command: string;
}): Promise<{
    resourceRoot: string;
    resourceConfigFileName: any;
    typeSelector: (p: string) => string;
    mergeSelector: any;
    nameSelector: any;
    userConfig: ResourceConfig.UserConfig;
}>;
