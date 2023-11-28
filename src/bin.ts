import { bold, green, red } from "https://deno.land/std@0.207.0/fmt/colors.ts";

import { closest } from "../main.ts";

while (true) {
	const color = prompt(">")?.trim();
	if (!color) continue;

	try {
		const { input, ...variants } = closest(color);
		console.log(`${green(bold("Input:"))} "${input.hex}"`);
		console.table(variants);
	} catch {
		console.error(`${red(bold("Error:"))} Invalid color provided!`);
	}
}
