import React from 'react';
import { storiesOf } from '@storybook/react';

import ImageMagnifier from '../lib/ImageMagnifier';


storiesOf('Button', module)
	.add('Image Magnifier', () => (
		<ImageMagnifier />
	));