import * as ast from 'egret-typescript-ast';
import * as path from 'path';
import { Data, ResourceConfig } from './';
import * as fs from 'fs-extra-promise';
import * as ts from 'typescript';


export async function printConfig(egretRoot) {
    let data = await getConfigViaDecorator(egretRoot);
    let source = getDist();
    let { resourceRoot, resourceConfigFileName, typeSelector} = data;
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
    let mergeSelector: any;
    let nameSelector = (p: string) => { return p };
    return { resourceRoot, resourceConfigFileName, typeSelector, mergeSelector, nameSelector };

}

export async function getConfigViaDecorator(egretRoot: string) {

    let decorators = await ast.findDecorator(path.join(egretRoot, "src/Main.ts"));

    function getFunction<T>(name: string): T | null {
        let result = decorators.filter(item => item.name == name);
        if (!result || result.length == 0 || result.length > 1) {
            return null;
        }
        else {
            let decorator = result[0];
            return decorator.paramters[0] as T;
        }
    }
    let mapConfigDecorator = decorators.filter(item => item.name == "RES.mapConfig");
    if (!mapConfigDecorator || mapConfigDecorator.length == 0 || mapConfigDecorator.length > 1) {
        throw 'missing decorator';
    }
    let decorator = mapConfigDecorator[0];
    let resourceConfigFileName = decorator.paramters[0];

    let mergeSelector = decorator.paramters[3];
    let resourceRoot = "resource/";
    let resConfigFilePath = path.join(resourceRoot, resourceConfigFileName);


    type NameSelector = (p: string) => string;
    let nameSelector = getFunction<NameSelector>("RES.mapResourceName");
    if (!nameSelector) {
        nameSelector = (p: string) => p;
    }

    type TypeSelector = (p: string) => string;
    let typeSelector = getFunction<TypeSelector>("RES.mapResourceType");
    if (!typeSelector) {
        typeSelector = decorator.paramters[2] as TypeSelector;
    }

    type MergerSelector = ((p: string) => string) | null;
    let mergerSelector = getFunction<TypeSelector>("RES.mapResourceMerger");
    if (!mergerSelector) {
        mergerSelector = decorator.paramters[3] as MergerSelector;
    }

    let mergeSelector2 = () => "helloworld"


    return { resourceRoot, resourceConfigFileName, typeSelector, mergeSelector, nameSelector, mergeSelector2 };




}

