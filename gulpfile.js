'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const config = require('./gulp/configs/main.config');
const register = require(`./gulp/utils/register`);

register(gulp, plugins, config)([
    'compile',
    'copy',
]);

gulp.task('build',  gulp.series('compile', 'copy'));
gulp.task('default',  gulp.parallel('copy'));
