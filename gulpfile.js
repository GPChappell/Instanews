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
var babel = require('gulp-babel');

//Babel Task
var input = './js/*.js';
var output = './js/transpiled'

gulp.task('babel', function() {
  return gulp.src(input)
  .pipe(babel())
  .pipe(gulp.dest(output))
});

//Sass Task
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
  return gulp.src(['./js/transpiled/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
});

//Lint & Minify js files
gulp.task('minify-js', gulp.series('lint', function() {  
  return gulp.src('./js/transpiled/*.js')
    .pipe(uglify()) //call uglify function on files
    .pipe(rename({extname: '.min.js'})) //rename the uglified files
    .pipe( gulp.dest('./build/js')); //move processed files to build folder
}));

//Uglify CSS, JS files on change
gulp.task('watch', function() {
  gulp.watch('js/*.js', gulp.series('babel','minify-js'));
  gulp.watch('scss/*.scss', gulp.series('sass'));
});

// Browser sync, reload on HMTL, CSS, JS change
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