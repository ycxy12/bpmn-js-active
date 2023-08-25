<template>
	<div ref="propertyPanel" class="property-panel">
		<div v-if="nodeName" class="node-name">{{ nodeName }}</div>
		<component :is="getComponent" v-if="elements" :element="elements" :modeler="modeler" :users="users" :groups="groups" :categorys="categorys" />
	</div>
</template>

<script setup name="PropertyPanel">
import { ref, onMounted, computed, nextTick } from 'vue'
import taskPanel from './components/task.vue'
import startEndPanel from './components/startEnd.vue'
import processPanel from './components/process.vue'
import sequenceFlowPanel from './components/sequenceFlow.vue'
import gatewayPanel from './components/gateway.vue'
import { NodeName } from './common/translationsGerman'

const props = defineProps({
	modeler: {
		type: Object,
		required: true,
	},
	users: {
		type: Array,
		default: () => [],
	},
	groups: {
		type: Array,
		default: () => [],
	},
	categorys: {
		type: Array,
		default: () => [],
	},
})

const elements = ref(null)
const getComponent = computed(() => {
	const type = elements.value?.type
	console.log(type)
	if (['bpmn:IntermediateThrowEvent', 'bpmn:StartEvent', 'bpmn:EndEvent'].includes(type)) {
		return startEndPanel
	}
	if (['bpmn:UserTask', 'bpmn:Task', 'bpmn:SendTask', 'bpmn:ReceiveTask', 'bpmn:ManualTask', 'bpmn:BusinessRuleTask', 'bpmn:ServiceTask', 'bpmn:ScriptTask'].includes(type)) {
		// 'bpmn:CallActivity',  'bpmn:SubProcess'
		return taskPanel
	}
	if (type === 'bpmn:SequenceFlow') {
		return sequenceFlowPanel
	}
	if (['bpmn:InclusiveGateway', 'bpmn:ExclusiveGateway', 'bpmn:ParallelGateway', 'bpmn:EventBasedGateway'].includes(type)) {
		return gatewayPanel
	}
	if (type === 'bpmn:Process') {
		return processPanel
	}
	return null
})

const nodeName = computed(() => {
	if (elements.value) {
		const bizObj = elements.value.businessObject
		const type = bizObj?.eventDefinitions ? bizObj.eventDefinitions[0].$type : bizObj.$type
		return NodeName[type] || type
	}
	return ''
})

const handleModeler = () => {
	props.modeler.on('root.added', (e) => {
		if (e.element.type === 'bpmn:Process') {
			elements.value = null
			nextTick(() => {
				elements.value = e.element
			})
		}
	})
	props.modeler.on('element.click', (e) => {
		if (e.element.type === 'bpmn:Process') {
			elements.value = e.element
		}
	})
	props.modeler.on('selection.changed', (e) => {
		// hack 同类型面板不刷新
		elements.value = null
		const element = e.newSelection && e.newSelection.length > 0 ? e.newSelection[0] : null
		if (element) {
			nextTick(() => {
				elements.value = element
			})
		}
	})
}

onMounted(() => {
	handleModeler()
})
</script>

<style lang="scss" scoped>
.property-panel {
	position: absolute;
	right: 0;
	top: 0;
	width: 300px;
	background-color: #f0f2f5;
	width: 400px;
	min-height: 650px;
	box-sizing: border-box;
	padding: 20px;
	.el-form--label-top .el-form-item__label {
		padding: 0;
	}
	.el-form-item {
		margin-bottom: 6px;
	}
	.tab-table .el-form-item {
		margin-bottom: 16px;
	}
	.node-name {
		border-bottom: 1px solid #ccc;
		padding: 0 0 10px 20px;
		margin-bottom: 10px;
		font-size: 16px;
		font-weight: bold;
		color: #444;
	}
}
</style>
