import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';

import Magnifier from '../lib/Magnifier';
import testImage from './test-image.jpg';
import testImageSmall from './test-image-small.jpg';


addDecorator(story => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'center',
			marginTop: 100
		}}
	>
		{story()}
	</div>
));

storiesOf('Magnifier', module)
	.add('Round', () => (
		<Magnifier
			imgSrc={testImage}
		/>
	))
	.add('Square', () => (
		<Magnifier
			imgSrc={testImage}
			mgShape="square"
		/>
	))
	.add('Different images', () => (
		<Magnifier
			imgSrc={testImageSmall}
			zoomImgSrc={testImage}
		/>
	));