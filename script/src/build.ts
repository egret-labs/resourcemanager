import {Data, ResourceConfig} from './';
import * as utils from 'egret-node-utils';

import * as ts from 'typescript';
import * as fs from 'fs-extra-promise';
import * as path from 'path';

namespace original {


    export interface Info {
        groups: GroupInfo[],
        resources: ResourceInfo[],
    }

    interface GroupInfo {
        keys: string,
        name: string
    }

    interface ResourceInfo {
        name: string;
        type: string;
        url: string;
        subkeys: string;
    }
}

let projectRoot;

let add = (r) => {

    if (ResourceConfig.config.getTypeByFileExtensionName) {
        var f = r.name;
        var ext = f.substr(f.lastIndexOf(".") + 1);
        var type = ResourceConfig.config.getTypeByFileExtensionName(ext);
        if (type == r.type) {
            r.type = "";
            // console.log (r)
        }
    }
    // console.log (r)
    ResourceConfig.addFile(r);
}

export async function build(p: string, target?: string) {


    let resourceRoot = "resource";

    let register = (moduleName) => {

        let modulePath = path.join(projectRoot, moduleName);
        if (!fs.existsSync(modulePath)) {
            modulePath = path.join(projectRoot, "node_modules", moduleName);
        }
        var m = require(modulePath);
        return m;
    }

    let crc32 = (p) => {
        var c = require("crc32");
        var data = fs.readFileSync(path.join(resourcePath, p));
        var code = c(data);
        // console.log(p, code);
        return code;
    }




    let copy = async (r) => {
        let from = path.resolve(projectRoot, resourceRoot, r.name);
        let to = path.resolve(projectRoot, target, r.url);
        await fs.copyAsync(from, to);
    }


    let executeFilter = async (f) => {

        let config = ResourceConfig.config;
        if (!config.filter) {
            throw "missing filter in config.resjs";
        }
        var ext = f.substr(f.lastIndexOf(".") + 1);
        let file = { path: f, fullname: path.join(resourceRoot, f), ext };
        let env = { target, resourceRoot };
        let result = await config.filter(file, env, { crc32, add, copy, register });
        return result;
    }

    let updateResourceConfigFileContent = async (filename, matcher, data) => {

        let replacedText = JSON.stringify(data, null, "\t");
        let config = ResourceConfig.config;
        let content = await fs.readFileAsync(filename, "utf-8");
        let sourceFile = ts.createSourceFile(filename, content, ts.ScriptTarget.ES2015, /*setParentNodes */ true);
        content = await delint(sourceFile, matcher, replacedText);;
        await fs.writeFileAsync(filename, content, "utf-8");
        return content;
    }

    projectRoot = p;
    let resourcePath = path.join(projectRoot, "resource");

    let filename = getResourceConfigFile();
    await ResourceConfig.init(filename,resourcePath);

    let option: utils.walk.WalkOptions = {
        relative: true,
        ignoreHiddenFile: true
    }


    await ResourceConfig.execute();

    let list = await utils.walk(resourcePath, () => true, option);
    await Promise.all(list.map(executeFilter)).catch(e => console.log(e));

    await convertResourceJson(ResourceConfig.config);

    //todo : performance-optimize
    let content = await updateResourceConfigFileContent(filename, "exports.resources", ResourceConfig.config.resources);
    content = await updateResourceConfigFileContent(filename, "exports.groups", ResourceConfig.config.groups);
    content = await updateResourceConfigFileContent(filename, "exports.alias", ResourceConfig.config.alias);

    if (target) {
        var outputFileDir = path.resolve(process.cwd(), projectRoot, target);
        let outputFileName = path.join(outputFileDir, "config.resjs");
        await fs.mkdirpAsync(outputFileDir);
        await fs.writeFileAsync(outputFileName, content, "utf-8");
    }
}

function getResourceConfigFile() {
    return path.resolve(process.cwd(), projectRoot, "resource/config.resjs");
}




//分析特定文件中的 exports.resource = {blablabla}，将其中右侧的内容进行替换
function delint(sourceFile: ts.SourceFile, matcher: string, replacedText: string): Promise<string> {

    let config = ResourceConfig.config;

    return new Promise((reslove, reject) => {

        function delintNode(node: ts.Node) {

            // ExpressionStatement  表达式
            //    |-- BinaryExpression 二元表达式
            //      |-- left  左侧
            //      |-- right  右侧
            if (node.kind == ts.SyntaxKind.ExpressionStatement) {
                if ((node as ts.ExpressionStatement).expression.kind == ts.SyntaxKind.BinaryExpression) {
                    let expression = (node as ts.ExpressionStatement).expression as ts.BinaryExpression;
                    if (expression.left.getText() == matcher) {
                        let right = expression.right;
                        let positionStart = right.getStart();
                        let positionFinish = right.getWidth();
                        let fullText = sourceFile.getFullText();

                        fullText = fullText.substr(0, positionStart) + replacedText + fullText.substr(positionStart + positionFinish);
                        result = fullText;
                    }
                }
            }
            else {
                ts.forEachChild(node, delintNode);
            }


        }
        let result = "";
        let count = setInterval(() => {
            if (result) {
                clearInterval(count);
                reslove(result);
            }
        }, 100)
        delintNode(sourceFile);
    });


}



async function convertResourceJson(config: Data) {


    let resourceJsonPath = path.join(projectRoot, "resource/default.res.json");
    if (!fs.existsSync(resourceJsonPath)) {
        resourceJsonPath = path.join(projectRoot, "resource/resource.json");
    }
    if (!fs.existsSync(resourceJsonPath)) {
        return;
    }
    let resourceJson: original.Info = await fs.readJSONAsync(resourceJsonPath);
    // let resourceJson: original.Info = await fs.readJSONAsync(resourceJsonPath);
    for (let r of resourceJson.resources) {
        config.alias[r.name] = r.url;

        let file = ResourceConfig.getFile(r.url);
        for (var resource_custom_key in r) {
            if (resource_custom_key == "url" || resource_custom_key == "type" || resource_custom_key == "name") {
                continue;
            }
            else if (resource_custom_key == "subkeys") {
                var subkeysArr = r.subkeys.split(",");
                for (let subkey of subkeysArr) {
                    // if (!obj.alias[subkeysArr[i]]) {
                    config.alias[subkey] = r.url + "#" + subkey;
                    // }
                }
            }
            else {
                if (typeof file != "string") {
                    file[resource_custom_key] = r[resource_custom_key];
                }
                else {
                    console.warn(`missing properties ${resource_custom_key} in ${file}`)
                }
            }

        }
    }
    for (let group of resourceJson.groups) {
        config.groups[group.name] = group.keys.split(",");
    }
}