import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';

import Magnifier from '../lib/Magnifier.es';
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
			src={testImage}
			width="50%"
		/>
	))
	.add('Square', () => (
		<Magnifier
			src={testImage}
			mgShape="square"
			width="50%"
		/>
	))
	.add('Different images', () => (
		<Magnifier
			src={testImageSmall}
			zoomImgSrc={testImage}
			width="50%"
		/>
	));
