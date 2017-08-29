import * as ast from 'egret-typescript-ast';
import * as path from 'path';
import { Data, ResourceConfig } from './';
import * as fs from 'fs-extra-promise';
import * as ts from 'typescript';


export async function printConfig(egretRoot) {
    let data = await getConfigViaFile(path.join(egretRoot, 'resource/config.ts'));
    let source = getDist();
    let { resourceRoot, resourceConfigFileName, typeSelector } = data;
    let typeSelectorBody = typeSelector.toString();
    let outputData = { resourceRoot, resourceConfigFileName, typeSelectorBody, source };
    console.log(JSON.stringify(outputData));
}

export function getDist() {
    let folder = path.resolve(__dirname, "../../bin/resourcemanager");
    let bundleFiles = [
        "resourcemanager.js"
    ]
    let minFiles = [
        "resourcemanager.min.js"
    ];
    let declareFiles = [
        "resourcemanager.d.ts"
    ]
    return {
        folder, bundleFiles, minFiles, declareFiles
    }
}

export async function getConfigViaFile(fileName: string) {
    let content = await fs.readFileAsync(fileName, 'utf-8');
    let jsfile = ts.transpile(content, { module: ts.ModuleKind.CommonJS });
    let f = new Function('require', 'exports', jsfile);
    var require = function () { };
    var exports_1: any = {};
    try {
        f(require, exports_1);
    }
    catch (e) {
        throw 'todo:parse error'
    }
    let resourceRoot: string = typeof exports_1.resourceRoot == 'function' ? exports_1.resourceRoot() : exports_1.resourceRoot;
    let resourceConfigFileName = exports_1.configPath;
    let typeSelector: (p: string) => string = exports_1.typeSelector;
    let nameSelector = (p: string) => { return p };
    let userConfigs: { build: ResourceConfig.UserConfig, publish: ResourceConfig.UserConfig } = exports_1.userConfigs;
    let mergeSelector = exports_1.mergeSelector;
    return { resourceRoot, resourceConfigFileName, typeSelector, mergeSelector, nameSelector, userConfigs };

}
