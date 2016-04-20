'use strict';

module.exports = (gulp, plugins, config) => () => {
    return gulp.src(config.paths.data_files).pipe(gulp.dest(`${config.paths.release}/${config.output.win32}`));
};
