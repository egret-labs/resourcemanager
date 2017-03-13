import * as ast from 'egret-typescript-ast';
import * as path from 'path';
import { Data, ResourceConfig } from './';
import * as fs from 'fs-extra-promise';

export async function getConfigViaDecorator(egretRoot: string) {

    let decorators = await ast.findDecorator(path.join(egretRoot, "src/Main.ts"));
    decorators = decorators.filter(item => item.name == "RES.mapConfig");
    if (!decorators || decorators.length == 0 || decorators.length > 1) {
        throw 'missing decorator';
    }
    let decorator = decorators[0];
    let resourceConfigFileName = decorator.paramters[0];
    let typeSelector = decorator.paramters[2];
    let mergeSelector = decorator.paramters[3];
    let resourceRoot = "resource/";
    let resConfigFilePath = path.join(resourceRoot, resourceConfigFileName);
    return { resourceRoot, resourceConfigFileName, typeSelector };
}
