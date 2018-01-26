var gulp = require('gulp');  //Load gulp first
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var prettyError = require('gulp-prettyerror');


//Gulp task for Sass
gulp.task('sass', function() {
  return gulp.src('./scss/style.scss')
  .pipe(sass())
  .pipe(prettyError())
  .pipe(
    autoprefixer({
      browsers: ['last 2 versions']
    })
  )
  .pipe(gulp.dest('./build/css'))
  .pipe(cssnano())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('./build/css'));
})

//Gulp Lint
gulp.task('lint', function() {
  return gulp.src(['./js/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
});



//Lint & Minify js files
gulp.task('minify-js', gulp.series('lint', function(e) {  
  return gulp.src('./js/*.js')
    .pipe(uglify()) //call uglify function on files
    .pipe(rename({extname: '.min.js'})) //rename the uglified files
    .pipe( gulp.dest('./build/js')); //move processed files to build folder
}));

// //Minify css files
// gulp.task('minify-css', function(e) {  
//   return gulp.src('./css/*.css')
//     .pipe(uglifycss()) //call uglify function on files
//     .pipe(rename({extname: '.min.css'})) //rename the uglified files
//     .pipe( gulp.dest('./build/css')); //move processed files to build folder
// });

//Uglify CSS, JS files on change
gulp.task('watch', function() {
  gulp.watch('js/*.js', gulp.series('minify-js'));
  gulp.watch('scss/*.scss', gulp.series('sass'));
});




// Browser sync, reload on html, css, js change
gulp.task('browser-sync', function() {

  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch(["*.html", "./scss/*.scss", "./build/js/*.js"]).on('change', browserSync.reload);
});



//DEFAULT
gulp.task('default', gulp.parallel('watch','browser-sync'));