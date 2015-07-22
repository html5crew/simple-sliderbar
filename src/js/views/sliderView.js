(function (exports) {
    'use strict';

    var helper = exports.helper;

    exports.SliderView = Class.extend({
        init: function (el, queue, options) {
            this.el = el;
            this.queue = queue;
            this.options = options;
            this.digit = this._calculateDigit();

            this.PROPS_NAME = helper.getPropsName(options.orientation);

            this._render();
            this._initView();
            this._bindEvent();
        },
        _render: function () {
            this._append();
            this._composite();
        },
        _append: function () {
            if (this.wrapEl) {
                this.el.removeChild(this.wrapEl);
            }
            this.wrapEl = helper.createEl('div', 'pp_slider_wrap');
            this.el.appendChild(this.wrapEl);

            if (this.options.orientation === 'vertical') {
                this.el.className += ' vertical';
            }
        },
        _composite: function () {
            var TRANSFORM_NAME = helper.getPrefix(this.wrapEl, 'transform');
            this.wrapEl.style[TRANSFORM_NAME] = 'translateZ(0)';
        },
        _initView: function () {
            this._initBarView();
            this._initBtnView();
            this._initLineView();
            this._initPointView();

            this.queue.emit('set:inputValue', this.options.current);
        },
        _initBtnView: function () {
            var self = this;
            this.btnView = new exports.BtnView(this.wrapEl, this.queue, this.options);
            this.btnView.on('start', function (data) {
                self._removeEffect();
                self.queue.emit('start', self._calculate(data));
            });
            this.btnView.on('move', function (data) {
                var result = self._calculate(data);
                self.queue.emit('set:inputValue', result);
                self.queue.emit('move', result);
            });
            this.btnView.on('end', function (data) {
                self.queue.emit('end', self._calculate(data));
            });
        },
        _initBarView: function () {
            new exports.BarView(this.wrapEl, this.queue, this.options);
        },
        _initLineView: function () {
            this.lineView = new exports.LineView(this.wrapEl, this.queue, this.options);
        },
        _initPointView: function () {
            new exports.PointView(this.wrapEl, this.queue, this.options);
        },
        _bindEvent: function () {
            var self = this;
            exports.event.on(this.wrapEl, 'mousedown', function (e) {
                var current, start, pageOffset;
                var point = (e.touches && e.touches.length > 0) ? e.touches[0] : e;
                var clientRect = self.wrapEl.getBoundingClientRect();

                if (self.options.orientation === 'vertical') {
                    current = point.pageY || point.clientY;
                    start = clientRect[self.PROPS_NAME['POSITION']];
                    pageOffset = window.pageYOffset;

                } else {
                    current = point.pageX || point.clientX;
                    start = clientRect[self.PROPS_NAME['POSITION']];
                    pageOffset = window.pageXOffset;
                }

                var offset = current - (start + pageOffset);
                var rate = offset / clientRect[self.PROPS_NAME['SIZE']] * 100;
                var value = self._calculate(rate);

                self._addEffect();
                self.queue.emit('reset:view', { 'current' : value });
                self.queue.emit('end', value);
            });
        },
        _calculate: function (data) {
            var step = this.options.step;
            var factor = this.options.range / 100;
            var value = data * factor;
            var quotient = parseFloat((value / step).toFixed(0));
            var sum = parseFloat(this.options.min) + parseFloat((quotient * step).toFixed(this.digit));
            var result = parseFloat(sum.toFixed(this.digit));

            return (result < this.options.min) ? this.options.min : ((result > this.options.max) ? this.options.max : result);
        },
        _calculateDigit: function () {
            var digit = 0;
            if ((this.options.step + '').split('.')[1]) {
                digit = (this.options.step + '').split('.')[1].length;
            }
            return digit;
        },
        _addEffect: function () {
            exports.classList.add(this.btnView.el, 'pp_slider_animate');
            exports.classList.add(this.lineView.el, 'pp_slider_animate');
        },
        _removeEffect: function () {
            exports.classList.remove(this.btnView.el, 'pp_slider_animate');
            exports.classList.remove(this.lineView.el, 'pp_slider_animate');
        }

    });

})(window.SliderBar = (typeof window.SliderBar === 'undefined') ? {} : window.SliderBar);