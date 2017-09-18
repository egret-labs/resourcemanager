import * as fs from 'fs-extra-promise';
import * as path from 'path'
export async function version() {
    //{AppData/Roaming}/npm/node_modules/egret-resource-manager/script/cli.js'
    const cli_file_path = process.argv[1];
    const packageJsonPath = path.resolve(cli_file_path, "../../../package.json");
    const packageJSON = await fs.readJSONAsync(packageJsonPath);
    process.stdout.write(packageJSON.version)
}