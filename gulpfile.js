'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');

gulp.task('sass', function () {
    return gulp.src('docs/sass/**/*.scss')
      .pipe(sass()) // Converts Sass to CSS with gulp-sass
      .pipe(gulp.dest('docs/css'))
      .pipe(browserSync.reload({
        stream: true
      }))
});
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'docs'
        },
    })
})
gulp.task('useref', function () {
    return gulp.src('docs/*.html')
      .pipe(useref())
      .pipe(gulpIf('docs/*.js', uglify()))
      .pipe(gulpIf('docs/*.css', cssnano()))
      .pipe(gulp.dest('dist'))
});
gulp.task('minify', function () {
    return gulp.src('docs/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist'));
});
gulp.task('images', function () {
    return gulp.src('docs/Images/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/Images'))
});
gulp.task('watch', ['browserSync', 'sass', 'useref', 'images', 'minify'], function () {
    gulp.watch('dev/sass/**/*.scss', ['sass']);
    gulp.watch('dev/*.html', browserSync.reload);
    gulp.watch('dev/js/**/*.js', browserSync.reload);
})
