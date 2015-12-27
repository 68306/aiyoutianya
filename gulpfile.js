var gulp = require('gulp'),
    gutil = require('gulp-util'),  //gulp 自带的输出都带时间和颜色，这样很容易识别。我们利用 gulp-util 实现同样的效果。
    combiner = require('stream-combiner2'), //捕获错误信息。
    sourcemaps = require('gulp-sourcemaps'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    ejs = require("gulp-ejs"),
    cache = require('gulp-cache'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    requirejsOptimize = require('gulp-requirejs-optimize');

//捕获错误信息
var handleError = function(err){
    var colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log('fileName: ' + colors.red(err.fileName));
    gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + colors.yellow(err.plugin));
};

//清除目录
gulp.task('clean', function() {
    return del(['build/*'])
});

//编译less
gulp.task('lesscss', function () {
    var combined = combiner.obj([
        gulp.src('src/less/**/*.less'),
        sourcemaps.init(),
        autoprefixer({
            browsers: 'last 2 versions'
        }),
        less(),
        minifycss(),
        sourcemaps.write('./'),   //sourceMappingURL:路径
        gulp.dest('src/css')
    ]);
    combined.on('error', handleError)
});

//实时编译ejs文件
gulp.task('ejs', function() {
    var combined = combiner.obj([
        gulp.src('src/ejs/**/*.ejs'),
        ejs({
            ext: '.html'
        }),
        gulp.dest('src/html')
    ]);
    combined.on('error', handleError)
});

//html搬到build
gulp.task('copyfile', function() {
        gulp.src('src/html/*.html')
            .pipe(gulp.dest('build/html'))

        gulp.src('src/fonts/*')
            .pipe(gulp.dest('build/fonts'))

        gulp.src('src/css/**/*.css')
            .pipe(gulp.dest('build/css'))

        gulp.src('src/js/**/*.js')
            .pipe(gulp.dest('build/js'))
});

//压缩图片
gulp.task('imgmin', function (){
    var combined = combiner.obj([
        gulp.src('src/images/**/*'),
        imagemin({
            progressive: true, //无损压缩jpg图片
            interlaced: true, //隔行扫描gif进行渲染
            multipass: true
        }),
        gulp.dest('build/images')
    ]);
    combined.on('error', handleError)
});

//压缩合并js
gulp.task('jsmin', function () {
    var combined = combiner.obj([
        gulp.src('src/js/**/*.js'),
        jshint(),
        requirejsOptimize(),
        gulp.dest('build/js')
    ]);
    combined.on('error', handleError)
});

gulp.task('watch', function() {
    gulp.watch('src/less/**/*.less', ['lesscss']);
    gulp.watch('src/ejs/**/*.ejs', ['ejs']);
});

gulp.task('default', ['lesscss', 'ejs', 'watch']);
gulp.task('build', ['imgmin', 'copyfile']);

