export interface File {

    url: string;

    type: string;

    name: string;

}

export interface Dictionary {

    [file: string]: File | Dictionary

}
export class FileSystem {


    init(d: Dictionary) {
        this.root = d;
        return this.root;
    }

    root: Dictionary = {};

    addFile(r: File) {

        let { type, name, url } = r;
        if (!type) type = "";
        name = this.normalize(name);
        let basefilename = this.basename(name);
        let folder = this.dirname(name);
        if (!this.exists(folder)) {
            this.mkdir(folder);
        }
        let d = this.reslove(folder) as (Dictionary | null);
        if (d) {
            d[basefilename] = { url, type, name };
        }
    }

    getFile(filename: string): File | undefined {
        return this.reslove(filename) as File;
    }

    basename(filename: string) {
        return filename.substr(filename.lastIndexOf("/") + 1);
    }

    normalize(filename: string) {
        return filename.split("/").filter(d => !!d).join("/");
    }

    dirname(path: string) {
        return path.substr(0, path.lastIndexOf("/"));
    }

    reslove(dirpath: string) {
        if (dirpath == "") {
            return this.root;
        }
        dirpath = this.normalize(dirpath);
        let list = dirpath.split("/");
        let current: File | Dictionary = this.root;
        for (let f of list) {
            current = current[f];
            if (!current) {
                return null;
            }
        }
        return current;
    }

    mkdir(dirpath: string) {
        dirpath = this.normalize(dirpath);
        let list = dirpath.split("/");
        let current = this.root;
        for (let f of list) {
            if (!current[f]) {
                current[f] = {};
            }
            current = current[f] as Dictionary;
        }
    }

    exists(dirpath: string) {
        if (dirpath == "") return true;
        dirpath = this.normalize(dirpath);
        let list = dirpath.split("/");
        let current = this.root;
        for (let f of list) {
            if (!current[f]) {
                return false;
            }
            current = current[f] as Dictionary;
        }
        return true;
    }
}
