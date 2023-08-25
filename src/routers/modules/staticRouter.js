import { HOME_URL, LOGIN_URL } from '@/config'

/**
 * staticRouter (静态路由)
 */
export const staticRouter = [
	{
		path: '/',
		redirect: HOME_URL,
	},
	{
		path: LOGIN_URL,
		name: 'login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
	{
		path: '',
		name: 'layout',
		component: () => import('@/layouts/index.vue'),
		redirect: HOME_URL,
		children: [
			{
				path: 'home',
				name: '首页',
				component: () => import('@/views/home/index.vue'),
			},
		],
	},
]

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
	{
		path: '/403',
		name: '403',
		component: () => import('@/components/ErrorMessage/403.vue'),
		meta: {
			title: '403页面',
		},
	},
	{
		path: '/404',
		name: '404',
		component: () => import('@/components/ErrorMessage/404.vue'),
		meta: {
			title: '404页面',
		},
	},
	{
		path: '/500',
		name: '500',
		component: () => import('@/components/ErrorMessage/500.vue'),
		meta: {
			title: '500页面',
		},
	},
	// 解决刷新页面、路由警告
	{
		path: '/:pathMatch(.*)*',
		component: () => import('@/components/ErrorMessage/404.vue'),
	},
]
