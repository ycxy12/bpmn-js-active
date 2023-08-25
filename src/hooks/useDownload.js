/**
 * @description 接收数据流生成 blob，创建链接，下载文件
 * @param {Function} api 导出表格的api方法 (必传)
 * @param {String} tempName 导出的文件名 (必传)
 * @param {Object} params 导出的参数 (默认{})
 * @param {String} fileType 导出的文件格式 (默认为.xlsx)
 * */
export const useDownload = async (api, tempName, params = {}) => {
	try {
		const res = await api(params)
		const blob = new Blob([res])
		// 兼容 edge 不支持 createObjectURL 方法
		if ('msSaveOrOpenBlob' in navigator) return window.navigator.msSaveOrOpenBlob(blob, tempName + fileType)
		const blobUrl = window.URL.createObjectURL(blob)
		const exportFile = document.createElement('a')
		exportFile.style.display = 'none'
		exportFile.download = `${tempName}`
		exportFile.href = blobUrl
		document.body.appendChild(exportFile)
		exportFile.click()
		// 去除下载对 url 的影响
		document.body.removeChild(exportFile)
		window.URL.revokeObjectURL(blobUrl)
	} catch (error) {
		console.log(error)
	}
}
