
import * as path from 'path';
import * as fs from 'fs-extra-promise';

import * as resource from './';
import * as config from './config';




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

        console.log(source, target)

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



    async function createDecorator() {
        var mainSourceFile = path.join(projectPath, "src/Main.ts");
        let contents = await fs.readFileAsync(mainSourceFile, "utf-8");
        if (contents.indexOf("RES.mapConfig") == -1) {
            var index = contents.indexOf("class Main");
            if (index == -1) {
                throw new Error("无法匹配到 class Main,升级失败");
            }
            contents = contents.substr(0, index) + `
// 资源配置，您可以访问
// https://github.com/egret-labs/resourcemanager/tree/master/docs
// 了解更多细节 
@RES.mapConfig("config.json",()=>"resource",path => {
    var ext = path.substr(path.lastIndexOf(".") + 1);
    var typeMap = {
        "jpg": "image",
        "png": "image",
        "webp": "image",
        "json": "json",
        "fnt": "font",
        "pvr": "pvr",
        "mp3": "sound"
    }
    var type = typeMap[ext];
    if (type == "json") {
        if (path.indexOf("sheet") >= 0) {
            type = "sheet";
        } else if (path.indexOf("movieclip") >= 0) {
            type = "movieclip";
        };
    }
    return type;
})\n`
                + contents.substr(index);
        }
        await fs.writeFileAsync(mainSourceFile, contents, "utf-8");
    };



    async function modifyTypeScriptConfigFile() {
        let tsconfigFile = path.join(projectPath, "tsconfig.json");
        if (!await fs.existsAsync(tsconfigFile)) {
            let contents = `{
   "compilerOptions": {
      "target": "es5",
      "experimentalDecorators":true
   },
   "exclude": [
      "node_modules"
   ]
}`;
            await fs.writeFileAsync(tsconfigFile, contents, 'utf-8');
        }
        else {
            let tsconfigJson = await fs.readJSONAsync(tsconfigFile) as any;
            tsconfigJson.compilerOptions.experimentalDecorators = true;
            await fs.writeFileAsync(tsconfigFile, JSON.stringify(tsconfigJson, null, "\t"), 'utf-8');
        }

    }

    await copyLibrary();
    await createDecorator();
    await modifyTypeScriptConfigFile();

}

