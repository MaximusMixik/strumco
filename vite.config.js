import { defineConfig } from "vite";
import handlebars from 'vite-plugin-handlebars'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';
// import Vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// function imageProcessPlugin() {
// 	return {
// 		name: 'image-process',

// 		writeBundle() {
// 			execSync(`magick ./src/img/w3kr4m2fi3111.png -resize 800x600 ./dist/w3kr4m2fi3111_optimized.png`);
// 		}
// 	}
// }

export default defineConfig(() => ({
	base: '/strumco/',
	// base: './',

	build: {
		emptyOutDir: true,
		manifest: true,
		outDir: 'dist',
		assetsDir: ''
	},

	plugins: [
		handlebars({
			partialDirectory: path.resolve(__dirname, 'src/partials'),
		}),
		// Vue(),
		VitePluginSvgSpritemap('./src/icons/*.svg', {
			output: {
				filename: '[extname]',
				name: 'spritemap.svg',
				view: false,
				use: true,
			},
		}),
		viteStaticCopy({
			targets: [
				{
					src: 'src/img/*',
					dest: 'img'
				}
			]
		}),
		// imageProcessPlugin()
	],

	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'~(.+)': process.cwd() + '/node_modules/$1',
			'vue': 'vue/dist/vue.esm-bundler.js',
		}
	},

	server: {
		port: 5173,
		open: false,
		host: '0.0.0.0',
		hmr: {
			host: 'localhost'
		},
	},

	define: {
		__VUE_OPTIONS_API__: true,
		__VUE_PROD_DEVTOOLS__: false,
	},
}));