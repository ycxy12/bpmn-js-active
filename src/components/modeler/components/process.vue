<template>
	<el-form :model="formData" :rules="rules" ref="ruleFormRef" label-width="120px" label-suffix="：" class="flow_form">
		<el-form-item label="流程分类" prop="processCategory">
			<el-select v-model="formData.processCategory" style="width: 100%">
				<el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
		</el-form-item>
		<el-form-item label="流程标识key" prop="id">
			<el-input v-model="formData.id"></el-input>
		</el-form-item>
		<el-form-item label="流程名称" prop="name">
			<el-input v-model="formData.name"></el-input>
		</el-form-item>
		<el-form-item label="节点描述" prop="documentation">
			<el-input v-model="formData.documentation"></el-input>
		</el-form-item>
		<el-form-item label="执行监听器" prop="executionListener">
			<el-badge :value="0" class="item">
				<el-button size="small">编辑</el-button>
			</el-badge>
		</el-form-item>
		<el-form-item label="信号定义" prop="signal">
			<el-badge :value="0" class="item">
				<el-button size="small">编辑</el-button>
			</el-badge>
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
	id: [{ required: true, message: '请输入流程标识key', trigger: 'blur' }],
}

watch(
	() => formData.value.id,
	(val) => {
		updateProperties({ id: val })
	}
)

watch(
	() => formData.value.name,
	(val) => {
		updateProperties({ name: val })
	}
)

watch(
	() => formData.value.documentation,
	(val) => {
		if (!val) {
			updateProperties({ documentation: [] })
			return
		}
		const documentationElement = props.modeler.get('moddle').create('bpmn:Documentation', { text: val })
		updateProperties({ documentation: [documentationElement] })
	}
)

watch(
	() => formData.value.processCategory,
	(val) => {
		if (val === '') val = null
		updateProperties({ 'flowable:processCategory': val })
	}
)

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
