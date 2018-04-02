var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require("gulp-rename");
gulp.task('compress', function(cb) {
    pump([
            gulp.src('./src/*.js'),
            uglify(),
            rename(function(path) {
                path.basename += ".min"
            }),
            gulp.dest('dist')
        ],
        cb
    );
})
gulp.task('cssmin', function() {
    return gulp.src('./src/*.css')
        .pipe(csso())
        .pipe(rename(function(path) {
            path.basename += ".min"
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['compress', 'cssmin']);