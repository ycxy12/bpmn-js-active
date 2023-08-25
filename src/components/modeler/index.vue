<template>
	<div class="containers">
		<div class="canvas" ref="canvasRef"></div>
		<panel v-if="modeler && isView" :modeler="modeler" :users="users" :groups="groups" :categorys="categorys"></panel>
		<Function v-if="isView" :modeler="modeler" @save="saveModeler"></Function>
	</div>
</template>

<script setup name="Modeler">
import { onMounted, ref, reactive, nextTick, watch } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import panel from './PropertyPanel.vue'
import Function from './Function.vue'
import getInitStr from './flowable/init'
// 引入flowable的节点文件
import flowableModdle from './flowable/flowable.json'

// 以下为bpmn工作流绘图工具的样式
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

// 汉化包
import customTranslate from './common/customTranslate'

const props = defineProps({
	xml: {
		type: String,
		default: '',
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
	isView: {
		type: Boolean,
		default: true,
	},
})

const canvasRef = ref(null)
const modeler = ref()

const init = () => {
	//创建BpmnModeler实例
	modeler.value && modeler.value.destroy()
	modeler.value = new BpmnModeler({
		container: canvasRef.value,
		additionalModules: [{ translate: ['value', customTranslate] }],
		moddleExtensions: {
			flowable: flowableModdle,
		},
	})

	// 注意：必须先加载一个bpmn文件，新建就是加载一个空的bpmn文件，否则不能拖拽节点
	if (props.xml) createNewDiagram(props.xml)
	else createNewDiagram(getInitStr())
}

//加载一个空的bpmn文件
const createNewDiagram = async (data) => {
	data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
		return str.replace(/</g, '&lt;')
	})

	try {
		await modeler.value.importXML(data)
		// fitViewport()
	} catch (err) {
		console.log(err.message, err.warnings)
	}
}

// 让图能自适应屏幕
const zoom = ref(1)
const fitViewport = () => {
	zoom.value = modeler.value.get('canvas').zoom('fit-viewport')
	const bbox = document.querySelector('.containers .viewport').getBBox()
	const currentViewbox = modeler.value.get('canvas').viewbox()
	const elementMid = {
		x: bbox.x + bbox.width / 2 - 65,
		y: bbox.y + bbox.height / 2,
	}
	modeler.value.get('canvas').viewbox({
		x: elementMid.x - currentViewbox.width / 2,
		y: elementMid.y - currentViewbox.height / 2,
		width: currentViewbox.width,
		height: currentViewbox.height,
	})
	zoom.value = (bbox.width / currentViewbox.width) * 1.8
}

const fillColor = () => {
	const canvas = modeler.value.get('canvas')
	modeler.value._definitions.rootElements[0].flowElements.forEach((n) => {
		if (n.$type === 'bpmn:UserTask') {
			const completeTask = this.taskList.find((m) => m.key === n.id) || { completed: true }
			const todoTask = this.taskList.find((m) => !m.completed)
			const endTask = this.taskList[this.taskList.length - 1]
			if (completeTask) {
				canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
				n.outgoing?.forEach((nn) => {
					const targetTask = this.taskList.find((m) => m.key === nn.targetRef.id)
					if (targetTask) {
						canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
					} else if (nn.targetRef.$type === 'bpmn:ExclusiveGateway') {
						// canvas.addMarker(nn.id, 'highlight');
						canvas.addMarker(nn.id, completeTask.completed ? 'highlight' : 'highlight-todo')
						canvas.addMarker(nn.targetRef.id, completeTask.completed ? 'highlight' : 'highlight-todo')
					} else if (nn.targetRef.$type === 'bpmn:EndEvent') {
						if (!todoTask && endTask.key === n.id) {
							canvas.addMarker(nn.id, 'highlight')
							canvas.addMarker(nn.targetRef.id, 'highlight')
						}
						if (!completeTask.completed) {
							canvas.addMarker(nn.id, 'highlight-todo')
							canvas.addMarker(nn.targetRef.id, 'highlight-todo')
						}
					}
				})
			}
		} else if (n.$type === 'bpmn:ExclusiveGateway') {
			n.outgoing.forEach((nn) => {
				const targetTask = this.taskList.find((m) => m.key === nn.targetRef.id)
				if (targetTask) {
					canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
				}
			})
		}
		if (n.$type === 'bpmn:StartEvent') {
			n.outgoing.forEach((nn) => {
				const completeTask = this.taskList.find((m) => m.key === nn.targetRef.id)
				if (completeTask) {
					canvas.addMarker(nn.id, 'highlight')
					canvas.addMarker(n.id, 'highlight')
					return
				}
			})
		}
	})
}

//向父级传递数据
const emit = defineEmits(['save'])
const saveModeler = (result) => {
	emit('save', result)
}

onMounted(() => {
	init()
})

watch(
	() => props.xml,
	(val) => {
		if (val) createNewDiagram(val)
	}
)
</script>

<style lang="scss" scoped>
.containers {
	background-color: #ffffff;
	width: 100%;
	height: 100%;
	position: relative;
	background-image: url('@/assets/icons/grid.svg');
	outline: 1px solid #e4e7ed;
	:deep(.djs-palette) {
		top: 40px;
	}
}
.canvas {
	width: 100%;
	height: 100%;
}
</style>
