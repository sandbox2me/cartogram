import { Texture, TextureLoader } from 'three';
import { scene as sceneActions } from 'actions';

import Font from './font';

const loader = new TextureLoader();

export default class Image extends Font {
    constructor(dispatch, name, textureURI) {
        super();

        this._dispatch = dispatch;
        this.name = name;
        this.texture = new Texture();
        this.isLoaded = false;
        this._textureURI = textureURI;

        this._loadTexture();
    }

    _loadTexture() {
        loader.load(
            this._textureURI,
            (texture) => {
                this.texture = texture;
                this.isLoaded = true;

                this._dispatch(sceneActions.forceRedraw());
            }
        );
    }
}
