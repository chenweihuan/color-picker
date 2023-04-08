import { throttle } from 'lodash-es';
import tinycolor from 'tinycolor2';

// eslint-disable-next-line complexity
export function formatColor(data: any, oldHue?: string) {
    const alpha = data && data.a;
    let color;

    // hsl is better than hex between conversions
    if (data && data.hsl) {
        color = tinycolor(data.hsl);
    } else if (data && data.hex && data.hex.length > 0) {
        color = tinycolor(data.hex);
        alpha && color.setAlpha(alpha || 1);
    } else if (data && data.hsv) {
        color = tinycolor(data.hsv);
    } else if (data && data.rgba) {
        color = tinycolor(data.rgba);
    } else if (data && data.rgb) {
        color = tinycolor(data.rgb);
    } else {
        color = tinycolor(data);
    }

    if (color && (color._a === undefined || color._a === null)) {
        color.setAlpha(alpha || 1);
    }

    const hsl = color.toHsl();
    const hsv = color.toHsv();

    if (hsl.s === 0) {
        hsv.h = hsl.h = data.h || (data.hsl && data.hsl.h) || oldHue || 0;
    }

    /* --- comment this block to fix #109, may cause #25 again --- */
    // when the hsv.v is less than 0.0164 (base on test)
    // because of possible loss of precision
    // the result of hue and saturation would be miscalculated
    // if (hsv.v < 0.0164) {
    //   hsv.h = data.h || (data.hsv && data.hsv.h) || 0
    //   hsv.s = data.s || (data.hsv && data.hsv.s) || 0
    // }

    // if (hsl.l < 0.01) {
    //   hsl.h = data.h || (data.hsl && data.hsl.h) || 0
    //   hsl.s = data.s || (data.hsl && data.hsl.s) || 0
    // }
    /* ------ */

    return {
        hsl: hsl,
        hex: color.toHex(),
        hex6: color.toHexString(),
        hex8: color.toHex8String(),
        rgba: color.toRgb(),
        hsv: hsv,
        oldHue: data.h || oldHue || hsl.h,
        source: data.source,
        a: data.a || color.getAlpha(),
    };
}

export function isValidColor(hex: string) {
    return tinycolor(hex).isValid();
}

export function getAlpha(color: string) {
    return tinycolor(color).getAlpha();
}

export function isAlpha(color: string) {
    return getAlpha(color) < 1;
}

export async function copy(text: string) {
    try {
        if (navigator.permissions?.query) {
            await navigator.permissions.query({
                name: 'clipboard-write' as PermissionName,
            });
        }

        await navigator.clipboard.writeText(text);
        return;
    } catch (e) {}

    const inputElement = document.createElement('input');
    try {
        inputElement.value = text;
        inputElement.style.opacity = '0';
        document.body.appendChild(inputElement);
        inputElement.select();
        document.execCommand('copy');
        return;
    } finally {
        inputElement.remove();
    }
}

export const throttleHandle = throttle(
    (fn, data) => {
        // eslint-disable-next-line prefer-spread
        fn.apply(null, data);
    },
    50,
    { leading: true, trailing: true },
);
