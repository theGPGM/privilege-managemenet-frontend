import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "../utils/api";
import Stomp from 'stompjs'
import SockJS from 'sockjs-client'
import { Notification } from 'element-ui';
Vue.use( Vuex );

const now = new Date();

/**
 * 使用 Vuex 存储从数据库查询出的当前用户可访问的权限菜单项
 */
const store = new Vuex.Store({
    state : {
        //路由数组
        routes : [],
        hrs:[],
        sessions:{},
        currentSession: null,
        currentUser : JSON.parse(localStorage.getItem('user')),
        filterKey:'',
        stomp : null,
        isDot : {},
    },
    mutations : {
        /**
         * 将 data（ json 封装的菜单项）放入 routes 中
         * @param state
         * @param data
         */
        initRoutes(state, data){
            state.routes = data;
        },
        changeCurrentSession (state,item) {
            Vue.set(state.isDot,  state.currentUser.username + '2' + item.username, false);
            state.currentSession = item;
        },
        addMessage (state,msg) {
            console.log(msg);
            let message = state.sessions[state.currentUser.username + '2' + msg.to];
            if(!message){
                // state.sessions[state.currentUser.username + '2' + msg.to] = [];
                Vue.set(state.sessions, state.currentUser.username + '2' + msg.to, []);
            }
            state.sessions[state.currentUser.username + '2' + msg.to].push({
                content:msg,
                date: new Date(),
                self: !msg.notself
            })
        },
        INIT_DATA (state) {
            //存储本地聊天记录
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_HRS(state, data){
            state.hrs = data;
        },
        INIT_CURRENT_USER(state, data){
            state.currentUser = data;
        }
    },
    actions : {
        initData (context) {
            getRequest('/chat/').then(resp=>{
                if(resp){
                    context.commit('INIT_HRS', resp);
                }
            })
            context.commit('INIT_DATA');
        },
        connect(context){
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            context.state.stomp.connect({}, success=>{
                //接收消息
                context.state.stomp.subscribe('/user/queue/chat', message=>{
                    let receiveMessage = JSON.parse(message.body);
                    if(!context.state.currentSession || receiveMessage.from != context.state.currentSession.username){
                        Notification.info({
                            title : '【' + receiveMessage.fromNickName + '】发来一条消息',
                            message : receiveMessage.content.length > 10 ? receiveMessage.content.substr(0,10) : receiveMessage.content,
                            position : 'bottom-right'
                        })
                        Vue.set(context.state.isDot, context.state.currentUser.username + '2' + receiveMessage.from, true)
                    }
                    receiveMessage.notself = true;
                    receiveMessage.to = receiveMessage.from;
                    context.commit('addMessage', receiveMessage);
                })
            }, fail=>{

            });
        }
    }
})

/**
 * 开启监控
 */
store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;