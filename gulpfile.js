var gulp = require('gulp'),
    gutil = require('gulp-util'),  //gulp �Դ����������ʱ�����ɫ������������ʶ���������� gulp-util ʵ��ͬ����Ч����
    combiner = require('stream-combiner2'), //���������Ϣ��
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

//���������Ϣ
var handleError = function(err){
    var colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log('fileName: ' + colors.red(err.fileName));
    gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + colors.yellow(err.plugin));
};

//���Ŀ¼
gulp.task('clean', function() {
    return del(['build/*'])
});

//����less
gulp.task('lesscss', function () {
    var combined = combiner.obj([
        gulp.src('src/less/**/*.less'),
        sourcemaps.init(),
        autoprefixer({
            browsers: 'last 2 versions'
        }),
        less(),
        minifycss(),
        sourcemaps.write('./'),   //sourceMappingURL:·��
        gulp.dest('src/css')
    ]);
    combined.on('error', handleError)
});

//ʵʱ����ejs�ļ�
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

//html�ᵽbuild
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

//ѹ��ͼƬ
gulp.task('imgmin', function (){
    var combined = combiner.obj([
        gulp.src('src/images/**/*'),
        imagemin({
            progressive: true, //����ѹ��jpgͼƬ
            interlaced: true, //����ɨ��gif������Ⱦ
            multipass: true
        }),
        gulp.dest('build/images')
    ]);
    combined.on('error', handleError)
});

//ѹ���ϲ�js
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

