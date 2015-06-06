/* global $$, DOMEvent, Class, Observer, Draggable */

(function (exports) {
    'use strict';

    var helper = exports.helper;

    var App = Observer.extend({
        init: function (el, options) {
            if (!el) {
                throw new Error('element should be provided');
            }
            this.el = el;
            this.options = options;
            this.attrs = this._parseAttrs(el);
            this.PROPS_NAME = helper.getPropsName(this.attrs.orientation);

            this._bindEvent();
            this._initSliderView(el, this.attrs);
            this._updateView();
        },
        reset: function (options) {
            this.emit('reset:view', options);
        },
        resize: function () {
            this.emit('update:view');
        },
        setCurrent: function (num) {
            if (!helper.isNumeric(num)) {
                num = this.attrs.start;
            }
            this.emit('reset:view', { 'current' : num });
        },
        _setInputValue: function (result) {
            this.emit('set:value', result);
            this.inputEl.setAttribute('value', result);
        },
        _parseAttrs: function (el) {
            this.inputEl = exports.$$('.pp_slider_input', el)[0];
            this.inputEl.style.display = 'none';

            var min = this._getOptionAttr('min', 0);
            var max = this._getOptionAttr('max', 100);
            var start = this._getOptionAttr('start', 0);

            return {
                min     : min,
                max     : max,
                range   : max - min,
                step    : this._getOptionAttr('step', 1),
                start   : this._getOptionAttr('start', 0),
                current : this._getOptionAttr('current', start),
                type        : this.inputEl.getAttribute('type') || 'range',
                mode        : this.inputEl.getAttribute('mode') || 'nosteps',           // steps, nosteps
                orientation : this.inputEl.getAttribute('orientation') || 'horizontal'  // vertical, horizontal
            };
        },
        _getOptionAttr: function (name, defaultValue) {
            var option = this.options && this.options[name];
            if (!helper.isNumeric(option)) {
                if (this.inputEl.hasAttribute(name)) {
                    option = this.inputEl.getAttribute(name);
                } else {
                    option = defaultValue;
                }
            }
            return parseFloat(option);
        },
        _initSliderView: function (el, options) {
            this.sliderView = new exports.SliderView(el, this, options);
        },
        _bindEvent: function () {
            var self = this;
            this.on('set:inputValue', function (result) {
                self._setInputValue(result);
            });
        },
        _updateView: function () {
            this.emit('update:view');
        }
    });

    exports.App = App;

})(window.SliderBar = (typeof window.SliderBar === 'undefined') ? {} : window.SliderBar);