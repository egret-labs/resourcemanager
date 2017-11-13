export declare function build(buildConfig: {
    projectRoot: string;
    debug: boolean;
    matcher?: string;
    command: "build" | "publish";
    target: string;
}): Promise<any>;
