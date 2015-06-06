dependencies = [
    'bower_components/selector-alias/selector-alias.js',
    'bower_components/simple-inheritance/class.js',
    'bower_components/simple-observer/observer.js',
    'bower_components/simple-event/event.js',
    'bower_components/simple-classList/classList.js'
]
sources = [
    '<%= css2js.dist.dest %>',
    'src/js/utils/init.js',
    'src/js/utils/helper.js',
    'src/js/utils/draggable.js',
    'src/js/sliderbar.js',
    'src/js/views/sliderView.js',
    'src/js/views/btnView.js',
    'src/js/views/barView.js',
    'src/js/views/lineView.js',
    'src/js/views/pointView.js'
];

module.exports =
    dist:
        src: sources
        dest: 'dist/sliderbar-<%= pkg.version %>.js'
    standalone:
        src: dependencies.concat(sources)
        dest: 'dist/sliderbar-standalone-<%= pkg.version %>.js'