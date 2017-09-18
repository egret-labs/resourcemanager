const through = require('through2');
import { ResVinylFile } from '../';

type Plugin = {
    fileOperator: (file: ResVinylFile) => {}
}


export function createPlugin() {
    return {};
}
