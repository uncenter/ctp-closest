import type { Flavor } from "./types.ts";

export function firstToUpperCase(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function isFlavor(input: unknown): input is Flavor {
	return (
		typeof input === "string" &&
		["latte", "frappe", "macchiato", "mocha"].includes(input)
	);
}
