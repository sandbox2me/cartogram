import * as primitives from './index';

export default function typeInitializer(registerFunc) {
    Object.keys(primitives).forEach(function(name) {
        registerFunc(name, primitives[name]);
    });
}
