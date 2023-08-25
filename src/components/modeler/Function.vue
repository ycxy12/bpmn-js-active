<template>
	<div class="flow_function">
		<el-upload action="" :before-upload="openBpmn" style="margin-right: 10px; display: inline-block">
			<el-tooltip effect="dark" content="加载xml" placement="bottom">
				<el-button size="small" :icon="FolderOpened" />
			</el-tooltip>
		</el-upload>
		<el-tooltip effect="dark" content="新建" placement="bottom">
			<el-button size="small" :icon="CirclePlusFilled" @click="createNewDiagram(getInitStr())" />
		</el-tooltip>
		<el-tooltip effect="dark" content="自适应屏幕" placement="bottom">
			<el-button size="small" :icon="Rank" @click="fitViewport" />
		</el-tooltip>
		<el-tooltip effect="dark" content="放大" placement="bottom">
			<el-button size="small" :icon="ZoomIn" @click="zoomViewport(true)" />
		</el-tooltip>
		<el-tooltip effect="dark" content="缩小" placement="bottom">
			<el-button size="small" :icon="ZoomOut" @click="zoomViewport(false)" />
		</el-tooltip>
		<el-tooltip effect="dark" content="后退" placement="bottom">
			<el-button size="small" :icon="Back" @click="commandStack(false)" />
		</el-tooltip>
		<el-tooltip effect="dark" content="前进" placement="bottom">
			<el-button size="small" :icon="Right" @click="commandStack(false)" />
		</el-tooltip>
		<el-button size="small" :icon="Download" @click="saveXML(true)" style="margin-left: auto">下载xml</el-button>
		<el-button size="small" :icon="PictureFilled" @click="saveImg('svg', true)">下载svg</el-button>
		<el-button size="small" type="primary" @click="save">保存模型</el-button>
		<el-button size="small" @click="router.go(-1)">返回</el-button>
	</div>
</template>

<script setup name="Function">
import { onMounted, ref, reactive, nextTick, watch } from 'vue'
import { FolderOpened, CirclePlusFilled, Rank, ZoomIn, ZoomOut, Back, Right, Download, PictureFilled } from '@element-plus/icons-vue'
import getInitStr from './flowable/init'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
	modeler: {
		type: Object,
		required: true,
	},
})

//上传 加载xml
const openBpmn = (file) => {
	const reader = new FileReader()
	reader.readAsText(file, 'utf-8')
	reader.onload = () => {
		createNewDiagram(reader.result)
	}
	return false
}

//加载xml
const createNewDiagram = async (data) => {
	// 将字符串转换成图显示出来
	data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
		return str.replace(/</g, '&lt;')
	})
	try {
		await props.modeler.importXML(data)
	} catch (err) {
		console.error(err.message, err.warnings)
	}
}

// 让图能自适应屏幕
const zoom = ref(1)
const fitViewport = () => {
	zoom.value = props.modeler.get('canvas').zoom('fit-viewport')
	const bbox = document.querySelector('.containers .viewport').getBBox()
	const currentViewbox = props.modeler.get('canvas').viewbox()
	const elementMid = {
		x: bbox.x + bbox.width / 2 - 65,
		y: bbox.y + bbox.height / 2,
	}
	props.modeler.get('canvas').viewbox({
		x: elementMid.x - currentViewbox.width / 2,
		y: elementMid.y - currentViewbox.height / 2,
		width: currentViewbox.width,
		height: currentViewbox.height,
	})
	zoom.value = (bbox.width / currentViewbox.width) * 1.8
}

// 放大缩小
const zoomViewport = (zoomIn = true) => {
	zoom.value = props.modeler.get('canvas').zoom()
	zoom.value += zoomIn ? 0.1 : -0.1
	props.modeler.get('canvas').zoom(zoom.value)
}

//操作前进/后退
const commandStack = (done = true) => {
	if (done) props.modeler.get('commandStack').redo()
	else props.modeler.get('commandStack').undo()
}

//下载xml
const saveXML = async (download = false) => {
	try {
		const { xml } = await props.modeler.saveXML({ format: true })
		if (download) {
			downloadFile(`${getProcessElement().name}.bpmn20.xml`, xml, 'application/xml')
		}
		return xml
	} catch (err) {
		console.log(err)
	}
}

//下载svg
const saveImg = async (type = 'svg', download = false) => {
	try {
		const { svg } = await props.modeler.saveSVG({ format: true })
		if (download) {
			downloadFile(getProcessElement().name, svg, 'image/svg+xml')
		}
		return svg
	} catch (err) {
		console.log(err)
	}
}

//获取下载文件名称
const getProcessElement = () => {
	const rootElements = props.modeler.getDefinitions().rootElements
	for (let i = 0; i < rootElements.length; i++) {
		if (rootElements[i].$type === 'bpmn:Process') return rootElements[i]
	}
}

//下载文件
const downloadFile = (filename, data, type) => {
	var a = document.createElement('a')
	var url = window.URL.createObjectURL(new Blob([data], { type: type }))
	a.href = url
	a.download = filename
	a.click()
	document.body.removeChild(a)
	window.URL.revokeObjectURL(url)
}

//保存模型
const emit = defineEmits(['save'])
const save = async () => {
	const process = getProcess()
	const xml = await saveXML()
	const result = { process, xml }
	emit('save', result)
}

//保存模型 参数
const getProcess = () => {
	const element = getProcessElement()
	return {
		id: element.id,
		name: element.name,
		category: element.$attrs['flowable:processCategory'],
	}
}
</script>

<style lang="scss" scoped>
.flow_function {
	position: absolute;
	top: 8px;
	left: 80px;
	width: calc(100% - 490px);
	display: flex;
}
</style>
