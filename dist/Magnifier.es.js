import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import React, { PureComponent } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".magnifier {\n  position: relative;\n  display: inline-block;\n  line-height: 0;\n}\n\n.magnifier-image {\n  cursor: none;\n}\n\n.magnifying-glass {\n  position: absolute;\n  z-index: 1;\n  background: #e5e5e5 no-repeat;\n  border: solid #ebebeb;\n  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);\n  opacity: 0;\n  transition: opacity 0.3s;\n  pointer-events: none;\n}\n.magnifying-glass.circle {\n  border-radius: 50%;\n}\n.magnifying-glass.visible {\n  opacity: 1;\n}";
styleInject(css);

var Magnifier = (function (_super) {
    __extends(Magnifier, _super);
    function Magnifier(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            showZoom: false,
            mgOffsetX: 0,
            mgOffsetY: 0,
            relX: 0,
            relY: 0,
        };
        _this.componentDidMount = function () {
            _this.img.addEventListener("mouseenter", _this.onMouseEnter, { passive: false });
            _this.img.addEventListener("mousemove", _this.onMouseMove, { passive: false });
            _this.img.addEventListener("mouseout", _this.onMouseOut, { passive: false });
            _this.img.addEventListener("touchstart", _this.onTouchStart, { passive: false });
            _this.img.addEventListener("touchmove", _this.onTouchMove, { passive: false });
            _this.img.addEventListener("touchend", _this.onTouchEnd, { passive: false });
            window.addEventListener("resize", _this.calcImgBoundsDebounced);
            window.addEventListener("scroll", _this.calcImgBoundsDebounced, true);
        };
        _this.componentWillUnmount = function () {
            _this.img.removeEventListener("mouseenter", _this.onMouseEnter);
            _this.img.removeEventListener("mousemove", _this.onMouseMove);
            _this.img.removeEventListener("mouseout", _this.onMouseOut);
            _this.img.removeEventListener("touchstart", _this.onTouchStart);
            _this.img.removeEventListener("touchmove", _this.onTouchMove);
            _this.img.removeEventListener("touchend", _this.onTouchEnd);
            window.removeEventListener("resize", _this.calcImgBoundsDebounced);
            window.removeEventListener("scroll", _this.calcImgBoundsDebounced, true);
        };
        _this.onMouseEnter = function () {
            _this.calcImgBounds();
        };
        _this.onMouseMove = function (e) {
            var _a = _this.props, mgMouseOffsetX = _a.mgMouseOffsetX, mgMouseOffsetY = _a.mgMouseOffsetY;
            if (_this.imgBounds) {
                var target = e.target;
                var relX = (e.clientX - _this.imgBounds.left) / target.clientWidth;
                var relY = (e.clientY - _this.imgBounds.top) / target.clientHeight;
                _this.setState({
                    mgOffsetX: mgMouseOffsetX,
                    mgOffsetY: mgMouseOffsetY,
                    relX: relX,
                    relY: relY,
                    showZoom: true,
                });
            }
        };
        _this.onMouseOut = function () {
            _this.setState({
                showZoom: false,
            });
        };
        _this.onTouchStart = function (e) {
            e.preventDefault();
            _this.calcImgBounds();
        };
        _this.onTouchMove = function (e) {
            e.preventDefault();
            if (_this.imgBounds) {
                var target = e.target;
                var _a = _this.props, mgTouchOffsetX = _a.mgTouchOffsetX, mgTouchOffsetY = _a.mgTouchOffsetY;
                var relX = (e.targetTouches[0].clientX - _this.imgBounds.left) / target.clientWidth;
                var relY = (e.targetTouches[0].clientY - _this.imgBounds.top) / target.clientHeight;
                if (relX >= 0 && relY >= 0 && relX <= 1 && relY <= 1) {
                    _this.setState({
                        mgOffsetX: mgTouchOffsetX,
                        mgOffsetY: mgTouchOffsetY,
                        relX: relX,
                        relY: relY,
                        showZoom: true,
                    });
                }
                else {
                    _this.setState({
                        showZoom: false,
                    });
                }
            }
        };
        _this.onTouchEnd = function () {
            _this.setState({
                showZoom: false,
            });
        };
        _this.calcImgBounds = function () {
            if (_this.img) {
                _this.imgBounds = _this.img.getBoundingClientRect();
            }
        };
        _this.render = function () {
            var _a = _this.props, src = _a.src, width = _a.width, height = _a.height, className = _a.className, zoomImgSrc = _a.zoomImgSrc, zoomFactor = _a.zoomFactor, mgHeight = _a.mgHeight, mgWidth = _a.mgWidth, mgBorderWidth = _a.mgBorderWidth, mgMouseOffsetX = _a.mgMouseOffsetX, mgMouseOffsetY = _a.mgMouseOffsetY, mgTouchOffsetX = _a.mgTouchOffsetX, mgTouchOffsetY = _a.mgTouchOffsetY, mgShape = _a.mgShape, mgShowOverflow = _a.mgShowOverflow, otherProps = __rest(_a, ["src", "width", "height", "className", "zoomImgSrc", "zoomFactor", "mgHeight", "mgWidth", "mgBorderWidth", "mgMouseOffsetX", "mgMouseOffsetY", "mgTouchOffsetX", "mgTouchOffsetY", "mgShape", "mgShowOverflow"]);
            var _b = _this.state, mgOffsetX = _b.mgOffsetX, mgOffsetY = _b.mgOffsetY, relX = _b.relX, relY = _b.relY, showZoom = _b.showZoom;
            var mgClasses = "magnifying-glass";
            if (showZoom) {
                mgClasses += " visible";
            }
            if (mgShape === "circle") {
                mgClasses += " circle";
            }
            return (React.createElement("div", { className: "magnifier " + className, style: {
                    width: width,
                    height: height,
                    overflow: mgShowOverflow ? "visible" : "hidden",
                } },
                React.createElement("img", __assign({ className: "magnifier-image", src: src, width: "100%", height: "100%" }, otherProps, { onLoad: function () {
                        _this.calcImgBounds();
                    }, ref: function (img) {
                        _this.img = img;
                    } })),
                _this.imgBounds && (React.createElement("div", { className: mgClasses, style: {
                        width: mgWidth,
                        height: mgHeight,
                        left: "calc(" + relX * 100 + "% - " + mgWidth / 2 + "px + " + mgOffsetX + "px - " + mgBorderWidth + "px)",
                        top: "calc(" + relY * 100 + "% - " + mgHeight / 2 + "px + " + mgOffsetY + "px - " + mgBorderWidth + "px)",
                        backgroundImage: "url(\"" + (zoomImgSrc || src) + "\")",
                        backgroundPosition: "calc(" + relX * 100 + "% + " + mgWidth / 2 + "px - " + relX *
                            mgWidth + "px) calc(" + relY * 100 + "% + " + mgHeight / 2 + "px - " + relY * mgWidth + "px)",
                        backgroundSize: zoomFactor * _this.imgBounds.width + "% " + zoomFactor *
                            _this.imgBounds.height + "%",
                        borderWidth: mgBorderWidth,
                    } }))));
        };
        _this.onMouseMove = throttle(_this.onMouseMove.bind(_this), 20, {
            trailing: false,
        });
        _this.onTouchMove = throttle(_this.onTouchMove.bind(_this), 20, {
            trailing: false,
        });
        _this.calcImgBoundsDebounced = debounce(_this.calcImgBounds, 200);
        return _this;
    }
    Magnifier.defaultProps = {
        width: "100%",
        height: "auto",
        className: "",
        zoomImgSrc: "",
        zoomFactor: 1.5,
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
    return Magnifier;
}(PureComponent));

export default Magnifier;
