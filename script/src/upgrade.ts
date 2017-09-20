
import * as path from 'path';
import * as fs from 'fs-extra-promise';

import * as resource from './';
import * as config from './config';
import * as utils from './utils';



export async function upgrade(projectPath) {

    let generateVersion = (versionString: string) => {
        let v = versionString.split(".");
        let result = 0;
        for (var i = 0; i < v.length; i++) {
            result += parseInt(v[i]) * Math.pow(100, (3 - i))
        }
        return result;
    }

    async function copyLibrary() {


        var propertyFile = path.join(projectPath, "egretProperties.json");
        let propertyData = await fs.readJsonAsync(propertyFile) as any;
        let version = generateVersion(propertyData.egret_version);

        delete propertyData.modules['res'];

        for (let m of propertyData.modules) {
            if (m.name == "res") {
                m.name = "resourcemanager";
                m.path = "."
            }
        }
        let source = config.getDist().folder;
        let target = path.join(projectPath, "bin/resourcemanager");
        if (version >= 4000100) { //4.0.1.0
            for (let m of propertyData.modules) {
                if (m.name == "resourcemanager") {
                    m.path = "resourcemanager"
                }
            }
            target = path.join(projectPath, "resourcemanager");
        }
        await fs.writeJSONAsync(propertyFile, propertyData);
        await fs.copyAsync(source, target);
    }

    async function modifyTypeScriptConfigFile() {
        let tsconfigFile = path.join(projectPath, "tsconfig.json");
        if (!await fs.existsAsync(tsconfigFile)) {
            let contents = `{
   "compilerOptions": {
      "target": "es5",
      "experimentalDecorators":true,
      "lib":[
          "es5",
          "es2015.promise",
          "dom"
      ]
   },
   "exclude": [
      "node_modules",
      "resource",
      "bin-debug",
      "bin-release"
   ]
}`;
            await fs.writeFileAsync(tsconfigFile, contents, 'utf-8');
        }
        else {
            let tsconfigJson = await fs.readJSONAsync(tsconfigFile) as any;
            tsconfigJson.compilerOptions.experimentalDecorators = true;
            let exclude: string[] | null = tsconfigJson.exclude;
            if (exclude) {
                let needToAdds = ["resource", "bin-debug", "bin-release"];
                for (let needToAdd of needToAdds) {
                    if (exclude.indexOf(needToAdd) == -1) {
                        exclude.push(needToAdd);
                    }
                }
            }

            let lib: string[] | null = tsconfigJson.compilerOptions.lib;
            if (!lib) {
                lib = [];
                tsconfigJson.compilerOptions.lib = lib;
                let needToAdds = ["es5", "dom", "es2015.promise"];
                for (let needToAdd of needToAdds) {
                    if (lib.indexOf(needToAdd) == -1) {
                        lib.push(needToAdd);
                    }
                }
            }
            await fs.writeFileAsync(tsconfigFile, JSON.stringify(tsconfigJson, null, "\t"), 'utf-8');
        }

    }
    process.stdout.write("正在拷贝库项目..." + "\n");
    await copyLibrary();
    process.stdout.write("正在修改 tsconfig.json 文件..." + "\n");
    await modifyTypeScriptConfigFile();
    process.stdout.write("正在拷贝 resource/config.ts 文件..." + "\n");
    await copyConfigFile();
    process.stdout.write("正在清理项目..." + "\n");
    await utils.shell("egret", ["clean", projectPath]);
    process.stdout.write("升级完毕" + "\n");

    async function copyConfigFile() {
        let configFile = path.join(projectPath, "resource/config.ts");
        let configDeclrationFile = path.join(projectPath, "resource/config.d.ts");
        if (!(await fs.existsAsync(configFile))) {
            await fs.writeFileAsync(configFile, config_content);
        }
        await fs.writeFileAsync(configDeclrationFile, config_declration_content);

    }


}

const config_declration_content = `
/**
 * ResourceManager 配置文件
 */
type ResourceManagerConfig = {
    /**
     * 配置文件生成路径
     */
    configPath: string,
    /**
     * 资源根目录路径
     */
    resourceRoot: () => string,
    /**
     * 构建与发布配置
     */
    userConfigs: UserConfigs,
    /**
     * 设置资源类型
     */
    typeSelector: (path: string) => (string | null)
    /**
     * 设置资源的合并策略
     */
    mergeSelector?: (path: string) => (string | null),
    /**
     * 设置资源的命名策略
     * beta 功能，请勿随意使用
     */
    nameSelector?: (path: string) => (string | null)
}

/**
 * 构建与发布配置
 */
type UserConfigs = {

    /**
     * res build 配置
     */
    build: UserConfig,

    /**
     * res publish 配置
     */
    publish: UserConfig
}

/**
 * 构建配置
 */
type UserConfig = {
    /**
     * 输出路径
     */
    outputDir: string,
    /**
     * 插件
     */
    plugin: ("zip" | "spritesheet" | "convertFileName" | "emitConfigFile" | "html")[]
}
`;

const config_content = `
/// 阅读 config.d.ts 查看文档
///<reference path="config.d.ts"/>

const config: ResourceManagerConfig = {

    configPath: 'config.res.js',

    resourceRoot: () => "resource",

    userConfigs: {

        build: {
            outputDir: "resource",

            plugin: [
                "emitConfigFile"
            ]
        },

        publish: {

            outputDir: "resource-bundles",

            plugin: [
                "zip",
                "spritesheet",
                "convertFileName",
                "emitConfigFile",
                "html"
            ]
        }
    },

    mergeSelector: (path) => {
        if (path.indexOf("assets/bitmap/") >= 0) {
            return "assets/bitmap/sheet.sheet"
        }
        else if (path.indexOf("armature") >= 0 && path.indexOf(".json") >= 0) {
            return "assets/armature/1.zip";
        }
    },

    typeSelector: (path) => {
        const ext = path.substr(path.lastIndexOf(".") + 1);
        const typeMap = {
            "jpg": "image",
            "png": "image",
            "webp": "image",
            "json": "json",
            "fnt": "font",
            "pvr": "pvr",
            "mp3": "sound",
            "zip": "zip",
            "mergeJson": "mergeJson",
            "sheet": "sheet"
        }
        let type = typeMap[ext];
        if (type == "json") {
            if (path.indexOf("sheet") >= 0) {
                type = "sheet";
            } else if (path.indexOf("movieclip") >= 0) {
                type = "movieclip";
            };
        }
        return type;
    }
}


export = config;
`