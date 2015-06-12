module.exports =
    dist:
        files:
            'dist/sliderbar.min.js': ['<%= concat.dist.dest %>']
    standalone:
        files:
            'dist/sliderbar.standalone.min.js': ['<%= concat.standalone.dest%>']