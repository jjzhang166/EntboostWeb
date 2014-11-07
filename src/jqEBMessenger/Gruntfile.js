module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('jqEBMessenger.jquery.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist', 'release']
    },
//    concat: {
//      options: {
//        banner: '<%= banner %>',
//        stripBanners: true
//      },
//      dist: {
//        src: ['src/jquery.<%= pkg.name %>.js'],
//        dest: 'dist/jquery.<%= pkg.name %>.js'
//      }
//    },
    uglify: {
        options: {
            banner: '<%= banner %>',
            mangle: false, //混淆变量名
            preserveComments: 'false', //all不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
            footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */',//添加footer
            report: "min"//输出压缩率，可选的值有 false(不输出信息)，gzip
        },
        build: {
            files: [
                {
                    src: 'dist/jquery.jqEBMessenger.js',
                    dest: 'dist/jquery.jqEBMessenger.min.js'
                },
                {
                    src: 'dist/jqEBMessengerIfr.js',
                    dest: 'dist/jqEBMessengerIfr.min.js'
                },
                {
                    src: 'dist/jqEBMessengerUI.js',
                    dest: 'dist/jqEBMessengerUI.min.js'
                },
                {
                    src: 'src-outpoint/onlinecall.js',
                    dest: 'dist/onlinecall.js'
                }
            ]
        }
    },
    copy: {
      server: {
          files: [
              {flatten: false, expand:true, cwd:"libs/jquery/", src: ['jquery-1.8.3.min.js'], dest:'release/server/js/'},
              {flatten: false, expand:true, cwd:"dist/", src: ['jqEBMessengerIfr.min.js'], dest:'release/server/js/'},
              {flatten: true, expand:true, cwd:"test/", src: ['iframe_domain.html'], dest:'release/server/'}
          ]
      },
      client: {
          files: [
              {flatten: false, expand:true, cwd:"libs/jquery/", src: ['jquery-1.8.3.min.js'], dest:'release/client/js/'},
              {flatten: false, expand:true, cwd:"dist/", src: ['jquery.jqEBMessenger.min.js'], dest:'release/client/js/'},
              {flatten: false, expand:true, cwd:"dist/", src: ['jqEBMessengerUI.min.js'], dest:'release/client/js/'},
              {flatten: true, expand:true, cwd:"css/", src: '**', dest: 'release/client/css/'},
              {flatten: false, expand:true, cwd:"images/", src: '**', dest: 'release/client/images/'},
              {flatten: false, expand:true, cwd:"images2/", src: '**', dest: 'release/client/images2/'},
              {flatten: true, expand:true, cwd:"test/", src: ['client.html', 'receiveMessagePage.html','sendMessagePage.html'], dest:'release/client/'},
              {flatten: false, expand:true, cwd:"dist/", src: 'onlinecall.js', dest: 'release/client/js/'}
          ]
      },
      toApache: {
          files: [
              {flatten: false, expand:true, cwd:"release/", src: 'client/**', dest:'D:/work/Apache2.2/document_root/'},
              {flatten: false, expand:true, cwd:"release/", src: 'server/**', dest:'D:/work/Apache2.2/document_root/'}
          ]
      }
    },
    qunit: {
      files: ['test/test.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/*.js', 'src-ui/*.js', 'src-ifr/*.js']
      },
      test: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['dist/jquery.jqEBMessenger.js', "dist/jqEBMessengerUI.js", "dist/jqEBMessengerIfr.js"]
      }
    },
//    mochaTest: {
//      files: ['dist/jquery.jqEBMessenger.js']
//    },
//    mochaTestConfig: {
//      options: {
//        reporter: 'spec',
//        require: 'node_modules/should'
//      }
//    },
    build: {
        all: {
            dest: "dist/jquery.jqEBMessenger.js"
        }
    },
    buildUI: {
      all: {
          dest: "dist/jqEBMessengerUI.js"
      }
    },
    buildIfr: {
      all: {
          dest: "dist/jqEBMessengerIfr.js"
      }
    }
//    watch: {
//      gruntfile: {
//        files: '<%= jshint.gruntfile.src %>',
//        tasks: ['jshint:gruntfile']
//      },
//      src: {
//        files: '<%= jshint.src.src %>',
//        tasks: ['jshint:src', 'qunit']
//      },
//      test: {
//        files: '<%= jshint.test.src %>',
//        tasks: ['jshint:test', 'qunit']
//      }
//    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
//  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Load grunt tasks from NPM packages
  require( "load-grunt-tasks" )( grunt );
  
	// Integrate jQuery specific tasks
	grunt.loadTasks( "build/tasks" );
    grunt.loadTasks( "buildUI/tasks" );
    grunt.loadTasks( "buildIfr/tasks" );
	
	// Short list as a high frequency watch task
    //	grunt.registerTask( "dev", [ "build:*:*", "lint", "qunit"] );
    grunt.registerTask( "dev", [ "build:*:*", "buildUI:*:*", "buildIfr:*:*", "jshint"] );
    grunt.registerTask("release", ["uglify", "copy"]);

    // Default task.
    grunt.registerTask('default', [ 'clean', 'dev', 'release']);

};
