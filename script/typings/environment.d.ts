export declare function setEnv(key: keyof Environment, value: string): Promise<void>;
export declare type Environment = {
    texture_merger_path?: string;
};
export declare function getEnv(): Promise<Environment>;
