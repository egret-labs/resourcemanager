export const configPath = 'config.res.js';

export const resourceRoot = () => "resource";

export const mergeSelector = (path: string) => {
    if (path.indexOf("assets/bitmap/") >= 0) {
        return "assets/bitmap/sheet.sheet"
    }
}

export const typeSelector = (path: string) => {
    var ext = path.substr(path.lastIndexOf(".") + 1);
    var typeMap = {
        "jpg": "image",
        "png": "image",
        "webp": "image",
        "json": "json",
        "fnt": "font",
        "pvr": "pvr",
        "mp3": "sound",
        "zip": "zip",
        "mergeJson": "mergeJson",
        "sheet": "sheet"
    }
    var type = typeMap[ext];
    if (type == "json") {
        if (path.indexOf("sheet") >= 0) {
            type = "sheet";
        } else if (path.indexOf("movieclip") >= 0) {
            type = "movieclip";
        };
    }
    return type;
}

