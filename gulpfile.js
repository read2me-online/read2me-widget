const gulp = require('gulp');
const plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var csslint = require('gulp-csslint');
var cssComb = require('gulp-csscomb');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyHtml = require('gulp-minify-html');
const babel = require('gulp-babel');
const inject = require('gulp-inject-string');
const gulpMerge = require('gulp-merge');
const del = require('del');
const runSequence = require('gulp-sequence');
const s3 = require('gulp-s3');

const process = require('process');
const fs = require('fs');
const version = fs.readFileSync('./VERSION', 'utf8');
const isDev = version.indexOf('-dev') !== -1;

const AWS = {
    "key":    process.env.AWS_ACCESS_KEY_ID,
    "secret": process.env.AWS_SECRET_ACCESS_KEY,
    "bucket": "s3.read2me.online",
    "region": "eu-west-1"
};
const AWSOptions = {
    uploadPath: 'api/widget/' + version + '/',
    failOnError: true,
    headers: {
        'Cache-Control': 'max-age=63072000, public'
    }
};
const AWSOptionsDev = {
    uploadPath: 'api/widget/dev/',
    failOnError: true,
    headers: {
        'Cache-Control': 'max-age=0'
    }
};

const appendVersion = () => {
    fs.appendFileSync('./.published', version + "\n");
};

const isVersionPublished = () => {
    return fs.readFileSync('./.published', 'utf8').indexOf(version) !== -1;
};

gulp.task('publish', () => {
    if (isDev) {
        const error = new Error('VERSION is -dev, use publishDev for that, EXITING...');
        console.error(error);

        return error;
    }

    // unfortunately S3 doesn't support a IAM role or a bucket policy where
    // one can upload, but not overwrite a file, so we have to track published
    // versions in a local file
    if (isVersionPublished()) {
        const error = new Error('This version has already been published, EXITING...');
        console.error(error);

        return error;
    }

    let upload = gulp.src(['./dist/read2me-backend.js', './dist/widget.min.html'])
        .pipe(s3(AWS, AWSOptions));

    appendVersion();

    return upload;
});

gulp.task('publishDev', () => {
    return gulp.src(['./dist/read2me-backend.js', './dist/widget.min.html'])
        .pipe(s3(AWS, AWSOptionsDev));
});

gulp.task('wipeDist', function () {
    return del([
        'dist/**/*',
    ]);
});

gulp.task('css', function () {
    return gulp.src(['src/**/*.css'])
        .pipe(plumber())
        .pipe(cssComb())
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
    return gulp.src(['src/js/**/*.js'])
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
        .pipe(gulp.dest('dist/'));
});

gulp.task('js-backend-class-only', function() {
    return gulp.src(['src/js/Read2MeBackend.js'])
        .pipe(concat('read2me-backend.js'))
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
    return gulp.src(['src/html/**/*.html'])
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

gulp.task('_sequence', () => {
    runSequence(
        ['js', 'js-backend-class-only', 'css', 'html'],
        ['concatenateFiles', 'concatenateFilesMinified'],
        ['publishDev'],
        () => {});
});

gulp.task('default', () => {
    runSequence(['_sequence'], () => {
        gulp.watch(js, ['_sequence']);
        gulp.watch(css, ['_sequence']);
        gulp.watch(html, ['_sequence']);
    });
});
