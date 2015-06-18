'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
    	clean: ['build/*'],
    	jshint: {
    		options: {
	            reporter: require('jshint-stylish')
	        },
	        target: ['src/**/*.js']
		},
    	includes: {
            files: {
                src: ['src/main.js'], 
                dest: 'build/craftymatter.js', 
                flatten: true,
                cwd: '',
                options: {
                }
            }
        },
        uglify: {
            options: {
              compress: {
                  drop_console: true
              }
            },
            my_target: {
                files: {
                    'build/craftymatter.min.js': ['build/craftymatter.js']
                }
            }
        }
    });

    grunt.registerTask('default', ['clean', 'jshint', 'includes', 'uglify']);

}