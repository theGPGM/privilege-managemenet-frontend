import {getRequest} from "./api";

/**
 * 本类为获取菜单项的工具类
 * @param router
 * @param store
 */
export const initMenu = (router, store) => {
    //已有缓存，直接返回
    if (store.state.routes.length > 0) return;
    //刷新或其它导致缓存为空，重新请求
    getRequest('/menu').then(data => {
        if (data) {
            //初始化菜单项
            let fmtRoutes = formatRoutes(data);
            //将菜单项组件加入路由数组中
            router.addRoutes(fmtRoutes);
            //将菜单项存储在 store 中
            store.commit('initRoutes', fmtRoutes);
        }
    })
}

/**
 * 初始化菜单项
 * @param routes
 * @returns {[]}
 */
export const formatRoutes = (routes) => {
    let fmRoutes = [];
    //获取一级菜单
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router
        //递归获取次级菜单
        if (children && children instanceof Array) {
            children = formatRoutes(children)
        }
        let fmRouter = {
            path: path,
            name: name,
            meta: meta,
            iconCls: iconCls,
            children: children,
            //处理 component 字段的字符串
            component(resolve) {
                if (component.startsWith("Home"))
                    require(['../views/' + component + '.vue'], resolve);
                else if (component.startsWith("Emp"))
                    require(['../views/emp/' + component + '.vue'], resolve);
                else if (component.startsWith("Sta"))
                    require(['../views/sta/' + component + '.vue'], resolve);
                else if (component.startsWith("Sal"))
                    require(['../views/sal/' + component + '.vue'], resolve);
                else if (component.startsWith("Sys"))
                    require(['../views/sys/' + component + '.vue'], resolve);
                else if (component.startsWith("Per"))
                    require(['../views/per/' + component + '.vue'], resolve);
            }
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}