#!/usr/bin/env node

import * as res from './';

function getProjectPath(p) {
    return p ? p : ".";
}

var command = process.argv[2];
switch (command) {
    case "upgrade":
        var p = getProjectPath(process.argv[3])
        res.upgrade.run(p).catch(e => console.log(e))
        break;
    case "build":
        var p = getProjectPath(process.argv[3]);
        res.build.build(p).catch(e => console.log(e.stack))
        break;
    default:
        var p = getProjectPath(command);
        res.build.build(p).catch(e => console.log(e.stack))
        break;
}





