import "./style.scss";

import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import React, { PureComponent } from "react";

type mgShape = "circle" | "square";

interface Props {
	// Image
	src: string;
	width: string | number;
	height: string | number;
	className: string;

	// Zoom image
	zoomImgSrc: string;
	zoomFactor: number;

	// Magnifying glass
	mgWidth: number;
	mgHeight: number;
	mgBorderWidth: number;
	mgShape: mgShape;
	mgShowOverflow: boolean;
	mgMouseOffsetX: number;
	mgMouseOffsetY: number;
	mgTouchOffsetX: number;
	mgTouchOffsetY: number;
	active:boolean;
}

interface State {
	showZoom: boolean;

	// Magnifying glass offset
	mgOffsetX: number;
	mgOffsetY: number;

	// Mouse position relative to image
	relX: number;
	relY: number;
}

export default class Magnifier extends PureComponent<Props, State> {
	img: HTMLElement;

	imgBounds: DOMRect | ClientRect;

	calcImgBoundsDebounced: () => void;

	static defaultProps = {
		// Image
		width: "100%",
		height: "auto",
		className: "",

		// Zoom image
		zoomImgSrc: "",
		zoomFactor: 1.5,

		// Magnifying glass
		mgWidth: 150,
		mgHeight: 150,
		mgBorderWidth: 2,
		mgShape: "circle",
		mgShowOverflow: true,
		mgMouseOffsetX: 0,
		mgMouseOffsetY: 0,
		mgTouchOffsetX: -50,
		mgTouchOffsetY: -50,
	};

	state: Readonly<State> = {
		showZoom: false,
		mgOffsetX: 0,
		mgOffsetY: 0,
		relX: 0,
		relY: 0,
	};

	constructor(props: Props) {
		super(props);

		this.onMouseMove = throttle(this.onMouseMove.bind(this), 20, {
			trailing: false,
		});
		this.onTouchMove = throttle(this.onTouchMove.bind(this), 20, {
			trailing: false,
		});
		this.calcImgBoundsDebounced = debounce(this.calcImgBounds, 200);
	}

	componentDidMount = (): void => {
		// Add mouse/touch event listeners to image element (assigned in render function)
		// `passive: false` prevents scrolling on touch move
		this.img.addEventListener("mouseenter", this.onMouseEnter, { passive: false });
		this.img.addEventListener("mousemove", this.onMouseMove, { passive: false });
		this.img.addEventListener("mouseout", this.onMouseOut, { passive: false });
		this.img.addEventListener("touchstart", this.onTouchStart, { passive: false });
		this.img.addEventListener("touchmove", this.onTouchMove, { passive: false });
		this.img.addEventListener("touchend", this.onTouchEnd, { passive: false });

		// Re-calculate image bounds on window resize
		window.addEventListener("resize", this.calcImgBoundsDebounced);
		// Re-calculate image bounds on scroll (useCapture: catch scroll events in entire DOM)
		window.addEventListener("scroll", this.calcImgBoundsDebounced, true);
	};

	componentWillUnmount = (): void => {
		// Remove all event listeners
		this.img.removeEventListener("mouseenter", this.onMouseEnter);
		this.img.removeEventListener("mousemove", this.onMouseMove);
		this.img.removeEventListener("mouseout", this.onMouseOut);
		this.img.removeEventListener("touchstart", this.onTouchStart);
		this.img.removeEventListener("touchmove", this.onTouchMove);
		this.img.removeEventListener("touchend", this.onTouchEnd);
		window.removeEventListener("resize", this.calcImgBoundsDebounced);
		window.removeEventListener("scroll", this.calcImgBoundsDebounced, true);
	};

	onMouseEnter = (): void => {
		this.calcImgBounds();
	};

	onMouseMove = (e: MouseEvent): void => {
		const { mgMouseOffsetX, mgMouseOffsetY } = this.props;

		if (this.imgBounds) {
			const target = e.target as HTMLElement;
			const relX = (e.clientX - this.imgBounds.left) / target.clientWidth;
			const relY = (e.clientY - this.imgBounds.top) / target.clientHeight;

			this.setState({
				mgOffsetX: mgMouseOffsetX,
				mgOffsetY: mgMouseOffsetY,
				relX,
				relY,
				showZoom: true,
			});
		}
	};

	onMouseOut = (): void => {
		this.setState({
			showZoom: false,
		});
	};

	onTouchStart = (e: TouchEvent): void => {
		e.preventDefault(); // Prevent mouse event from being fired

		this.calcImgBounds();
	};

	onTouchMove = (e: TouchEvent): void => {
		e.preventDefault(); // Disable scroll on touch

		if (this.imgBounds) {
			const target = e.target as HTMLElement;
			const { mgTouchOffsetX, mgTouchOffsetY } = this.props;
			const relX = (e.targetTouches[0].clientX - this.imgBounds.left) / target.clientWidth;
			const relY = (e.targetTouches[0].clientY - this.imgBounds.top) / target.clientHeight;

			// Only show magnifying glass if touch is inside image
			if (relX >= 0 && relY >= 0 && relX <= 1 && relY <= 1) {
				this.setState({
					mgOffsetX: mgTouchOffsetX,
					mgOffsetY: mgTouchOffsetY,
					relX,
					relY,
					showZoom: true,
				});
			} else {
				this.setState({
					showZoom: false,
				});
			}
		}
	};

	onTouchEnd = (): void => {
		this.setState({
			showZoom: false,
		});
	};

	calcImgBounds = (): void => {
		if (this.img) {
			this.imgBounds = this.img.getBoundingClientRect();
		}
	};

	render = (): React.ReactElement => {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const {
			src,
			width,
			height,
			className,
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
			active,
			...otherProps
		} = this.props;
		/* eslint-enable @typescript-eslint/no-unused-vars */
		const { mgOffsetX, mgOffsetY, relX, relY, showZoom } = this.state;

		// Show/hide magnifying glass (opacity needed for transition)
		let mgClasses = "magnifying-glass";
		if (showZoom) {
			mgClasses += " visible";
		}
		if (mgShape === "circle") {
			mgClasses += " circle";
		}

		return (
			<div
				className={`magnifier ${className}`}
				style={{
					width,
					height,
					overflow: mgShowOverflow ? "visible" : "hidden",
				}}
			>
				{/* eslint-disable-next-line jsx-a11y/alt-text */}
				<img
					className="magnifier-image"
					src={src}
					width="100%"
					height="100%"
					{...otherProps}
					onLoad={(): void => {
						this.calcImgBounds();
					}}
					ref={(img: HTMLImageElement): void => {
						this.img = img;
					}}
				/>
				{(this.imgBounds && active) && (
					<div
						className={mgClasses}
						style={{
							width: mgWidth,
							height: mgHeight,
							left: `calc(${relX * 100}% - ${mgWidth / 2}px + ${mgOffsetX}px - ${mgBorderWidth}px)`,
							top: `calc(${relY * 100}% - ${mgHeight / 2}px + ${mgOffsetY}px - ${mgBorderWidth}px)`,
							backgroundImage: `url("${zoomImgSrc || src}")`,
							backgroundPosition: `calc(${relX * 100}% + ${mgWidth / 2}px - ${relX *
								mgWidth}px) calc(${relY * 100}% + ${mgHeight / 2}px - ${relY * mgWidth}px)`,
							backgroundSize: `${zoomFactor * this.imgBounds.width}% ${zoomFactor *
								this.imgBounds.height}%`,
							borderWidth: mgBorderWidth,
						}}
					/>
				)}
			</div>
		);
	};
}
