const path = require('path');
var env_app = process.env.ENV_APP || 'exe';

module.exports = {
	basepath: (env_app == 'console') ? path.join(__dirname, '..', '..', '..') : path.join(__dirname, '..', '..', '..', '..', '..'), /* console : exe */
	toBase: function(dir) {
		return path.join(this.basepath, dir);
	}
}
