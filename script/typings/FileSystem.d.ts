export interface File {
    url: string;
    type: string;
    name: string;
}
export interface Dictionary {
    [file: string]: File | Dictionary;
}
export declare class FileSystem {
    root: Dictionary;
    rootPath: string;
    init(d: Dictionary, rootPath: string): Dictionary;
    addFile(r: File): void;
    getFile(filename: string): File | undefined;
    private basename(filename);
    private normalize(filename);
    private dirname(path);
    private reslove(dirpath);
    private mkdir(dirpath);
    private exists(dirpath);
}
