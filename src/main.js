import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from './utils/menus'
import 'font-awesome/css/font-awesome.min.css'


Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;


/**
 * 全局路由的前置守卫，作用与 filter 相似
 * 路由跳转前触发
 */
router.beforeEach((to, from, next) => {
    //请求登录页，直接跳转
    if (to.path == '/') {
        next();
    } else {
        //已登录
        if(sessionStorage.getItem("user")){
            //请求其他页面，将菜单项注入路由中
            initMenu(router, store);
            next();
        } else{//未登录
            next('/?redirect=' + to.path);
        }
    }
})

Vue.config.productionTip = false

Vue.use(ElementUI, );

/**
 * 挂载模块
 */
new Vue({
    router,
    //将 store 注入每一个子组件
    store,
    render: h => h(App)
}).$mount('#app')
