define(function(require) {
    'use strict';

    var debug = {};

    return {
        initialize: function() {
            debug.containerEl = document.createElement('div');
            debug.containerEl.style.position = 'absolute';
            debug.containerEl.style.top = '0px';
            debug.containerEl.style.right = '0px';
            debug.containerEl.style.backgroundColor = 'rgba(0, 0, 32, 0.8)';
            debug.containerEl.style.padding = '6px 10px';
            debug.containerEl.style.fontSize = '10px';
            debug.containerEl.style.fontWeight = '500';
            debug.containerEl.style.fontFamily = '"Helvetica Neue", helvetica, arial, sans-serif';
            debug.containerEl.style.color = '#fff';
            debug.containerEl.style.textShadow = '0 1px 0 rgba(0, 0, 0, 0.6)';
            debug.containerEl.style.opacity = '0.7';
            debug.containerEl.style.borderBottomLeftRadius = '5px';

            debug.containerEl.innerHTML = 'Cartogram Stats';

            debug.modeEl = document.createElement('div');
            debug.modeEl.style.marginTop = '5px';
            debug.modeEl.style.paddingTop = '5px';
            debug.modeEl.style.borderTop = '1px solid rgba(255, 255, 255, 0.5)';
            debug.rendererEl = document.createElement('div');
            debug.rendererEl.style.marginTop = '5px';
            debug.rendererEl.style.paddingTop = '5px';
            debug.rendererEl.style.borderTop = '1px solid rgba(255, 255, 255, 0.5)';

            debug.containerEl.appendChild(debug.modeEl);
            debug.containerEl.appendChild(debug.rendererEl);

            document.body.appendChild(debug.containerEl);
        },

        updateMode: function(mode) {
            debug.modeEl.innerHTML = mode;
        },

        updateRendererInfo: function(info) {
            debug.rendererEl.innerHTML = info;
        }
    }
});
