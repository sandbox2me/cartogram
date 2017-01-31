import SDFFont from 'components/sdf_font';
import Image from 'components/image';


function registerAsync(name, fontDef) {
    throw new Error('registerAsync is not fully implemented!');

    return (dispatch) => {
        loader.load(fontDef.textureUrl, (texture) => {
            dispatch(registerSync(name, new SDFFont(name, fontDef, texture)));
        }, undefined, (xhr) => {
            throw new Error(`Error loading texture '${ fontDef.textureUrl }': ${ xhr }`);
        });
    };
}

function registerImage(name, url) {
    return (dispatch) => {
        dispatch(registerSync(
            name,
            new Image(
                dispatch,
                name,
                url
            )
        ));
    };
}

function registerSync(name, image) {
    return {
        type: 'REGISTER_IMAGE',
        name,
        image
    };
}

export default {
    registerImage,
};
