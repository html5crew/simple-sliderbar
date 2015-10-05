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
            if (point instanceof TouchEvent) {
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