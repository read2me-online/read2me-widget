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
const template = require('gulp-template');

var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var selfExecute = require('gulp-self-execute');

const process = require('process');
const fs = require('fs');
const version = fs.readFileSync('./VERSION', 'utf8');
const isDev = version.indexOf('-dev') !== -1;

const AWS_Credentials = {
    "key":    process.env.AWS_ACCESS_KEY_ID,
    "secret": process.env.AWS_SECRET_ACCESS_KEY
};
const AWS_Devel = {
    "bucket": "s3-sg.read2me.online",
    "region": "ap-southeast-1",
    "api_endpoint": 'https://api-dev.read2me.online/'
};
const AWS_Prod = {
    "bucket": "s3.read2me.online",
    "region": "eu-west-1",
    "api_endpoint": 'https://api.read2me.online/'
};

Object.assign(AWS_Devel, AWS_Credentials);
Object.assign(AWS_Prod, AWS_Credentials);

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

const apiEndpoint = () => global.publishIsRunning ? AWS_Prod.api_endpoint : AWS_Devel.api_endpoint;

const appendVersion = () => {
    fs.appendFileSync('./.published', version + "\n");
};

const isVersionPublished = () => fs.readFileSync('./.published', 'utf8').indexOf(version) !== -1;

gulp.task('config', function() {
    const config = {
        config: JSON.stringify({
            apiEndpoint: apiEndpoint()
        })
    };

    return gulp.src('config.tmpl.js')
        .pipe(template(config))
        .pipe(rename({
            basename: 'config',
            extname: '.js'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('publish', () => {
    global.publishIsRunning = true;

    runSequence(
        ['wipeDist'],
        ['config'],
        ['js', 'backendClassOnly', 'css', 'html'],
        ['concatenateFiles'],
        ['concatenateFilesMinified'],
        () => {
            if (isDev)
                throw new Error('VERSION is -dev, use publishDev for that, EXITING...');

            // unfortunately S3 doesn't support a IAM role or a bucket policy where
            // one can upload, but not overwrite a file, so we have to track published
            // versions in a local file
            if (isVersionPublished())
                throw new Error('This version has already been published, EXITING...');

            let upload = gulp.src(['./dist/read2me-backend.js', './dist/widget.min.html'])
                .pipe(s3(AWS_Prod, AWSOptions));

            appendVersion();

            return upload;
        });
});

gulp.task('publishDev', () => {
    return gulp.src(['./dist/read2me-backend.js', './dist/widget.min.html'])
        .pipe(s3(AWS_Devel, AWSOptionsDev));
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

gulp.task('js', function() {
    return gulpMerge(
        gulp.src('node_modules/bootstrap-slider/dist//bootstrap-slider.min.js'),
        browserify({entries: './src/js/app.js', debug: true})
            .transform("babelify", { presets: ["env"] })
            .bundle()
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(uglify())
    )
        .pipe(concat('app.min.js'))
        .pipe(selfExecute())
        .pipe(gulp.dest('dist/'))
});

gulp.task('backendClassOnly', function() {
    return gulp.src(['src/js/Read2MeBackendWrapper.js'])
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

        gulp.src('dist/app.min.js')
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

        gulp.src('dist/app.min.js')
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
        ['wipeDist'],
        ['config'],
        ['js', 'backendClassOnly', 'css', 'html'],
        ['concatenateFiles'],
        ['concatenateFilesMinified'],
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
