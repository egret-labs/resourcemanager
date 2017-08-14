
import * as path from 'path';
import * as yazl from 'yazl';
import * as getStream from 'get-stream';
import * as Vinyl from 'vinyl';
import * as crc32 from 'crc32';
import * as through from 'through2'
import { Data, ResourceConfig, GeneratedData, original, handleException, ResVinylFile } from '../';

let mergeCollection: { [mergeFile: string]: yazl.ZipFile } = {};

export function zip(resourceFolder: string) {

    let mergerSelector = ResourceConfig.mergeSelector;


    let opts = {
        compress: true
    };

    return through.obj((file: ResVinylFile, enc, cb) => {
        if (!mergerSelector) {
            cb(null, file);
            return;
        }
        let filename = file.original_relative;
        let mergeResult = mergerSelector(filename);
        if (mergeResult) {
            let type = ResourceConfig.typeSelector(mergeResult);
            if (!type) {
                throw new Error(`missing merge type : ${mergeResult}`);
            }
            if (type != "zip") {
                cb(null, file);
                return;
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

            cb(null, file);
        }
        else {
            cb(null, file);
        }

    }, function (cb) {

        let list: yazl.ZipFile = [];
        for (let zipFile in mergeCollection) {
            let zip = mergeCollection[zipFile];
            zip['__path'] = zipFile
            list.push(zip);

        }
        Promise.all(list.map((zip) => {
            zip.end();
            return getStream.buffer(zip.outputStream).then(data => {
                let zipFile = zip['__path'];
                let file = new Vinyl({
                    cwd: resourceFolder,
                    base: resourceFolder,
                    path: path.join(resourceFolder, zipFile),
                    contents: data
                })
                this.push(file);
            });
        })).then(() => cb());

    });
};