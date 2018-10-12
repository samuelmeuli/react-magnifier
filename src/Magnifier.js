import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

import './style.scss';


const propTypes = {
	// image
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

	// zoom image
	zoomImgSrc: PropTypes.string,
	zoomFactor: PropTypes.number,

	// magnifying glass
	mgWidth: PropTypes.number,
	mgHeight: PropTypes.number,
	mgShape: PropTypes.oneOf(['circle', 'square']),
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

			// absoulte image size
			absWidth: null,
			absHeight: null,

			// magnifying glass offset
			mgOffsetX: 0,
			mgOffsetY: 0,

			// mouse position relative to image
			relX: 0,
			relY: 0
		};

		// function bindings
		this.onMouseMove = throttle(this.onMouseMove.bind(this), 20, { trailing: false });
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onTouchMove = throttle(this.onTouchMove.bind(this), 20, { trailing: false });
		this.onTouchEnd = this.onTouchEnd.bind(this);
	}

	componentDidMount() {
		// Add non-passive event listeners to 'nv' element (assigned in render function)
		this.element.addEventListener('mousemove', this.onMouseMove, { passive: false });
		this.element.addEventListener('mouseout', this.onMouseOut, { passive: false });
		this.element.addEventListener('touchstart', this.onTouchStart, { passive: false });
		this.element.addEventListener('touchmove', this.onTouchMove, { passive: false });
		this.element.addEventListener('touchend', this.onTouchEnd, { passive: false });
	}

	componentWillUnmount() {
		// Remove all event listeners
		this.element.removeEventListener('mousemove', this.onMouseMove);
		this.element.removeEventListener('mouseout', this.onMouseMove);
		this.element.removeEventListener('touchstart', this.onMouseMove);
		this.element.removeEventListener('touchmove', this.onMouseMove);
		this.element.removeEventListener('touchend', this.onMouseMove);
	}

	onMouseMove(e) {
		const imgBounds = e.target.getBoundingClientRect();
		this.setState({
			showZoom: true,
			relX: (e.clientX - imgBounds.left) / e.target.clientWidth,
			relY: (e.clientY - imgBounds.top) / e.target.clientHeight,
			mgOffsetX: this.props.mgMouseOffsetX,
			mgOffsetY: this.props.mgMouseOffsetY
		});
	}

	onTouchStart(e) {
		e.preventDefault(); // prevent mouse event from being fired
	}

	onTouchMove(e) {
		e.preventDefault(); // disable scroll on touch
		const imgBounds = e.target.getBoundingClientRect();
		const relX = (e.targetTouches[0].clientX - imgBounds.left) / e.target.clientWidth;
		const relY = (e.targetTouches[0].clientY - imgBounds.top) / e.target.clientHeight;

		// only show magnifying glass if touch is inside image
		if (relX >= 0 && relY >= 0 && relX <= 1 && relY <= 1) {
			this.setState({
				showZoom: true,
				relX,
				relY,
				mgOffsetX: this.props.mgTouchOffsetX,
				mgOffsetY: this.props.mgTouchOffsetY
			});
		}
		else {
			this.setState({
				showZoom: false
			});
		}
	}

	onMouseOut() {
		this.setState({
			showZoom: false
		});
	}

	onTouchEnd() {
		this.setState({
			showZoom: false
		});
	}

	render() {
		// show/hide magnifying glass (opacity needed for transition)
		let mgClasses = 'magnifying-glass';
		if (this.state.showZoom) {
			mgClasses += ' visible';
		}
		if (this.props.mgShape === 'circle') {
			mgClasses += ' circle';
		}

		return (
			<div
				className="magnifier"
				style={{
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
					onLoad={(e) => {
						this.setState({
							absWidth: e.target.width,
							absHeight: e.target.height
						});
					}}
					ref={(e) => {
						this.element = e;
					}}
				/>
				<div
					className={mgClasses}
					style={{
						width: this.props.mgWidth,
						height: this.props.mgHeight,
						left: `calc(${this.state.relX * 100}% - ${this.props.mgWidth / 2}px + ${this.state.mgOffsetX}px)`,
						top: `calc(${this.state.relY * 100}% - ${this.props.mgHeight / 2}px + ${this.state.mgOffsetY}px)`,
						backgroundImage: `url(${this.props.zoomImgSrc || this.props.src})`,
						backgroundPosition: `${this.state.relX * 100}% ${this.state.relY * 100}%`,
						backgroundSize: `${this.props.zoomFactor * this.state.absWidth}% ${this.props.zoomFactor * this.state.absHeight}%`
					}}
				/>
			</div>
		);
	}
}


Magnifier.propTypes = propTypes;
Magnifier.defaultProps = defaultProps;