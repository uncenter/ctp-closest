import { build, emptyDir } from "https://deno.land/x/dnt@0.39.0/mod.ts";

const COPY_FILES = ["README.md", "LICENSE", "COPYING.md"];

await emptyDir("./dist");

await build({
	entryPoints: [{ kind: "bin", name: "ctpvert", path: "./src/bin.ts" }],
	scriptModule: false,
	outDir: "./dist",
	shims: {
		deno: true,
		prompts: true,
	},
	importMap: "deno.json",
	package: {
		name: "ctpvert",
		version: Deno.args[0]?.replace(/^v/, ""),
		description: "Get the closest Catppuccin color.",
		author: "uncenter <hi@uncenter.dev>",
		repository: {
			type: "git",
			url: "https://github.com/uncenter/ctp-closest.git",
		},
		license: "MIT",
		files: [...COPY_FILES, "esm/"],
		devDependencies: {
			"@types/delta-e": "0.0.2",
		},
	},
	packageManager: "pnpm",
});

for (const file of COPY_FILES) {
	Deno.copyFileSync(file, `dist/${file}`);
}
