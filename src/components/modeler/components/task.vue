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
		<el-form-item label="任务监听器" prop="taskListener" v-if="formItem.taskListener">
			<el-badge :value="0">
				<el-button size="small">编辑</el-button>
			</el-badge>
		</el-form-item>
		<el-form-item label="人员类型" prop="userType" v-if="formItem.userType">
			<el-select v-model="formData.userType" style="width: 100%">
				<el-option v-for="item in userTypeOption" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
		</el-form-item>
		<el-form-item label="指定人员" prop="assignee" v-if="formItem.assignee && formData.userType === 'assignee'">
			<el-select v-model="formData.assignee" filterable allow-create style="width: 100%">
				<el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
		</el-form-item>
		<el-form-item label="候选人员" prop="candidateUsers" v-if="formItem.candidateUsers && formData.userType === 'candidateUsers'">
			<el-select v-model="formData.candidateUsers" multiple filterable allow-create style="width: 100%">
				<el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
		</el-form-item>
		<el-form-item label="候选组" prop="candidateGroups" v-if="formItem.candidateGroups && formData.userType === 'candidateGroups'">
			<el-select v-model="formData.candidateGroups" multiple filterable allow-create style="width: 100%">
				<el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
		</el-form-item>
		<el-form-item label="多实例" prop="multiInstance">
			<el-badge :value="0">
				<el-button size="small">编辑</el-button>
			</el-badge>
		</el-form-item>
		<el-form-item label="异步" prop="async">
			<el-switch v-model="formData.async" active-text="是" inactive-text="否" />
		</el-form-item>
		<el-form-item label="优先级" prop="priority" v-if="formItem.priority">
			<el-input v-model="formData.priority"></el-input>
		</el-form-item>
		<el-form-item label="表单标识key" prop="formKey" v-if="formItem.formKey">
			<el-input v-model="formData.formKey"></el-input>
		</el-form-item>
		<el-form-item label="跳过表达式" prop="skipExpression" v-if="formItem.skipExpression">
			<el-input v-model="formData.skipExpression"></el-input>
		</el-form-item>
		<el-form-item label="是否为补偿" prop="isForCompensation" v-if="formItem.isForCompensation">
			<el-switch v-model="formData.isForCompensation" active-text="是" inactive-text="否" />
		</el-form-item>
		<el-form-item label="服务任务可触发" prop="triggerable" v-if="formItem.triggerable">
			<el-switch v-model="formData.triggerable" active-text="是" inactive-text="否" />
		</el-form-item>
		<el-form-item label="自动存储变量" prop="autoStoreVariables" v-if="formItem.autoStoreVariables">
			<el-switch v-model="formData.autoStoreVariables" active-text="是" inactive-text="否" />
		</el-form-item>
		<el-form-item label="输入变量" prop="ruleVariablesInput" v-if="formItem.ruleVariablesInput">
			<el-input v-model="formData.ruleVariablesInput"></el-input>
		</el-form-item>
		<el-form-item label="规则" prop="rules" v-if="formItem.rules">
			<el-input v-model="formData.rules"></el-input>
		</el-form-item>
		<el-form-item label="结果变量" prop="resultVariable" v-if="formItem.resultVariable">
			<el-input v-model="formData.resultVariable"></el-input>
		</el-form-item>
		<el-form-item label="排除" prop="exclude" v-if="formItem.exclude">
			<el-switch v-model="formData.exclude" active-text="是" inactive-text="否" />
		</el-form-item>
		<el-form-item label="类" prop="class" v-if="formItem.class">
			<el-input v-model="formData.class"></el-input>
		</el-form-item>
		<el-form-item label="到期时间" prop="dueDate" v-if="formItem.dueDate" style="width: 100%">
			<el-date-picker v-model="formData.dueDate" type="datetime" />
		</el-form-item>
	</el-form>
</template>

<script setup name="treeAdd">
import { ref, watch, computed, onMounted, toRaw, watchEffect } from 'vue'
import { commonParse, userTaskParse } from '../common/parseElement'
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
	users: {
		type: Array,
		required: true,
	},
	groups: {
		type: Array,
		required: true,
	},
})

