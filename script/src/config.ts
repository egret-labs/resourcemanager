import * as ast from 'egret-typescript-ast';
import * as path from 'path';
import { Data, ResourceConfig } from './';
import * as fs from 'fs-extra-promise';

export async function getConfigViaDecorator(egretRoot: string) {

    let decorators = await ast.findDecorator(path.join(egretRoot, "src/Main.ts"));
    let mapConfigDecorator = decorators.filter(item => item.name == "RES.mapConfig");
    if (!mapConfigDecorator || mapConfigDecorator.length == 0 || mapConfigDecorator.length > 1) {
        throw 'missing decorator';
    }
    let decorator = mapConfigDecorator[0];
    let resourceConfigFileName = decorator.paramters[0];
    let typeSelector = decorator.paramters[2];
    let mergeSelector = decorator.paramters[3];
    let resourceRoot = "resource/";
    let resConfigFilePath = path.join(resourceRoot, resourceConfigFileName);

    let nameSelector = (p: string) => p;


    let nameDecorator = decorators.filter(item => item.name == "RES.mapResourceName");
    if (!nameDecorator || nameDecorator.length == 0 || nameDecorator.length > 1) {

    }
    else {
        let decorator = nameDecorator[0];
        nameSelector = decorator.paramters[0];
    }

    return { resourceRoot, resourceConfigFileName, typeSelector, mergeSelector, nameSelector };
}
