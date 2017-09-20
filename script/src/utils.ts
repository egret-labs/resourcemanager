import * as child_process from 'child_process';
var iconv = require('iconv-lite');

export function shell(path: string, args: string[]): Promise<number> {

    return new Promise((resolve, reject) => {
        let cmd = `${path} ${args.join(" ")}`
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

