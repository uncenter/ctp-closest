export type Color = {
	hex: string;
};

export type NamedColor = Color & {
	name: string;
};

export type DeltaColor = Color & { delta: number };
