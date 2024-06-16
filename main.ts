import type { Color, DeltaColor, NamedColor } from "./src/types.ts";

import { flavorEntries } from "https://esm.sh/@catppuccin/palette@1.2.0";
import DeltaE from "https://esm.sh/delta-e@0.0.8";

import { colorToDeltaELAB, parseColor } from "./src/utils.ts";

export function closest(
	input: unknown,
) {
	const inputColor = parseColor(input);
	const inputLab = colorToDeltaELAB(inputColor);

	const deltasByFlavor: Record<string, Record<string, DeltaColor>> = {};

	for (const [flavor, data] of flavorEntries) {
		const colorDeltas: Record<string, DeltaColor> = {};

		for (const [color, { hex }] of data.colorEntries) {
			const delta = DeltaE.getDeltaE00(
				inputLab,
				colorToDeltaELAB(parseColor(hex)),
			);
			colorDeltas[color] = { hex, delta };
		}

		deltasByFlavor[flavor] = colorDeltas;
	}

	const closestByFlavor: Record<string, NamedColor> = {};

	for (const [flavor, colorDeltas] of Object.entries(deltasByFlavor)) {
		let minDelta = Number.MAX_VALUE;
		let closestColor = null;

		for (const [name, colorDelta] of Object.entries(colorDeltas)) {
			const { delta, hex } = colorDelta;
			if (delta < minDelta) {
				minDelta = delta;
				closestColor = { name: name, hex: hex };
			}
		}

		closestByFlavor[flavor] = closestColor as NamedColor;
	}

	return {
		input: {
			hex: inputColor.HEX.toLowerCase(),
		},
		...closestByFlavor,
	} as {
		input: Color;
		latte: NamedColor;
		frappe: NamedColor;
		macchiato: NamedColor;
		mocha: NamedColor;
	};
}
