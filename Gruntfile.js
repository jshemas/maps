'use strict';

module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			server: {
				src: ['server/*.js']
			},
			serverTests: {
				// lots of none errors in the tests, run these manually
				//src: ['server/tests/server/index.spec.js']
			},
			serverModels: {
				src: ['server/models/*.js']
			},
			serverControllers: {
				src: ['server/controllers/*.js']
			}
		},
		mochaTest: {
			test: {
				options: {
					//reporter: 'spec'
					reporter: 'Nyan'
				},
				src: ['server/tests/server/*.js']
			}
		},
		karma: {
			js: {
				configFile: 'client/conf/karma.conf.js',
				options: {
					background: true,
					reporters: 'dots'
				},
			},
			e2e: {
				configFile: 'client/conf/karma-e2e.conf.js'
			}
		},
		express: {
			options: {
				port: 8080
			},
			dev: {
				options: {
					script: './app.js',
					node_env: 'dev',
					nospawn: true,
					delay: 5
				}
			},
			prod: {
				options: {
					script: './app.js',
					node_env: 'production'
				}
			}
		},
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile']
			},
			server: {
				files: 'server/*.js',
				tasks: ['jshint:server','mochaTest:test']
			},
			serverTests: {
				files: 'server/tests/server/*.js',
				tasks: ['jshint:serverTests','mochaTest:test']
			},
			serverModels: {
				files: 'server/models/*.js',
				tasks: ['jshint:serverModels','mochaTest:test']
			},
			serverControllers: {
				files: 'server/controllers/*.js',
				tasks: ['jshint:serverControllers','mochaTest:test']
			},
			karma: {
				files: ['client/app/scripts/*.js', 'client/tests/spec/**/*.js', 'client/tests/e2e/*.js', 'client/conf/*.js', 'client/app/lib/*.js', 'client/app/styles/*.css', 'client/app/views/*.jade', 'client/app/views/partials/*.jade'],
				tasks: ['karma:js:run']
			},
			express: {
				files:  [ 'server/*.js' ],
				tasks:  [ 'express:dev' ],
				options: {
					nospawn: true
				}
			}
		}
	});
	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-karma');
	// Tasks.
	grunt.registerTask('default', ['jshint', 'mochaTest']);
	grunt.registerTask('nolint', ['mochaTest']);
	grunt.registerTask('server', ['express:dev', 'watch']);
	grunt.registerTask('testserver','run backend tests', function () {
		var tasks = ['jshint', 'mochaTest', 'watch'];
		// always use force when watching, this will rerun tests if they fail
		grunt.option('force', true);
		grunt.task.run(tasks);
	});
	grunt.registerTask('testkarma', ['karma:js','watch']);
	grunt.registerTask('teste2e', ['karma:e2e','watch']);
};