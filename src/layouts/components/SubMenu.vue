<template>
	<template v-for="subItem in menuList" :key="subItem.path">
		<el-sub-menu v-if="subItem.children?.length" :index="subItem.path">
			<template #title>
				<el-icon>
					<component :is="subItem.meta.icon"></component>
				</el-icon>
				<span class="sle">{{ subItem.meta.title }} </span>
			</template>
			<SubMenu :menuList="subItem.children" />
		</el-sub-menu>
		<el-menu-item v-else :index="subItem.path" @click="handleClickMenu(subItem)">
			<el-icon v-if="first">
				<component :is="subItem.meta.icon"></component>
			</el-icon>
			<template #title>
				<span class="sle">{{ subItem.meta.title }}</span>
			</template>
		</el-menu-item>
	</template>
</template>

<script setup>
import { watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
	menuList: {
		type: Array,
		default: () => {
			return []
		},
	},
	first: {
		type: Boolean,
		default: () => {
			return false
		},
	},
})

//激活的菜单
const route = useRoute()
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path))

//路由页面跳转
const router = useRouter()
const handleClickMenu = (subItem) => {
	if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank')
	router.push(subItem.path)
}
</script>

<style lang="scss">
.el-sub-menu .el-sub-menu__title:hover {
	color: var(--el-menu-hover-text-color) !important;
	background-color: transparent !important;
}
.el-sub-menu.is-active .el-sub-menu__title {
	font-weight: 600;
	background-color: #f0f7f6 !important;
}
.el-sub-menu.is-active .el-sub-menu .el-sub-menu__title {
	font-weight: 500;
	background-color: transparent !important;
}
.el-sub-menu.is-active .is-active .el-sub-menu__title {
	font-weight: 600;
	background-color: #f0f7f6 !important;
}
.el-menu--collapse {
	.is-active {
		.el-sub-menu__title {
			color: #ffffff !important;
			background-color: var(--el-color-primary) !important;
		}
	}
}
.el-menu-item {
	&:hover {
		color: var(--el-menu-hover-text-color);
	}
	&.is-active {
		color: var(--el-menu-active-color) !important;
		background-color: var(--el-menu-hover-bg-color) !important;
		&::before {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			width: 3px;
			content: '';
			background-color: var(--el-color-primary);
		}
	}
}
.active_sub_menu {
	position: relative;
	background-color: var(--el-menu-hover-bg-color) !important;
	&::before {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 3px;
		content: '';
		background-color: var(--el-color-primary);
	}
	& > .el-sub-menu__title {
		color: var(--el-menu-active-color) !important;
	}
}

.vertical,
.classic,
.transverse {
	.el-menu-item {
		&.is-active {
			&::before {
				left: 0;
			}
		}
	}
}
.columns {
	.el-menu-item {
		&.is-active {
			&::before {
				right: 0;
			}
		}
	}
}
.classic,
.transverse {
	#driver-highlighted-element-stage {
		background-color: #606266 !important;
	}
}
</style>
