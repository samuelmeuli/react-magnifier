import babel from 'rollup-plugin-babel';


export default {
	input: 'src/Magnifier',
	output: {
		file: 'lib/Magnifier.js',
		format: 'cjs'
	},
	external: ['react', 'prop-types'],
	plugins: [
		babel({
			exclude: 'node_modules/**',
			plugins: ['external-helpers']
		})
	]
};