import * as vinylfs from 'vinyl-fs';
import * as VinylFile from 'vinyl';
import { Data, ResourceConfig, GeneratedData, original } from './';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as path from 'path';
import * as merger from './merger';
import * as html from './html';
import * as config from './config';
var map = require('map-stream');
var crc32 = require("crc32");


let projectRoot;
let resourceFolder;

declare interface ResVinylFile extends VinylFile {

    original_relative: string;
}

export async function build(p: string, format: "json" | "text", publishPath?: string, debug: boolean = false) {

    let resourcePath = publishPath ?
        path.join(publishPath, (await config.getConfigViaDecorator(p)).resourceRoot) :
        undefined;

    let result = await ResourceConfig.init(p);
    ResourceConfig.typeSelector = result.typeSelector;
    ResourceConfig.nameSelector = result.nameSelector;

    let executeFilter = async (url: string) => {
        var ext = url.substr(url.lastIndexOf(".") + 1);
        merger.walk(url);
        let type = ResourceConfig.typeSelector(url);
        let name = ResourceConfig.nameSelector(url);
        if (type) {
            return { name, url, type }
        }
        else {
            return null;
        }

    }

    projectRoot = p;
    resourceFolder = path.join(projectRoot, result.resourceRoot);

    merger.init(resourceFolder);


    let option: utils.walk.WalkOptions = {
        relative: true,
        ignoreHiddenFile: true
    }

    let init = (file: ResVinylFile, cb) => {
        file.original_relative = file.relative.split("\\").join("/");
        cb(null, file);
    }


    let convert = (file: ResVinylFile, cb) => {
        let crc32_file_path: string = crc32(file.contents);
        crc32_file_path = `${crc32_file_path.substr(0, 2)}/${crc32_file_path.substr(2)}${file.extname}`
        file.path = `${file.base}${crc32_file_path}`;
        cb(null, file);
    };

    let convert2 = async (file: ResVinylFile, cb) => {

        let r = await executeFilter(file.original_relative);
        if (r) {
            r.url = file.relative;
            ResourceConfig.addFile(r, true);
            cb(null, file);
        }
        else {
            cb(null);
        }


    };

    let list = await utils.walk(resourceFolder, () => true, option);
    let outputFile = resourcePath ?
        path.join(projectRoot, resourcePath, result.resourceConfigFileName) :
        path.join(resourceFolder, result.resourceConfigFileName)

    let stream = vinylfs.src(`**/**.*`, { cwd: resourceFolder, base: resourceFolder })
        .pipe(map(init))
    if (resourcePath) {
        stream = stream.pipe(map(convert))
    }
    stream = stream.pipe(map(convert2).on("end", async () => {
        let config = ResourceConfig.getConfig();
        await convertResourceJson(projectRoot, config);
        await updateResourceConfigFileContent(outputFile, debug);
        await ResourceConfig.generateClassicalConfig(path.join(resourceFolder, "wing.res.json"));
        merger.output();
    }))
    if (resourcePath) {
        stream = stream.pipe(vinylfs.dest(path.join(projectRoot, resourcePath)).on("end", () => {
            html.publish(publishPath as string);
        }));
    }
}

export async function updateResourceConfigFileContent(filename: string, debug: boolean) {
    let config = ResourceConfig.generateConfig(debug);
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

        let resourceName = ResourceConfig.nameSelector(r.url);
        let file = ResourceConfig.getFile(resourceName);
        if (!file) {
            if (await fs.existsAsync(path.join(resourceFolder, r.url))) {
                ResourceConfig.addFile(r, false)
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
                var subkeysArr = (r[resource_custom_key] as string).split(",");
                for (let subkey of subkeysArr) {
                    // if (!obj.alias[subkeysArr[i]]) {
                    config.alias[subkey] = r.name + "#" + subkey;
                    file[resource_custom_key] = r[resource_custom_key];
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