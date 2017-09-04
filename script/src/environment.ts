import * as fs from 'fs-extra-promise';
import * as path from 'path';

function getAppDataRootPath() {
    let appdata: string | null = null;
    switch (process.platform) {
        case 'darwin':
            var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            appdata = home + "/Library/Application Support/";
            break;
        case 'win32':
            appdata = process.env.AppData || process.env.USERPROFILE + "/AppData/Roaming/";
            break;
    }
    if (appdata) {
        appdata = path.join(appdata, 'Egret/resourcemanager');
    }
    else {
        throw 'missing appdata'
    }

    return appdata;
}

export async function setConfig(key: keyof Environment, value: string) {
    let config = getConfig();
    config[key] = value;
    let url = getAppDataRootPath();
    await fs.writeFileAsync(url, config);
}

type Environment = {

    texture_merger_path?: string
}

export async function getConfig() {
    let url = getAppDataRootPath();
    if (await !fs.existsAsync(url)) {
        await fs.writeJSONAsync(url, {});
    }
    let config: Environment = await fs.readJsonAsync(url);
    return config;
}
