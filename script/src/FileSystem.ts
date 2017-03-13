export interface File {

    url: string;

    type: string;

    name: string;

}

export interface Dictionary {

    [file: string]: File | Dictionary

}

export function init(d: Dictionary) {
    root = d;
    return root;
}

var root: Dictionary = {};


export function addFile(r: File) {

    let { type, name, url} = r;
    if (!type) type = "";
    name = normalize(name);
    let basefilename = basename(name);
    let folder = dirname(name);
    if (!exists(folder)) {
        mkdir(folder);
    }
    let d = reslove(folder) as (Dictionary | null);
    if (d) {
        d[basefilename] = { url, type, name };
    }
}

export function getFile(filename: string): File | undefined {
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
    if (dirpath == "") {
        return root;
    }
    dirpath = normalize(dirpath);
    let list = dirpath.split("/");
    let current: File | Dictionary = root;
    for (let f of list) {
        current = current[f];
        if (!current) {
            return null;
        }
    }
    return current;
}

export function mkdir(dirpath: string) {
    dirpath = normalize(dirpath);
    let list = dirpath.split("/");
    let current = root;
    for (let f of list) {
        if (!current[f]) {
            current[f] = {};
        }
        current = current[f] as Dictionary;
    }
}

export function exists(dirpath: string) {
    if (dirpath == "") return true;
    dirpath = normalize(dirpath);
    let list = dirpath.split("/");
    let current = root;
    for (let f of list) {
        if (!current[f]) {
            return false;
        }
        current = current[f] as Dictionary;
    }
    return true;
}

