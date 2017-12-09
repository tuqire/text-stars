const gulp = require('gulp');
const image = require('gulp-imagemin');
const flatten = require('gulp-flatten');
const changed = require('gulp-changed');

const { src, dest } = require('../config');

gulp.task('build:images', () => {
  gulp.src(`${src}/images/**/*.{svg,png,jpg,jpeg,gif}`)
    .pipe(flatten())
    .pipe(changed(`./${dest}/images`))
    .pipe(image())
    .pipe(gulp.dest(`./${dest}/images`));
});

gulp.task('watch:images', () => {
	gulp.watch(`${src}/images/**/*.{svg,png,jpg,jpeg,gif}`, ['build:images']);
});
