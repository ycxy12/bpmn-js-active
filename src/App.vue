<template>
	<el-config-provider :locale="zhCn">
		<router-view></router-view>
	</el-config-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

onMounted(() => {
	console.log('发布时间: ', __APP_INFO__.lastBuildTime)
})
</script>

<style lang="scss">
#app {
	background-color: #e5eeee;
	background-size: 100% 100%;
	background-repeat: no-repeat;
}
</style>
