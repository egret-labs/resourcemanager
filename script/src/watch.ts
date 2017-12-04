import * as w from 'watch';
import * as build from './build';
import * as path from 'path';
import * as config from './config';
import { ResourceManagerUserConfig } from './'

export async function watch(projectRoot: string) {
    let result = await build.build({ projectRoot, debug: true, command: "build", target: "web" });
    result.on("end", () => {
        let root = path.join(projectRoot, "resource");
        w.createMonitor(root, (m) => {
            m.on("created", (f) => compileChanged(f, "added"))
                .on("removed", (f) => compileChanged(f, "removed"))
                .on("changed", (f) => compileChanged(f, "modified"));
        });

        async function compileChanged(f: string, type: string) {
            console.log("res-watch:file changed start");
            console.log(f)
            f = path.relative(root, f);

            // await build.build({ projectRoot, debug: true, matcher: f, command: "build", target: "web" })
            console.log("res-watch:file changed finish");
        }
    })



}
