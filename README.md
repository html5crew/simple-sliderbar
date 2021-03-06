# SliderBar
[![Build Status](https://travis-ci.org/html5crew/simple-sliderbar.svg?branch=master)](https://travis-ci.org/html5crew/simple-sliderbar)

*SliderBar is a simple and lightweight vanilla JS slider.*
	
## Bower
```
	bower install simple-sliderbar
```


## Demo
You can use 'grunt server' command
 * gh-pages : http://html5crew.github.io/simple-sliderbar/
 * dev version : http://localhost:9000/samples/dev.html
 * dist version	: http://localhost:9000/samples/dist.html


## Options
You can add options to input attributes or arguments object.
 - min : Number
 - max : Number
 - start : Number
 - current : Number
 - snap : Number
 	- (startRate - snap) ~ (startRate + snap)
 - orientation : String
    - "horizontal" (default)
    - "vertical"
 - mode : String
    - "nosteps" (default)
    - "steps"


## Usage
```html
	<!-- default -->
	<div class="slider_0 wrap">
		<div class="pp_slider">
			<input class="pp_slider_input" snap="1" type="range" min="-100" max="100" step="1" start="0" style="display:none">
		</div>
	</div>
	<script>
		var el0 = Selector.$$('.slider_0 .pp_slider')[0];
		this.slider0 = new SliderBar.App(el0, {
			// no options
		});
	</script>
	<!-- steps mode -->
	<div class="slider_1 wrap">
		<div class="pp_slider">
			<input class="pp_slider_input pp_hide" snap="1" type="range" min="-5" max="5" step="1" start="0" mode="steps" style="display:none">
		</div>
	</div>
	<script>
		var el1 = Selector.$$('.slider_1 .pp_slider')[0];
        	this.slider1 = new SliderBar.App(el1, {
        		// no options
        	});
	</script>
	<div class="slider_2 wrap">
		<div class="pp_slider">
			<input class="pp_slider_input pp_hide" snap="1" type="range" min="-5" max="5" step="0.0025" start="0" style="display:none">
		</div>
	</div>
	<script>
		var el2 = Selector.$$('.slider_2 .pp_slider')[0];
    	this.slider2 = new SliderBar.App(el2, {
    		// override
    		min: 0.4, 
    		max: 1.2, 
    		start: 1, 
    		current: 1
    	});
	</script>
```


## Grunt
```
	grunt server  // task : serve
	grunt build   // task : jshint, clean, css2js, concat, uglify
```


## Change Log
* 1.0.7 : support TouchEvent
* 1.0.6 : bar click event bugfix
* 1.0.5 : add snap feature
* 1.0.3 : vertical mode position bugfix
* 1.0.0 : first release
