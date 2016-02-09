import { Texture, TextureLoader } from 'three';
import { scene as sceneActions } from 'actions';

import Font from './font';

const loader = new TextureLoader();

export default class SDFFont extends Font {
    constructor(dispatch, name, definition, texture) {
        super();

        this._dispatch = dispatch;
        this.name = name;
        this.test = definition.test;
        this.metrics = definition.metrics;
        this.texture = new Texture();
        this._textureURI = texture;

        this._loadTexture();
    }

    _loadTexture() {
        loader.load(
            this._textureURI,
            (texture) => {
                this.texture = texture;

                this._dispatch(sceneActions.forceRedraw());
            }
        );
    }

    canUseFor(str) {
        return this.test.test(str);
    }
}
