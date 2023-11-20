import DeltaE from "https://esm.sh/delta-e@0.0.8";
import { variants } from "https://esm.sh/@catppuccin/palette@0.1.5";
import { ColorTranslator } from "npm:colortranslator";

const colorToLab = (input: unknown) => {
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

export function closest(
	input: unknown,
	variant: "latte" | "frappe" | "macchiato" | "mocha"
) {
	const colors: Record<
		string,
		{ hex: string; lab: { L: number; A: number; B: number } }
	> = {};

	Object.keys(variants[variant]).map((color) => {
		// @ts-ignore: I hate TypeScript.
		const hex = variants[variant][color].hex;
		const lab = colorToLab(hex);
		colors[color] = {
			hex: hex,
			lab: lab,
		};
	});

	const inputLab = colorToLab(input);

	const { hex: closestHex, color: closestColor } = Object.entries(
		colors
	).reduce(
		(acc, [color, { lab, hex }]) => {
			const delta = DeltaE.getDeltaE00(inputLab, lab);
			return delta < acc.nearest ? { nearest: delta, hex, color } : acc;
		},
		{ nearest: Infinity, hex: "", color: "" }
	);

	const result = new ColorTranslator(closestHex);

	return {
		hex: result.HEX,
		rgb: result.RGB,
		name: closestColor,
	};
}
