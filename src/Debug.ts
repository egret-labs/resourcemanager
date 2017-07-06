module RES {

    export let checkNull: MethodDecorator = (target, propertyKey, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function (...arg) {
            if (!arg[0]) {
                console.warn(`方法${propertyKey}的参数不能为null`)
                return null;
            }
            else {
                return method.apply(this, arg);
            }

        }
    }

    /**
     * 功能开关
     *  LOADING_STATE：处理重复加载
     */
    export let FEATURE_FLAG = {
        LOADING_STATE: 0
    }




    export namespace upgrade {


        var _level: LOG_LEVEL = "warning";

        type LOG_LEVEL = "warning" | "silent"

        export function setUpgradeGuideLevel(level: "warning" | "silent") {
            _level = level;
        }

        // export let checkDecorator: MethodDecorator = (target, propertyKey, descriptor) => {
        //     const method = descriptor.value;
        //     descriptor.value = function () {
        //         if (!RES['configItem']) {
        //             let url = "config.json";
        //             resourceRoot = "resource/";
        //             RES['configItem'] = { url, resourceRoot, type: "commonjs", name: url };
        //             if (_level == "warning") {
        //                 console.warn(
        //                     "RES.loadConfig() 不再接受参数，强制访问 resource/config.json 文件\n",
        //                     "请访问以下站点了解更多细节\n",
        //                     "https://github.com/egret-labs/resourcemanager/blob/master/docs/"
        //                 )
        //             }

        //         }

        //         return method.apply(this);
        //     }

        // }

    }
}