import * as ast from 'egret-typescript-ast';
import * as path from 'path';

export async function run(egretRoot: string) {

    let decorators = await ast.findDecorator(path.join(egretRoot, "src/Main.ts"));
    decorators = decorators.filter(item => item.name == "RES.mapConfig");
    let resourceConfigFileFileName = "";
    let resourceRoot = "resource/";
    if (!decorators || !decorators.length) {
        resourceConfigFileFileName = "config.resjs";
    }
    else {
        let resourceFileNames = decorators.map(item => item.paramters[0]);
        resourceConfigFileFileName = resourceFileNames[0];
    }



    let resConfigFilePath = path.join(resourceRoot, resourceConfigFileFileName);
    return { resourceRoot, resourceConfigFileFileName };
}