var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

 
gulp.task("dist-js",function(){
    gulp
        .src(['src/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest("dist"))
})


gulp.task("dist-other",function(){
    gulp
        .src(['src/*.css','src/*.json','src/*.html','src/*.png'])
        .pipe(gulp.dest("dist"))
})

gulp.task('dist',['dist-js','dist-other']);



