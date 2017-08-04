import { Data, ResourceConfig, GeneratedData } from './';
import * as c from './config';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as path from 'path';


let resourcePath;
let mergeCollection: { [mergeFile: string]: string[] } = {};

export function init(p: string) {
    resourcePath = p;
}


export function walk(f: string) {

    let mergerSelector = ResourceConfig.mergeSelector;
    if (mergerSelector) {
        let mergeResult = mergerSelector(f);
        if (mergeResult) {
            let type = ResourceConfig.typeSelector(f);
            if (!type) {
                throw new Error(`missing merge type : ${mergeResult}`);
            }
            if (!mergeCollection[mergeResult]) {
                mergeCollection[mergeResult] = [];
            }
            mergeCollection[mergeResult].push(f);
        }

    }
}

export function output() {
    for (let mergeFile in mergeCollection) {
        let outputJson = {};
        let sourceFiles = mergeCollection[mergeFile];
        if (ResourceConfig.typeSelector(mergeFile) == "zip") {
            // sourceFiles.map(sourceFile => {
            //     let sourcePath = path.join(resourcePath, sourceFile.path);
            //     let json = fs.readJSONSync(sourcePath);
            //     outputJson[sourceFile.alias] = json;
            // })
        }
        fs.writeFileSync(path.join(resourcePath, mergeFile), JSON.stringify(outputJson))
    }


}
