#!/usr/bin/env node  

import * as res from './';

console.log (process.argv);
var path = process.argv[2];
if (path){
    res.build(path)
}
else{
    console.log("error")
}



