
const through = require('through2');


export function profile() {

    let count = 0;
    let start //= 0;

    return through.obj((file, enc, cb) => {

        if (count == 0) {
            start = new Date();
        }
        count++;
        cb(null, file)
    }, function (cb) {
        let end = new Date();
        // console.log(end, start)
        // console.log(`profile:${end - start}`);
        cb();
    });
};