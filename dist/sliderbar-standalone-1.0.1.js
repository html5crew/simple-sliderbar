/*global jQuery, Sizzle */

(function (exports) {
    'use strict';

    function createSelectorAlias() {
        if (window.Sizzle) {
            return window.Sizzle;
        } else if (window.jQuery && window.jQuery.find) {
            return window.jQuery.find;
        } else {
            return function (select, start) {
                if (typeof start === "object" && start.querySelectorAll) {
                    return start.querySelectorAll(select);
                } else if (typeof start === "string") {
                    return document.querySelectorAll(start + " " + select);
                } else {
                    return document.querySelectorAll(select);
                }
            };
        }
    }

    exports.Selector = {
        "$": function (id) {
            return document.getElementById(id);
        },

        "$$": createSelectorAlias(),

        _createSelectorAlias: createSelectorAlias
    };

})(this);
/* source: https://gist.github.com/shakyShane/5944153
 *
 * Simple JavaScript Inheritance for ES 5.1 ( includes polyfill for IE < 9 )
 * based on http://ejohn.org/blog/simple-javascript-inheritance/
 *  (inspired by base2 and Prototype)
 * MIT Licensed.
 */
(function (global) {
    "use strict";

    if (!Object.create) {
        Object.create = (function () {
            function F() {
            }

            return function (o) {
                if (arguments.length !== 1) {
                    throw new Error("Object.create implementation only accepts one parameter.");
                }
                F.prototype = o;
                return new F();
            };
        })();
    }

    var fnTest = /xyz/.test(function () {
        /* jshint ignore:start */
        xyz;
        /* jshint ignore:end */
    }) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    function BaseClass() {
    }

    // Create a new Class that inherits from this class
    BaseClass.extend = function (props) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        var proto = Object.create(_super);

        // Copy the properties over onto the new prototype
        for (var name in props) {
            // Check if we're overwriting an existing function
            proto[name] = typeof props[name] === "function" &&
                typeof _super[name] === "function" && fnTest.test(props[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, props[name]) :
                props[name];
        }

        // The new constructor
        var newClass = function () {
            if (typeof this.init === "function") {
                this.init.apply(this, arguments);
            }
        };


        // Populate our constructed prototype object
        newClass.prototype = proto;

        // Enforce the constructor to be what we expect
        proto.constructor = newClass;

        // And make this class extendable
        newClass.extend = BaseClass.extend;

        return newClass;
    };

    // export
    global.Class = BaseClass;
})(this);
/*jshint devel: true
 */
