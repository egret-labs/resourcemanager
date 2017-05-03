import * as htmlparser from 'htmlparser2';
import * as path from 'path';
import * as fs from 'fs-extra-promise';
import * as crc32 from 'crc32';

export async function publish(publishRoot: string) {

    let indexHTML = path.join(publishRoot, 'index.html');
    let content = await fs.readFileAsync(indexHTML, "utf-8");



    let handler: htmlparser.Handler = {
        // 这里不要包含异步逻辑
        onopentag: function (name, attributes) {

            if (name == 'script' &&
                attributes['src']) {
                let src = attributes['src'];
                let javascriptFilePath = path.join(publishRoot, src);
                let javascriptContent = fs.readFileSync(javascriptFilePath, "utf-8");
                let javascriptCrc32 = crc32(javascriptContent);
                let javascritpOutFilePath = rename(src, javascriptCrc32);
                fs.renameSync(javascriptFilePath, path.join(publishRoot, javascritpOutFilePath))
                content = content.replace(src, javascritpOutFilePath);
                manifest.initial.push(javascritpOutFilePath);
            }
        }
    }

    let manifest = { initial: [] as string[] };

    var parser = new htmlparser.Parser(handler, { decodeEntities: true });
    parser.parseComplete(content)
    parser.end();
    console.log(manifest)

}

function rename(fileName: string, crc32: string) {
    let index = fileName.indexOf(".");
    return fileName.substr(0, index) + "_" + crc32 + fileName.substr(index)

}
