<template>
	<div class="flow">
		<div class="canvas" ref="canvasRef"></div>
		<!--属性面板将通过该元素呈现到其中-->
		<div class="panel" id="js-properties-panel"></div>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import BpmnModeler from 'bpmn-js/lib/Modeler.js' // 引入 bpmn-js
// 导入一下有关于bpmn-js的字体库以及样式文件
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// 右侧属性面包样式
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css'
// 汉化包 (这里注意你们项目的路径！！！！！！！)
import customTranslate from './customTranslate.js'
// 注意这个xml文件
import xmlStr from './xml.js' // 放在下面了
// 两个属性面板相关模块
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel'
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'

const canvasRef = ref(null)
const state = reactive({
	bpmnModeler: null,
	bpmnXmlStr: xmlStr, // xml数据
})
// 注意：必须先加载一个bpmn文件，新建就是加载一个空的bpmn文件，否则不能拖拽节点
const createNewDiagram = async (bpmn) => {
	// 将字符串转换成图显示出来
	try {
		const result = await state.bpmnModeler.importXML(bpmn)
		// state.bpmnModeler.get('canvas').zoom('fit-viewport');
		const { warnings } = result
		console.log(warnings)
	} catch (e) {
		ElMessage.error('打开模型出错，数据格式有误！')
		console.log('error--->', e)
	}
}
const init = () => {
	// 将汉化包装成一个模块
	const customTranslateModule = {
		translate: ['value', customTranslate],
	}
	// 生成实例
	state.bpmnModeler = new BpmnModeler({
		container: canvasRef.value, // 获取到属性ref为“canvasRef”的dom节点
		propertiesPanel: {
			parent: '#js-properties-panel',
		},
		additionalModules: [
			BpmnPropertiesPanelModule,
			BpmnPropertiesProviderModule,
			//  汉化模块
			customTranslateModule,
		],
		moddleExtensions: {
			camunda: CamundaBpmnModdle,
		},
	})
	createNewDiagram(state.bpmnXmlStr) // 新增流程定义
}
onMounted(() => {
	init()
})
</script>

<style lang="scss" scoped></style>
