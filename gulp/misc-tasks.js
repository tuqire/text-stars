const gulp = require('gulp');
const flatten = require('gulp-flatten');
const changed = require('gulp-changed');
const rename = require('gulp-rename');

const { src, dest } = require('../config');

function moveFiles(compress = false) {
	gulp.src([`${src}/misc/manifest/manifest.json`])
		.pipe(changed(`./${dest}`))
    .pipe(gulp.dest('dest'));

	gulp.src([`${src}/misc/htaccess/htaccess.txt`])
		.pipe(rename({ basename: '.htaccess', extname: '' }))
    .pipe(gulp.dest('dest'));
}

gulp.task('build:misc', () => {
	moveFiles(true);
});

gulp.task('dev:misc', () => {
	moveFiles();
});

gulp.task('watch:misc', () => {
	gulp.watch(`${src}/misc/**/*.**`, ['dev:misc']);
});
