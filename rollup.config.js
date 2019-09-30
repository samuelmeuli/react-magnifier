import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
	input: "./src/Magnifier.tsx",
	output: [
		{
			file: pkg.main,
			format: "cjs",
		},
		{
			file: pkg.module,
			format: "es",
		},
	],
	external: ["react", "lodash.debounce", "lodash.throttle"],
	plugins: [postcss(), typescript()],
};
