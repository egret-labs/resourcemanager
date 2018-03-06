import { BuildConfig } from './';
export declare function build(buildConfig: BuildConfig, before?: (context: {
    outputDir: string;
    buildConfig: BuildConfig;
}) => Promise<void>): Promise<any>;
