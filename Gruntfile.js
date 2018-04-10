'use strict';

module.exports = function (grunt) {

	var srcFolder = __dirname + '/src/core',
		firefoxFolder = __dirname + '/src/firefox',
		safariFolder = __dirname + '/src/safari',
		safariExtensionFolder = __dirname + '/src/cryptocat.safariextension',
		releaseFolder = __dirname + '/release';


	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),

		mochaTest:{
			files:['test/core/js/*.js']
		},
		mochaTestConfig:{
			options:{
				reporter:'spec',
				ui:'exports'
			}
		},

		copy:{
			'src-to-firefox':{
				files:[
					{
						expand:true,
						src:[ 'css/**', 'img/**', 'js/**', 'locale/**', 'snd/**', 'locale/**', 'index.html' ],
						dest:firefoxFolder + '/chrome/content/data',
						cwd:srcFolder
					}
				]
			},
			'src-to-safari':{
				files:[
					{
						expand:true,
						src:[ 'css/**', 'img/**', 'js/**', 'locale/**', 'snd/**', 'locale/**', 'index.html' ],
						dest:safariExtensionFolder,
						cwd:srcFolder
					},
					{
						expand:true,
						src:[ '*' ],
						dest:safariExtensionFolder,
						cwd:safariFolder
					}
				]
			}
		},

		jshint:{
			options:{
				jshintrc: '.jshintrc'
			},
			files:[
				'Gruntfile.js',
				'src/core/js/cryptocat.js',
				'src/core/js/lib/elliptic.js',
				'src/core/js/lib/salsa20.js',
				'src/core/js/etc/*.js',
				'src/standaloneServer.js',
				'src/firefox/chrome/content/cryptocat.js',
				'test/testBase.js',
				'test/core/js/*.js'
			]
		}
	});


	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('tests', 'Run tests', ['mochaTest']);

	grunt.registerTask('pre-build', 'Pre-build tasks', ['tests', 'jshint']);


	/**
	 * Create zip file.
	 * @param inputFolder String folder containing input files.
	 * @param outputFile String output file.
	 * @param cb Function result callback with signature: (Boolean)
	 */
	var createZipFile = function (inputFolder, outputFile, cb) {
		grunt.util.spawn({
			cmd:'zip',
			opts:{
				cwd:inputFolder
			},
			args:['-q', '-r9', outputFile, '.', '-x', '*/\\.*', '-x', '\\.*'],
			fallback:-255
		}, function (error, result, code) {
			if (-255 === code) {
				grunt.log.errorlns(result.stderr);
				cb(false);
			} else {
				grunt.log.writeln('...created ZIP [' + outputFile + ']');
				cb(true);
			}
		});
	};


	grunt.registerTask('build-chrome', 'Build Chrome browser extension', function () {
		var done = this.async();

		grunt.log.write('Creating Chrome extension...');

		var outputFile = releaseFolder + '/cryptocat-chrome.zip';

		createZipFile(srcFolder, outputFile, done);
	});

	grunt.registerTask('build-firefox', 'Build Firefox browser extension', function () {
		var done = this.async();

		grunt.log.write('Creating Firefox add-on...');

		grunt.task.run([ 'copy:src-to-firefox' ]);

		var outputFile = releaseFolder + '/cryptocat-firefox.xpi';

		createZipFile(firefoxFolder, outputFile, done);
	});

	grunt.registerTask('build-safari', 'Build Safari browser extension', function () {
		grunt.log.write('Creating Safari extension...');

		grunt.task.run([ 'copy:src-to-safari' ]);
	});


	grunt.registerTask('build', 'Build project', ['pre-build', 'build-chrome', 'build-firefox', 'build-safari']);

	grunt.registerTask('default', ['build']);
};
