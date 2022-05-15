module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{css,html,png,jpg,js,json,md}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};