type UserConfigs = {

    build: UserConfig,

    publish: UserConfig
}



type UserConfig = {
    outputDir: string,
    plugin: ("zip" | "spritesheet" | "convertFileName" | "emitConfigFile" | "html")[]
}


type ResourceManagerConfig = {
    configPath: string,
    resourceRoot: () => string,
    userConfigs: UserConfigs,
    typeSelector: (path: string) => (string | null)
    mergeSelector?: (path: string) => (string | null),
    nameSelector?: (path: string) => (string | null)
}