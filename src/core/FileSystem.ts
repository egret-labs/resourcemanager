module RES {

    export interface File {

        url: string;

        type: string;

        crc32?: string;

        size?: number;

        //todo remove
        name: string;

        soundType?: string

    }

    export interface Dictionary {

        [file: string]: File | Dictionary

    }

    enum ResourceNodeType {
        FILE, DICTIONARY
    }


    export var data: Data;

    export function getResourceInfo(url: string): File {
        return FileSystem.getFile(url);
    }

    export function print() {
        console.log(data);
    }

    export namespace FileSystem {


        export var data: Dictionary = {};

        export function addFile(filename: string, type?: string) {
            if (!type) type = "";
            filename = normalize(filename);
            let basefilename = basename(filename);
            let folder = dirname(filename);
            if (!exists(folder)) {
                mkdir(folder);
            }
            let d = reslove(folder);
            d[basefilename] = { url:filename, type };
        }

        export function getFile(filename: string): File {
            return reslove(filename) as File;
        }

        function basename(filename: string) {
            return filename.substr(filename.lastIndexOf("/") + 1);
        }

        function normalize(filename: string) {
            return filename.split("/").filter(d => !!d).join("/");
        }

        function dirname(path: string) {
            return path.substr(0, path.lastIndexOf("/"));
        }

        function reslove(dirpath: string) {
            dirpath = normalize(dirpath);
            let list = dirpath.split("/");
            let current: File | Dictionary = data;
            for (let f of list) {
                current = current[f];
            }
            return current;
        }

        export function mkdir(dirpath: string) {
            dirpath = normalize(dirpath);
            let list = dirpath.split("/");
            let current = data;
            for (let f of list) {
                if (!current[f]) {
                    current[f] = {};
                }
                current = current[f] as Dictionary;
            }
        }

        export function exists(dirpath: string) {
            dirpath = normalize(dirpath);
            let list = dirpath.split("/");
            let current = data;
            for (let f of list) {
                if (!current[f]) {
                    return false;
                }
                current = current[f] as Dictionary;
            }
            return true;
        }
    }
}


