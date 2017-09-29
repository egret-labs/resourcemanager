export interface File {
    url: string;
    type: string;
    name: string;
}
export interface Dictionary {
    [file: string]: File | Dictionary;
}
export declare class FileSystem {
    init(d: Dictionary): Dictionary;
    root: Dictionary;
    addFile(r: File): void;
    getFile(filename: string): File | undefined;
    basename(filename: string): string;
    normalize(filename: string): string;
    dirname(path: string): string;
    reslove(dirpath: string): Dictionary | File | null;
    mkdir(dirpath: string): void;
    exists(dirpath: string): boolean;
}
