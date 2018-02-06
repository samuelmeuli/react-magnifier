import React from 'react';
import { storiesOf } from '@storybook/react';

import ImageMagnifier from '../lib/ImageMagnifier';
import testImage from './test-image.jpg';
import './style.css';


storiesOf('Image Magnifier', module)
	.add('Round', () => (
		<div className="image-wrapper">
			<ImageMagnifier
				imgSrc={testImage}
			/>
		</div>
	))
	.add('Square', () => (
		<div className="image-wrapper">
			<ImageMagnifier
				imgSrc={testImage}
				round={false}
			/>
		</div>
	));