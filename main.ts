import type { Color, DeltaColor, NamedColor } from "./src/types.ts";
import type { AlphaColor } from "https://esm.sh/@catppuccin/palette@0.2.0";

import { variants } from "https://esm.sh/@catppuccin/palette@0.2.0";
import DeltaE from "https://esm.sh/delta-e@0.0.8";

import { colorToLab, parseColor } from "./src/utils.ts";

export function closest(
	input: unknown,
) {
	const inputColor = parseColor(input);
	const inputLab = colorToLab(inputColor);

	const deltasByVariant: Record<string, Record<string, DeltaColor>> = {};

	for (const [vName, vValue] of Object.entries(variants)) {
		const colorDeltas: Record<string, DeltaColor> = {};

		for (const [cName, cValue] of Object.entries(vValue)) {
			const hex = (cValue as AlphaColor).hex;
			const delta = DeltaE.getDeltaE00(inputLab, colorToLab(parseColor(hex)));
			colorDeltas[cName] = { hex, delta };
		}

		deltasByVariant[vName] = colorDeltas;
	}

	const closestByVariant: Record<string, NamedColor> = {};

	for (const [variant, colorDeltas] of Object.entries(deltasByVariant)) {
		let minDelta = Number.MAX_VALUE;
		let closestColor = null;

		for (const [name, colorDelta] of Object.entries(colorDeltas)) {
			const { delta, hex } = colorDelta;
			if (delta < minDelta) {
				minDelta = delta;
				closestColor = { name: name, hex: hex };
			}
		}

		closestByVariant[variant] = closestColor as NamedColor;
	}

	return {
		input: {
			hex: inputColor.HEX.toLowerCase(),
		},
		...closestByVariant,
	} as {
		input: Color;
		latte: NamedColor;
		frappe: NamedColor;
		macchiato: NamedColor;
		mocha: NamedColor;
	};
}
