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
