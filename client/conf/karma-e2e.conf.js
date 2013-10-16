module.exports = function(config) {
	config.set({
		frameworks: ['ng-scenario'],
		files: [
		'../tests/e2e/scenarios.js'
		],
		urlRoot: '/__karma/',
		autoWatch: true,
		proxies: {
			'/': 'http://localhost:8080/'
		},
		browsers: ['Chrome'],
		reporters: ['dots'],
		plugins: [
			'karma-ng-scenario',
			'karma-chrome-launcher',
			'karma-firefox-launcher'
		]
	});
};


