import * as vinylfs from 'vinyl-fs';
import * as Vinyl from 'vinyl';
import { Data, ResourceConfig, GeneratedData, original, handleException, ResVinylFile, ResourceManagerUserConfig } from './';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as path from 'path';

import * as config from './config';
import * as zip from './plugin/zip';
import * as profile from './plugin/profile';
import * as spritesheet from './plugin/spritesheet';
import * as html from './plugin/html';
import * as plugin1 from './plugin';

var map = require('map-stream');
var crc32 = require("crc32");


let projectRoot: string;
let resourceFolder: string;

const wing_res_json = "wing.res.json";

export async function build(buildConfig: { projectRoot: string, debug: boolean, matcher?: string, command: "build" | "publish" }) {

    /**
     * 当写入地址为源文件夹时，防止重复写入
     */
    function filterDuplicateWrite(file: ResVinylFile, cb) {

        if (file.isExistedInResourceFolder) {
            cb(null);
        }
        else {
            cb(null, file);
        }
    }

    async function executeFilter(url: string) {
        if (url == wing_res_json) {
            return null;
        }
        let type = ResourceConfig.typeSelector(url);
        let name = ResourceConfig.nameSelector(url);
        if (type) {
            return { name, url, type }
        }
        else {
            return null;
        }
    }

    async function convertFileName(file: ResVinylFile, cb) {

        let crc32_file_path: string = crc32(file.contents);
        // crc32_file_path = `${crc32_file_path.substr(0, 2)}/${crc32_file_path.substr(2)}${file.extname}`;
        let origin_path = file.original_relative;
        crc32_file_path = origin_path.substr(0, origin_path.length - file.extname.length) + "_" + crc32_file_path + file.extname;
        file.path = path.join(file.base, crc32_file_path);
        cb(null, file);
    };

    function initVinylFile(file: ResVinylFile, cb) {
        file.original_relative = file.relative.split("\\").join("/");
        file.isExistedInResourceFolder = true;
        executeFilter(file.original_relative).then((r) => {
            if (r) {
                cb(null, file);
            }
            else {
                cb(null);
            }
        }).catch(e => console.log(e))

    }





    let parsedConfig = await ResourceConfig.init(buildConfig.projectRoot);
    let userConfig = ResourceConfig.getUserConfig(buildConfig.command);
    projectRoot = buildConfig.projectRoot;
    resourceFolder = path.join(projectRoot, ResourceConfig.resourceRoot);

    let outputDir = path.join(projectRoot, userConfig.outputDir);
    let matcher = buildConfig.matcher ? buildConfig.matcher : "**/*.*";
    let stream = vinylfs.src(matcher, { cwd: resourceFolder, base: resourceFolder })
        .pipe(map(initVinylFile))
        .pipe(profile.profile());
    for (let item of userConfig.plugin) {
        let plugin;
        switch (item) {
            case "zip":
                plugin = zip.zip(resourceFolder);
                break;
            case "spritesheet":
                plugin = spritesheet.sheet(resourceFolder);
                break;
            case "convertFileName":
                plugin = plugin1.getPlugin(item);
                break;
            case "emitConfigFile":
                plugin = plugin1.getPlugin(item);
                break;
            case "html":
                plugin = html.emitConfigJsonFile(buildConfig);
                break;
        }
        if (plugin) {
            stream = stream.pipe(plugin);
        }
    }

    if (ResourceConfig.resourceRoot == userConfig.outputDir) {
        stream = stream.pipe(map(filterDuplicateWrite));
    }
    stream = stream.pipe(vinylfs.dest(outputDir));
    return new Promise<typeof stream>((resolve, reject) => {
        stream.on("end", () => {
            resolve(stream);
        })
    })
}



