import "./ColorGradientNumber.css";

export class RGB {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

export class Level {
    bound: number;
    rgb: RGB;

    constructor(bound: number, rgb: RGB) {
        this.bound = bound;
        this.rgb = rgb;
    }
}

type GradientProps = {
    levels: Level[],
    value: number,
    unit?: string,
    icon?: string
}

export const ColorGradientNumber = ({ levels, value, unit, icon }: GradientProps) => {
    validateLevels(levels);
    const reversedLevels: Level[] = Object.assign([], levels).reverse();
    const lowerBound = reversedLevels.find(l => l.bound <= value) || levels[0];
    const upperBound = levels.find(l => l.bound > value) || levels[levels.length - 1];
    let rgb = lowerBound.rgb;
    if (lowerBound !== upperBound) {
        const scaled = (lower: number, upper: number) => convertScale(value, lowerBound.bound, upperBound.bound, lower, upper);
        rgb = new RGB(
            scaled(lowerBound.rgb.r, upperBound.rgb.r),
            scaled(lowerBound.rgb.g, upperBound.rgb.g),
            scaled(lowerBound.rgb.b, upperBound.rgb.b)
        );
    }
    return <span style={{ color: `rgb(${rgb.r.toFixed(0)}, ${rgb.g.toFixed(0)}, ${rgb.b.toFixed(0)})` }}>{icon || ""} {value.toFixed(1)}{unit || ""}</span>
}

function validateLevels(levels: Level[]) {
    if (levels.length === 0) {
        throw new Error("At least one level must be passed");
    }

    let bound = levels[0].bound;
    for (let level of levels) {
        if (level.bound < bound) {
            throw new Error("Levels must be set with ascending bounds");
        }
        bound = level.bound;
    }
}

export function convertScale(n: number, inLow: number, inHigh: number, outLow: number, outHigh: number): number {
    const inRange = inHigh - inLow
    const outRange = outHigh - outLow
    const inScale = (n - inLow) / inRange
    return outLow + (outRange * inScale)
}
