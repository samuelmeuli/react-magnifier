import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';


export default {
	input: 'src/Magnifier',
	output: {
		file: 'lib/Magnifier.js',
		format: 'cjs'
	},
	external: ['react', 'prop-types', 'lodash.throttle'],
	plugins: [
		postcss(),
		babel({
			exclude: 'node_modules/**',
			plugins: ['external-helpers']
		})
	]
};