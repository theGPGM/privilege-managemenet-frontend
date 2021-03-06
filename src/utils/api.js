import axios from 'axios'
/**
 * 封装前端请求的工具类
 */

/**
 * 拦截所有响应，根据相关响应状态码执行不同操作
 */
import router from '../router'
axios.interceptors.response.use(success => {
    if (success.status && 200 == success.status && success.data.status == 500) {
        Message.error(success.data.message);
        return;
    }
    if (success.data.message) {
        Message.success(success.data.message);
    }

    return success.data;
}, error => {
    if (error.response.status == 504 || error.response == 404)
        Message.error("服务器冒烟了，请稍等");
    else if (error.response.status == 403)
        Message.error("权限不足，请联系管理员");
    else if (error.response.status == 401) {
        Message.error("尚未登录，请登录");
        //跳转登录页
        localStorage.removeItem("user");
        router.replace('/');
    } else {
        Message.error("未知错误!");
    }
    return;
})


import {Message} from "element-ui";

let base = '';

export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&';
            }
            return ret;
        }],
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    });
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    });
}
/**
 * 请求后端菜单项 json
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    });
}
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    });
}
