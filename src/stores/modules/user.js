import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import { getUserInfo } from '@/api/modules/Login'

export const useUserStore = defineStore({
	id: 'hx-user',
	state: () => ({
		access_token: '',
		refresh_token: '',
		userInfo: {}, //用户信息
		permissions: [], // 权限
		roles: [], //用户角色
	}),
	getters: {},
	actions: {
		// 设置token
		setAccessToken(access_token) {
			this.access_token = access_token
		},
		setRefreshToken(refresh_token) {
			this.refresh_token = refresh_token
		},
		async setUserInfo(ticket = '') {
			const { data } = await getUserInfo(ticket)
			this.permissions = data.permissions
			this.roles = data.roles
			this.userInfo = data.sysUser
		},
	},
	persist: piniaPersistConfig('hx-user'),
})
