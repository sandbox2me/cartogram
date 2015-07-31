var requireConfig = {

    baseUrl: '',

    paths: {
        'backbone': './node_modules/backbone/backbone',
        'jquery': './node_modules/jquery/dist/jquery',
        'pnltri': './node_modules/pnltri/pnltri',
        'q': './node_modules/q/q',
        'rbush': './node_modules/rbush/rbush',
        'sinon': './node_modules/sinon/lib/sinon',
        'text': './src/lib/require-text',
        'three': './node_modules/three/three',
        'tinycolor': './node_modules/tinycolor2/tinycolor',
        'underscore': './node_modules/underscore/underscore'
    },
    shim: {
        backbone: {
            init: function(Backbone) {
                window.Backbone = Backbone;
            }
        },
        'three': {
            'exports': 'THREE'
        }
    },
    map: {
        '*': {
            'handlebars.runtime': 'handlebars/handlebars',
            'backbone.wreqr': 'backbone_wreqr',
            'backbone_advice': 'backbone.advice',
            'backbone.marionette': 'marionette'
        }
    },
    packages: [
        {
            name: 'cartogram',
            location: './node_modules/cartogram/src',
            main: './cartogram'
        }
    ],
};

if (typeof require === 'undefined') {
    // any values set on require before it loads will be used as config
    // ignore the "redefinition error" due to the line below
    window.require = window.requireConfig;
} else if (typeof module === 'undefined') {
    window.require.config(window.requireConfig);
}

// allow for loading in nodejs
if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = requireConfig;
}