(function (exports) {
    'use strict';

    exports.Observer = Class.extend({
        on: function (event, listener) {
            var events = [].concat(event);
            for (var i = 0, l = events.length; i < l; i++) {
                this.addListener.apply(this, [events[i], listener]);
            }

            return this;
        },
        addListener: function (event, listener) {
            var listeners = this.getListeners(event);
            listeners.push(listener);
            return this;
        },
        once: function (event, listener) {
            if (!listener) {
                return ;
            }
            var self = this;
            var onetimeListener = function () {
                self.off(event, onetimeListener);
                listener.apply(this, arguments);
            };
            listener.__onetime_listener = onetimeListener;
            this.on(event, onetimeListener);
        },
        emit: function (event) {
            var events = [].concat(event);
            var args = [].slice.call(arguments, 1);
            for (var i = 0, l = events.length; i < l; i++) {
                this._emit(events[i], args);
            }

            return this;
        },
        _emit: function (event, args) {
            var cloneListeners = this.getListeners(event).slice(0);
            if (typeof cloneListeners !== 'undefined') {
                for (var i = 0, len = cloneListeners.length; i < len; i++) {
                    try {
                        cloneListeners[i].apply(this, args);
                    } catch (e) {
                        if (typeof console !== 'undefined') {
                            console.error('failed on while "' + event + '" event, caused by\r\n > ' + e);
                        }
                        throw e;
                    }
                }
            }
        },
        getListeners: function (event) {
            this.listeners = this.listeners || {};
            this.listeners[event] = this.listeners[event] || [];
            return this.listeners[event];
        },
        off: function (event, listener) {
            var events = [].concat(event);
            if (listener && typeof listener.__onetime_listener === 'function') {
                listener = listener.__onetime_listener;
            }

            for (var i = 0, l = events.length; i < l; i++) {
                this.removeListener.apply(this, [events[i], listener]);
            }

            if (listener && typeof listener.__onetime_listener === 'function') {
                delete listener.__onetime_listener;
            }
            return this;
        },
        removeListener: function (event, listener) {
            var listeners = this.getListeners(event);
            if (typeof listeners !== 'undefined') {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i] === listener || listeners[i].__original__ === listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
            return this;
        },
        destroy: function () {
            this.listeners = null;
        }
    });
})(this);
/*global Selector */
(function (exports) {
    "use strict";

    exports.DOMEvent = {

        on: function () {
            if (document.addEventListener) {
                return function (el, type, fn) {
                    if (!el) {
                        throw new Error('failed to add event. Element: "' + el + '", Event: "' + type + '", handler: ' + fn.toString());
                    }
                    el.addEventListener(type, fn, false);
                };
            } else {
                return function (el, type, fn) {
                    if (!el) {
                        throw new Error('failed to add event. Element: "' + el + '", Event: "' + type + '", handler: ' + fn.toString());
                    }
                    el.attachEvent('on' + type, fn);
                };
            }
        }(),

        off: function () {
            if (document.removeEventListener) {
                return function (el, type, fn) {
                    el.removeEventListener(type, fn, false);
                };
            } else {
                return function (el, type, fn) {
                    el.detachEvent("on" + type, fn);
                };
            }
        }(),

        preventDefault: function (e) {
            var ev = e || window.event;
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
        },

        stopPropagation: function (e) {
            var ev = e || window.event;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }
        },

        getTarget: function (e) {
            var ev = e || window.event;
            return ev.target || ev.srcElement;
        }
    };

    function delegate(el, selector, type, fn) {
        if (typeof Selector === 'undefined') {
            throw new Error('dependency not found. you should include selector-alias module to use delegate function.');
        }
        if (!el) {
            throw new Error('failed to delegate event. Element: "' + el + '", Selector: "' + selector + '", Event: "' + type + '", handler: ' + fn.toString());
        }

        var $$ = Selector.$$;

        exports.DOMEvent.on(el, type, function (e) {
            var currentTarget = exports.DOMEvent.getTarget(e),
                targets = $$(selector, el);

            targets = Array.prototype.slice.apply(targets);

            while (currentTarget && currentTarget !== el) {
                if (currentTarget.nodeType === 1 && targets.indexOf(currentTarget) > -1) {
                    fn(e, currentTarget);
                    break;
                }
                currentTarget = currentTarget.parentNode;
            }
        });
    }

    exports.DOMEvent.delegate = delegate;

})(window);
/*jshint browser: true
 */
