import * as w from 'watch';
import * as build from './build';
import * as path from 'path';
import * as config from './config';

export async function watch(p: string, format: "json" | "text", publishPath: string) {
    let result = await config.getConfigViaDecorator(p);
    let root = path.join(p, result.resourceRoot);
    w.createMonitor(root, (m) => {
        m.on("created", (f) => compileChanged(f, "added"))
            .on("removed", (f) => compileChanged(f, "removed"))
        // .on("changed", (f) => compileChanged(f, "modified"));
    });

    async function compileChanged(f: string, type: string) {
        console.log("res-watch:file changed start");
        await build.build(p, format, publishPath)
        console.log("res-watch:file changed finish");
    }
}

