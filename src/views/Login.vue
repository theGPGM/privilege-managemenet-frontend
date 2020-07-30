<template>
    <div>
        <el-form
                :rules="rules"
                ref="loginForm"
                :model="loginForm"
                class="loginContainer"
                v-loading="loading">
            <h2 class="loginTitle">系统登录</h2>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="off"
                          placeholder="请输入用户名..."></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off"
                          placeholder="请输入密码..."></el-input>
            </el-form-item>
            <el-checkbox :model="checked" class="loginRememberMe">记住密码</el-checkbox>
            <el-form-item>
                <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login.vue",
        data() {
            return {
                loading : false,
                loginForm: {
                    username: 'admin',
                    password: '123'
                },
                checked: true,
                rules: {
                    username: [{required: true, message: "请输入用户名", trigger: 'blur'}],
                    password: [{required: true, message: "请输入密码", trigger: 'blur'}],
                }
            }
        },
        methods : {
            /**
             * 提交登录
             */
            submitLogin(){
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        //加载
                        this.loading = true;
                        this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
                            this.loading = false;
                            if(resp){
                                //将用户放入 session 中
                                localStorage.setItem('user', JSON.stringify(resp.obj));
                                //页面跳转
                                let path = this.$route.query.redirect;
                                this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
                            }
                        })
                    } else {
                        this.$message.error('请输入所有字段');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
    .loginContainer {

        border-radius: 15px;
        background-clip: padding-box;
        margin: 100px auto;
        width : 350px;
        padding : 30px 35px 15px 35px;
        background: white;
        border: 1px solid #efefef;
        box-shadow: 0 0 25px #d5d5d5;
    }
    .loginTitle {
        margin: 0px auto 30px auto;
        text-align: center;
        color: #636262;
    }
    .loginRememberMe{
        margin : 0px auto 10px auto;
    }
</style>