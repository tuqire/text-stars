const gulp = require('gulp');

require('./server');
require('./js-tasks');
require('./hbs-tasks');
require('./image-tasks');

gulp.task('default', ['server']);
gulp.task('watch', ['watch:js', 'watch:hbs', 'watch:images']);
gulp.task('build', ['build:js', 'build:hbs', 'build:images']);
