import React from 'react';
import PropTypes from 'prop-types';


const propTypes = {
	showZoom: PropTypes.bool.isRequired,

	// mouse position
	relX: PropTypes.number.isRequired,
	relY: PropTypes.number.isRequired,

	// image
	imgWidth: PropTypes.number.isRequired,

	// zoom image
	zoomImgSrc: PropTypes.string.isRequired,
	zoomImgWidth: PropTypes.number.isRequired,
	zoomImgHeight: PropTypes.number.isRequired,

	// magnifying glass
	factor: PropTypes.number.isRequired,
	round: PropTypes.bool.isRequired
};


export default function MagnifyingGlass(props) {
	const style = {
		transition: 'opacity 0.3s',
		position: 'absolute',
		zIndex: 1,
		width: props.zoomImgWidth,
		height: props.zoomImgHeight,
		left: `calc(${props.relX * 100}% - ${props.zoomImgWidth / 2}px)`,
		top: `calc(${props.relY * 100}% - ${props.zoomImgHeight / 2}px)`,
		backgroundImage: `url(${props.zoomImgSrc})`,
		backgroundPosition: `${props.relX * 100}% ${props.relY * 100}%`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: `${props.factor * props.imgWidth}%`,
		border: '2px solid #EBEBEB',
		borderRadius: props.round ? '50%' : '0',
		boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.3)',
		pointerEvents: 'none'
	};
	if (props.showZoom) {
		style.opacity = 1;
	}
	else {
		style.opacity = 0;
	}

	return (
		<div
			className="magnifying-glass"
			style={style}
		/>
	);
}


MagnifyingGlass.propTypes = propTypes;