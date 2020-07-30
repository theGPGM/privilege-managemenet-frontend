import Vue from 'vue'
import Vuex from 'vuex'

Vue.use( Vuex );

/**
 * 使用 Vuex 存储从数据库查询出的当前用户可访问的权限菜单项
 */
export default new Vuex.Store({
    state : {
        //路由数组
        routes : []
    },
    mutations : {
        /**
         * 将 data（ json 封装的菜单项）放入 routes 中
         * @param state
         * @param data
         */
        initRoutes(state, data){
            state.routes = data;
        }
    },
    actions : {
    }
})
