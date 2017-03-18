import * as vfs from 'vinyl-fs';
import * as VinylFile from 'vinyl';
import { Data, ResourceConfig, GeneratedData } from './';
import * as c from './config';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as path from 'path';
import * as merger from './merger';
var map = require('map-stream');
var crc32 = require("crc32");

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
let resourceFolder;

export async function build(p: string, format: "json" | "text") {

    let result = await ResourceConfig.init(p);
    ResourceConfig.typeSelector = result.typeSelector;
    if (!ResourceConfig.typeSelector) {
        throw "missing typeSelector in Main.ts";
    }

    let executeFilter = async (url) => {
        var ext = url.substr(url.lastIndexOf(".") + 1);
        merger.walk(url);
        let type = ResourceConfig.typeSelector(url);
        let name = ResourceConfig.nameSelector(url);
        return { name, url, type }
    }

    projectRoot = p;
    resourceFolder = path.join(projectRoot, result.resourceRoot);

    merger.init(resourceFolder);


    let option: utils.walk.WalkOptions = {
        relative: true,
        ignoreHiddenFile: true
    }


    let convert = (file: VinylFile, cb) => {
        file.path = file.base + "/" + crc32(file.contents);
        cb(null, file);
    };

    let list = await utils.walk(resourceFolder, () => true, option);
    let files = (await Promise.all(list.map(executeFilter))).filter(a => a.type);
    //  let outputFolder = path.join(projectRoot, "resource-publish");
    // vfs.src(files.map(f => f.url), { cwd: resourceFolder, base: resourceFolder })
    //     .pipe(map(convert))
    //     .pipe(vfs.dest(outputFolder))
    files.forEach(element => ResourceConfig.addFile(element));
    let config = ResourceConfig.getConfig();
    await convertResourceJson(projectRoot, config);
    let filename = path.join(resourceFolder, result.resourceConfigFileName);
    await updateResourceConfigFileContent(filename);

    // await updateResourceConfigFileContent(path.join(outputFolder, result.resourceConfigFileName));

    merger.output();
}

export async function updateResourceConfigFileContent(filename: string) {
    let config = ResourceConfig.generateConfig();
    let content = JSON.stringify(config, null, "\t");
    await fs.mkdirpAsync(path.dirname(filename))
    await fs.writeFileAsync(filename, content, "utf-8");
    return content;
}


export async function convertResourceJson(projectRoot: string, config: Data) {

    let filename = path.join(projectRoot, "resource/default.res.json");
    if (!fs.existsSync(filename)) {
        filename = path.join(projectRoot, "resource/resource.json");
    }
    if (!fs.existsSync(filename)) {
        return;
    }
    let resourceJson: original.Info = await fs.readJSONAsync(filename);
    // let resourceJson: original.Info = await fs.readJSONAsync(resourceJsonPath);
    for (let r of resourceJson.resources) {
        let file = ResourceConfig.getFile(r.url);
        if (!file) {
            file = ResourceConfig.getFile(r.name);
        }
        if (!file) {
            if (await fs.existsAsync(path.join(resourceFolder, r.url))) {
                ResourceConfig.addFile(r)
            }
            else {
                console.error(`missing file ${r.name} ${r.url}`)
            }

            continue;
        }
        if (file.name != r.name) {
            config.alias[r.name] = file.name;
        }
        for (var resource_custom_key in r) {
            if (resource_custom_key == "url" || resource_custom_key == "name") {
                continue;
            }
            else if (resource_custom_key == "subkeys") {
                var subkeysArr = r.subkeys.split(",");
                for (let subkey of subkeysArr) {
                    // if (!obj.alias[subkeysArr[i]]) {
                    config.alias[subkey] = r.name + "#" + subkey;
                    // }
                }
            }
            else {
                // 包含 type 在内的自定义属性
                file[resource_custom_key] = r[resource_custom_key];
            }

        }

    }
    for (let group of resourceJson.groups) {
        config.groups[group.name] = group.keys.split(",");
    }

}