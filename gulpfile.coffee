gulp = require('gulp')
coffee = require('gulp-coffee')
gutil = require('gutil')
watch = require('gulp-watch')
browserify = require('gulp-browserify')
rename = require('gulp-rename')
livereload = require('gulp-livereload')
exec = require('child_process').exec
plumber = require('gulp-plumber')

swallowError = (error) ->
  console.log("i help")
  console.log(error.toString())
  this.emit('end')

gulp.task 'default2', ->
  exec('static')
  gulp.src('./ca/**.js', {read: false})
  .pipe(watch('./ca/**.js'))
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .on('error', swallowError)
  .pipe(rename('script.bundle.js'))
  .pipe(gulp.dest('./'))
  .pipe(livereload())

  gulp.src('./script.coffee', {read: false})
  .pipe(watch('./script.coffee'))
  .pipe(coffee({bare: true}))
  .on('error', swallowError)
  .pipe(gulp.dest('./'))


gulp.task 'server', ->
  livereload.listen()
  exec('static')

gulp.task 'browserify', ->
  browserify('./script.js')
  .bundle()
  .pipe(source('script.bundle.js'))
  .pipe(gulp.dest('./'));


gulp.task 'watch', ->
  gulp.watch('./ca/*.js', ['browserify']);

gulp.task('default', ['watch', 'browserify', 'server']);

###
  gulp.src('./script.js', {read: false})
  .pipe(watch('./ca/*.js'))
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .on('error', swallowError)
  .pipe(rename('script.bundle.js'))
  .pipe(gulp.dest('../'))
  .pipe(livereload())
###