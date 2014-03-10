'use strict';
//var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
	return connect.static(require('path').resolve(dir));
};


module.exports = function(grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		watch: {
			options: {
      	livereload: true
    	},
			scripts: {
				files: ['app/**/*.{js,css,png,jpg,jpeg,webp}'],
				tasks: ['copy:debug']
			},
			compass: {
				files: ['app/**/*.{scss,sass}'],
				tasks: ['compass:debug']
			},
			jade: {
				files: ['app/**/*.jade'],
				tasks: ['jade:debug']
			},
			html: {
				files: ['app/**/*.html'],
				tasks: ['jade:debug','copy:debug']
			},
			coffee: {
				files: ['app/scripts/{,*/}*.coffee'],
				tasks: ['coffee:debug']
			}
		},
		connect: {
			options: {
				port: '9876',
				hostname: '0.0.0.0'
			},
			debug: {
				options: {
					middleware: function(connect) {
						return [
						mountFolder(connect, '.tmp')];
					}
				}
			},
			dist: {
				options: {
					middleware: function(connect) {
						return [
						mountFolder(connect, 'dist')];
					}
				}
			}
		},
		open: {
			server: {
				path: 'http://localhost:<%= connect.options.port %>'
			}
		},
		clean: {
			debug: '.tmp',
			dist: ['dist/*'],
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'app/scripts/{,*/}*.js']
		},
		coffee: {
			debug: {
				files: [{
					expand: true,
					cwd: 'app/scripts',
					src: '{,*/}*.coffee',
					dest: '.tmp/scripts',
					ext: '.js'
				}]
			},
			dist:{
				files: [{
					expand: true,
					cwd: 'app/scripts',
					src: '{,*/}*.coffee',
					dest: 'dist/scripts',
					ext: '.js'
				}]
			}
		},
		compass: {
			debug: {
				options: {
					cssDir: '.tmp',
					sassDir: 'app',
					imagesDir: 'app/images',
					relativeAssets : true,
					httpGeneratedImagesPath : '/images',
					generatedImagesDir : '.tmp/images'
				}
			},
			dist: {
				options: {
					sassDir: 'app',
					cssDir: 'dist',
					imagesDir: 'app/images',
					environment: 'production',
					//outputStyle:'expanded',
				}
			}
		},
		jade: {
			debug: {
				options: {
					data: {
						debug: true
					},
					pretty: true
				},
				files: [{
					expand: true,
					cwd: 'app/',
					src: ['**/*.jade'],
					dest: '.tmp/',
					ext: '.html'
				}]
			},
			dist: {
				options: {
					data: {
						debug: true
					},
					pretty: true
				},
				files: [{
					expand: true,
					cwd: 'app/',
					src: ['**/*.jade'],
					dest: 'dist/',
					ext: '.html'
				}]
			}
		},
		uglify: {
			dist: {
				options:{
                    compress : true
                }
			}
		},
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'app/images',
					src: '**/*.{png,jpg,jpeg}',
					dest: 'dist/images'
				}]
			}
		},
		copy: {
			debug: {
				files: [{
					expand: true,
					cwd: 'app',
					src: ['**/*.{css,js,png,jpg,jpeg,html,svg,eot,ttf,woff}'],
					dest: '.tmp'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'app',
					src: ['**/*.{css,js,png,jpg,jpeg,svg,eot,ttf,woff}'],
					dest: 'dist'
				}]
			}
		}
	});


	grunt.registerTask('server', function(target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:debug',
			'compass:debug',
			'coffee:debug',
			'jade:debug',
			'connect:debug',
			'copy:debug',
			'open',
			'watch']);
	});

	grunt.registerTask('test', [

	]);

	grunt.registerTask('build', [
		'clean:dist',
		'compass:dist',
		'jade:dist',
		'coffee:dist',
		'imagemin',
		'uglify',
		'copy:dist']);

	grunt.registerTask('default', [
		'server','jshint']);
};