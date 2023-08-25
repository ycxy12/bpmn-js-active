<template>
	<el-dialog title="查看流程" v-model="dialogVisible" width="60%" top="10vh" :before-close="handleClose" :close-on-click-modal="false">
		<div class="dialog_containers">
			<div class="canvas" ref="canvasRef"></div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup name="dialogView">
import { nextTick, ref } from 'vue'
// import modeler from '@/components/modeler/index.vue'
import { readXmlByProcessDefinitionId } from '@/api/modules/flow'

//只读
import BpmnViewer from 'bpmn-js/lib/Viewer'

//通过规则Id查询单条信息
const xml = ref('')
const getXmlById = async (processDefinitionId) => {
	const { data } = await readXmlByProcessDefinitionId(processDefinitionId)
	xml.value = data
	init()
}

const canvasRef = ref(null)
const viewer = ref()
const init = () => {
	//创建BpmnModeler实例
	viewer.value && viewer.value.destroy()
	viewer.value = new BpmnViewer({
		container: canvasRef.value,
		height: 600,
		keyboard: {
			bindTo: window,
		},
	})

	createNewDiagram(xml.value)
}

//加载的bpmn文件
const createNewDiagram = async (data) => {
	data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
		return str.replace(/</g, '&lt;')
	})
	try {
		await viewer.value.importXML(data)
		nextTick(() => {
			fitViewport()
		})
	} catch (err) {
		console.log(err.message, err.warnings)
	}
}

// 让图能自适应屏幕
const fitViewport = () => {
	const bbox = document.querySelector('.dialog_containers .viewport').getBBox()
	const currentViewbox = viewer.value.get('canvas').viewbox()
	const elementMid = {
		x: bbox.x + bbox.width / 2,
		y: bbox.y + bbox.height / 2,
	}
	viewer.value.get('canvas').viewbox({
		x: elementMid.x - currentViewbox.width / 2,
		y: elementMid.y - currentViewbox.height / 2,
		width: currentViewbox.width,
		height: currentViewbox.height,
	})
}

//打开弹框
const dialogVisible = ref(false)
const openDialog = (data) => {
	getXmlById(data.processDefinitionId)
	dialogVisible.value = true
}
//关闭弹框
const handleClose = () => {
	dialogVisible.value = false
}

// 暴露方法给父组件 - 子组件
defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.dialog_containers {
	background-color: #ffffff;
	width: 100%;
	height: 600px;
	background-image: url('@/assets/icons/grid.svg');
	outline: 1px solid #e4e7ed;
}
</style>
