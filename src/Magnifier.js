import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

import './style.scss';


const propTypes = {
	// Image
	src: PropTypes.string.isRequired,
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

	// Zoom image
	zoomImgSrc: PropTypes.string,
	zoomFactor: PropTypes.number,

	// Magnifying glass
	mgWidth: PropTypes.number,
	mgHeight: PropTypes.number,
	mgBorderWidth: PropTypes.number,
	mgShape: PropTypes.oneOf(['circle', 'square']),
	mgShowOverflow: PropTypes.bool,
	mgMouseOffsetX: PropTypes.number,
	mgMouseOffsetY: PropTypes.number,
	mgTouchOffsetX: PropTypes.number,
	mgTouchOffsetY: PropTypes.number,
};

const defaultProps = {
	// Image
	width: '100%',
	height: 'auto',

	// Zoom image
	zoomImgSrc: null,
	zoomFactor: 1.5,

	// Magnifying glass
	mgWidth: 150,
	mgHeight: 150,
	mgBorderWidth: 2,
	mgShape: 'circle',
	mgShowOverflow: true,
	mgMouseOffsetX: 0,
	mgMouseOffsetY: 0,
	mgTouchOffsetX: -50,
	mgTouchOffsetY: -50,
};

export default class Magnifier extends PureComponent {
	static enforceRelative(number) {
		// Make sure the provided relative number lies between 0 and 1
		if (number < 0) {
			return 0;
		}
		if (number > 1) {
			return 1;
		}
		return number;
	}

	constructor(props) {
		super(props);
		if (!props.src) {
			throw Error('Missing src prop');
		}

		this.state = {
			showZoom: false,

			// Magnifying glass offset
			mgOffsetX: 0,
			mgOffsetY: 0,

			// Mouse position relative to image
			relX: 0,
			relY: 0,
		};

		// Function bindings
		this.onMouseMove = throttle(this.onMouseMove.bind(this), 20, { trailing: false });
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onTouchMove = throttle(this.onTouchMove.bind(this), 20, { trailing: false });
		this.onTouchEnd = this.onTouchEnd.bind(this);
		this.calcImgBounds = this.calcImgBounds.bind(this);
		this.calcImgBoundsDebounced = debounce(this.calcImgBounds, 200);
	}

	componentDidMount() {
		// Add non-passive event listeners to image img (assigned in render function)
		this.img.addEventListener('mousemove', this.onMouseMove, { passive: false });
		this.img.addEventListener('mouseout', this.onMouseOut, { passive: false });
		this.img.addEventListener('touchstart', this.onTouchStart, { passive: false });
		this.img.addEventListener('touchmove', this.onTouchMove, { passive: false });
		this.img.addEventListener('touchend', this.onTouchEnd, { passive: false });

		// Re-calculate image bounds on resize and scroll
		window.addEventListener('resize', this.calcImgBoundsDebounced);
		window.addEventListener('scroll', this.calcImgBoundsDebounced);
	}

	componentWillUnmount() {
		// Remove all event listeners
		this.img.removeEventListener('mousemove', this.onMouseMove);
		this.img.removeEventListener('mouseout', this.onMouseMove);
		this.img.removeEventListener('touchstart', this.onMouseMove);
		this.img.removeEventListener('touchmove', this.onMouseMove);
		this.img.removeEventListener('touchend', this.onMouseMove);
		window.removeEventListener('resize', this.calcImgBoundsDebounced);
		window.removeEventListener('scroll', this.calcImgBoundsDebounced);
	}

	onMouseMove(e) {
		const { mgMouseOffsetX, mgMouseOffsetY } = this.props;

		if (this.imgBounds) {
			const relX = (e.clientX - this.imgBounds.left) / e.target.clientWidth;
			const relY = (e.clientY - this.imgBounds.top) / e.target.clientHeight;

			this.setState({
				showZoom: true,
				relX: Magnifier.enforceRelative(relX),
				relY: Magnifier.enforceRelative(relY),
				mgOffsetX: mgMouseOffsetX,
				mgOffsetY: mgMouseOffsetY,
			});
		}
	}

	onTouchStart(e) { // eslint-disable-line class-methods-use-this
		e.preventDefault(); // Prevent mouse event from being fired
	}

	onTouchMove(e) {
		e.preventDefault(); // Disable scroll on touch

		if (this.imgBounds) {
			const { mgTouchOffsetX, mgTouchOffsetY } = this.props;
			const relX = (e.targetTouches[0].clientX - this.imgBounds.left) / e.target.clientWidth;
			const relY = (e.targetTouches[0].clientY - this.imgBounds.top) / e.target.clientHeight;

			// Only show magnifying glass if touch is inside image
			if (relX >= 0 && relY >= 0 && relX <= 1 && relY <= 1) {
				this.setState({
					showZoom: true,
					relX: Magnifier.enforceRelative(relX),
					relY: Magnifier.enforceRelative(relY),
					mgOffsetX: mgTouchOffsetX,
					mgOffsetY: mgTouchOffsetY,
				});
			} else {
				this.setState({
					showZoom: false,
				});
			}
		}
	}

	onMouseOut() {
		this.setState({
			showZoom: false,
		});
	}

	onTouchEnd() {
		this.setState({
			showZoom: false,
		});
	}

	calcImgBounds() {
		this.imgBounds = this.img.getBoundingClientRect();
	}

	render() {
		const {
			src,
			width,
			height,
			zoomImgSrc,
			zoomFactor,
			mgHeight,
			mgWidth,
			mgBorderWidth,
			mgMouseOffsetX,
			mgMouseOffsetY,
			mgTouchOffsetX,
			mgTouchOffsetY,
			mgShape,
			mgShowOverflow,
			...otherProps
		} = this.props;
		const { mgOffsetX, mgOffsetY, relX, relY, showZoom } = this.state;

		// Show/hide magnifying glass (opacity needed for transition)
		let mgClasses = 'magnifying-glass';
		if (showZoom) {
			mgClasses += ' visible';
		}
		if (mgShape === 'circle') {
			mgClasses += ' circle';
		}

		return (
			<div
				className="magnifier"
				style={{
					width,
					height,
					overflow: mgShowOverflow ? 'visible' : 'hidden',
				}}
			>
				<img // eslint-disable-line jsx-a11y/alt-text
					className="magnifier-image"
					src={src}
					width="100%"
					height="100%"
					{...otherProps}
					onLoad={() => {
						this.calcImgBounds();
					}}
					ref={(e) => {
						this.img = e;
					}}
				/>
				{
					this.imgBounds
						&& (
							<div
								className={mgClasses}
								style={{
									width: mgWidth,
									height: mgHeight,
									left: `calc(${relX * 100}% - ${mgWidth / 2}px + ${mgOffsetX}px - ${mgBorderWidth}px)`,
									top: `calc(${relY * 100}% - ${mgHeight / 2}px + ${mgOffsetY}px - ${mgBorderWidth}px)`,
									backgroundImage: `url(${zoomImgSrc || src})`,
									backgroundPosition: `calc(${relX * 100}% + ${mgWidth / 2}px - ${relX * mgWidth}px) calc(${relY * 100}% + ${mgHeight / 2}px - ${relY * mgWidth}px)`,
									backgroundSize: `${zoomFactor * this.imgBounds.width}% ${zoomFactor * this.imgBounds.height}%`,
									borderWidth: mgBorderWidth,
								}}
							/>
						)
				}
			</div>
		);
	}
}

Magnifier.propTypes = propTypes;
Magnifier.defaultProps = defaultProps;
