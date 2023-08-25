import http from '@/api'
/**
 * @name 首页模块
 */
// 用户登录

/* 获取列表 */
export const getList = (params) => {
	return http.get('/newWay/datasourceManage/page', params)
}

// 获取分类/标签组织树
export const queryLeftCategoryBusinessTagTree = (params) => {
	return http.get('/newWay/datasourceManage/queryLeftCategoryBusinessTagTree', params)
}

// 插入或更新一条记录
export const saveOrUpdateDatasource = (params) => {
	return http.post('/newWay/datasourceManage/saveOrUpdateDatasource', params)
}

// 测试数据库链接
export const testConnection = (params) => {
	return http.post('/newWay/datasourceManage/testConnection', params)
}

// 获取服务分组
export const queryAppServerGroup = (params) => {
	return http.get('/newWay/datasourceManage/queryAppServerGroup', params)
}

// 删除一条记录
export const delDataSource = (id) => {
	return http.delete(`/newWay/datasourceManage/${id}`)
}
