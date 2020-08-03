<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">
                    GPM 权限管理系统
                </div>
                <div>
                    <el-dropdown class="userInfo" @command="commandHandler">
                        <span class="el-dropdown-link username" style="align-items: center">
                        {{user.name}}<i><img :src="user.userface" :alt="user.name"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="chatRoom">聊天室</el-dropdown-item>
                            <el-dropdown-item command="hrInfo">个人中心</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router>
                        <el-submenu :index="index+''" v-for="(item, index) in routes"
                                    v-if="!item.hidden" :key="index">
                            <template slot="title">
                                <i style="margin-right : 5px;color: #23236a;"
                                   :class="item.iconCls+''" class="menuIcon"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="child.path" v-for="(child, index) in item.children" :key="index">
                                {{child.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator="/" v-if="this.$router.currentRoute.path != '/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div v-if="this.$router.currentRoute.path == '/home'" class="homeWelcome">
                        欢迎来到 GPM 权限管理系统
                    </div>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import router from '../router'
    export default {
        name: "Home",
        data() {
            return {
                // user: JSON.parse(localStorage.getItem('user')),
            }
        },
        mounted() {
            this.$store.dispatch('connect');
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            },
            user(){
                return this.$store.state.currentUser;
            }
        },
        methods: {
            commandHandler(cmd) {
                if (cmd == 'logout') {
                    this.$confirm('此操作将注销登录，是否继续', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest('/logout');
                        localStorage.removeItem('user')
                        this.$store.commit('initRoutes', []);
                        this.$router.replace('/')
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }else if(cmd == 'chatRoom'){
                    router.replace("/chat");
                }else if(cmd = 'hrInfo'){
                    router.replace('/hrInfo')
                }
            },
        }
    }
</script>

<style>
    .homeRouterView {
        margin-top: 20px;
    }

    .homeWelcome {
        text-align: center;
        padding-top: 35px;
        font-size: 35px;
        font-family: 微软雅黑;
        color: #23236a;
        font-weight: bolder;
    }

    .homeHeader {
        background: #23236a;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .homeHeader .title {
        font-size: 20px;
        color: #efefef;
        font-family: 微软雅黑;
    }

    .homeHeader .username {
        color: white;
    }

    .homeHeader .userInfo {
        cursor: pointer;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
    }

    .el-dropdown-link img {
        margin-left: 5px;
        width: 40px;
        height: 40px;
        border-radius: 100%;
    }

</style>