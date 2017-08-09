import { Data, ResourceConfig, GeneratedData } from './';
import * as c from './config';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as path from 'path';

import * as yazl from 'yazl';


let resourcePath;
let mergeCollection: { [mergeFile: string]: string[] } = {};

export function init(p: string) {
    resourcePath = p;
}


export function walk(f: string) {

}


export function output() {
    for (let mergeFile in mergeCollection) {
        let outputJson = {};
        let sourceFiles = mergeCollection[mergeFile];
        if (ResourceConfig.typeSelector(mergeFile) == "zip") {

            // var zipfile = new yazl.ZipFile();

            // sourceFiles.forEach(sourceFile => {
            //     sourceFile = "resource/" + sourceFile;
            //     zipfile.addFile(sourceFile, sourceFile);
            // })
            // // pipe() can be called any time after the constructor 
            // zipfile.outputStream.pipe(fs.createWriteStream("output.zip")).on("close", function () {
            //     console.log("done");
            // });
            // zipfile.end();
        }
        // fs.writeFileSync(path.join(resourcePath, mergeFile), JSON.stringify(outputJson))
    }


}
