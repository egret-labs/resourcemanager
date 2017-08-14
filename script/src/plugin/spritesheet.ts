import * as child_process from 'child_process';
import * as path from 'path';
import * as yazl from 'yazl';
import * as getStream from 'get-stream';
import * as Vinyl from 'vinyl';
import * as crc32 from 'crc32';
import * as through from 'through2'
import { Data, ResourceConfig, GeneratedData, original, handleException, ResVinylFile } from '../';
var iconv = require('iconv-lite');

export async function generateSpriteSheet(spriteSheetFileName, dirname) {
    let cmd = getTextureMergerPath();
    let folder = path.join(process.cwd(), dirname);
    let p = "\"" + folder + "\"";
    let o = "\"" + path.join(process.cwd(), spriteSheetFileName) + "\"";
    await shell(cmd, ["-p", p, "-o", o]);
}


function getTextureMergerPath() {
    return `"C:\\Program Files\\Egret\\TextureMerger\\TextureMerger.exe"`;
}

function shell(path: string, args: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
        let cmd = `${path} ${args.join(" ")}`
        console.log(cmd)
        var encoding = 'cp936';
        var binaryEncoding = 'binary';
        child_process.exec(cmd, { encoding: binaryEncoding }, function (err, stdout, stderr) {
            let message = iconv.decode(new Buffer(stdout.toString(), binaryEncoding), encoding)
            let message2 = iconv.decode(new Buffer(stderr.toString(), binaryEncoding), encoding);
            console.log(message, message2);
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }

        });
    })
}


let spriteSheetMergeCollection: { [mergeFile: string]: string[] } = {};

export function sheet(resourceFolder: string) {

    let mergerSelector = ResourceConfig.mergeSelector;


    return through.obj((file: ResVinylFile, enc, cb) => {
        if (!mergerSelector) {
            cb();
            return;
        }
        let filename = file.original_relative;
        let mergeResult = mergerSelector(filename);
        if (mergeResult) {
            let type = ResourceConfig.typeSelector(mergeResult);
            if (!type) {
                throw new Error(`missing merge type : ${mergeResult}`);
            }
            if (type != "sheet") {
                cb(null, file);
                return;
            }
            if (!spriteSheetMergeCollection[mergeResult]) {
                spriteSheetMergeCollection[mergeResult] = [];
            }
            let spriteSheet = spriteSheetMergeCollection[mergeResult];
            if (file.isNull() && file.stat && file.stat.isDirectory && file.stat.isDirectory()) {

            } else {
                spriteSheet.push(filename)
            }

            cb(null, file);
        }
        else {
            cb(null, file);
        }

    }, function (cb) {


        console.log(spriteSheetMergeCollection)
        for (let spriteSheetFile in spriteSheetMergeCollection) {
            let files = spriteSheetMergeCollection[spriteSheetFile];
            let dirname = path.dirname(files[0]);
            if (!files.every(f => dirname == path.dirname(f))) {
                console.log('SpriteSheet的内容必须在同一文件夹中')
                continue;
            }
            else {
                generateSpriteSheet(path.join(resourceFolder, spriteSheetFile), path.join(resourceFolder, dirname))
            }
        }
        // let list: yazl.ZipFile = [];
        // for (let zipFile in spriteSheetMergeCollection) {
        //     let zip = spriteSheetMergeCollection[zipFile];
        //     zip['__path'] = zipFile
        //     list.push(zip);

        // }
        // Promise.all(list.map((zip) => {
        //     zip.end();
        //     return getStream.buffer(zip.outputStream).then(data => {
        //         let zipFile = zip['__path'];
        //         let file = new Vinyl({
        //             cwd: resourceFolder,
        //             base: resourceFolder,
        //             path: path.join(resourceFolder, zipFile),
        //             contents: data
        //         })
        //         this.push(file);
        //     });
        // })).then(() => cb());

    });
};