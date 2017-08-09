
import * as path from 'path';
import * as yazl from 'yazl';
import * as getStream from 'get-stream';
import * as Vinyl from 'vinyl';
import * as crc32 from 'crc32';
import * as through from 'through2'
import { Data, ResourceConfig, GeneratedData, original, handleException } from '../';

let mergeCollection: { [mergeFile: string]: string[] } = {};

export function zip(a: string, resourceFolder: string) {

    let mergerSelector = ResourceConfig.mergeSelector;


    let opts = {
        compress: true
    };

    let firstFile;
    const zip = new yazl.ZipFile();

    return through.obj((file, enc, cb) => {

        if (!mergerSelector) {
            cb();
            return;
        }
        let filename = file.relative;
        let mergeResult = mergerSelector(filename);
        if (mergeResult) {
            let type = ResourceConfig.typeSelector(mergeResult);
            if (!type) {
                throw new Error(`missing merge type : ${mergeResult}`);
            }
            if (!mergeCollection[mergeResult]) {
                mergeCollection[mergeResult] = [];
            }
            mergeCollection[mergeResult].push(filename);
        }
        if (!firstFile) {
            firstFile = file;
        }

        // Because Windows...
        const pathname = file.relative.replace(/\\/g, '/');

        if (!pathname) {
            cb();
            return;
        }
        let mtime = new Date(1);
        if (file.isNull() && file.stat && file.stat.isDirectory && file.stat.isDirectory()) {
            zip.addEmptyDirectory(pathname, {
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
                zip.addReadStream(file.contents, pathname, stat);
            }

            if (file.isBuffer()) {
                zip.addBuffer(file.contents, pathname, stat);
            }
        }

        cb(null, file);
    }, function (cb) {
        if (!firstFile) {
            cb();
            return;
        }
        for (let zipFile in mergeCollection) {

        }
        getStream.buffer(zip.outputStream).then(data => {

            let file = new Vinyl({
                cwd: resourceFolder,
                base: resourceFolder,
                path: path.join(resourceFolder, "sss.zip"),
                contents: data
            })
            this.push(file);
            cb();
        });

        zip.end();
    });
};