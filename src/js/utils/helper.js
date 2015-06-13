(function (exports) {
    'use strict';

    var doc = document;
    exports.helper = {
        isNumeric: function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        extend: function (target, source) {
            for (var name in source) {
                if (source.hasOwnProperty(name)) {
                    target[name] = source[name];
                }
            }
        },
        getPrefix: function (el, exp) {
            var _prefix = ['', '-ms-', '-o-','-moz-','-webkit-'];
            var _style = el.style;

            for(var i=0, len=_prefix.length; i<len; i+=1) {
                var result = _prefix[i] + exp;
                if( result in _style) {
                    return result;
                }
            }
            return '';
        },
        num2rate: function (num, size) {
            return num * (100 / size);
        },
        rate2num: function (rate, size) {
            return rate * (size / 100);
        },
        getPropsName: function (orientation) {
            if (orientation === 'vertical') {
                return { 'POSITION': 'top',    'SIZE': 'height',  'DX': 'dy'};
            } else {
                return { 'POSITION': 'left',   'SIZE': 'width',   'DX': 'dx' };
            }
        },
        createEl: function (tagName, className) {
            var el = doc.createElement(tagName);
            if (className) {
                el.className = className;
            }
            return el;
        }
    };

})(window.SliderBar = (typeof window.SliderBar === 'undefined') ? {} : window.SliderBar);