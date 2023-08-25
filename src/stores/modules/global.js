import { defineStore } from 'pinia'
import { DEFAULT_PRIMARY } from '@/config'
import piniaPersistConfig from '@/config/piniaPersist'

export const useGlobalStore = defineStore({
	id: 'hx-global',
	// 修改默认值之后，需清除 localStorage 数据
	state: () => ({
		// 主题颜色
		primary: DEFAULT_PRIMARY,
		// 折叠菜单
		isCollapse: false,
		//是否显示头部
		isHeader: true,
	}),
	getters: {},
	actions: {
		// Set GlobalState
		setGlobalState(...args) {
			this.$patch({ [args[0]]: args[1] })
		},
	},
	persist: piniaPersistConfig('hx-global'),
})
