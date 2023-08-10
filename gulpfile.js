const { dest, src, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync');
const scss = require('gulp-sass')(require('sass'));
const useref = require('gulp-useref');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');
const cacheBust = require('gulp-cache-bust');
const includeFile = require('gulp-file-include');
const rev = require('gulp-rev');

const templateFiles = 'app/_templates/**';

function initBrowserSync() {
    browserSync.init({
        server: './dist',
    });
}

function processHTMLfiles() {
    return src('app/**/*.html', { ignore: templateFiles })
        .pipe(includeFile({ prefix: '@@' }))
        .pipe(useref())
        .pipe(dest('dist'));
}

function prodProcessHTMLFiles() {
    return src('app/**/*.html', { ignore: templateFiles })
        .pipe(includeFile({ prefix: '@@' }))
        .pipe(useref())
        .pipe(gulpif('*.{js,css}', rev()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(dest('dist'));
}

function processAssets() {
    return src('app/assets/**/*').pipe(dest('dist/assets'));
}

function processFonts() {
    return src('app/fonts/**/*').pipe(dest('dist/fonts'));
}

function processSCSSFiles() {
    return src('app/styles/**/*.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(dest('app/css'));
}

function processJsFiles() {
    return src('app/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(dest('app/packages'));
}

function bustCache() {
    return src('dist/**/*.html')
        .pipe(clean())
        .pipe(cacheBust())
        .pipe(dest('dist'));
}

function watchForChanges() {
    watch('app/**/*.html', processHTMLfiles).on('change', function () {
        browserSync.reload();
    });
    watch('app/styles/**/*.scss', processSCSSFiles);
    watch(['app/css/**/*.css', 'app/packages/**/*.js'], processHTMLfiles).on(
        'change',
        function () {
            browserSync.reload();
        }
    );
    watch('app/js/**/*.js', processJsFiles);
    watch('app/assets/**/*', processAssets);
    watch('app/fonts/**/*', processFonts);
    watch([templateFiles], processHTMLfiles).on('change', function () {
        browserSync.reload();
    });
}

exports.default = series(
    processJsFiles,
    processSCSSFiles,
    processHTMLfiles,
    processAssets,
    processFonts,
    parallel(watchForChanges, initBrowserSync)
);

exports.build = series(
    processJsFiles,
    processSCSSFiles,
    prodProcessHTMLFiles,
    processAssets,
    processFonts,
    bustCache
);
