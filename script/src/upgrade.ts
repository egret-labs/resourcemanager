
import * as path from 'path';
import * as fs from 'fs-extra-promise';

import * as resource from './';




export async function run(projectPath) {



    async function copyLibrary() {
        console.log (__dirname)
        let folder = path.resolve(__dirname,"../../")
        console.log (folder)
        let source = path.join(folder, "bin");
        let target = path.join(projectPath, "bin");
        await fs.copyAsync(source, target);
    }







    async function convertEgretProperties() {
        var propertyFile = path.join(projectPath,"egretProperties.json");
        console.log (propertyFile)
        let propertyData = await fs.readJsonAsync(propertyFile) as any;
        console.log (propertyData)
        delete propertyData.modules['res'];

        for (let m of propertyData.modules) {
            if (m.name == "res") {
                m.name = "resourcemanager";
                m.path = "."
            }
        }
        await fs.writeJSONAsync(propertyFile,propertyData);
    }

    await convertEgretProperties();
    await copyLibrary();

}

