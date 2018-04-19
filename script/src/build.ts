import * as vinylfs from 'vinyl-fs';
import * as Vinyl from 'vinyl';
import { ResourceConfig, BuildConfig, ResVinylFile } from './';
import * as utils from 'egret-node-utils';
import * as fs from 'fs-extra-promise';
import * as path from 'path';

import * as config from './config';
import * as profile from './plugin/profile';

import * as plugin1 from './plugin';
import { setImmediate } from 'timers';

var map = require('map-stream');
var crc32 = require("crc32");


let projectRoot: string;


export async function build(buildConfig: BuildConfig, before?: (context: { outputDir: string, buildConfig: BuildConfig }) => Promise<void>) {



    /**
     * 当写入地址为源文件夹时，防止重复写入
     */
    function filterDuplicateWrite(file: ResVinylFile, cb) {
        if (file.isDirty) {
            cb(null, file);

        }
        else {
            cb(null);
        }
    }

    function initVinylFile(file: ResVinylFile, cb) {
        file.origin = file.relative.split("\\").join("/");
        cb(null, file);
    }

    let parsedConfig = await ResourceConfig.init(buildConfig.projectRoot, buildConfig);
    let userConfig = ResourceConfig.userConfig;
    projectRoot = buildConfig.projectRoot;
    plugin1.init(buildConfig.projectRoot, buildConfig);
    let outputDir = path.join(projectRoot, userConfig.outputDir);

    if (before) {
        await before({ outputDir, buildConfig });
    }

    let matcher = buildConfig.matcher ? buildConfig.matcher : "resource/**/*.*";
    // let matcher = ["resource/**/*.*"]
    let stream = vinylfs.src(matcher, { cwd: projectRoot, base: projectRoot })
        .pipe(map(initVinylFile))

    let plugins = userConfig.commands.map(item => plugin1.createPlugin(item, outputDir));
    if (userConfig.outputDir == ".") {
        plugins.push(map(filterDuplicateWrite))
    }




    plugins.push(vinylfs.dest((file: any) => {
        return file.outputDir ? file.outputDir : outputDir
    }));



    // return new Promise<typeof stream>((reslove, reject) => {
    //     let index = 0;
    //     const onComplete = () => {
    //         setImmediate(() => {
    //             const p = plugins[index];
    //             index++;
    //             if (p) {
    //                 stream.on("end", onComplete);
    //                 // console.log (plugins)
    //                 stream = stream.pipe(p)
    //             }
    //             else {
    //                 reslove(stream);
    //             }
    //         })
    //     }

    //     onComplete();
    // })

    for (let plugin of plugins) {
        stream = stream.pipe(plugin);
    }
    return new Promise<typeof stream>((resolve, reject) => {
        stream.on("end", () => {
            resolve(stream);
        }).on("error", () => {
            console.log('fuck')
        })
    })

}
