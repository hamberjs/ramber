module.exports = {
	root: true,
	extends: '@hamberjs',
	plugins: ['import'],
	settings: {
		'import/resolver': {
			typescript: {} // this loads <rootdir>/tsconfig.json to eslint
		}
	}
};
