import { addDecorator, storiesOf } from "@storybook/react";
import React from "react";

import Magnifier from "../dist/Magnifier.es";
import BASE_64_IMG from "./test-image-base-64";
import testImageSmall from "./test-image-small.jpg";
import testImage from "./test-image.jpg";

const IMG_WIDTH = "50%";

addDecorator(story => (
	<div
		style={{
			display: "flex",
			justifyContent: "center",
			margin: "100px 0",
		}}
	>
		{story()}
	</div>
));

storiesOf("Magnifier", module)
	.add("Round", () => <Magnifier src={testImage} width={IMG_WIDTH} />)
	.add("Square", () => <Magnifier src={testImage} mgShape="square" width={IMG_WIDTH} />)
	.add("Hide overflow", () => (
		<Magnifier
			src={testImage}
			mgShowOverflow={false}
			mgTouchOffsetX={0}
			mgTouchOffsetY={0}
			width={IMG_WIDTH}
		/>
	))
	.add("Different images", () => (
		<Magnifier src={testImageSmall} zoomImgSrc={testImage} width={IMG_WIDTH} />
	))
	.add("Base64 image", () => <Magnifier src={BASE_64_IMG} width={IMG_WIDTH} />);
