<template>
	<div style="height: 100%">
		<modeler ref="refNode" :xml="xml" :users="users" :groups="groups" :categorys="categorys" @save="saveModeler" />
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import modeler from '@/components/modeler/index.vue'
import { saveXml } from '@/api/modules/flow'

const users = [
	{ name: '张三', id: 'zhangsan' },
	{ name: '李四', id: 'lisi' },
	{ name: '王五', id: 'wangwu' },
]

const groups = [
	{ name: 'web组', id: 'web' },
	{ name: 'java组', id: 'java' },
	{ name: 'python组', id: 'python' },
]

const categorys = [
	{ name: 'OA', id: 'oa' },
	{ name: '财务', id: 'finance' },
]

const xml = ref('')
const getModelDetail = () => {
	fetch('https://cdn.jsdelivr.net/gh/goldsubmarine/workflow-bpmn-modeler@master/src/Leave.bpmn20.xml')
		.then((response) => {
			return response.text()
		})
		.then((val) => {
			xml.value = val
		})
}

const saveModeler = async (data) => {
	const query = { xml: data.xml, name: data.process.name }
	await saveXml(query)
}

onMounted(() => {
	// getModelDetail()
})
</script>

<style lang="scss" scoped></style>
