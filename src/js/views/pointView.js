(function (exports) {
    'use strict';

    var helper = exports.helper;

    exports.PointView = Class.extend({
        init: function (el, queue, options) {
            this.wrapEl = el;
            this.queue = queue;
            this.options = options;

            this.PROPS_NAME = helper.getPropsName(options.orientation);

            this._render();
            this._bindEvent();
        },
        _render: function () {
            var bgEl = exports.$$('.pp_slider_bg', this.wrapEl)[0];
            var frgm = document.createDocumentFragment();
            if (this.options.mode === 'steps') {
                var length = this.options.range / this.options.step;
                for (var i=0; i<=length; i++) {
                    frgm.appendChild(helper.createEl('div', 'pp_slider_point'));
                }
            } else {
                frgm.appendChild(helper.createEl('div', 'pp_slider_point'));
            }
            bgEl.appendChild(frgm);

            this.els = exports.$$('.pp_slider_point', bgEl);
        },
        _bindEvent: function () {
            var self = this;
            this.queue.on('update:style', function (offset, start) {
                self._update(offset, start);
            });
        },
        _update: function (offset, start) {
            var cssText = '';
            var position = this.PROPS_NAME['POSITION'];

            if (this.options.mode === 'steps') {
                var rate = 100 / (this.els.length - 1);
                for (var i= 0, len= this.els.length; i<len; i++) {
                    cssText = position + ':' + rate * i + '%;' + this._getPointOpacity(rate * i, offset, start);
                    this.els[i].style.cssText = cssText;
                }
            } else {
                cssText = position + ':' + start + '%;';
                this.els[0].style.cssText = cssText;
            }
        },
        _getPointOpacity: function (rate, offset, start) {
            if (start <= offset) {
                if ((rate) < start || offset < rate ) {
                    return 'opacity:0.2;';
                }
            } else {
                if (start < (rate) || rate < offset) {
                    return 'opacity:0.2;';
                }
            }
        }
    });

})(window.SliderBar = (typeof window.SliderBar === 'undefined') ? {} : window.SliderBar);