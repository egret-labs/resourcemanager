import * as fs from 'fs-extra-promise';
import * as path from 'path'
export async function version() {
    let packageJsonPath = path.resolve(module.filename, "../../../package.json");
    let packageJSON = await fs.readJSONAsync(packageJsonPath);
    console.log(packageJSON.version);
}