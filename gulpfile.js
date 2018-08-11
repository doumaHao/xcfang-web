var gulp = require('gulp');
// html复用 npm install gulp-file-include
var fileinclude = require('gulp-file-include');

// 初始化任务
gulp.task('default', ['fileMove', 'fileinclude'], function () {
    console.log('gulp启动成功');
    gulp.watch('src/**/*.*', ['fileMove', 'fileinclude']);
});

// plugins、images、 fonts移动
gulp.task('fileMove', function () {
    // assets 移动
    gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('./dist/assets'));
    // font 移动
    gulp.src('src/font/**/*.*')
        .pipe(gulp.dest('./dist/font'));
    // image 移动
    gulp.src('src/image/**/*.*')
        .pipe(gulp.dest('./dist/image'));

    // TODO 后期有可能压缩
    gulp.src('src/html/**/*.*')
        .pipe(gulp.dest('./dist/html'));
    gulp.src('src/css/**/*.*')
        .pipe(gulp.dest('./dist/css'));
    gulp.src('src/js/**/*.*')
        .pipe(gulp.dest('./dist/js'));
});
// 文件复用
gulp.task('fileinclude', function () {
    // 文件复用
    gulp.src('./src/html/**/*.html')
        .pipe(fileinclude())
        .pipe(gulp.dest('./dist/html'));
});

