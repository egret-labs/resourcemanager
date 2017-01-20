#!/usr/bin/env node

import * as res from './';

function getProjectPath(p) {
    return p ? p : ".";
}

let handleExceiption = (e: string | Error) => {
    if (typeof e == 'string') {
        console.log(e);
    }
    else {
        console.log(e.stack);
    }
}

var command = process.argv[2];
switch (command) {
    case "upgrade":
        var p = getProjectPath(process.argv[3])
        res.upgrade.run(p).catch(handleExceiption)
        break;
    case "build":
        var p = getProjectPath(process.argv[3]);
        res.build.build(p).catch(handleExceiption)
        break;
    default:
        var p = getProjectPath(command);
        res.build.build(p).catch(handleExceiption)
        break;
}





