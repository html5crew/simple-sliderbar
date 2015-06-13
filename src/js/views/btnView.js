(function (exports) {
    'use strict';

    var helper = exports.helper;
    var MAX = 100;

    exports.BtnView = exports.Draggable.extend({
        init: function (el, queue, options) {
            this.wrapEl = el;
            this.queue = queue;
            this.options = options;

            this.EVENT_NAME = exports.EVENT_NAME;
            this.PROPS_NAME = helper.getPropsName(options.orientation);

            this.initialX = 0;
            this.initialY = 0;

            this._render();
            this._initRate();
            this._bindEvent();
        },
        onmouseup: function (e) {
            this._super(e);

            this.lastRate = this.rate;
        },
        onmousemove: function (e) {
            this.offset = this._calOffset(e);
            this._setStyle();

            this.emit('move', this.offset);
        },
        _calOffset: function (e) {
            var offset = this._super(e);

            this.rate = this.lastRate + helper.num2rate(offset[this.PROPS_NAME['DX']], this.size);
            this.rate = this.rate < 0 ? 0 : (this.rate > MAX ? MAX : this.rate);

            return this.rate;
        },
        _render: function () {
            this.valEl = helper.createEl('div', 'pp_slider_val');
            this.el = helper.createEl('div', 'pp_slider_btn');
            this.el.appendChild(this.valEl);
            this.wrapEl.appendChild(this.el);
        },
        _initRate: function () {
            var options = this.options;
            var startRate = helper.num2rate(options.start - options.min, options.range);
            var currentRate = helper.num2rate(options.current - options.min, options.range);

            this.step = helper.num2rate(options.step, options.range) || 1;
            this.startRate = helper.isNumeric(startRate) ? startRate : 0;

            this.lastRate = helper.isNumeric(currentRate) ? currentRate : startRate;
            this.rate = helper.isNumeric(currentRate) ? currentRate : startRate;
        },
        _bindEvent: function () {
            this._super();

            var self = this;
            this.queue.on('set:value', function (val) {
                self._setValue(val);
            });
            this.queue.on('update:view', function () {
                self._update();
            });
            this.queue.on('reset:view', function (options) {
                self._reset(options);
                self.queue.emit('set:inputValue', options.current);
            });
        },
        _update: function () {
            this._setSize();
            this._setStyle();
        },
        _setSize: function () {
            var self = this;
            this.queue.emit('get:size', function (size) {
                self.size = size;
            });
        },
        _setStyle: function () {
            var rate = this._calculate(this.rate);
            if (this.options.orientation === 'vertical') {
                this._setBtnLeftByNum(helper.rate2num(rate, this.size));
            } else {
                this._setBtnLeftByRate(rate);
            }
            this.queue.emit('update:style', rate, this.startRate);
        },
        _calculate: function (data) {
            var step = this.step;
            var remainder = data % step;
            var quotient = Math.floor(data / step);

            if (remainder < step / 2) {
                return quotient * step;
            } else {
                return (quotient * step + step < MAX) ? quotient * step + step : MAX;
            }
        },
        _setBtnLeftByRate: function (rate) {
            this.el.style[this.PROPS_NAME['POSITION']] = rate + '%';
        },
        _setBtnLeftByNum: function (num) {
            this.el.style[this.PROPS_NAME['POSITION']] = num + 'px';
        },
        _reset: function (options) {
            this._extendOptions(options);
            this._initRate();
            this._update();
        },
        _setValue: function (val) {
            this.valEl.innerHTML = val;
        },
        _extendOptions: function (options) {
            for (var name in options) {
                if (options.hasOwnProperty(name)) {
                    this.options[name] = options[name];
                }
            }
            this.options['range'] = this.options['max'] - this.options['min'];
        }
    });

})(window.SliderBar = (typeof window.SliderBar === 'undefined') ? {} : window.SliderBar);