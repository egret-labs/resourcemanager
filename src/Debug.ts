module RES {

    export let checkNull: MethodDecorator = (target, propertyKey, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function (...arg) {
            if (!arg[0]) {
                console.warn(`方法${propertyKey}的参数不能为null`)
                return null;
            }
            else {
                return method.apply(this,arg);
            }

        }
    }

    export let checkDecorator: MethodDecorator = (target, propertyKey, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function (url?: string, resourceRoot?: string) {

            if (resourceRoot) {
                console.warn("已经废弃 resourceRoot");//todo
            }
            if (url) {
                console.warn("已经废弃 url");
            }
            console.assert(RES.configItem, "需要为文档类添加 RES.mapConfig 注解")
            return method.apply(this);
        }

    }
}