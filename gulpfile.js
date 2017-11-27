const gulp = require('gulp');
const plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var csslint = require('gulp-csslint');
var cssComb = require('gulp-csscomb');
var cleanCss = require('gulp-clean-css');
var jshint = require('gulp-jshint'); // removed
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyHtml = require('gulp-minify-html');
const babel = require('gulp-babel');
const inject = require('gulp-inject-string');
const gulpMerge = require('gulp-merge');
const del = require('del');
const runSequence = require('gulp-sequence');

gulp.task('clean', function () {
    return del([
        'dist/**/*',
    ]);
});

gulp.task('css', function () {
    gulp.src(['src/**/*.css'])
        .pipe(plumber())
        .pipe(cssComb())
        .pipe(csslint())
        .pipe(csslint.formatter())
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('dist/'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/'))
});

gulp.task('js', function () {
    gulp.src(['src/js/**/*.js'])
        .pipe(concat('bundle.js'))
        .pipe(babel({
            presets: 'env'
        }))
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'))
});

gulp.task('html', function () {
    gulp.src(['src/html/**/*.html'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist/'))
});

gulp.task('concatenateFiles', function() {
    return gulpMerge(
        gulp.src('dist/bundle.css')
            .pipe(inject.wrap("\n<style>\n", "\n</style>\n")),

        gulp.src('dist/bundle.js')
            .pipe(inject.wrap("\n<script>\n", "\n</script>\n\n")),

        gulp.src('src/html/player.html')
        )
        .pipe(concat('widget.html'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('concatenateFilesMinified', function() {
    return gulpMerge(
        gulp.src('dist/bundle.min.css')
            .pipe(inject.wrap('<style>', '</style>')),

        gulp.src('dist/bundle.min.js')
            .pipe(inject.wrap('<script>', '</script>')),

        gulp.src('dist/player.min.html')
        )
        .pipe(concat('widget.min.html'))
        .pipe(gulp.dest('dist/'));
});

const js = 'src/**/*.js';
const css = 'src/**/*.css';
const html = 'src/**/*.html';
const all = [js, css, html];

gulp.task('default', ['clean', 'js', 'css', 'html', 'concatenateFiles', 'concatenateFilesMinified'], function () {
    gulp.watch(js, ['js']);
    gulp.watch(css, ['css']);
    gulp.watch(html, ['html']);
});