import http from '@/api'
import routes from '@/assets/routes.json'

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params) => {
	return http.post('/auth/oauth/token', null, { params, noLoading: true, headers: { Authorization: 'Basic cGlnOnBpZw==' } }) // 正常 post json 请求  ==>  application/json
	// return http.post<Login.ResLogin>(`/login`, params, { noLoading: true }); // 控制当前请求不显示 loading
	// return http.post<Login.ResLogin>(`/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
	// return http.post<Login.ResLogin>(`/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
	// return http.get<Login.ResLogin>(`/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
}

// 获取菜单列表
export const getAuthMenuListApi = () => {
	return routes
}

// 获取用户信息
export const getUserInfo = (ticket) => {
	return http.get(`/admin/user/info?ticket=${ticket}`)
}

// 用户退出登录
export const logoutApi = (params) => {
	return http.post('/auth/authentication/removeToken', params)
}
