import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MagnifyingGlass from './MagnifyingGlass';


const propTypes = {
	// image
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,

	// zoom image
	zoomImgSrc: PropTypes.string,
	zoomFactor: PropTypes.number,

	// magnifying glass
	mgWidth: PropTypes.number,
	mgHeight: PropTypes.number,
	mgShape: PropTypes.string,
	mgMouseOffsetX: PropTypes.number,
	mgMouseOffsetY: PropTypes.number,
	mgTouchOffsetX: PropTypes.number,
	mgTouchOffsetY: PropTypes.number
};

const defaultProps = {
	// image
	width: '100%',
	height: 'auto',

	// zoom image
	zoomFactor: 1.5,

	// magnifying glass
	mgWidth: 150,
	mgHeight: 150,
	mgShape: 'circle',
	mgMouseOffsetX: 0,
	mgMouseOffsetY: 0,
	mgTouchOffsetX: -50,
	mgTouchOffsetY: -50
};


export default class Magnifier extends Component {

	constructor(props) {
		super(props);

		if (!this.props.src) {
			throw Error('Missing src prop');
		}

		this.state = {
			showZoom: false,
			absWidth: null,
			absHeight: null,
			relX: 0, // horizontal mouse position relative to image
			relY: 0, // vertical mouse position relative to image
			mgOffsetX: 0,
			mgOffsetY: 0
		};

		// function bindings
		this.onMove = this.onMove.bind(this);
		this.onLeave = this.onLeave.bind(this);
	}

	onMove(e) {
		e.preventDefault(); // disable scroll on touch

		// get mouse/touch position
		const imgBounds = e.target.getBoundingClientRect();
		let left;
		let top;
		let mgOffsetX;
		let mgOffsetY;
		if (e.targetTouches) {
			// touch input
			left = e.targetTouches[0].pageX;
			top = e.targetTouches[0].pageY;
			mgOffsetX = this.props.mgTouchOffsetX;
			mgOffsetY = this.props.mgTouchOffsetY;
		}
		else {
			// mouse input
			left = e.clientX;
			top = e.clientY;
			mgOffsetX = this.props.mgMouseOffsetX;
			mgOffsetY = this.props.mgMouseOffsetY;
		}

		this.setState({
			showZoom: true,
			relX: (left - imgBounds.left) / e.target.clientWidth,
			relY: (top - imgBounds.top) / e.target.clientHeight,
			mgOffsetX,
			mgOffsetY
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
					display: 'inline-block',
					width: this.props.width,
					height: this.props.height
				}}
			>
				<img
					className="magnifier-image"
					src={this.props.src}
					alt={this.props.alt}
					width="100%"
					height="100%"
					onMouseMove={this.onMove}
					onMouseOut={this.onLeave}
					onTouchMove={this.onMove}
					onTouchEnd={this.onLeave}
					style={{ cursor: 'none' }}
					onLoad={(e) => {
						this.setState({
							absWidth: e.target.width,
							absHeight: e.target.height
						});
					}}
				/>
				{
					// show magnifying glass once image has loaded and its absolute size has been determined
					this.state.absWidth &&
						<MagnifyingGlass
							showZoom={this.state.showZoom}
							absWidth={this.state.absWidth}
							absHeight={this.state.absHeight}
							relX={this.state.relX}
							relY={this.state.relY}
							zoomImgSrc={this.props.zoomImgSrc || this.props.src}
							zoomFactor={this.props.zoomFactor}
							mgWidth={this.props.mgWidth}
							mgHeight={this.props.mgHeight}
							mgShape={this.props.mgShape}
							mgOffsetX={this.state.mgOffsetX}
							mgOffsetY={this.state.mgOffsetY}
						/>
				}
			</div>
		);
	}
}


Magnifier.propTypes = propTypes;
Magnifier.defaultProps = defaultProps;