const ruleFormRef = ref(null)
const formData = ref({})
const rules = {
	id: [{ required: true, message: '请输入节点 id', trigger: 'blur' }],
}
const userTypeOption = [
	{ name: '指定人员', id: 'assignee' },
	{ name: '候选人员', id: 'candidateUsers' },
	{ name: '候选组', id: 'candidateGroups' },
]
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
//监听executionListener
const executionListener = computed(() => formData.value.executionListener)
watch(executionListener, (val) => {
	defaultUpdate(val, 'executionListener')
})
//监听taskListener
const taskListener = computed(() => formData.value.taskListener)
watch(taskListener, (val) => {
	defaultUpdate(val, 'taskListener')
})
//监听multiInstance
const multiInstance = computed(() => formData.value.multiInstance)
watch(multiInstance, (val) => {
	defaultUpdate(val, 'multiInstance')
})
//监听async
const async = computed(() => formData.value.async)
watch(async, (val) => {
	defaultUpdate(val, 'async')
})
//监听priority
const priority = computed(() => formData.value.priority)
watch(priority, (val) => {
	defaultUpdate(val, 'priority')
})
//监听formKey
const formKey = computed(() => formData.value.formKey)
watch(formKey, (val) => {
	defaultUpdate(val, 'formKey')
})
//监听skipExpression
const skipExpression = computed(() => formData.value.skipExpression)
watch(skipExpression, (val) => {
	defaultUpdate(val, 'skipExpression')
})
//监听isForCompensation
const isForCompensation = computed(() => formData.value.isForCompensation)
watch(isForCompensation, (val) => {
	defaultUpdate(val, 'isForCompensation')
})
//监听triggerable
const triggerable = computed(() => formData.value.triggerable)
watch(triggerable, (val) => {
	defaultUpdate(val, 'triggerable')
})
//监听autoStoreVariables
const autoStoreVariables = computed(() => formData.value.autoStoreVariables)
watch(autoStoreVariables, (val) => {
	defaultUpdate(val, 'autoStoreVariables')
})
//监听ruleVariablesInput
const ruleVariablesInput = computed(() => formData.value.ruleVariablesInput)
watch(ruleVariablesInput, (val) => {
	defaultUpdate(val, 'ruleVariablesInput')
})
//监听rules
const rulesReplace = computed(() => formData.value.rules)
watch(rulesReplace, (val) => {
	defaultUpdate(val, 'rules')
})
//监听resultVariable
const resultVariable = computed(() => formData.value.resultVariable)
watch(resultVariable, (val) => {
	defaultUpdate(val, 'resultVariable')
})
//监听exclude
const exclude = computed(() => formData.value.exclude)
watch(exclude, (val) => {
	defaultUpdate(val, 'exclude')
})
//监听class
const classReplace = computed(() => formData.value.class)
watch(classReplace, (val) => {
	defaultUpdate(val, 'class')
})
//监听dueDate
const dueDate = computed(() => formData.value.dueDate)
watch(dueDate, (val) => {
	defaultUpdate(val, 'dueDate')
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
//监听userType
const userType = computed(() => formData.value.userType)
watch(userType, (val) => {
	if (val) {
		const types = ['assignee', 'candidateUsers', 'candidateGroups']
		types.forEach((type) => {
			delete props.element.businessObject.$attrs[`flowable:${type}`]
			delete formData.value[type]
		})
	}
})
//监听assignee
const assignee = computed(() => formData.value.assignee)
watch(assignee, (val) => {
	if (formData.value.userType === 'assignee') {
		updateProperties({ 'flowable:assignee': val })
	} else {
		delete props.element.businessObject.$attrs[`flowable:assignee`]
	}
})
//监听candidateUsers
const candidateUsers = computed(() => formData.value.candidateUsers)
watch(candidateUsers, (val) => {
	if (formData.value.userType === 'candidateUsers') {
		updateProperties({ 'flowable:candidateUsers': val?.join(',') })
	} else {
		delete props.element.businessObject.$attrs[`flowable:candidateUsers`]
	}
})
//监听candidateGroups
const candidateGroups = computed(() => formData.value.candidateGroups)
watch(candidateGroups, (val) => {
	if (formData.value.userType === 'candidateGroups') {
		updateProperties({ 'flowable:candidateGroups': val?.join(',') })
	} else {
		delete props.element.businessObject.$attrs[`flowable:candidateGroups`]
	}
})

//监听字段的后续操作
const defaultUpdate = (val, key) => {
	const flowObj = {}
	flowObj[`flowable:${key}`] = val ? val : null
	updateProperties(flowObj)
}

onMounted(() => {
	let cache = commonParse(props.element)
	formData.value = userTaskParse(cache)
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
