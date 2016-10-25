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




    export namespace upgrade {


        var _level:LOG_LEVEL = "warning";

        type LOG_LEVEL = "warning" | "silent"

        export function setUpgradeGuideLevel(level: "warning" | "silent") {
            _level = level;
        }

        export let checkDecorator: MethodDecorator = (target, propertyKey, descriptor) => {
            const method = descriptor.value;
            descriptor.value = function () {
                if (!RES['configItem']) {
                    let url = "config.resjs";
                    RES['configItem'] = { url, resourceRoot: "resource", type: "commonjs", name: url };
                    if (_level == "warning"){
                        console.warn("RES.loadConfig() 不再接受参数，请使用 RES.mapConfig 注解","http://www.baidu.com")
                    }
                    
                }

                return method.apply(this);
            }

        }

    }
}