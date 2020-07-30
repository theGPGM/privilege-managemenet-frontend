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

Vue.config.productionTip = false

Vue.use(ElementUI);

/**
 * 全局前置守卫
 * 作用与 Servlet filter 类似
 * 路由跳转前触发
 * 处理页面跳转规则
 */
router.beforeEach((to, from, next) => {
    if (to.path == '/') {
        if(localStorage.getItem("user")){
            next("/home");
        }else{
            next();
        }
    } else {
        if(localStorage.getItem("user")){
            //请求其他页面，将菜单项注入路由中
            initMenu(router, store);
            next();
        } else{
            //未登录时，记录要跳转的页面，跳转到登录页
            next('/?redirect=' + to.path);
        }
    }
})



/**
 * 挂载
 */
new Vue({
    router,
    //将 store 注入每一个子组件
    store,
    render: h => h(App)
}).$mount('#app')
