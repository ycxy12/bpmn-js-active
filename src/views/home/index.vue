<template>
	<div class="define">
		<div class="table_search_btn">
			<span>部署名称</span>
			<el-input v-model="searchParam.name" placeholder="部署名称" @keyup.enter.native="search" />
			<el-button type="primary" @click="search">查询</el-button>
			<el-button type="primary" @click="handleAdd">新增</el-button>
		</div>
		<el-table :data="tableData" :height="tableHeight">
			<el-table-column type="index" label="序号" width="60" align="center" />
			<el-table-column property="name" label="流程名称" />
			<el-table-column property="processDefinitionId" label="流程定义Key" align="center" />
			<el-table-column property="suspensionState" label="流程状态" align="center">
				<template #default="{ row }">
					{{ row.suspensionState === 1 ? '激活' : '挂起' }}
				</template>
			</el-table-column>
			<el-table-column property="version" label="流程版本" align="center" />
			<el-table-column property="deployTime" label="流程部署时间" align="center" />
			<el-table-column label="操作" width="260" align="center">
				<template #default="{ row }">
					<el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
					<el-button link type="primary" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			v-model:current-page="pageable.current"
			v-model:page-size="pageable.size"
			:page-sizes="[10, 20, 30, 40]"
			background
			layout="total, sizes, prev, pager, next, jumper"
			:total="pageable.total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
		<dialogView ref="dialogViewRef"></dialogView>
	</div>
</template>
<script setup name="problem">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listDefinition, removeXml } from '@/api/modules/flow'
import dialogView from './components/dialogView.vue'
import { useTable } from '@/hooks/useTable'

onMounted(() => {
	getTableList()
})

// 表格操作 Hooks
const { tableData, getTableList, search, pageable, searchParam, updatedTotalParam, handleSizeChange, handleCurrentChange } = useTable(listDefinition)

//新增
const router = useRouter()
const handleAdd = () => {
	router.push('/home/modeler')
}

//查看
const dialogViewRef = ref(null)
const handleView = (row) => {
	dialogViewRef.value.openDialog({ processDefinitionId: row.processDefinitionId })
}

//计算表格高度
const tableHeight = computed(() => 'calc(100vh - 125px)')
</script>
<style lang="scss" scoped>
.table_search_btn {
	background-color: #fff;
	padding: 10px;
	margin-bottom: 0;
	& > span {
		font-size: 14px;
		margin-right: 10px;
	}
	:deep(.el-input) {
		margin-left: 0;
		margin-right: auto;
	}
}
.define {
	:deep(.el-pagination) {
		background-color: #fff;
		margin: 0;
		padding: 10px;
	}
}
</style>
