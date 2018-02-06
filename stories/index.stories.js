import React from 'react';
import { storiesOf } from '@storybook/react';

import Magnifier from '../lib/Magnifier';
import testImage from './test-image.jpg';
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
				round={false}
			/>
		</div>
	));