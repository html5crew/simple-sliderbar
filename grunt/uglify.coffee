module.exports =
    dist:
        files:
            'dist/sliderbar-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
    standalone:
        files:
            'dist/sliderbar-standalone-<%= pkg.version %>.min.js': ['<%= concat.standalone.dest%>']