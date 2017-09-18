import * as fs from 'fs-extra-promise';
import * as path from 'path'
export async function version() {
    process.stdout.write(__VERSION__.toString())
}

declare var __VERSION__: string;