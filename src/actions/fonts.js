import SDFFont from 'components/sdf_font';
import TTFont from 'components/ttf_font';


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

function registerSDFWithURI(name, fontDef) {
    return (dispatch) => {
        dispatch(registerSync(
            name,
            new SDFFont(
                dispatch,
                name,
                fontDef,
                fontDef.uri
            )
        ));
    };
}

function registerSync(name, font) {
    return {
        type: 'REGISTER_FONT',
        name,
        font
    };
}

function registerFont(name, fontface) {
    return {
        type: 'REGISTER_TTF',
        name,
        font: new TTFont(
            name,
            fontface
        )
    };
}

export default {
    registerSDFWithURI,
    registerFont,
};
