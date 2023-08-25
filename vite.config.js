import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'
import { dayjs } from 'element-plus'

const loginUrl = 'http://172.18.41.114:12099/'
const baseUrl = 'http://172.18.42.4:9500/'

// https://vitejs.dev/config/
export default defineConfig({
	base: '',
	root: process.cwd(),
	server: {
		host: '0.0.0.0',
		port: 1217,
		open: true,
		cors: true,
		proxy: {
			'/auth': {
				target: loginUrl,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/auth/, '/auth'),
			},
			'/admin': {
				target: loginUrl,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/admin/, '/admin'),
			},
			'/data-quality': {
				target: baseUrl,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/data-quality/, ''),
			},
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	define: {
		__APP_INFO__: JSON.stringify({ lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }),
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "@/styles/element/index.scss";',
			},
		},
	},
	plugins: [
		vue(),
		vueSetupExtend({}), // name 可以写在 script 标签上
		// 注入变量到 html 文件
		createHtmlPlugin({
			inject: {
				data: { title: '流程管理' },
			},
		}),
		// 使用 svg 图标
		createSvgIconsPlugin({
			iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
			symbolId: 'icon-[dir]-[name]',
		}),
	],
	esbuild: {
		pure: ['debugger'],
	},
	build: {
		outDir: 'dist',
		minify: 'esbuild',
		// esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
		// minify: "terser",
		// terserOptions: {
		// 	compress: {
		// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
		// 		drop_debugger: true
		// 	}
		// },
		// 禁用 gzip 压缩大小报告，可略微减少打包时间
		reportCompressedSize: false,
		// 规定触发警告的 chunk 大小
		chunkSizeWarningLimit: 2000,
		rollupOptions: {
			output: {
				// Static resource classification and packaging
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
			},
		},
	},
})
