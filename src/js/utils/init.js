(function (exports) {
    'use strict';

    exports.$ = Selector.$;
    exports.$$ = Selector.$$;
    exports.event = DOMEvent;
    exports.classList = DOMClassList;
    exports.EVENT_NAME = (function () {
        var TOUCH_EVENT = {
                START: 'touchstart',
                MOVE: 'touchmove',
                END: 'touchend',
                CANCEL: 'touchcancel'
            },
            MOUSE_EVENT = {
                START: 'mousedown',
                MOVE: 'mousemove',
                END: 'mouseup'
            };

        return !!('ontouchstart' in window) ? TOUCH_EVENT : MOUSE_EVENT;
    })();

})(window.SliderBar = (typeof window.SliderBar === 'undefined') ? {} : window.SliderBar);
