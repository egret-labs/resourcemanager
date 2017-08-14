import * as child_process from 'child_process';
import * as path from 'path';
import * as yazl from 'yazl';
import * as getStream from 'get-stream';
import * as Vinyl from 'vinyl';
import * as crc32 from 'crc32';
import * as through from 'through2'
import * as os from 'os';
import * as fs from 'fs-extra-promise';
import { Data, ResourceConfig, GeneratedData, original, handleException, ResVinylFile } from '../';
var iconv = require('iconv-lite');

export async function generateSpriteSheet(spriteSheetFileName, dirname) {
    let cmd = getTextureMergerPath();
    let folder = path.join(process.cwd(), dirname);
    let p = "\"" + folder + "\"";
    let o = "\"" + spriteSheetFileName + "\"";
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
            if (err) {
                err = iconv.decode(new Buffer(err.toString(), binaryEncoding), encoding);
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

    }, async function (cb) {

        let tempDir = os.tmpdir();
        let outputDir = path.join(tempDir, "aaa", Date.now().toString());
        for (let spriteSheetFile in spriteSheetMergeCollection) {
            let files = spriteSheetMergeCollection[spriteSheetFile];
            let dirname = path.dirname(files[0]);
            if (!files.every(f => dirname == path.dirname(f))) {
                console.log('SpriteSheet的内容必须在同一文件夹中')
                continue;
            }
            else {
                let outputJsonFile = path.join(outputDir, spriteSheetFile);
                await fs.mkdirpAsync(path.dirname(outputJsonFile))
                await generateSpriteSheet(outputJsonFile, path.join(resourceFolder, dirname));
                let outputPngFile = outputJsonFile.replace(path.extname(outputJsonFile), ".png");

                let outputJsonContent = await fs.readFileAsync(outputJsonFile);
                let outputPngContent = await fs.readFileAsync(outputPngFile)

                let jsonFile = new Vinyl({
                    cwd: resourceFolder,
                    base: resourceFolder,
                    path: spriteSheetFile,
                    contents: outputJsonContent,
                    original_relative: spriteSheetFile
                })


                let pngFilePath = spriteSheetFile.replace(path.extname(spriteSheetFile), ".png");
                let pngFile = new Vinyl({
                    cwd: resourceFolder,
                    base: resourceFolder,
                    path: pngFilePath,
                    contents: outputPngContent,
                    original_relative: pngFilePath
                })
                this.push(jsonFile);
                this.push(pngFile);
            }
        }
        cb();
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