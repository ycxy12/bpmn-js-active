import { createApp } from 'vue'
import App from './App.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import ElementPlus from 'element-plus' // element plus
import 'element-plus/dist/index.css'
import '@/styles/common.scss' // CSS通用样式表
import '@/styles/element.scss' // 自定义 element css

import * as Icons from '@element-plus/icons-vue' // element icons
import 'virtual:svg-icons-register' // svg icons
import 'default-passive-events' //消除控制台警告 Added non-passive event listener to a scroll-blocking ‘mousewheel‘ event.
import router from '@/routers' // vue Router
import pinia from '@/stores' // pinia store
import formCreate from '@form-create/element-ui'
import FcDesigner from '@form-create/designer'

const app = createApp(App)
app.component('SvgIcon', SvgIcon)

// 注册 Element Icons 组件
Object.keys(Icons).forEach((key) => {
	app.component(key, Icons[key])
})

app.use(formCreate)
app.use(FcDesigner)

app.use(ElementPlus).use(router).use(pinia).mount('#app')
