var gulp  = require('gulp'),
    $     = require('gulp-load-plugins')(),
    browserSync = require('browser-sync');


var paths = {
  html: './src/layouts/*jade',
  htmlOut: 'dist',
  css: './src/files/stylesheets/*.scss',
  cssOut: './dist/stylesheets',
  js: './src/files/scripts/*.js',
  jsOut: './dist/scripts',
  images: './src/files/images/*',
  imagesOut: './dist/images'
}

/* Task build sass to css */
gulp.task('sass', function () {
  gulp.src(paths.css)
    .pipe($.sass())
    .pipe(gulp.dest(paths.cssOut))
    .pipe(browserSync.reload({ stream: true }));
});

/* Task imagemin */
gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(paths.imagesOut))
    .pipe(browserSync.reload({ stream: true }));
});

/* Task buil compass */
gulp.task('compass', function() {
  gulp.src(paths.css)
    .pipe($.compass({
      style: 'nested',
      config_file: './config.rb',
      css: paths.cssOut,
      sass: './src/files/stylesheets',
      image: paths.images
    }))
    .pipe(gulp.dest(paths.cssOut))
    .pipe(browserSync.reload({ stream: true }));
});

/* Task bui jade to html */
gulp.task('templates', function() {
  return gulp.src(paths.html)
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.htmlOut))
    .pipe(browserSync.reload({ stream: true }));
});

/* Task buil script */
gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe($.uglify())
    .pipe(gulp.dest(paths.jsOut));
});

// Serve files from the dist directory
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './dist'
    }
  });
});

/* Run task when change files */
gulp.task('serve', ['compass', 'templates', 'js', 'images'], function () {
  browserSync.init({
    server: './dist'
  });

  gulp.watch('src/files/stylesheets/**/*.{scss,sass}', ['compass', browserSync.reload]);
  gulp.watch(paths.html, ['templates', browserSync.reload]);
  gulp.watch(paths.js, ['js', browserSync.reload]);
  gulp.watch(paths.images, ['images', browserSync.reload]);
});

/* HTML min */
gulp.task('htmlmin', function() {
  return gulp.src('./dist/*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./app'));
});

/* CSS min */
gulp.task('cssmin', function () {
  return gulp.src('./dist/stylesheets/*.css')
    .pipe($.concat('main.css'))
    .pipe($.cssmin())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('./app/stylesheets'));
});

/* Script min */
gulp.task('jsmin', function () {
  return gulp.src('./dist/scripts/*.js')
    .pipe($.concat('main.js'))
    .pipe($.jsmin())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('./app/scripts'));
});

/* Images min */
gulp.task('imagemin', function () {
  return gulp.src('./dist/images/*')
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./app/images'))
});

/* Buil task min */
gulp.task('build', ['cssmin', 'htmlmin', 'jsmin', 'imagemin'], function() {
  browserSync.init({
    server: './app'
  });
});

gulp.task('default', ['serve']);
