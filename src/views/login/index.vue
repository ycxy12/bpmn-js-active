<template>
	<div class="login_container">
		<div class="name mr start">
			<img src="@/assets/images/logo.png" alt="" />
			<span>数据质量管理平台</span>
		</div>
		<div class="login_form">
			<div class="logo_text">系统登录</div>
			<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" placeholder="请输入用户名">
						<template #prefix>
							<el-icon class="el-input__icon"><user /></el-icon>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" v-model="loginForm.password" placeholder="请输入密码" show-loginPwd autocomplete="new-loginPwd">
						<template #prefix>
							<el-icon class="el-input__icon"><lock /></el-icon>
						</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div class="login_btn">
				<el-button @click="login(loginFormRef)" type="primary" :loading="loading"> 登录 </el-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { HOME_URL } from '@/config'
import { Encrypt } from '@/utils/cryptojs'
import { randomLenNum } from '@/utils/index'
import { loginApi } from '@/api/modules/login'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'
import { useKeepAliveStore } from '@/stores/modules/keepAlive'
import { initDynamicRouter } from '@/routers/modules/dynamicRouter'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const keepAliveStore = useKeepAliveStore()

const loginFormRef = ref()
const loginRules = reactive({
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const loading = ref(false)
const loginForm = reactive({
	username: 'zy',
	password: 'Qwer@1234#',
	grant_type: 'password',
	scope: 'server',
})

// 提交
const login = (formEl) => {
	if (!formEl) return
	formEl.validate(async (valid) => {
		if (!valid) return
		loading.value = true
		try {
			// 1.执行登录接口
			const query = Object.assign({}, loginForm, { password: Encrypt(loginForm.password, 'MFORCE_12345asd@', 'MFORCE_12345168@') })
			const { access_token, refresh_token } = await loginApi(query)
			userStore.setAccessToken(access_token)
			userStore.setRefreshToken(refresh_token)

			// 2.获取用户信息
			await userStore.setUserInfo()

			//3.获取菜单
			await authStore.getAuthMenuList()

			await initDynamicRouter()

			// 3.清空 tabs、keepAlive 数据
			keepAliveStore.setKeepAliveName()

			// 4.跳转到首页
			router.push(HOME_URL)
		} finally {
			loading.value = false
		}
	})
}

onMounted(() => {
	document.onkeydown = (e) => {
		e = window.event || e
		if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
			if (loading.value) return
			login(loginFormRef.value)
		}
	}
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
