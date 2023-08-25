<template>
	<el-container class="layout">
		<el-container class="classic-content">
			<!-- <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
				<el-scrollbar>
					<el-menu :default-active="activeMenu" :router="false" :collapse="isCollapse" :collapse-transition="false" :unique-opened="true">
						<SubMenu :menu-list="menuList" first />
					</el-menu>
				</el-scrollbar>
				<div class="side_collapsed" @click="changeCollapse">
					<el-icon class="collapse-icon">
						<component :is="isCollapse ? 'CaretRight' : 'CaretLeft'"></component>
					</el-icon>
				</div>
			</div> -->
			<el-main class="layout_main">
				<!-- 本地开始时, 修改文件在跳转页面会加载不出来对应组件, 隐藏mode="out-in"即可 -->
				<router-view v-slot="{ Component, route }">
					<transition appear name="fade-transform" mode="out-in">
						<keep-alive :include="keepAliveName">
							<component :is="Component" :key="route.fullPath" v-if="isRouterShow" />
						</keep-alive>
					</transition>
				</router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import SubMenu from './components/SubMenu.vue'
import { useAuthStore } from '@/stores/modules/auth'
import { useGlobalStore } from '@/stores/modules/global'
import { useKeepAliveStore } from '@/stores/modules/keepAlive'

const keepAliveStore = useKeepAliveStore()
const { keepAliveName } = storeToRefs(keepAliveStore)

// 注入刷新页面方法
const isRouterShow = ref(true)
const refreshCurrentPage = (val) => (isRouterShow.value = val)
provide('refresh', refreshCurrentPage)

//菜单数组
const authStore = useAuthStore()
const menuList = computed(() => authStore.showMenuListGet)

//激活的菜单
const route = useRoute()
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path))

//展开收起
const globalStore = useGlobalStore()
const isCollapse = computed(() => globalStore.isCollapse)
const isHeader = computed(() => globalStore.isHeader)
const changeCollapse = () => globalStore.setGlobalState('isCollapse', !globalStore.isCollapse)
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
