define(function(require) {

    return {
        // Not technically correct since we should have 1 setting
        // store per cartogram instance. The problem with that is we can
        // only have 1 cartogram instance on each page.
        isGL: window.WebGLRenderingContext,
        maxZoom: 2000
    };

});
