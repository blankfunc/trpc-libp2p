import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";
import { swc } from "rollup-plugin-swc3";
import path from "path";

const __dirname = path.resolve(import.meta.dirname);

const commonPlugins = [
	nodeResolve(),
	alias({
		entries: {
			"@": path.join(__dirname, "lib")
		}
	})
];

export default defineConfig([
	{
		input: "lib/index.ts",
		output: [
			{ file: "dist/bundle.js", format: "esm", sourcemap: true },
			{ file: "dist/bundle.cjs", format: "cjs", sourcemap: true },
		],
		plugins: [
			commonjs(),
			swc({
				tsconfig: "tsconfig.json",
				jsc: {
					minify: {
						format: {
							beautify: true
						}
					},
				}
			}),
			...commonPlugins
		]
	},
	{
		input: "lib/index.ts",
		output: {
			file: "dist/bundle.ts",
			format: "es"
		},
		plugins: [
			dts({
				respectExternal: false
			}),
			...commonPlugins
		]
	}
]);