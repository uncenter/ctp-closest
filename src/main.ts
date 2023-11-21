import type { Flavor } from "./types.ts";

import { variants } from "@catppuccin/palette";
import { ColorTranslator } from "colortranslator";
import DeltaE from "delta-e";

const parseColor = (input: unknown) => {
	let color: ColorTranslator;
	try {
		// deno-lint-ignore no-explicit-any
		color = new ColorTranslator(input as any);
	} catch {
		try {
			color = new ColorTranslator("#" + input);
		} catch {
			throw new Error("Invalid color provided!");
		}
	}
	return color;
};

// Adapted from https://github.com/antimatter15/rgb-lab/blob/a6cf2e9e2ff6fcc7965a2e73c019f8ace69b4384/color.js#L28-L47 (under MIT license, see COPYING.md for copyright notice).
const colorToLab = (color: ColorTranslator) => {
	const rgb = Object.values(color.RGBObject);

	let r = rgb[0] / 255,
		g = rgb[1] / 255,
		b = rgb[2] / 255,
		x,
		y,
		z;

	r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
	g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
	b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

	x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
	y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
	z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

	return {
		L: 116 * y - 16,
		A: 500 * (x - y),
		B: 200 * (y - z),
	};
};

export function closest(input: unknown, flavor: Flavor) {
	const colors: Record<
		string,
		{ hex: string; lab: { L: number; A: number; B: number } }
	> = {};

	Object.keys(variants[flavor]).map((color) => {
		// @ts-ignore: I hate TypeScript.
		const hex = variants[flavor][color].hex;
		const lab = colorToLab(parseColor(hex));
		colors[color] = {
			hex: hex,
			lab: lab,
		};
	});

	const inputColor = parseColor(input);
	const inputLab = colorToLab(inputColor);

	const { hex: closestHex, color: closestColor } = Object.entries(
		colors
	).reduce(
		(acc, [color, { lab, hex }]) => {
			const delta = DeltaE.getDeltaE00(inputLab, lab);
			return delta < acc.nearest ? { nearest: delta, hex, color } : acc;
		},
		{ nearest: Infinity, hex: "", color: "" }
	);

	const result = parseColor(closestHex);

	return {
		input: {
			hex: inputColor.HEX,
			rgb: inputColor.RGBObject,
		},
		result: {
			hex: result.HEX,
			rgb: result.RGBObject,
			name: closestColor,
		},
	};
}
