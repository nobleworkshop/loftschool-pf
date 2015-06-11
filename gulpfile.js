"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var connect = require("gulp-connect");
var autoprefixer = require('gulp-autoprefixer');
var spritesmith = require('gulp.spritesmith');

// Запуск сервера
gulp.task('connect', function() {
	connect.server({
		root: 'app',
		livereload: true,
		port: 8888
	})
})

// Работа с html
gulp.task('html', function () {
	gulp.src('./app/*.html')
		.pipe(connect.reload())
})

// Работа с css
gulp.task('css', function () {
	gulp.src('./app/sass/*.scss')
	    .pipe(sass.sync().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['> 1% in RU']
		}))
		.pipe(gulp.dest('./app/css/'))
		.pipe(connect.reload());
});

// Работа с js
gulp.task('js', function () {
	gulp.src('./app/js/*.js')
		.pipe(connect.reload())
})

gulp.task('sprite', function () {
  // Generate our spritesheet 
  var spriteData = gulp.src('./app/sprite/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '../img/sprite.png',
    padding: 50
  }));
 
  // Pipe image stream through image optimizer and onto disk 
  spriteData.img.pipe(gulp.dest('./app/img/'));
 
  // Pipe CSS stream through CSS optimizer and onto disk 
  spriteData.css.pipe(gulp.dest('./app/sass/'));
})

gulp.task('deploy', function() {
	//Задача на доработку, пока только копирует
	gulp.src('./app/sass/*.scss')
	    .pipe(sass.sync().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest('./dist/css/'));
	gulp.src('./app/bower_components/modernizr/modernizr.js')
		.pipe(gulp.dest('./dist/bower_components/modernizr/'));
	gulp.src('./app/bower_components/normalize.css/normalize.css')
		.pipe(gulp.dest('./dist/bower_components/normalize.css/'));
	gulp.src('./app/bower_components/jquery/dist/jquery.min.js')
		.pipe(gulp.dest('./dist/bower_components/jquery/dist/'));
	gulp.src('./app/img/*')
		.pipe(gulp.dest('./dist/img/'));
	gulp.src('./app/js/*')
		.pipe(gulp.dest('./dist/js/'));
	gulp.src('./app/font/**')
		.pipe(gulp.dest('./dist/font/'));
	gulp.src('./app/*.html')
		.pipe(gulp.dest('./dist/'));

		
})

// Слежка
gulp.task('watch', function () {
	gulp.watch(['./app/*.html'], ['html'])
	gulp.watch(['./app/sass/*.scss'], ['css'])
	gulp.watch(['./app/js/*.js'], ['js'])
})

// Задача поумолчанию
gulp.task('default', ['connect', 'watch'])