var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var csslint = require('gulp-csslint');
var cssComb = require('gulp-csscomb');
var cleanCss = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyHtml = require('gulp-minify-html');
const babel = require('gulp-babel');
const inject = require('gulp-inject-string');
const gulpMerge = require('gulp-merge');

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
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
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
        gulp.src('dist/bundle.min.css')
            .pipe(inject.wrap('<style>', '</style>')),

        gulp.src('dist/bundle.min.js')
            .pipe(inject.wrap('<script>', '</script>')),

        gulp.src('dist/player.min.html')
        )
        .pipe(concat('widget.min.html'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['js', 'css', 'html', 'concatenateFiles'], function () {
    const js = 'src/**/*.js';
    const css = 'src/**/*.js';
    const html = 'src/**/*.js';

    gulp.watch(js, ['js']);
    gulp.watch(css, ['css']);
    gulp.watch(html, ['html']);
    gulp.watch([js, css, html], 'concatenateFiles');
});
