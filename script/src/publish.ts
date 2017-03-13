import * as vfs from 'vinyl-fs';
import { Data, ResourceConfig, GeneratedData } from './';
import * as c from './config';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as path from 'path';
import * as merger from './merger';

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
let resourcePath

export async function publish(p: string, format: "json" | "text") {


    let result = await ResourceConfig.init(p);
    ResourceConfig.typeSelector = result.typeSelector;
    if (!ResourceConfig.typeSelector) {
        throw "missing typeSelector in Main.ts";
    }

    let executeFilter = async (f) => {


        var ext = f.substr(f.lastIndexOf(".") + 1);
        merger.walk(f)
        let type = ResourceConfig.typeSelector(f);

        if (type) {
            return { name: f, url: f, type };
        }

    }

    projectRoot = p;
    resourcePath = path.join(projectRoot, result.resourceRoot);
    merger.init(resourcePath);
    let filename = path.join(resourcePath, result.resourceConfigFileName);

    let option: utils.walk.WalkOptions = {
        relative: true,
        ignoreHiddenFile: true
    }

    let list = await utils.walk(resourcePath, () => true, option);
    let files = await Promise.all(list.map(executeFilter));
    files.filter(a => a).forEach(element => ResourceConfig.addFile(element));
    let config = ResourceConfig.getConfig();
    await convertResourceJson(projectRoot, config);
    await updateResourceConfigFileContent("publish-1.json");

    merger.output();
}

export async function updateResourceConfigFileContent(filename: string) {
    let config = ResourceConfig.generateConfig();
    let content = JSON.stringify(config, null, "\t");
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
        config.alias[r.name] = r.url;

        let file = ResourceConfig.getFile(r.url);
        for (var resource_custom_key in r) {
            if (resource_custom_key == "url" || resource_custom_key == "name") {
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

                if (!file) {
                    //todo warning
                }
                else {
                    // 包含 type 在内的自定义属性
                    file[resource_custom_key] = r[resource_custom_key];
                }
            }

        }
    }
    for (let group of resourceJson.groups) {
        config.groups[group.name] = group.keys.split(",");
    }

}