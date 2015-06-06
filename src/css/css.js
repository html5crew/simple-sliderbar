(function () {
    'use strict';

    var cssText = [
        '.pp_slider {position:absolute;top:0;left:0;width:100%;height:20px;margin:0;}',
        '.pp_slider_wrap {position:relative;width:100%;height:100%;}',
        '.pp_slider_btn {position:absolute;top:0px;left:0px;width:18px;height:18px;margin-left:-9px;background-color:#ddd;border-radius:8px;z-index:1;}',
        '.pp_slider_bg {position:absolute;top:0px;left:0;width:100%;height:2px;margin:8px 0 0 0;}',
        '.pp_slider_bar {position:absolute;top:0px;left:0;width:100%;height:2px;background-color:#fff;opacity:0.2;}',
        '.pp_slider_line {position:absolute;top:0px;left:0;height:2px;background-color:#fff;}',
        '.pp_slider_point {position:absolute;top:0;left:0;margin:-2px 0 0 -3px;width:6px;height:6px;background-color:#fff;border-radius:6px;}',
        '.pp_slider_val {position:absolute;top:-15px;width:18px;text-align:center;font-size:10px;color:#fff}',
        /* vertical mode */
        '.pp_slider.vertical {width:20px;height:100%;margin:0;}',
        '.pp_slider.vertical .pp_slider_wrap {height:100%}',
        '.pp_slider.vertical .pp_slider_btn {margin-left:0;margin-top:-9px;}',
        '.pp_slider.vertical .pp_slider_bg {width:0;height:100%;margin:0 0 0 8px;}',
        '.pp_slider.vertical .pp_slider_bar {width:2px;height:100%;}',
        '.pp_slider.vertical .pp_slider_line {width:2px;}',
        '.pp_slider.vertical .pp_slider_point {position:absolute;top:0;left:0;margin:-3px 0 0 -2px;width:6px;height:6px;background-color:#fff;border-radius:6px;}',
        '.pp_slider.vertical .pp_slider_val {}',
        /* animation */
        '.pp_slider_animate {-webkit-transition: 0.2s ease-out;transition: 0.1s ease-out;}'
    ].join('');

    var styleEl = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(styleEl);
    if (styleEl.styleSheet) {
        if (!styleEl.styleSheet.disabled) {
            styleEl.styleSheet.cssText = cssText;
        }
    } else {
        try {
            styleEl.innerHTML = cssText;
        } catch(e) {
            styleEl.innerText = cssText;
        }
    }

}());