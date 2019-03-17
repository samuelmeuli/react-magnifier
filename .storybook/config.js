import { addParameters, configure } from "@storybook/react";
import pkg from "../package";

// Hide add-on menu
addParameters({
	options: {
		brandTitle: pkg.name,
		brandUrl: pkg.homepage,
		showPanel: false,
		showSearchBox: false,
	},
});

function loadStories() {
	// Import all *.stories.js files
	const imports = require.context("../stories", true, /.stories.js$/);
	imports.keys().forEach(filename => imports(filename));
}

configure(loadStories, module);
