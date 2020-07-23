import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

/**
 * 定义路由组件
 * 路由 : 通过不同的 url 访问不同的内容
 * @type {({path: string, component: {data(): {loginForm: {password: string, username: string}, checked: boolean, rules: {password: [{trigger: string, message: string, required: boolean}], username: [{trigger: string, message: string, required: boolean}]}}, methods: {submitLogin(): void}, name: string}, hidden: boolean, name: string}|{path: string, component: {data(): {user: any}, computed: {routes(): *}, methods: {commandHandler(*): void}, name: string}, hidden: boolean, name: string})[]}
 */
const routes = [
    {
        //Login.vue
        path: '/',
        name: 'Login',
        component: Login,
        hidden : true
    }, {
        //Home.vue
        path: '/home',
        name: 'Home',
        component: Home,
        hidden: true
    }
]

/**
 * 创建路由实例
 */
const router = new VueRouter({
    routes
})

export default router
