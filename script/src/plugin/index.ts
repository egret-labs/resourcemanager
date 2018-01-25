const through = require('through2');
import * as Vinyl from 'vinyl';
import * as path from 'path';
import { ResVinylFile, ResourceConfig, ResourceManagerUserConfig } from '../';

export type PluginContext = {
    projectRoot: string,
    outputDir: string,
    buildConfig: { command: "build" | "publish" },

    createFile: (relativePath: string, content: Buffer) => void
}

export type Plugin = {

    onStart?: (param: PluginContext) => void | Promise<void>

    onFile: (file: ResVinylFile) => Promise<ResVinylFile | null>;

    onFileLater?: (file: ResVinylFile) => Promise<ResVinylFile | null>;

    onFinish: (param: PluginContext) => void | Promise<void>
}

const plugins: { [name: string]: Plugin } = {};

let projectRoot: string;
let resourceFolder: string;
let buildConfig: { command: "build" | "publish" };

export function init(__projectRoot, __resourceFolder, __buildConfig: { command: "build" | "publish" }) {
    projectRoot = __projectRoot;
    resourceFolder = __resourceFolder;
    buildConfig = __buildConfig;
}


export function createPlugin(p: Plugin, outputDir: string) {
    const through = require('through2');

    outputDir = path.resolve(projectRoot, outputDir).split('\\').join('/');

    let context1: PluginContext = {
        projectRoot, outputDir, buildConfig, createFile: () => { console.error('onStart 中暂不支持 createFile') }
    }

    const onFile = async (file: ResVinylFile, enc, cb) => {
        try {
            let r = await p.onFile(file);
            if (r) {
                cb(null, file);
            }
            else {
                cb(null);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    const onFinish = async function (cb) {


        const createFile = (relativePath: string, buffer: Buffer, options?: any) => {
            relativePath = relativePath.split('\\').join('/')
            let newFile = new Vinyl({
                cwd: resourceFolder,
                base: resourceFolder,
                path: path.join(resourceFolder, relativePath),
                origin: relativePath,
                contents: buffer,
                isDirty: true,
                options
            });
            this.push(newFile);
        }


        try {
            let context2: PluginContext = {
                projectRoot, outputDir, buildConfig, createFile
            }
            await p.onFinish(context2);
            cb();
        }
        catch (e) {
            console.log(e);
        }
    }
    if (p.onStart) {
        let x = p.onStart(context1);
        if (x && x.then) {
            console.error('onStart 暂时不支持异步')
        }
    }
    return through.obj(onFile, onFinish)
}