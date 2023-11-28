# ctpvert

Get the closest Catppuccin color.

```
npx ctpvert@latest
pnpm dlx ctpvert@latest
bunx ctpvert@latest
```

## API

```ts
import { closest } from "https://deno.land/x/ctpvert/main.ts";

const myTheme = {
	foreground: "#000000",
	background: "#FFFFFF",
	accent: "#00ff00",
};

const catppuccinLatteTheme = Object.fromEntries(
	Object.entries(myTheme).map(([property, color]) => [
		property,
		closest(color)["latte"].hex,
	])
);

console.log(catppuccinLatteTheme);
/* { foreground: "#4c4f69", background: "#eff1f5", accent: "#40a02b" } */
```

## License

[MIT](LICENSE)
