import * as htmlparser from 'htmlparser2';
import * as path from 'path';
import * as fs from 'fs-extra-promise';
import * as crc32 from 'crc32';
import { ResourceConfig } from '../';

import * as plugin from './';

const p: plugin.Plugin = {


    name: "html",

    onFile: async (file) => {
        return file;
    },

    onFinish: async (pluginContext) => {
        let userConfig = ResourceConfig.getUserConfig(pluginContext.buildConfig.command)
        let outputDir = path.resolve(pluginContext.projectRoot, userConfig.outputDir, "../");
        let outputDir2 = path.resolve(pluginContext.projectRoot, userConfig.outputDir);
        let resourceFolder = path.relative(outputDir, outputDir2);
        let configjs = path.join(resourceFolder, ResourceConfig.resourceConfigFileName);
        let indexHTML = path.resolve(outputDir, 'index.html');
        let content = await fs.readFileAsync(indexHTML, "utf-8");


        let manifest = await fs.readJSONAsync(path.join(outputDir, 'manifest.json'));


        async function tagFile(filename: string, prefix?: any) {
            if (typeof prefix == 'number') {
                prefix = "js";
            }
            let content = await fs.readFileAsync(path.join(outputDir, filename), "utf-8");
            let contentCrc32 = crc32(content);
            let newFileName = rename(filename, contentCrc32, prefix);
            await fs.copyAsync(path.join(outputDir, filename), path.join(outputDir, newFileName));

            return newFileName.split("\\").join("/");
        }
        let initial = await Promise.all((manifest.initial as string[]).map(tagFile));
        let game = await Promise.all((manifest.game as string[]).map(tagFile));


        let configPath = await tagFile(configjs, "");

        let newManifest = {
            initial, game, configPath
        };
        await fs.writeJSONAsync(path.join(outputDir, 'manifest-generate.json'), newManifest)


        function rename(fileName: string, version: string, prefix: string) {
            let result = path.basename(fileName)
            if (prefix) {
                prefix = prefix + "/";
            }
            return prefix + renameFile(fileName, version)
        }

        function renameFile(fileName: string, version: string) {
            let index = fileName.indexOf(".");
            fileName = fileName.substr(0, index) + "_" + version + fileName.substr(index);
            return fileName;
        }

    }
}

export default p;