export interface Vector2Like {
    readonly x: number;
    readonly y: number;
}

export interface RectLike {
    readonly left: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
}

export interface OffsetScaleTransformation {
    readonly originOffset: Vector2Like;
    readonly scale: number;
}
