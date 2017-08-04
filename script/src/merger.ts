import { Data, ResourceConfig, GeneratedData } from './';
import * as c from './config';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as path from 'path';


let resourcePath;
let mergeCollection: { [mergeFile: string]: { path: string, alias: string }[] } = {};

export function init(p: string) {
    resourcePath = p;
}


export function walk(f: string) {
    if (ResourceConfig.mergeSelector) {
        let merge = ResourceConfig.mergeSelector(f);
        if (merge) {
            let mergeFile = merge.path;
            merge.path = f;
            let type = ResourceConfig.typeSelector(f);
            if (!type) {
                throw new Error(`missing merge type : ${merge.path}`);
            }
            if (!mergeCollection[mergeFile]) {
                mergeCollection[mergeFile] = [];
            }
            mergeCollection[mergeFile].push(merge);
        }

    }
}

export function output() {
    for (let mergeFile in mergeCollection) {
        let outputJson = {};
        let sourceFiles = mergeCollection[mergeFile];
        if (ResourceConfig.typeSelector(mergeFile) == "mergeJson") {
            sourceFiles.map(sourceFile => {
                let sourcePath = path.join(resourcePath, sourceFile.path);
                let json = fs.readJSONSync(sourcePath);
                outputJson[sourceFile.alias] = json;
            })
        }
        fs.writeFileSync(path.join(resourcePath, mergeFile), JSON.stringify(outputJson))
    }


}
