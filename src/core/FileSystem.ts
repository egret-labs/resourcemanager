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

    export function getResourceInfo(path: string): File {
        return FileSystem.getFile(path);
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
            d[basefilename] = { url: filename, type };
        }

        export function getFile(filename: string): File {
            let result = reslove(filename) as File;
            if (result) {
                result.name = filename;
            }
            return result;
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
                if (current) {
                    current = current[f];
                }
                else {
                    return current;
                }
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


