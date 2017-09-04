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
        appdata = path.join(appdata, 'Egret/resourcemanager/env.json');
    }
    else {
        throw 'missing appdata'
    }

    return appdata;
}

export async function setEnv(key: keyof Environment, value: string) {
    let config = await getEnv();
    config[key] = value;
    let url = await getAppDataRootPath();
    await fs.writeJSONAsync(url, config);
}

type Environment = {

    texture_merger_path?: string
}

export async function getEnv() {
    const url = await getAppDataRootPath();
    const exists = await fs.existsAsync(url);
    if (!exists) {
        console.log(2)
        await fs.mkdirpAsync(path.dirname(url));
        console.log(3)
        await fs.writeJSONAsync(url, {});

    }
    let config: Environment = await fs.readJsonAsync(url);
    return config;
}
