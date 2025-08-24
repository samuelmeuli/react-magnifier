import Magnifier from "../../dist/Magnifier.es";
import BASE_64_IMG from "./assets/test-image-base-64";
import testImageSmall from './assets/test-image-small.jpg'
import testImage from './assets/test-image.jpg'

const IMG_WIDTH = '50%';

export default {
  title: 'Magnifier',
  component: Magnifier,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
};


export const Round = {
    args: {
        src: testImage,
        width: IMG_WIDTH
    }
};

export const Square = {
    args: {
        src: testImage,
        width: IMG_WIDTH,
        mgShape: 'square'
    }
};

export const HideOverflow = {
    args: {
        src: testImage,
        mgShowOverflow: false,
        mgTouchOffsetX: 0,
        mgTouchOffsetY: 0,
        width: IMG_WIDTH,
    }
};

export const DifferentImages = {
    args: {
        src: testImageSmall, 
        zoomImgSrc: testImage, 
        width: IMG_WIDTH,
    }
};

export const Base64Image = {
    args: {
        src: BASE_64_IMG,
        width: IMG_WIDTH,
    }
};