export interface File {

    url: string;

    type: string;

    name: string;

}

export interface Dictionary {

    [file: string]: File | Dictionary

}
export class FileSystem {

    root: Dictionary = {};
    rootPath: string;

    init(d: Dictionary, rootPath: string) {
        this.root = d;
        this.rootPath = rootPath;
        return this.root;
    }



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
        filename = this.normalize(filename);
        return this.reslove(filename) as File;
    }

    private basename(filename: string) {
        return filename.substr(filename.lastIndexOf("/") + 1);
    }

    private normalize(filename: string) {
        return filename.split("/").filter(d => !!d && d != this.rootPath).join("/");
    }

    private dirname(path: string) {
        return path.substr(0, path.lastIndexOf("/"));
    }

    private reslove(dirpath: string) {
        if (dirpath == "") {
            return this.root;
        }
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

    private mkdir(dirpath: string) {
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

    private exists(dirpath: string) {
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
