'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
    	clean: ['build/*', 'demo/libs/craftymatter.min.js', 'demo/libs/matter.min.js'],
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
                    'build/craftymatter.min.js': ['build/craftymatter.js'],
                    'demo/libs/craftymatter.min.js': ['build/craftymatter.js'],
                    'libs/matter.min.js': ['libs/matter.js'],
                    'demo/libs/matter.min.js': ['libs/matter.js']
                }
            }
        },
        nodemon: {
            dev: {
                script: 'demo/server.js'
            }
        }
    });

    grunt.registerTask('default', ['clean', 'jshint', 'includes', 'uglify']);
    grunt.registerTask('demo', ['default', 'nodemon']);

}