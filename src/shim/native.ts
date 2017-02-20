namespace RES {


    export function native_init() {
        console.log(2222);
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            let data = getLocalData("all.manifest");
            console.log(2222);
            console.log(JSON.stringify(data));
        }

    }

    function getLocalData(filePath): any {
        if (egret_native.readUpdateFileSync && egret_native.readResourceFileSync) {
            //先取更新目录
            var content: string = egret_native.readUpdateFileSync(filePath);
            if (content != null) {
                return JSON.parse(content);
            }

            //再取资源目录
            content = egret_native.readResourceFileSync(filePath);
            if (content != null) {
                return JSON.parse(content);
            }
        }
        return null;
    }
}

