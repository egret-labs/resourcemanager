import * as htmlparser from 'htmlparser2';
import * as path from 'path';
import * as fs from 'fs-extra-promise';
import * as crc32 from 'crc32';
import { ResourceConfig } from '../';


export function emitConfigJsonFile() {
    const through = require('through2');
    return through.obj((file, enc, cb) => {
        cb(null, file)
    }, async function (cb) {

        let outputDir = path.resolve(ResourceConfig.getUserConfig().outputDir, "../");
        let resourceConfigPath = path.join(ResourceConfig.getUserConfig().outputDir, ResourceConfig.resourceConfigFileName);

        let indexHTML = path.resolve(outputDir, 'index.html');
        let content = await fs.readFileAsync(indexHTML, "utf-8");
        console.log(indexHTML)
        console.log(content)


        let handler: htmlparser.Handler = {
            // 这里不要包含异步逻辑
            onopentag: function (name, attributes) {

                if (name == 'script' &&
                    attributes['src']) {
                    let src = attributes['src'];
                    let javascriptFilePath = path.join(outputDir, src);
                    let javascriptContent = fs.readFileSync(javascriptFilePath, "utf-8");
                    let javascriptCrc32 = crc32(javascriptContent);
                    let javascritpOutFilePath = rename(src, javascriptCrc32, "js");
                    fs.copySync(javascriptFilePath, path.join(outputDir, javascritpOutFilePath))
                    // manifest.initial.push(javascritpOutFilePath);
                }
            }
        }

        // let version = Date.now().toString();
        // let configPath = renameFile(path.basename(resourceConfigPath), version);
        // let manifest = { initial: [] as string[], configPath };

        // var parser = new htmlparser.Parser(handler, { decodeEntities: true });
        // parser.parseComplete(content)
        // parser.end();

        // await fs.renameAsync(
        //     resourceConfigPath,
        //     path.join(outputDir, 'resource/', configPath)
        // )
        // let manifestPath = path.join(outputDir, "manifest.json");
        // let manifestContent = JSON.stringify(manifest, null, "\t");





        // await fs.writeFileAsync(manifestPath, manifestContent, "utf-8");
        // let backupManifest = path.join(outputDir, rename("manifest.json", version, "backup"));
        // await fs.mkdirpAsync(path.dirname(backupManifest));
        // await fs.writeFileAsync(backupManifest, manifestContent, "utf-8");

        // let config = ResourceConfig.getConfig();
        // await convertResourceJson(projectRoot, config);
        // let configContent = await emitResourceConfigFile(outputFile, debug);
        // let configFile = new Vinyl({
        //     cwd: resourceFolder,
        //     base: resourceFolder,
        //     path: outputFile,
        //     original_relative: outputFile,
        //     contents: new Buffer(configContent)
        // })
        // this.push(configFile);
        // let wingConfigContent = await ResourceConfig.generateClassicalConfig();
        // let wingConfigFile = new Vinyl({
        //     cwd: resourceFolder,
        //     base: resourceFolder,
        //     path: path.join(resourceFolder, wing_res_json),
        //     original_relative: wing_res_json,
        //     contents: new Buffer(wingConfigContent)
        // })
        // this.push(wingConfigFile);
        cb();
    });
};

function rename(fileName: string, version: string, prefix: string) {
    let result = path.basename(fileName)
    return prefix + "/" + renameFile(fileName, version)
}

function renameFile(fileName: string, version: string) {
    let index = fileName.indexOf(".");
    fileName = fileName.substr(0, index) + "_" + version + fileName.substr(index);
    return fileName;
}
