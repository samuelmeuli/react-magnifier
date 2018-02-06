import React from 'react';
import { storiesOf } from '@storybook/react';

import Magnifier from '../lib/Magnifier';
import testImage from './test-image.jpg';
import testImageSmall from './test-image-small.jpg';
import './style.css';


storiesOf('Magnifier', module)
	.add('Round', () => (
		<div className="image-wrapper">
			<Magnifier
				imgSrc={testImage}
			/>
		</div>
	))
	.add('Square', () => (
		<div className="image-wrapper">
			<Magnifier
				imgSrc={testImage}
				mgShape="square"
			/>
		</div>
	))
	.add('Different images', () => (
		<div className="image-wrapper">
			<Magnifier
				imgSrc={testImageSmall}
				zoomImgSrc={testImage}
			/>
		</div>
	));