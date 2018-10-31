/* eslint import/no-extraneous-dependencies: 0 */

import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';

import Magnifier from '../lib/Magnifier.es';
import testImage from './test-image.jpg';
import testImageSmall from './test-image-small.jpg';

const IMG_WIDTH = '50%';


addDecorator(story => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'center',
			marginTop: 100,
		}}
	>
		{story()}
	</div>
));

storiesOf('Magnifier', module)
	.add('Round', () => (
		<Magnifier
			src={testImage}
			width={IMG_WIDTH}
		/>
	))
	.add('Square', () => (
		<Magnifier
			src={testImage}
			mgShape="square"
			width={IMG_WIDTH}
		/>
	))
	.add('Hide overflow', () => (
		<Magnifier
			src={testImage}
			mgShowOverflow={false}
			mgTouchOffsetX={0}
			mgTouchOffsetY={0}
			width={IMG_WIDTH}
		/>
	))
	.add('Different images', () => (
		<Magnifier
			src={testImageSmall}
			zoomImgSrc={testImage}
			width={IMG_WIDTH}
		/>
	));
