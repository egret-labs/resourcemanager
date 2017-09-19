import * as plugin from './';
import * as path from 'path';
import * as crc32 from 'crc32';
import * as fs from 'fs-extra-promise';
import { Data, ResourceConfig, GeneratedData, original, handleException, ResVinylFile, ResourceManagerUserConfig } from '../';
import * as Vinyl from 'vinyl';

const wing_res_json = "wing.res.json";

async function executeFilter(url: string) {
    if (url == wing_res_json) {
        return null;
    }
    let type = ResourceConfig.typeSelector(url);
    let name = ResourceConfig.nameSelector(url);
    if (type) {
        return { name, url, type }
    }
    else {
        return null;
    }
}

const p: plugin.Plugin = {
    name: "emitConfigFile",
    onFile: async (file) => {
        let r = await executeFilter(file.original_relative);
        if (r) {
            r.url = file.relative;
            ResourceConfig.addFile(r, true);
            return file;
        }
        else {
            return null;
        }
    },
    onFinish: async (pluginContext) => {


        async function convertResourceJson(projectRoot: string, config: Data) {

            let filename = path.join(projectRoot, "resource/default.res.json");
            if (!fs.existsSync(filename)) {
                filename = path.join(projectRoot, "resource/resource.json");
            }
            if (!fs.existsSync(filename)) {
                return;
            }
            let resourceJson: original.Info = await fs.readJSONAsync(filename);
            // let resourceJson: original.Info = await fs.readJSONAsync(resourceJsonPath);
            for (let r of resourceJson.resources) {

                let resourceName = ResourceConfig.nameSelector(r.url);
                let file = ResourceConfig.getFile(resourceName);
                if (!file) {
                    if (await fs.existsAsync(path.join(pluginContext.resourceFolder, r.url))) {
                        ResourceConfig.addFile(r, false)
                    }
                    else {
                        console.error(`missing file ${r.name} ${r.url} `)
                    }
                    continue;
                }
                if (file.name != r.name) {
                    config.alias[r.name] = file.name;
                }
                for (var resource_custom_key in r) {
                    if (resource_custom_key == "url" || resource_custom_key == "name") {
                        continue;
                    }
                    else if (resource_custom_key == "subkeys") {
                        var subkeysArr = (r[resource_custom_key] as string).split(",");
                        for (let subkey of subkeysArr) {
                            // if (!obj.alias[subkeysArr[i]]) {
                            config.alias[subkey] = r.name + "#" + subkey;
                            file[resource_custom_key] = r[resource_custom_key];
                            // }
                        }
                    }
                    else {
                        // 包含 type 在内的自定义属性
                        file[resource_custom_key] = r[resource_custom_key];
                    }

                }

            }
            for (let group of resourceJson.groups) {
                config.groups[group.name] = group.keys.split(",");
            }

        }

        async function emitResourceConfigFile(debug: boolean) {
            let userConfig = ResourceConfig.getUserConfig(pluginContext.buildConfig.command)
            let config = ResourceConfig.generateConfig(true);
            let content = JSON.stringify(config, null, "\t");
            let file = `exports.typeSelector = ${ResourceConfig.typeSelector.toString()};
    exports.resourceRoot = "${userConfig.outputDir}";
    exports.alias = ${JSON.stringify(config.alias, null, "\t")};
    exports.groups = ${JSON.stringify(config.groups, null, "\t")};
    exports.resources = ${JSON.stringify(config.resources, null, "\t")};
    `
            return file;
        }

        let config = ResourceConfig.getConfig();
        await convertResourceJson(pluginContext.projectRoot, config);
        let configContent = await emitResourceConfigFile(true);
        pluginContext.createFile(ResourceConfig.resourceConfigFileName, new Buffer(configContent));

        let wingConfigContent = await ResourceConfig.generateClassicalConfig();
        pluginContext.createFile(wing_res_json, new Buffer(wingConfigContent));
    }




}


export default p;