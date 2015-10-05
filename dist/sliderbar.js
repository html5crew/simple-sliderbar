(function () {
    // sliderbar.css
    var cssText = "" +
".pp_slider {\n" +
"    position:absolute;\n" +
"    top:0;\n" +
"    left:0;\n" +
"    width:100%;\n" +
"    height:20px;\n" +
"    margin:0;\n" +
"}\n" +
".pp_slider_wrap {\n" +
"    position:relative;\n" +
"    width:100%;\n" +
"    height:100%;\n" +
"}\n" +
".pp_slider_btn {\n" +
"    position:absolute;\n" +
"    top:0px;\n" +
"    left:0px;\n" +
"    width:18px;\n" +
"    height:18px;\n" +
"    margin-left:-9px;\n" +
"    background-color:#ddd;\n" +
"    border-radius:8px;\n" +
"    z-index:1;\n" +
"}\n" +
".pp_slider_bg {\n" +
"    position:absolute;\n" +
"    top:0px;\n" +
"    left:0;\n" +
"    width:100%;\n" +
"    height:2px;\n" +
"    margin:8px 0 0 0;\n" +
"}\n" +
".pp_slider_bar {\n" +
"    position:absolute;\n" +
"    top:0px;\n" +
"    left:0;\n" +
"    width:100%;\n" +
"    height:2px;\n" +
"    background-color:#fff;\n" +
"    opacity:0.2;\n" +
"}\n" +
".pp_slider_line {\n" +
"    position:absolute;top:0px;\n" +
"    left:0;\n" +
"    height:2px;\n" +
"    background-color:#fff;\n" +
"}\n" +
".pp_slider_point {\n" +
"    position:absolute;\n" +
"    top:0;\n" +
"    left:0;margin:-2px 0 0 -3px;\n" +
"    width:6px;\n" +
"    height:6px;\n" +
"    background-color:#fff;\n" +
"    border-radius:6px;\n" +
"}\n" +
".pp_slider_val {\n" +
"    position:absolute;\n" +
"    top:-15px;\n" +
"    width:18px;\n" +
"    text-align:center;\n" +
"    font-size:10px;\n" +
"    color:#fff\n" +
"}\n" +
"/* vertical mode */\n" +
".pp_slider.vertical {\n" +
"    width:20px;\n" +
"    height:100%;\n" +
"    margin:0;\n" +
"}\n" +
".pp_slider.vertical .pp_slider_wrap {\n" +
"    height:100%\n" +
"}\n" +
".pp_slider.vertical .pp_slider_btn {\n" +
"    margin-left:0;\n" +
"    margin-top:-9px;\n" +
"}\n" +
".pp_slider.vertical .pp_slider_bg {\n" +
"    width:0;\n" +
"    height:100%;\n" +
"    margin:0 0 0 8px;\n" +
"}\n" +
".pp_slider.vertical .pp_slider_bar {\n" +
"    width:2px;\n" +
"    height:100%;\n" +
"}\n" +
".pp_slider.vertical .pp_slider_line {\n" +
"    width:2px;\n" +
"}\n" +
".pp_slider.vertical .pp_slider_point {\n" +
"    position:absolute;\n" +
"    top:0;\n" +
"    left:0;\n" +
"    width:6px;\n" +
"    height:6px;\n" +
"    margin:-3px 0 0 -2px;\n" +
"    background-color:#fff;\n" +
"    border-radius:6px;\n" +
"}\n" +
".pp_slider.vertical .pp_slider_val {\n" +
"\n" +
"}\n" +
"/* animation */\n" +
".pp_slider_animate {\n" +
"    -webkit-transition: 0.2s ease-out;\n" +
"    transition: 0.1s ease-out;\n" +
"}";
    // cssText end

    var styleEl = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(styleEl);
    if (styleEl.styleSheet) {
        if (!styleEl.styleSheet.disabled) {
            styleEl.styleSheet.cssText = cssText;
        }
    } else {
        try {
            styleEl.innerHTML = cssText
        } catch(e) {
            styleEl.innerText = cssText;
        }
    }
}());

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
(function (exports) {
    'use strict';

    exports.Draggable = Observer.extend({
        init: function (options) {
            if (!options.el) {
                throw new Error('element should be provided');
            }
            this.initialX = 0;
            this.initialY = 0;
            this.options = options;
            this.el = options.el || null;

            this.EVENT_NAME = exports.EVENT_NAME;
            this.offset = null;

            this._bindEvent();
        },
        onmousedown: function (e) {
            var point = (e.touches && e.touches.length > 0) ? e.touches[0] : e;
            this.initialX = point.pageX || point.clientX;
            this.initialY = point.pageY || point.clientY;

            exports.event.on(window, this.EVENT_NAME.MOVE, this._onmousemove);
            exports.event.on(window, this.EVENT_NAME.END, this._onmouseup);
            if(this.EVENT_NAME.CANCEL) {
                exports.event.on(window, this.EVENT_NAME.CANCEL, this._onmouseup);
            }
            this.offset = this._calOffset(e);
            this.emit('start', this.offset);
        },
        onmouseup: function (e) {
            exports.event.off(window, this.EVENT_NAME.MOVE, this._onmousemove);
            exports.event.off(window, this.EVENT_NAME.END, this._onmouseup);
            if(this.EVENT_NAME.CANCEL) {
                exports.event.off(window, this.EVENT_NAME.CANCEL, this._onmouseup);
            }
            this.offset = this._calOffset(e);
            this.emit('end', this.offset);
        },
        onmousemove: function (e) {
            this.offset = this._calOffset(e);
            this.emit('move', this.offset);
        },
        _bindEvent: function () {
            var self = this;
            this._onmousedown = function (e) {
                var ev = window.event || e;
                self._preventEvent(e);
                self.onmousedown(ev);
            };
            this._onmouseup = function (e) {
                var ev = window.event || e;
                self._preventEvent(e);
                self.onmouseup(ev);
            };
            this._onmousemove = function (e) {
                var ev = window.event || e;
                self._preventEvent(e);
                self.onmousemove(ev);
            };
            exports.event.on(this.el, this.EVENT_NAME.START, function (e) {
                self._onmousedown(e);
            });
        },
        _preventEvent: function (e) {
            if (this.options && !this.options.eventBubbling) {
                exports.event.preventDefault(e);
                exports.event.stopPropagation(e);
            }
        },
        _calOffset: function(e) {
            var point = (e.touches && e.touches.length > 0) ? e.touches[0] : e;
            if (TouchEvent && point instanceof TouchEvent) {
                point = point.changedTouches[0];
            }

            var currentX = point.pageX || point.clientX;
            var currentY = point.pageY || point.clientY;

            var dx = (currentX - this.initialX);
            var dy = (currentY - this.initialY);

            return {
                x: currentX,
                y: currentY,
                dx: dx,
                dy: dy,
                target: exports.event.getTarget(e)
            };
        }
    });

})(window.SliderBar = (typeof window.SliderBar === 'undefined') ? {} : window.SliderBar);
/* jshint unused:true */
(function (exports) {
    'use strict';

    var helper = exports.helper;

    exports.App = Observer.extend({
        init: function (el, initOptions) {
            if (!el) {
                throw new Error('element should be provided');
            }
            this.el = el;
            this.initOptions = initOptions;
            this.options = this._parseAttrs(el);
            this.PROPS_NAME = helper.getPropsName(this.options.orientation);

            this._bindEvent();
            this._initSliderView();
            this._updateView();
        },
        reset: function (options) {
            this._extendOptions(options);

            this.emit('reset:view', this.options);
        },
        resize: function () {
            this._updateView();
        },
        setCurrent: function (num) {
            if (!helper.isNumeric(num)) {
                num = this.options.start;
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
                snap    : this._getOptionAttr('snap', 0),
                type        : this.inputEl.getAttribute('type') || 'range',
                mode        : this.inputEl.getAttribute('mode') || 'nosteps',           // steps, nosteps
                orientation : this.inputEl.getAttribute('orientation') || 'horizontal'  // vertical, horizontal
            };
        },
        _getOptionAttr: function (name, defaultValue) {
            var option = this.initOptions && this.initOptions[name];
            if (!helper.isNumeric(option)) {
                if (this.inputEl.hasAttribute(name)) {
                    option = this.inputEl.getAttribute(name);
                } else {
                    option = defaultValue;
                }
            }
            return parseFloat(option);
        },
        _initSliderView: function () {
            new exports.SliderView(this.el, this, this.options);
        },
        _bindEvent: function () {
            var self = this;
            this.on('set:inputValue', function (result) {
                self._setInputValue(result);
            });
        },
        _updateView: function () {
            this.emit('update:view');
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

            if (this.startRate - this.options.snap < this.rate && this.rate < this.startRate + this.options.snap) {
                this.rate = this.startRate;
            }
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
(function (exports) {
    'use strict';

    var helper = exports.helper;

    exports.LineView = Class.extend({
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
            var size = this.PROPS_NAME['SIZE'];

            if (offset < start) {
                this.el.style.cssText = position + ':' + offset + '%;' + size + ':' + (start - offset) + '%;';
            } else {
                this.el.style.cssText = position + ':' + start + '%;' + size + ':' + (offset - start) + '%;';
            }
        }
    });

})(window.SliderBar = (typeof window.SliderBar === 'undefined') ? {} : window.SliderBar);
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