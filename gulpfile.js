var gulp = require('gulp'),
    sass = require('gulp-sass'),
    pleeease = require('gulp-pleeease'),
    uglify = require('gulp-uglify'),
    cleanCSS= require('gulp-clean-css'),
    concat = require('gulp-concat'),
    merge = require('merge-stream'),
    plumber = require('gulp-plumber'),
    webserver = require('gulp-webserver'),
    html5Lint = require('gulp-html5-lint');

var htmlFiles = [
        "index.html"
    ],

    scssFiles = [
        "scss/*.scss"
    ],

    cssFiles = [
        "css/*.css"
    ],

    jsLibFiles = [
        "node_modules/jquery/dist/jquery.min.js"
    ];

//------------------------------------------scss to css with bourbon

gulp.task('sass', function () {
    gulp.src(scssFiles)
        .pipe(plumber())
        .pipe(sass({ outputStyle: 'expanded' })
              .on('error', sass.logError))
        .pipe(pleeease({
            minifier: false,
            autoprefixer: { browsers: ['last 2 versions'] }
        }))
        .pipe(gulp.dest('css/'));
});

//------------------------------------------css minify

//gulp.task('css-minify', function () {
//    gulp.src(cssFiles)
//        .pipe(plumber())
//        .pipe(concat('application.css'))
//        .pipe( minifyCSS({ 'keepBreaks' : false }) )
//        .pipe(gulp.dest('public/stylesheets/'));
//});

//------------------------------------------js copy

gulp.task('js-copy', function () {
    gulp.src(jsLibFiles)
        .pipe(gulp.dest('js/lib/'));
});

//------------------------------------------icon copy

gulp.task('icon-copy', function () {
    gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('fonts/'));
});


//------------------------------------------js minify

//gulp.task('js-minify', function () {
//    merge(
//        gulp.src(jsFilesMin),
//        gulp.src(jsFiles)
//            .pipe(plumber())
////            .pipe( uglify({preserveComments: 'some'}) )
//    )
//    .pipe(concat('application.js'))
//    .pipe(gulp.dest('public/javascripts/'));
//});

//------------------------------------------run server
gulp.task('server', function() {
  gulp.src('./') //サイトのルートディレクトリ
    .pipe(webserver({
//      host: "192.168.1.10",
      livereload: true
    }));
});

//------------------------------------------all

gulp.task('all', function () {
//    gulp.start(['sass', 'css-minify', 'js-minify']);
    gulp.start(['sass']);
});


//------------------------------------------html5 lint

gulp.task('html5-lint', function() {
    return gulp.src(htmlFiles)
        .pipe(html5Lint());
});

//------------------------------------------watch

gulp.task('watch', ['sass'], function () {
    gulp.watch('scss/**/*.scss', ['sass']);
//    gulp.watch('app/assets/stylesheets/**/*.css', ['css-minify']);
//    gulp.watch('app/assets/javascripts/**/*.js', ['js-minify']);
});

//------------------------------------------init

gulp.task('init', ['js-copy', 'icon-copy', 'sass']);


//------------------------------------------default

gulp.task('default', ['watch', 'server']);
