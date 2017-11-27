var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var csslint = require('gulp-csslint');
var cssComb = require('gulp-csscomb');
var cleanCss = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyHtml = require('gulp-minify-html');
const babel = require('gulp-babel');


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
    gulp.src(['player.html/**/*.html'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(minifyHtml())
        .pipe(gulp.dest('./'))
});
gulp.task('default', function () {
    gulp.watch('src/scripts/**/*.js', ['js']);
    gulp.watch('src/styles/**/*.css', ['css']);
    gulp.watch('player.html/**/*.html', ['html']);
});
