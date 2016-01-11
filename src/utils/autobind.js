// grabbed from: https://www.npmjs.com/package/es7-autobinder
// currently have an issue with loading es6 modules from require
define(function() {
    return function autobind(target, name, descriptor) {
        const value = descriptor.value;

        return {
            configurable: true,
            get() {
                const boundValue = value.bind(this);
                Object.defineProperty(this, name, {
                    value: boundValue,
                    configurable: true,
                    writable: true
                });
                return boundValue;
            }
        };
    };
});
