import "./style.scss";
import React, { PureComponent } from "react";
declare type mgShape = "circle" | "square";
interface Props {
    src: string;
    width: string | number;
    height: string | number;
    className: string;
    zoomImgSrc: string;
    zoomFactor: number;
    mgWidth: number;
    mgHeight: number;
    mgBorderWidth: number;
    mgShape: mgShape;
    mgShowOverflow: boolean;
    mgMouseOffsetX: number;
    mgMouseOffsetY: number;
    mgTouchOffsetX: number;
    mgTouchOffsetY: number;
}
interface State {
    showZoom: boolean;
    mgOffsetX: number;
    mgOffsetY: number;
    relX: number;
    relY: number;
}
export default class Magnifier extends PureComponent<Props, State> {
    img: HTMLElement;
    imgBounds: DOMRect | ClientRect;
    calcImgBoundsDebounced: () => void;
    static defaultProps: {
        width: string;
        height: string;
        className: string;
        zoomImgSrc: string;
        zoomFactor: number;
        mgWidth: number;
        mgHeight: number;
        mgBorderWidth: number;
        mgShape: string;
        mgShowOverflow: boolean;
        mgMouseOffsetX: number;
        mgMouseOffsetY: number;
        mgTouchOffsetX: number;
        mgTouchOffsetY: number;
    };
    state: Readonly<State>;
    constructor(props: Props);
    componentDidMount: () => void;
    componentWillUnmount: () => void;
    onMouseEnter: () => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseOut: () => void;
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: () => void;
    calcImgBounds: () => void;
    render: () => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}
export {};
//# sourceMappingURL=Magnifier.d.ts.map