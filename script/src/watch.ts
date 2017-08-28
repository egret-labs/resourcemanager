import * as w from 'watch';
import * as build from './build';
import * as path from 'path';
import * as config from './config';
import { ResourceManagerUserConfig } from './'

export async function watch(p: string, userConfig: ResourceManagerUserConfig) {
    let result = await build.build(p, userConfig, true);
    result.on("end", () => {
        let root = path.join(p, "resource");
        w.createMonitor(root, (m) => {
            m.on("created", (f) => compileChanged(f, "added"))
                .on("removed", (f) => compileChanged(f, "removed"))
                .on("changed", (f) => compileChanged(f, "modified"));
        });
    })

    async function compileChanged(f: string, type: string) {
        console.log("res-watch:file changed start");
        console.log(f)
        await build.build(p, userConfig, true, "**/**.*")
        console.log("res-watch:file changed finish");
    }

}
