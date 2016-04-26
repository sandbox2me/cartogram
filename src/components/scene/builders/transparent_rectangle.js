import Rectangle from './rectangle';

export default class TransparentRectangle extends Rectangle {
    get renderOrder() {
        return 3;
    }

    get builderType() {
        return 'TransparentRectangle';
    }
}
