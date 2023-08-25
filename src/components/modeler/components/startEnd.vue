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
		<el-form-item label="发起人" prop="initiator" v-if="formItem.initiator">
			<el-input v-model="formData.initiator"></el-input>
		</el-form-item>
		<el-form-item label="表单标识key" prop="formKey" v-if="formItem.formKey">
			<el-input v-model="formData.formKey"></el-input>
		</el-form-item>
	</el-form>
</template>

<script setup name="treeAdd">
import { ref, watch, computed, onMounted, toRaw } from 'vue'
import { commonParse } from '../common/parseElement'
import ShowConfig from '../flowable/showConfig'

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
	() => formData.value.initiator,
	(val) => {
		if (val === '') val = null
		updateProperties({ 'flowable:initiator': val })
	}
)
watch(
	() => formData.value.formKey,
	(val) => {
		if (val === '') val = null
		updateProperties({ 'flowable:formKey': val })
	}
)

onMounted(() => {
	formData.value = commonParse(props.element)
})

const updateProperties = (properties) => {
	const modeling = props.modeler.get('modeling')
	modeling.updateProperties(toRaw(props.element), properties)
}

const formItem = computed(() => {
	const bizObj = props.element.businessObject
	const elementType = bizObj.eventDefinitions ? bizObj.eventDefinitions[0].$type : bizObj.$type
	return ShowConfig[elementType] || {}
})
</script>
<style lang="scss" scoped>
.flow_form {
	:deep(.el-form-item__label) {
		font-size: var(--el-font-size-small);
	}
}
</style>
