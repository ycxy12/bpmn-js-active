import http from '@/api'

/**
 * @name 流程定义
 */

// 流程定义列表
export const listDefinition = (params) => {
	return http.get('/data-quality/flow/definition/listDefinition', params)
}

// 根据流程定义ID获取xml
export const readXmlByProcessDefinitionId = (processDefinitionId) => {
	return http.get(`/data-quality/flow/definition/readXmlByProcessDefinitionId/${processDefinitionId}`)
}

//保存流程设计器内的xml文件
export const saveXml = (params) => {
	return http.post('/data-quality/flow/definition/saveXml', params)
}

// 删除部署信息
export const removeXml = (params) => {
	return http.delete('/data-quality/flow/definition/remove', params)
}
