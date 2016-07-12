'use strict';

const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const sourcemaps = require('gulp-sourcemaps');
const ngAnnotate = require('gulp-ng-annotate');


let paths = {
  html: {
    input: 'client/html/**/*.html',
    output: 'public/html'
  },
  js: {
    input: 'client/js/**/*.js',
    output: 'public/js'
  },
  css: {
    input: ['client/css/**/*.scss', 'client/css/**/*.sass'],
    output: 'public/css'
  },
  favicon:  {
    input: './client/favicon.ico',
    output: './public'
  }
};


gulp.task('default', ['build', 'watch', 'serve']);

gulp.task('build', ['favicon', 'html', 'css', 'js']);

gulp.task('watch', ['watch.html', 'watch.css', 'watch.js']);

gulp.task('serve', function() {
  nodemon({
    ignore: ['./client', './public']
  });
})

gulp.task('favicon', function() {
  return gulp.src(paths.favicon.input)
    .pipe(gulp.dest(paths.favicon.output));
})

//////////////// HTML ////////////////////
gulp.task('html',['clean:html'], function() {
  return gulp.src(paths.html.input)
    .pipe(gulp.dest(paths.html.output));
});

gulp.task('clean:html', function() {
  return del([paths.html.output]);
});

gulp.task('watch.html', function() {
  gulp.watch(paths.html.input, ['html'])
});

///////////////// JS /////////////////
gulp.task('js',['clean:js'], function() {
  return gulp.src(paths.js.input)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(babel({
        presets: ['es2015']
    }))
  .pipe(ngAnnotate())
  .pipe(concat('bundle.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.js.output));
});

gulp.task('clean:js', function() {
  return del([paths.js.output]);
});

gulp.task('watch.js', function() {
  gulp.watch(paths.js.input, ['js'])
});

//////////////// SASS /////////////////
gulp.task('css',['clean:css'], function() {
  return gulp.src(paths.css.input)
  .pipe(plumber())
  .pipe(sass())
  .pipe(gulp.dest(paths.css.output));
});

gulp.task('clean:css', function() {
  return del([paths.css.output]);
});

gulp.task('watch.css', function() {
  gulp.watch(paths.css.input, ['css'])
});
