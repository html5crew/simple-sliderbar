(function (exports) {
    'use strict';

    var helper = exports.helper;

    var LineView = Class.extend({
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
            this.el = helper.createEl('div', 'pp_slider_line');

            bgEl.appendChild(this.el);
        },
        _bindEvent: function () {
            var self = this;
            this.queue.on('update:style', function (offset, start) {
                self._update(offset, start);
            });
        },
        _update: function (offset, start) {
            var position = this.PROPS_NAME['POSITION'];
            var width = this.PROPS_NAME['WIDTH'];

            if (offset < start) {
                this.el.style.cssText = position + ':' + offset + '%;' + width + ':' + (start - offset) + '%;';
            } else {
                this.el.style.cssText = position + ':' + start + '%;' + width + ':' + (offset - start) + '%;';
            }
        }
    });

    exports.LineView = LineView;

})(window.SliderBar = (typeof window.SliderBar === 'undefined') ? {} : window.SliderBar);