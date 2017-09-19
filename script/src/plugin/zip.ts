
import * as path from 'path';
import * as yazl from 'yazl';
import * as getStream from 'get-stream';
import * as Vinyl from 'vinyl';
import * as crc32 from 'crc32';
import * as through from 'through2'
import { Data, ResourceConfig, GeneratedData, original, handleException, ResVinylFile } from '../';
import * as plugin from './';
let mergeCollection: { [mergeFile: string]: yazl.ZipFile } = {};



let p: plugin.Plugin = {
    "name": "zip",

    onFile: async (file) => {

        let mergerSelector = ResourceConfig.mergeSelector;
        let opts = {
            compress: true
        };
        if (!mergerSelector) {
            return file;
        }
        let filename = file.original_relative;
        let mergeResult = mergerSelector(filename);
        if (mergeResult) {
            let type = ResourceConfig.typeSelector(mergeResult);
            if (!type) {
                throw new Error(`missing merge type : ${mergeResult}`);
            }
            if (type != "zip") {
                return file;
            }
            if (!mergeCollection[mergeResult]) {
                mergeCollection[mergeResult] = new yazl.ZipFile();
            }


            let zip = mergeCollection[mergeResult];
            let mtime = new Date(1);
            if (file.isNull() && file.stat && file.stat.isDirectory && file.stat.isDirectory()) {
                zip.addEmptyDirectory(filename, {
                    mtime,//file.stat.mtime || new Date(),
                    mode: file.stat.mode
                });
            } else {
                const stat = {
                    compress: opts.compress,
                    mtime,//file.stat ? file.stat.mtime : new Date(),
                    mode: file.stat ? file.stat.mode : null
                };

                if (file.isStream()) {
                    zip.addReadStream(file.contents, filename, stat);
                }

                if (file.isBuffer()) {
                    zip.addBuffer(file.contents, filename, stat);
                }
            }

            let config = ResourceConfig.getConfig();
            config.alias[filename] = `${mergeResult}#${filename}`;
            return null;
        }
        else {
            return file;
        }
    },

    onFinish: async (pluginContext) => {
        let list: yazl.ZipFile = [];
        for (let zipFile in mergeCollection) {
            let zip = mergeCollection[zipFile];
            zip['__path'] = zipFile;
            list.push(zip);
        }
        await Promise.all(list.map(async (zip) => {
            zip.end();
            let data = await getStream.buffer(zip.outputStream)
            let zipFile = zip['__path'];
            pluginContext.createFile(zipFile, data);
        }));
    }


}

export default p;