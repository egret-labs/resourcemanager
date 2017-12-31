import * as ast from 'egret-typescript-ast';
import * as path from 'path';
import { Data, ResourceConfig } from './';
import * as fs from 'fs-extra-promise';
import * as ts from 'typescript';



const jsLoaderWrapper = (module, filename) => {
    const content = fs.readFileSync(filename, 'utf8');
    const jsfile = ts.transpile(content, { module: ts.ModuleKind.CommonJS, newLine: ts.NewLineKind.LineFeed });
    module._compile(jsfile, filename);
}
const nodeRequire = eval("require");
nodeRequire.extensions['.ts'] = jsLoaderWrapper;


export async function getConfigViaFile(configFileName: string, buildConfig: { projectRoot: string, target: string, command: string }) {
    let content = await fs.readFileAsync(configFileName, 'utf-8');
    let jsfile = ts.transpile(content, { module: ts.ModuleKind.CommonJS, newLine: ts.NewLineKind.LineFeed });
    let f = new Function('require', 'module', jsfile);
    var module_var: any = {};
    function pluginRequire(filename: string) {
        if (filename.charAt(0) == ".") {
            filename = path.join(path.dirname(configFileName), filename) + '.ts';
        }
        else if (filename.indexOf("built-in") >= 0) {
            filename = path.resolve(__dirname, '../../tasks/index')
        };
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
    let buildConfigFunction: ((params: any) => ResourceConfig.UserConfig) = exports_1.buildConfig;

    const { projectRoot } = buildConfig;
    const projectName = path.basename(projectRoot);
    const userConfig = buildConfigFunction({ projectName, ...buildConfig });
    let mergeSelector = exports_1.mergeSelector;
    return { resourceRoot, resourceConfigFileName, typeSelector, mergeSelector, nameSelector, userConfig };

}
