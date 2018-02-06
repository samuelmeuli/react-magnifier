import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MagnifyingGlass from './MagnifyingGlass';


const propTypes = {
	// image
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
	width: PropTypes.number,
	height: PropTypes.number,

	// zoom image
	zoomImgSrc: PropTypes.string,
	zoomFactor: PropTypes.number,

	// magnifying glass
	mgWidth: PropTypes.number,
	mgHeight: PropTypes.number,
	mgShape: PropTypes.string
};

const defaultProps = {
	// image
	width: 500,

	// zoom image
	zoomFactor: 1.5,

	// magnifying glass
	mgWidth: 150,
	mgHeight: 150,
	mgShape: 'circle'
};


export default class Magnifier extends Component {

	constructor(props) {
		super(props);

		if (!this.props.src) {
			throw Error('Missing src prop');
		}

		this.state = {
			showZoom: false,
			relX: 0, // horizontal mouse position relative to image
			relY: 0 // vertical mouse position relative to image
		};

		// function bindings
		this.onMove = this.onMove.bind(this);
		this.onLeave = this.onLeave.bind(this);
	}

	onMove(e) {
		e.preventDefault(); // disable scroll on touch

		// get mouse/touch position
		const imgBounds = e.target.getBoundingClientRect();
		const left = e.clientX || e.targetTouches[0].pageX;
		const top = e.clientY || e.targetTouches[0].pageY;

		this.setState({
			showZoom: true,
			relX: (left - imgBounds.left) / e.target.clientWidth,
			relY: (top - imgBounds.top) / e.target.clientHeight
		});
	}

	onLeave() {
		this.setState({
			showZoom: false
		});
	}

	render() {
		return (
			<div
				className="magnifier"
				style={{
					position: 'relative',
					display: 'inline-block'
				}}
			>
				<img
					src={this.props.src}
					alt={this.props.alt}
					width={this.props.width}
					height={this.props.height}
					onMouseMove={this.onMove}
					onMouseOut={this.onLeave}
					onTouchMove={this.onMove}
					onTouchEnd={this.onLeave}
					style={{ cursor: 'none' }}
				/>
				<MagnifyingGlass
					showZoom={this.state.showZoom}
					relX={this.state.relX}
					relY={this.state.relY}
					width={this.props.width}
					height={this.props.height}
					zoomImgSrc={this.props.zoomImgSrc || this.props.src}
					zoomFactor={this.props.zoomFactor}
					mgWidth={this.props.mgWidth}
					mgHeight={this.props.mgHeight}
					mgShape={this.props.mgShape}
				/>
			</div>
		);
	}
}


Magnifier.propTypes = propTypes;
Magnifier.defaultProps = defaultProps;