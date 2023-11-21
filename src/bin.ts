import type { Flavor } from "./types.ts";

import { variants } from "@catppuccin/palette";
import { blue, bold, green, magenta, red } from "fmt/colors.ts";

import { closest } from "./main.ts";
import { firstToUpperCase } from "./utils.ts";

while (true) {
	const color = prompt("> ")?.trim();
	if (!color) continue;

	// @ts-ignore: Missing properties.
	const results: Record<Flavor, ReturnType<typeof closest>["result"]> = {};
	let input: ReturnType<typeof closest>["input"];
	let invalid = false;

	for (const variant of Object.keys(variants) as Flavor[]) {
		try {
			const { input: i, result: r } = closest(color, variant);
			results[variant] = r;
			input = i;
		} catch {
			console.error(`${red(bold("error:"))} Invalid color provided!`);
			invalid = true;
			break;
		}
	}

	if (invalid) continue;

	let output = `The closest color to ${magenta(input.hex)} in...\n\n`;

	for (const variant in results) {
		const result = results[variant as Flavor];
		output += `  ${bold(`[${firstToUpperCase(variant)}]`)}: ${firstToUpperCase(
			result.name
		)}\n`;
		output += `    ${green("Hex:")} ${result.hex}\n    ${blue(
			"RGB:"
		)} [${Object.values(result.rgb).join(", ")}]\n\n`;
	}

	console.log(output.replace(/\n$/, ""));
}
