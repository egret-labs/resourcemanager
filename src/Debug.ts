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

    export let checkDecorator: MethodDecorator = (target, propertyKey, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function () {
            if (!RES['configItem']) {
                let url = "config.resjs";
                RES['configItem'] = { url, resourceRoot: "resource", type: "script", name: url };
                console.warn("RES.loadConfig() 不再接受参数，请使用 RES.mapConfig 注解")
            }

            return method.apply(this);
        }

    }
}