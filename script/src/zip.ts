
import * as path from 'path';
// const gutil = require('gulp-util');
const through = require('through2');
const Yazl = require('yazl');
const getStream = require('get-stream');
import * as Vinyl from 'vinyl';

export function zip(filename: string, resourceFolder: string) {

    let opts = {
        compress: true
    };

    let firstFile;
    const zip = new Yazl.ZipFile();

    return through.obj((file, enc, cb) => {
        if (!firstFile) {
            firstFile = file;
        }

        // Because Windows...
        const pathname = file.relative.replace(/\\/g, '/');

        if (!pathname) {
            cb();
            return;
        }

        if (file.isNull() && file.stat && file.stat.isDirectory && file.stat.isDirectory()) {
            zip.addEmptyDirectory(pathname, {
                mtime: file.stat.mtime || new Date(),
                mode: file.stat.mode
            });
        } else {
            const stat = {
                compress: opts.compress,
                mtime: file.stat ? file.stat.mtime : new Date(),
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


        getStream.buffer(zip.outputStream).then(data => {

            let file = new Vinyl({
                cwd: resourceFolder,
                base: resourceFolder + path.sep,
                path: path.join(resourceFolder, filename),
                contents: data
            })
            this.push(file);
            // this.push(new gutil.File({
            //     cwd: firstFile.cwd,
            //     base: firstFile.base,
            //     path: path.join(firstFile.base, filename),
            //     contents: data
            // }));

            cb();
        });

        zip.end();
    });
};