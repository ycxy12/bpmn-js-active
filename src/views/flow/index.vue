<template>
	<div class="containers">
		<div class="canvas" ref="canvasRef"></div>
		<div class="properties" ref="propertiesRef"></div>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive, nextTick } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import xmlStr from './xml.js'

//bpmn工作流绘图工具 - 两个属性面板相关模块
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel'

// 以下为bpmn工作流绘图工具的样式
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

//// 右侧属性面包样式
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css'

// Camunda平台执行相关的属性
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

// 汉化包
import customTranslate from './customTranslate.js'

const canvasRef = ref(null)
const propertiesRef = ref(null)
const modeler = ref()

const init = () => {
	// 将汉化包装成一个模块
	const customTranslateModule = { translate: ['value', customTranslate] }

	//创建BpmnModeler实例
	modeler.value = new BpmnModeler({
		container: canvasRef.value,
		propertiesPanel: {
			parent: propertiesRef.value,
		},
		additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, customTranslateModule],
		moddleExtensions: {
			camunda: camundaModdleDescriptor,
		},
	})

	// 注意：必须先加载一个bpmn文件，新建就是加载一个空的bpmn文件，否则不能拖拽节点
	createNewDiagram()
}

//加载一个空的bpmn文件
const createNewDiagram = async () => {
	try {
		const result = await modeler.value.importXML(xmlStr)
		const { warnings } = result
		console.log(warnings)

		modeler.value.get('canvas').zoom('fit-viewport')
	} catch (err) {
		console.log(err.message, err.warnings)
	}
}

onMounted(() => {
	init()
})
</script>

<style lang="scss" scoped>
.containers {
	background-color: #ffffff;
	width: 100%;
	height: 100%;
	position: relative;
	background-image: url('@/assets/icons/grid.svg');
}
.canvas {
	width: 100%;
	height: 100%;
}
.properties {
	position: absolute;
	right: 0;
	top: 0;
	width: 300px;
}
</style>
