import "./style.scss";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import React, { useState, useEffect, useRef, useCallback } from "react";

type mgShape = "circle" | "square";

interface Props {
  // Image
  src: string;
  width?: string | number;
  height?: string | number;
  className?: string;

  // Zoom image
  zoomImgSrc?: string;
  zoomFactor?: number;

  // Magnifying glass
  mgWidth?: number;
  mgHeight?: number;
  mgBorderWidth?: number;
  mgShape?: mgShape;
  mgShowOverflow?: boolean;
  mgMouseOffsetX?: number;
  mgMouseOffsetY?: number;
  mgTouchOffsetX?: number;
  mgTouchOffsetY?: number;
}

const Magnifier: React.FC<Props> = ({
  // Default props
  src,
  width = "100%",
  height = "auto",
  className = "",
  zoomImgSrc = "",
  zoomFactor = 1.5,
  mgWidth = 150,
  mgHeight = 150,
  mgBorderWidth = 2,
  mgShape = "circle",
  mgShowOverflow = true,
  mgMouseOffsetX = 0,
  mgMouseOffsetY = 0,
  mgTouchOffsetX = -50,
  mgTouchOffsetY = -50,
  ...otherProps
}) => {
  // State
  const [showZoom, setShowZoom] = useState(false);
  const [mgOffsetX, setMgOffsetX] = useState(0);
  const [mgOffsetY, setMgOffsetY] = useState(0);
  const [relX, setRelX] = useState(0);
  const [relY, setRelY] = useState(0);

  // Refs
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgBoundsRef = useRef<DOMRect | null>(null);

  // Calculate image bounds
  const calcImgBounds = useCallback(() => {
    if (imgRef.current) {
      imgBoundsRef.current = imgRef.current.getBoundingClientRect();
    }
  }, []);

  const calcImgBoundsDebounced = useCallback(debounce(calcImgBounds, 200), [calcImgBounds]);

  // Handlers
  const onMouseEnter = useCallback(() => {
    calcImgBounds();
  }, [calcImgBounds]);

  const onMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      if (imgBoundsRef.current && imgRef.current) {
        const relX = (e.clientX - imgBoundsRef.current.left) / imgRef.current.clientWidth;
        const relY = (e.clientY - imgBoundsRef.current.top) / imgRef.current.clientHeight;

        setMgOffsetX(mgMouseOffsetX);
        setMgOffsetY(mgMouseOffsetY);
        setRelX(relX);
        setRelY(relY);
        setShowZoom(true);
      }
    }, 20, { trailing: false }),
    [mgMouseOffsetX, mgMouseOffsetY]
  );

  const onMouseOut = useCallback(() => {
    setShowZoom(false);
  }, []);

  const onTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    calcImgBounds();
  }, [calcImgBounds]);

  const onTouchMove = useCallback(
    throttle((e: TouchEvent) => {
      e.preventDefault();
      if (imgBoundsRef.current && imgRef.current) {
        const relX =
          (e.targetTouches[0].clientX - imgBoundsRef.current.left) / imgRef.current.clientWidth;
        const relY =
          (e.targetTouches[0].clientY - imgBoundsRef.current.top) / imgRef.current.clientHeight;

        if (relX >= 0 && relY >= 0 && relX <= 1 && relY <= 1) {
          setMgOffsetX(mgTouchOffsetX);
          setMgOffsetY(mgTouchOffsetY);
          setRelX(relX);
          setRelY(relY);
          setShowZoom(true);
        } else {
          setShowZoom(false);
        }
      }
    }, 20, { trailing: false }),
    [mgTouchOffsetX, mgTouchOffsetY]
  );

  const onTouchEnd = useCallback(() => {
    setShowZoom(false);
  }, []);

  // Lifecycle (event listeners)
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Mouse events
    img.addEventListener("mouseenter", onMouseEnter, { passive: false });
    img.addEventListener("mousemove", onMouseMove, { passive: false });
    img.addEventListener("mouseout", onMouseOut, { passive: false });

    // Touch events
    img.addEventListener("touchstart", onTouchStart, { passive: false });
    img.addEventListener("touchmove", onTouchMove, { passive: false });
    img.addEventListener("touchend", onTouchEnd, { passive: false });

    // Window events
    window.addEventListener("resize", calcImgBoundsDebounced);
    window.addEventListener("scroll", calcImgBoundsDebounced, true);

    return () => {
      img.removeEventListener("mouseenter", onMouseEnter);
      img.removeEventListener("mousemove", onMouseMove);
      img.removeEventListener("mouseout", onMouseOut);
      img.removeEventListener("touchstart", onTouchStart);
      img.removeEventListener("touchmove", onTouchMove);
      img.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", calcImgBoundsDebounced);
      window.removeEventListener("scroll", calcImgBoundsDebounced, true);
    };
  }, [onMouseEnter, onMouseMove, onMouseOut, onTouchStart, onTouchMove, onTouchEnd, calcImgBoundsDebounced]);

  // Magnifier classes
  let mgClasses = "magnifying-glass";
  if (showZoom) mgClasses += " visible";
  if (mgShape === "circle") mgClasses += " circle";

  return (
    <div
      className={`magnifier ${className}`}
      style={{
        width,
        height,
        overflow: mgShowOverflow ? "visible" : "hidden",
      }}
    >
      <img
        className="magnifier-image"
        src={src}
        width="100%"
        height="100%"
        {...otherProps}
        onLoad={calcImgBounds}
        ref={imgRef}
        alt=""
      />

      {imgBoundsRef.current && (
        <div
          className={mgClasses}
          style={{
            width: mgWidth,
            height: mgHeight,
            left: `calc(${relX * 100}% - ${mgWidth / 2}px + ${mgOffsetX}px - ${mgBorderWidth}px)`,
            top: `calc(${relY * 100}% - ${mgHeight / 2}px + ${mgOffsetY}px - ${mgBorderWidth}px)`,
            backgroundImage: `url("${zoomImgSrc || src}")`,
            backgroundPosition: `calc(${relX * 100}% + ${mgWidth / 2}px - ${relX * mgWidth}px) calc(${relY * 100}% + ${mgHeight / 2}px - ${relY * mgWidth}px)`,
            backgroundSize: `${zoomFactor * (imgBoundsRef.current?.width || 0)}% ${zoomFactor *
              (imgBoundsRef.current?.height || 0)}%`,
            borderWidth: mgBorderWidth,
          }}
        />
      )}
    </div>
  );
};

export default Magnifier;
