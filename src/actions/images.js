import Image from 'components/image';


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
