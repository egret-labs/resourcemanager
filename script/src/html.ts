import * as htmlparser from 'htmlparser2';
import * as path from 'path';
import * as fs from 'fs-extra-promise';
import * as crc32 from 'crc32';

export async function test() {

    let publishRoot = "bin-release/web/xxx/";
    let indexHTML = path.join(publishRoot, 'index.html');
    let content = await fs.readFileAsync(indexHTML, "utf-8");

    var parser = new htmlparser.Parser({
        // 这里不要包含异步逻辑
        onopentag: function (name, attributes) {

            if (name == 'script' &&
                attributes['src']) {
                let src = attributes['src'];
                let javascriptFilePath = path.join(publishRoot, src);
                let javascriptContent = fs.readFileSync(javascriptFilePath, "utf-8");
                let javascriptCrc32 = crc32(javascriptContent);

                let index = src.indexOf(".");
                let javascritpOutFilePath = src.substr(0, index) + "_" + javascriptCrc32 + src.substr(index)
                fs.renameSync(javascriptFilePath, path.join(publishRoot, javascritpOutFilePath))
                content = content.replace(src, javascritpOutFilePath);
            }
        }
    }, { decodeEntities: true });
    parser.parseComplete(content)
    parser.end();

    await fs.writeFileAsync(indexHTML, content);

}
