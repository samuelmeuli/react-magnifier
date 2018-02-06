import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MagnifyingGlass from './MagnifyingGlass';


const propTypes = {
	// image
	imgSrc: PropTypes.string.isRequired,
	imgAlt: PropTypes.string,
	imgWidth: PropTypes.number,
	imgHeight: PropTypes.number,

	// zoom image
	zoomImgSrc: PropTypes.string,
	zoomImgWidth: PropTypes.number,
	zoomImgHeight: PropTypes.number,

	// magnifying glass
	factor: PropTypes.number,
	round: PropTypes.bool
};

const defaultProps = {
	// image
	imgAlt: null,
	imgWidth: 500,
	imgHeight: null,

	// zoom image
	zoomImgSrc: null,
	zoomImgWidth: 150,
	zoomImgHeight: 150,

	// magnifying glass
	factor: 1.5,
	round: true
};


export default class ImageMagnifier extends Component {

	constructor(props) {
		super(props);

		if (!this.props.imgSrc) {
			throw Error('Missing imgSrc prop for ImageMagnifier');
		}

		this.state = {
			showZoom: false,
			relX: 0, // horizontal mouse position relative to image
			relY: 0 // vertical mouse position relative to image
		};

		// function bindings
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
	}

	onMouseMove(e) {
		const imgBounds = e.target.getBoundingClientRect();
		this.setState({
			showZoom: true,
			relX: (e.clientX - imgBounds.left) / e.target.clientWidth,
			relY: (e.clientY - imgBounds.top) / e.target.clientHeight
		});
	}

	onMouseOut() {
		this.setState({
			showZoom: false
		});
	}

	render() {
		return (
			<div
				className="image-magnifier-wrapper"
				style={{
					position: 'relative',
					display: 'inline-block'
				}}
			>
				<img
					src={this.props.imgSrc}
					alt={this.props.imgAlt}
					width={this.props.imgWidth}
					height={this.props.imgHeight}
					onMouseMove={this.onMouseMove}
					onMouseOut={this.onMouseOut}
					style={{ cursor: 'none' }}
				/>
				{
					this.state.showZoom &&
						<MagnifyingGlass
							relX={this.state.relX}
							relY={this.state.relY}
							imgWidth={this.props.imgWidth}
							zoomImgSrc={this.props.zoomImgSrc || this.props.imgSrc}
							zoomImgWidth={this.props.zoomImgWidth}
							zoomImgHeight={this.props.zoomImgHeight}
							factor={this.props.factor}
							round={this.props.round}
						/>
				}
			</div>
		);
	}
}


ImageMagnifier.propTypes = propTypes;
ImageMagnifier.defaultProps = defaultProps;