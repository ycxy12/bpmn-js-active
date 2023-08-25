<template>
	<el-form :model="formData" :rules="rules" ref="ruleFormRef" label-width="120px" label-suffix="：" class="flow_form">
		<el-form-item label="节点 id" prop="id">
			<el-input v-model="formData.id"></el-input>
		</el-form-item>
		<el-form-item label="节点名称" prop="name">
			<el-input v-model="formData.name"></el-input>
		</el-form-item>
		<el-form-item label="节点描述" prop="documentation">
			<el-input v-model="formData.documentation"></el-input>
		</el-form-item>
		<el-form-item label="执行监听器" prop="executionListener">
			<el-badge :value="0">
				<el-button size="small">编辑</el-button>
			</el-badge>
		</el-form-item>
		<el-form-item label="异步" prop="async">
			<el-switch v-model="formData.async" active-text="是" inactive-text="否" />
		</el-form-item>
	</el-form>
</template>

<script setup name="treeAdd">
import { ref, watch, computed, onMounted, toRaw } from 'vue'
import { commonParse } from '../common/parseElement'

const props = defineProps({
	modeler: {
		type: Object,
		required: true,
	},
	element: {
		type: Object,
		required: true,
	},
	categorys: {
		type: Array,
		default: () => [],
	},
})

const ruleFormRef = ref(null)
const formData = ref({})
const rules = {
	id: [{ required: true, message: '请输入节点 id', trigger: 'blur' }],
}

//监听id
const id = computed(() => formData.value.id)
watch(id, (val) => {
	updateProperties({ id: val })
})

//监听name
const name = computed(() => formData.value.name)
watch(name, (val) => {
	updateProperties({ name: val })
})

//监听documentation
const documentation = computed(() => formData.value.documentation)
watch(documentation, (val) => {
	if (val) {
		const documentationElement = props.modeler.get('moddle').create('bpmn:Documentation', { text: val })
		updateProperties({ documentation: [documentationElement] })
	} else {
		updateProperties({ documentation: [] })
	}
})

const async = computed(() => formData.value.async)
watch(async, (val) => {
	if (val === '') val = null
	updateProperties({ 'flowable:async': val })
})

onMounted(() => {
	formData.value = commonParse(props.element)
})

const updateProperties = (properties) => {
	const modeling = props.modeler.get('modeling')
	modeling.updateProperties(toRaw(props.element), properties)
}
</script>
<style lang="scss" scoped>
.flow_form {
	:deep(.el-form-item__label) {
		font-size: var(--el-font-size-small);
	}
}
</style>
