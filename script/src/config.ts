import * as ast from 'egret-typescript-ast';
import * as path from 'path';
import { Data, ResourceConfig } from './';
import * as fs from 'fs-extra-promise';
import * as ts from 'typescript';


export async function printConfig(egretRoot) {
    let data = await getConfigViaFile(path.join(egretRoot, 'scripts/config.ts'));
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

export async function getConfigViaFile(configFileName: string) {
    let content = await fs.readFileAsync(configFileName, 'utf-8');
    let jsfile = ts.transpile(content, { module: ts.ModuleKind.CommonJS, newLine: ts.NewLineKind.LineFeed });
    let f = new Function('require', 'module', jsfile);
    var module_var: any = {};
    function pluginRequire(filename: string) {
        let nodeRequire = eval("require");
        if (filename.charAt(0) == ".") {
            filename = path.join(path.dirname(configFileName), filename);
        }
        return nodeRequire(filename);
    }
    try {
        f(pluginRequire, module_var);
    }
    catch (e) {
        console.log(e)
        throw e
    }
    var exports_1: any = module_var.exports;
    let resourceRoot: string = typeof exports_1.resourceRoot == 'function' ? exports_1.resourceRoot() : exports_1.resourceRoot;
    let resourceConfigFileName = exports_1.configPath;
    let typeSelector: (p: string) => string = exports_1.typeSelector;
    let nameSelector = exports_1.nameSelector ? exports_1.nameSelector : (p: string) => p;
    let userConfigs: { build: ResourceConfig.UserConfig, publish: ResourceConfig.UserConfig } = exports_1.userConfigs;
    let mergeSelector = exports_1.mergeSelector;
    return { resourceRoot, resourceConfigFileName, typeSelector, mergeSelector, nameSelector, userConfigs };

}
