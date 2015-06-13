(function (exports) {
    'use strict';

    var helper = exports.helper;

    exports.BarView = Class.extend({
        init: function (el, queue, options) {
            this.wrapEl = el;
            this.queue = queue;
            this.options = options;

            this.PROPS_NAME = helper.getPropsName(options.orientation);

            this._render();
            this._bindEvent();
        },
        _render: function () {
            var bgEl = helper.createEl('div', 'pp_slider_bg');
            this.el = helper.createEl('div', 'pp_slider_bar');

            bgEl.appendChild(this.el);
            this.wrapEl.appendChild(bgEl);
        },
        _bindEvent: function () {
            var self = this;
            this.queue.on('get:size', function (callback) {
                callback(self._getSize());
            });
        },
        _getSize: function () {
            var size = this.el.getBoundingClientRect()[this.PROPS_NAME['SIZE']];
            this.wrapEl.setAttribute('data-size', size);

            return size;
        }
    });

})(window.SliderBar = (typeof window.SliderBar === 'undefined') ? {} : window.SliderBar);