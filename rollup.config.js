import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";

import pkg from "./package.json";

export default {
	input: "src/Magnifier",
	output: [
		{
			file: pkg.main,
			format: "cjs",
			sourcemap: true,
		},
		{
			file: pkg.module,
			format: "es",
			sourcemap: true,
		},
	],
	external: ["react", "prop-types", "lodash.debounce", "lodash.throttle"],
	plugins: [
		postcss(),
		babel({
			exclude: "node_modules/**",
		}),
	],
};
