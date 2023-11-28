import { ColorTranslator } from "https://esm.sh/colortranslator@4.1.0";

export function firstToUpperCase(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function parseColor(input: unknown) {
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
}

export function colorToDeltaELAB(input: ColorTranslator) {
	const { L, a, b } = input.CIELabObject;
	return { L: L, A: a, B: b };
}
