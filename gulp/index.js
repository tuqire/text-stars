const gulp = require('gulp');

require('./server');
require('./js-tasks');
require('./hbs-tasks');
require('./image-tasks');
require('./sass-tasks');
require('./misc-tasks');

gulp.task('default', ['server']);
gulp.task('watch', ['watch:js', 'watch:hbs', 'watch:images', 'watch:sass', 'watch:misc']);
gulp.task('build', ['build:js', 'build:hbs', 'build:images', 'build:sass', 'build:misc']);
