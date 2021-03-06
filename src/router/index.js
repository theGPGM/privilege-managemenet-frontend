import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Chat from '../views/chat/Chat.vue'
import HrInfo from "../views/hr/HrInfo";

Vue.use(VueRouter)

/**
 * 项目使用的组件都添加在 routes 数组中
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
        hidden: true,
        children : [
            {
                path:'/chat',
                name:'在线聊天',
                component: Chat,
                hidden : true
            },
            {
                path:'/hrInfo',
                name:'个人中心',
                component: HrInfo,
                hidden : true
            }
        ]
    },
]

/**
 * 创建路由实例
 */
const router = new VueRouter({
    routes
})

export default router
