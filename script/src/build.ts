import * as vinylfs from 'vinyl-fs';

import { Data, ResourceConfig, GeneratedData, original, handleException, ResVinylFile } from './';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as path from 'path';
import * as merger from './merger';
import * as html from './html';
import * as config from './config';
import * as zip from './plugin/zip';
import * as profile from './plugin/profile';
import * as spritesheet from './plugin/spritesheet';
var map = require('map-stream');
var crc32 = require("crc32");


let projectRoot;
let resourceFolder;

const wing_res_json = "wing.res.json";



export async function build(p: string, format: "json" | "text", publishPath: string, debug: boolean = false) {

    let parsedConfig = await ResourceConfig.init(p);

    let executeFilter = async (url: string) => {

        if (url == wing_res_json) {
            return null;
        }
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
    resourceFolder = path.join(projectRoot, ResourceConfig.resourceRoot);
    merger.init(resourceFolder);


    async function convertFileName(file: ResVinylFile, cb) {

        let crc32_file_path: string = crc32(file.contents);
        crc32_file_path = `${crc32_file_path.substr(0, 2)}/${crc32_file_path.substr(2)}${file.extname}`
        file.path = path.join(file.base, crc32_file_path);
        cb(null, file);
    };

    function filter(file: ResVinylFile, cb) {
        file.original_relative = file.relative.split("\\").join("/");
        executeFilter(file.original_relative).then((r) => {
            if (r) {
                cb(null, file);
            }
            else {
                cb(null);
            }
        }).catch(e => console.log(e))

    }

    async function addFileToResourceConfig(file: ResVinylFile, cb) {
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



    async function emitResourceConfigFile(filename: string, debug: boolean) {
        let config = ResourceConfig.generateConfig(true);
        let content = JSON.stringify(config, null, "\t");
        let file = `exports.typeSelector = ${ResourceConfig.typeSelector.toString()};
exports.resourceRoot = "${publishPath}";
exports.alias = ${JSON.stringify(config.alias, null, "\t")};
exports.groups = ${JSON.stringify(config.groups, null, "\t")};
exports.resources = ${JSON.stringify(config.resources, null, "\t")};
`
        await fs.mkdirpAsync(path.dirname(filename))
        await fs.writeFileAsync(filename, file, "utf-8");
    }
    let outputFile = path.join(projectRoot, publishPath, ResourceConfig.resourceConfigFileName);

    vinylfs.src(`**/**.*`, { cwd: resourceFolder, base: resourceFolder })
        .pipe(map(filter))
        .pipe(profile.profile())
        .pipe(zip.zip(resourceFolder))
        .pipe(spritesheet.sheet(resourceFolder))
        .pipe(map(convertFileName)).on("end", async () => {
            // vinylfs.
        })
        .pipe(profile.profile())
        .pipe(map(addFileToResourceConfig).on("end", async () => {
            let config = ResourceConfig.getConfig();
            await convertResourceJson(projectRoot, config);
            await emitResourceConfigFile(outputFile, debug);
            await ResourceConfig.generateClassicalConfig(path.join(projectRoot, publishPath, wing_res_json));
            merger.output();
        }))
        .pipe(profile.profile())
        .pipe(vinylfs.dest(path.join(projectRoot, publishPath)).on("end", () => {
            // html.publish(publishPath_2 as string, outputFile).catch(e => handleException(e))
        }));
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
                console.error(`missing file ${r.name} ${r.url} `)
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