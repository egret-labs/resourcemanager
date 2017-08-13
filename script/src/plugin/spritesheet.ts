import * as child_process from 'child_process';
var iconv = require('iconv-lite');
import * as path from 'path';


export async function generateSpriteSheet() {
    let cmd = getTextureMergerPath();
    var o = "\"" + path.join(process.cwd(), "1.json") + "\"";
    var p = "\"" + path.join(process.cwd(), "resource/bg") + "\"";
    await shell(cmd, ["-p", p, "-o", o]);

}


function getTextureMergerPath() {
    return `"C:\\Program Files\\Egret\\TextureMerger\\TextureMerger.exe"`;
}

function shell(path: string, args: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
        let cmd = `${path} ${args.join(" ")}`
        console.log(cmd)
        var iconv = require('iconv-lite');
        var encoding = 'cp936';
        var binaryEncoding = 'binary';

        child_process.exec(cmd, { encoding: binaryEncoding }, function (err, stdout, stderr) {
            console.log(err)
            console.log(iconv.decode(new Buffer(stdout.toString(), binaryEncoding), encoding), iconv.decode(new Buffer(stderr.toString(), binaryEncoding), encoding));
            resolve(err);
        });
    })
}