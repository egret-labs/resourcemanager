exports.typeSelector = function (path) {
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
    };
    var type = typeMap[ext];
    if (type == "json") {
        if (path.indexOf("sheet") >= 0) {
            type = "sheet";
        }
        else if (path.indexOf("movieclip") >= 0) {
            type = "movieclip";
        }
        ;
    }
    return type;
};
exports.resourceRoot = "resource";
exports.alias = {
	"sheet_png": "assets/sheet/sheet.png",
	"sheet_json": "assets/sheet/sheet.json",
	"off": "sheet_json#off",
	"on": "sheet_json#on"
};
exports.groups = {
	"preload": [
		"off",
		"on"
	]
};
exports.resources = {
	"111.mergeJson": {
		"url": "111.mergeJson",
		"type": "mergeJson",
		"name": "111.mergeJson"
	},
	"config.json": {
		"url": "config.json",
		"type": "json",
		"name": "config.json"
	},
	"default.res.json": {
		"url": "default.res.json",
		"type": "json",
		"name": "default.res.json"
	},
	"assets": {
		"armature": {
			"skeleton.json": {
				"url": "assets/armature/skeleton.json",
				"type": "json",
				"name": "assets/armature/skeleton.json"
			},
			"texture.json": {
				"url": "assets/armature/texture.json",
				"type": "json",
				"name": "assets/armature/texture.json"
			},
			"texture.png": {
				"url": "assets/armature/texture.png",
				"type": "image",
				"name": "assets/armature/texture.png"
			}
		},
		"bitmap": {
			"bg.jpg": {
				"url": "assets/bitmap/bg.jpg",
				"type": "image",
				"name": "assets/bitmap/bg.jpg"
			},
			"egret_icon.png": {
				"url": "assets/bitmap/egret_icon.png",
				"type": "image",
				"name": "assets/bitmap/egret_icon.png"
			}
		},
		"font": {
			"font.fnt": {
				"url": "assets/font/font.fnt",
				"type": "font",
				"name": "assets/font/font.fnt"
			},
			"font.png": {
				"url": "assets/font/font.png",
				"type": "image",
				"name": "assets/font/font.png"
			}
		},
		"movieclip": {
			"movieclip.json": {
				"url": "assets/movieclip/movieclip.json",
				"type": "movieclip",
				"name": "assets/movieclip/movieclip.json"
			},
			"movieclip.png": {
				"url": "assets/movieclip/movieclip.png",
				"type": "image",
				"name": "assets/movieclip/movieclip.png"
			}
		},
		"pvr": {
			"0.pvr": {
				"url": "assets/pvr/0.pvr",
				"type": "pvr",
				"name": "assets/pvr/0.pvr"
			}
		},
		"sheet": {
			"sheet.json": {
				"url": "assets/sheet/sheet.json",
				"type": "sheet",
				"name": "assets/sheet/sheet.json",
				"subkeys": "off,on"
			},
			"sheet.png": {
				"url": "assets/sheet/sheet.png",
				"type": "image",
				"name": "assets/sheet/sheet.png"
			}
		},
		"sound": {
			"sound_go.mp3": {
				"url": "assets/sound/sound_go.mp3",
				"type": "sound",
				"name": "assets/sound/sound_go.mp3"
			}
		}
	}
};
