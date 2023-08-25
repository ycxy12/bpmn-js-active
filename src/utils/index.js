/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @returns {String}
 */
export function localGet(key) {
	const value = window.localStorage.getItem(key)
	try {
		return JSON.parse(window.localStorage.getItem(key))
	} catch (error) {
		return value
	}
}

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {*} value Storage值
 * @returns {void}
 */
export function localSet(key, value) {
	window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @returns {void}
 */
export function localRemove(key) {
	window.localStorage.removeItem(key)
}

/**
 * @description 清除所有localStorage
 * @returns {void}
 */
export function localClear() {
	window.localStorage.clear()
}

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList) {
	let newMenuList = JSON.parse(JSON.stringify(menuList))
	return newMenuList.flatMap((item) => [item, ...(item.children ? getFlatMenuList(item.children) : [])])
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList) {
	let newMenuList = JSON.parse(JSON.stringify(menuList))
	return newMenuList.filter((item) => {
		item.children?.length && (item.children = getShowMenuList(item.children))
		return !item.meta?.isHide
	})
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList, parent = [], result = {}) => {
	for (const item of menuList) {
		result[item.path] = [...parent, item]
		if (item.children) getAllBreadcrumbList(item.children, result[item.path], result)
	}
	return result
}

/**
 * @description 生成随机len位数字
 * @param {Number} length 长度
 * @param {Boolean} date 是否加时间戳
 * @returns {Number}
 * */
export const randomLenNum = (length, date) => {
	let random = ''
	random = Math.ceil(Math.random() * 100000000000000)
		.toString()
		.substr(0, typeof length === 'number' ? length : 4)
	if (date) random = random + Date.now()
	return random
}

/**
 * @description 获取assets静态资源
 * @param {String} url 路径
 * @returns {String} 文件路径
 * */
export const getAssetsFile = (url) => {
	return new URL(`../assets/images/${url}`, import.meta.url).href
}
