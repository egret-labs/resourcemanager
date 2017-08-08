import * as vinylfs from 'vinyl-fs';
import * as VinylFile from 'vinyl';
import { Data, ResourceConfig, GeneratedData, original, handleException } from './';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as path from 'path';
import * as merger from './merger';
import * as html from './html';
import * as config from './config';
import * as zip from './zip';
var map = require('map-stream');
var crc32 = require("crc32");


let projectRoot;
let resourceFolder;

declare interface ResVinylFile extends VinylFile {

    original_relative: string;
}

export async function build(p: string, format: "json" | "text", publishPath: string, debug: boolean = false) {

    let parsedConfig = await ResourceConfig.init(p);

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
    resourceFolder = path.join(projectRoot, ResourceConfig.resourceRoot);
    merger.init(resourceFolder);


    async function convertFileName(file: ResVinylFile, cb) {
        file.original_relative = file.relative.split("\\").join("/");
        let crc32_file_path: string = crc32(file.contents);
        crc32_file_path = `${crc32_file_path.substr(0, 2)}/${crc32_file_path.substr(2)}${file.extname}`
        file.path = path.join(file.base, crc32_file_path);
        if (file.original_relative.indexOf("sss.zip") >= 0) {
            console.log(file.path)
            console.log(file.original_relative)
            console.log(file.base)
        }
        else {
            // console.log(file.base)
            // console.log(file.original_relative)
        }
        cb(null, file);
    };

    async function filter(file: ResVinylFile, cb) {
        let r = await executeFilter(file.path).catch(e => console.log(e))
        if (r) {
            cb(null, file);
        }
        else {
            cb(null);
        }
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
    let outputFile = path.join(publishPath, ResourceConfig.resourceConfigFileName);

    vinylfs.src(`**/**.*`, { cwd: resourceFolder, base: resourceFolder })
        .pipe(map(filter))
        .pipe(zip.zip("sss.zip", resourceFolder))
        .pipe(map(convertFileName)).on("end", async () => {
            // vinylfs.
        })
        .pipe(map(addFileToResourceConfig).on("end", async () => {
            let config = ResourceConfig.getConfig();
            await convertResourceJson(projectRoot, config);
            await emitResourceConfigFile(outputFile, debug);
            await ResourceConfig.generateClassicalConfig(path.join(resourceFolder, "wing.res.json"));
            merger.output();
        }))
        .pipe(vinylfs.dest(publishPath).on("end", () => {
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