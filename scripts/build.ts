import { build, emptyDir } from "https://deno.land/x/dnt@0.39.0/mod.ts";

await emptyDir("./dist");

await build({
	entryPoints: [{ kind: "bin", name: "ctpvert", path: "./src/bin.ts" }],
	outDir: "./dist",
	shims: {
		deno: true,
		prompts: true,
	},
	importMap: "deno.json",
	package: {
		name: "ctpvert",
		version: Deno.args[0],
		description: "Get the closest Catppuccin color.",
		author: "uncenter <hi@uncenter.dev>",
		repository: {
			type: "git",
			url: "https://github.com/uncenter/ctp-closest.git",
		},
		license: "MIT",
		files: ["dist/"],
		devDependencies: {
			"@types/delta-e": "0.0.2",
		},
	},
	packageManager: "pnpm",
});

for (const file of ["LICENSE", "README.md", "COPYING.md"]) {
	Deno.copyFileSync(file, `dist/${file}`);
}
