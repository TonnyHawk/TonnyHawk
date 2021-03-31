let {gulp, src, dest, parallel, series, watch} = require('gulp'),
   sass = require('gulp-sass'),
   browserSync = require('browser-sync').create(),
   autoprefixer = require('gulp-autoprefixer'),
   gcmq = require('gulp-group-css-media-queries'),
   rename       = require('gulp-rename'),
   cleanCSS = require('gulp-clean-css'),
   include = require('gulp-file-include'), 
   sourcemaps = require('gulp-sourcemaps');

let projFold = './src';
let distFold = './dist';

let path = {
   src: {
      html: '/html/',
      scss: '/styles/',
      css: '/css/'
   },
   dist: {
      styles: '/css/'
   }
}

function startBrowser(){
   browserSync.init({
      server: {
         baseDir: projFold + '/'
      },
      notify: false
   });
}

function css(){
   return src(projFold + path.src.scss + 'main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(gcmq())
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(rename("styles.min.css"))
      .pipe(dest(projFold + path.src.css))
      .pipe(browserSync.stream())
}

function html(){
   return src(projFold + path.src.html + 'main.html')
      .pipe(include())
      .pipe(rename('index.html'))
      .pipe(dest(projFold + '/'))
}

function watcher(){
   watch(projFold + path.src.scss + '**/*.scss', css)
   watch(projFold + path.src.html + '*.html').on('change', series(html, browserSync.reload))
}

let develop = parallel(series(css, html, watcher), startBrowser)
let build = series(css)
let wStyles = series(watcher)

exports.default = develop;
exports.build = build;
exports.watch = wStyles;