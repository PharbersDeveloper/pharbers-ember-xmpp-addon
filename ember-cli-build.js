'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
	let app = new EmberAddon(defaults, {
		// Add options here
	});
	//第三方静态文件导入

	return app.toTree();
};
