import { Data } from './';
export declare function build(buildConfig: {
    projectRoot: string;
    debug: boolean;
    matcher?: string;
    command: "build" | "publish";
}): Promise<any>;
export declare function convertResourceJson(projectRoot: string, config: Data): Promise<void>;
