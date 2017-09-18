const through = require('through2');
import { ResVinylFile } from '../';

export type Plugin = {

    onFile: (file: ResVinylFile) => void,

    onFinish: () => void
}


export function createPlugin(): Plugin {
    return {
        onFile: (file: ResVinylFile) => { },
        onFinish: () => { }
    };
}