(function (exports) {
    "use strict";

    var DOMClassList = exports.DOMClassList = (function () {
        if ('classList' in document.documentElement) {
            return {
                has: function (el, cname) {
                    assertElement(el, cname, 'has');
                    return el.classList.contains(cname);
                },
                add: function (el, cname) {
                    assertElement(el, cname, 'add');
                    el.classList.add(cname);
                },
                remove: function (el, cname) {
                    assertElement(el, cname, 'remove');
                    el.classList.remove(cname);
                },
                toggle: function (el, cname) {
                    assertElement(el, cname, 'toggle');
                    el.classList.toggle(cname);
                }
            };
        } else {
            return {
                has: function (el, cname) {
                    assertElement(el, cname, 'has');
                    return el.className && ((" " + el.className + " ").lastIndexOf(" " + cname + " ") > -1);
                },
                add: function (el, cname) {
                    assertElement(el, cname, 'add');
                    if (!el.className) {
                        el.className = cname;
                    } else if (!DOMClassList.has(el, cname)) {
                        el.className += " " + cname;
                    }
                },
                remove: function (el, cname) {
                    assertElement(el, cname, 'remove');
                    if (el.className) {
                        el.className = (" " + el.className + " ").replace(" " + cname + " ", " ").replace(/^\s+|\s+$/g, '');
                    }
                },
                toggle: function (el, cname) {
                    assertElement(el, cname, 'toggle');
                    if (el.className && DOMClassList.has(el, cname)) {
                        DOMClassList.remove(el, cname);
                    } else {
                        DOMClassList.add(el, cname);
                    }
                }
            };
        }
    })();

    function assertElement(el, cname, method) {
        if (!el) {
            throw new Error('el is not valid, el : ' + el + ', method : ' + method + ', className : ' + cname);
        }
    }

})(window);
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
        num2rate: function (num, width) {
            return num * (100 / width);
        },
        rate2num: function (rate, width) {
            return rate * (width / 100);
        },
        getPropsName: function (orientation) {
            if (orientation === 'vertical') {
                return { 'POSITION': 'top',    'WIDTH': 'height',  'DX': 'dy'};
            } else {
                return { 'POSITION': 'left',   'WIDTH': 'width',   'DX': 'dx' };
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
            new exports.SliderView(el, this, options);
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

            this._render(el);
            this._initView(el, options);
            this._bindEvent();
        },
        _render: function (el) {
            this._append(el);
            this._composite();

            this.clientRect = this.wrapEl.getBoundingClientRect();
        },
        _append: function (el) {
            if (this.wrapEl) {
                el.removeChild(this.wrapEl);
            }
            this.wrapEl = helper.createEl('div', 'pp_slider_wrap');
            el.appendChild(this.wrapEl);

            if (this.options.orientation === 'vertical') {
                el.className += ' vertical';
            }
        },
        _composite: function () {
            var TRANSFORM_NAME = helper.getPrefix(this.wrapEl, 'transform');
            this.wrapEl.style[TRANSFORM_NAME] = 'translateZ(0)';
        },
        _initView: function (el, options) {
            this._initBarView(el, options);
            this._initBtnView(el, options);
            this._initLineView(el, options);
            this._initPointView(el, options);

            this.queue.emit('set:inputValue', this.options.current);
        },
        _initBtnView: function (el, options) {
            var self = this;
            this.btnView = new exports.BtnView(this.wrapEl, this.queue, options);
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
        _initBarView: function (el, options) {
            new exports.BarView(this.wrapEl, this.queue, options);
        },
        _initLineView: function (el, options) {
            this.lineView = new exports.LineView(this.wrapEl, this.queue, options);
        },
        _initPointView: function (el, options) {
            new exports.PointView(this.wrapEl, this.queue, options);
        },
        _bindEvent: function () {
            var self = this;
            exports.event.on(this.wrapEl, 'mousedown', function (e) {
                var current, start, pageOffset;
                var point = (e.touches && e.touches.length > 0) ? e.touches[0] : e;

                if (self.options.orientation === 'vertical') {
                    current = point.pageY || point.clientY;
                    start = self.clientRect[self.PROPS_NAME['POSITION']];
                    pageOffset = window.pageYOffset;

                } else {
                    current = point.pageX || point.clientX;
                    start = self.clientRect[self.PROPS_NAME['POSITION']];
                    pageOffset = window.pageXOffset;
                }

                var offset = current - (start + pageOffset);
                var rate = offset / self.clientRect[self.PROPS_NAME['WIDTH']] * 100;
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

            this.rate = this.lastRate + helper.num2rate(offset[this.PROPS_NAME['DX']], this.width);
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
            this._setWidth();
            this._setStyle();
        },
        _setWidth: function () {
            var self = this;
            this.queue.emit('get:width', function (width) {
                self.width = width;
            });
        },
        _setStyle: function () {
            var rate = this._calculate(this.rate);
            if (this.options.orientation === 'vertical') {
                this._setBtnLeftByNum(helper.rate2num(rate, this.width));
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
            this.queue.on('get:width', function (callback) {
                callback(self._getWidth());
            });
        },
        _getWidth: function () {
            var width = this.el.getBoundingClientRect()[this.PROPS_NAME['WIDTH']];
            this.wrapEl.setAttribute('data-size', width);

            return width;
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
            var width = this.PROPS_NAME['WIDTH'];

            if (offset < start) {
                this.el.style.cssText = position + ':' + offset + '%;' + width + ':' + (start - offset) + '%;';
            } else {
                this.el.style.cssText = position + ':' + start + '%;' + width + ':' + (offset - start) + '%;';
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