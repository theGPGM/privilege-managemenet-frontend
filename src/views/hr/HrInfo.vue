<template>
    <div style="display: flex; justify-content: center">
        <el-card style="width: 33%; margin-top: 2%;">
            <div slot="header" class="clearfix">
                <span>{{hr.name}}</span>
            </div>
            <el-upload
                    action="/hr/avatar"
                    style="display: flex; justify-content: center;"
                    :on-success="onSuccess"
                    :data="hr"
                    :show-file-list="false">
                    <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface"/>
            </el-upload>
            <div class="hrInfo">
                <div>用户名：{{hr.name}}</div>
                <div>手机号码：{{hr.phone}}</div>
                <div>电话号码：{{hr.telephone}}</div>
                <div>地址：{{hr.address}}</div>
                <div>备注：{{hr.remark}}</div>
            </div>
            <div style="display: flex; justify-content: center; margin-top: 20px">
                <el-button size="mini" type="success" @click="showUpdateView">修改信息</el-button>
                <el-button size="mini" type="danger" @click="showUpdatePasswordView">修改密码</el-button>
            </div>
        </el-card>
        <el-dialog
                title="更新用户信息"
                :visible.sync="dialogVisible"
                width="30%">
            <el-form :model="updateHr">
                <el-row>
                    <el-tag class="tag" size="small">用户名</el-tag>
                    <el-input placeholder="请输入用户名" v-model="updateHr.name" size="mini" style="width: 50%; margin-left: 12px"></el-input>
                </el-row>
                <el-row>
                    <el-tag class="tag" size="small">手机号码</el-tag>
                    <el-input placeholder="请输入手机号码" v-model="updateHr.phone" size="mini" style="width: 50%"></el-input>
                </el-row>
                <el-row>
                    <el-tag class="tag" size="small">电话号码</el-tag>
                    <el-input placeholder="请输入电话号码" v-model="updateHr.telephone" size="mini" style="width: 50%"></el-input>
                </el-row>
                <el-row>
                    <el-tag class="tag" size="small">地址</el-tag>
                    <el-input placeholder="请输入地址" v-model="updateHr.address" size="mini" style="width: 50%; margin-left: 25px"></el-input>
                </el-row>
                <el-row>
                    <el-tag class="tag" size="small">备注</el-tag>
                    <el-input placeholder="请输入备注" v-model="updateHr.remark" size="mini" style="width: 50%; margin-left: 25px"></el-input>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="doUpdate" size="mini">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="更新密码"
                :visible.sync="dialogPassFormVisible"
                width="30%">
            <el-form :model="updatePassForm">
                <el-row>
                    <el-tag class="tag" size="small">旧密码</el-tag>
                    <el-input placeholder="请输入旧密码" v-model="updatePassForm.oldPass" size="mini" style="width: 50%;"></el-input>
                </el-row>
                <el-row>
                    <el-tag class="tag" size="small">新密码</el-tag>
                    <el-input placeholder="请输入新密码" v-model="updatePassForm.newPass" size="mini" style="width: 50%"></el-input>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogPassFormVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="updatePass" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "HrInfo",
        data(){
            return{
                hr : {},
                updateHr : {},
                dialogVisible : false,
                updatePassForm : {
                    oldPass : '',
                    newPass : '',
                    id : null
                },
                dialogPassFormVisible : false,
            }
        },
        mounted() {
            this.initHr();
        },
        methods:{
            initHr(){
                this.getRequest('/hr/info').then(resp=>{
                    if(resp){
                        this.hr = resp;
                        this.updateHr = Object.assign({}, resp);
                        localStorage.setItem('user', JSON.stringify(resp));
                        this.$store.commit('INIT_CURRENT_USER', resp);
                    }
                })
            },
            showUpdateView(){
                this.dialogVisible = true;
            },
            showUpdatePasswordView(){
                this.updatePassForm = {
                    oldPass : '',
                    newPass : '',
                    id : null
                }
                this.updatePassForm.id = this.hr.id;
                this.dialogPassFormVisible = true;
            },
            doUpdate(){
                this.putRequest('/hr/info', this.updateHr).then(resp=>{
                    this.dialogVisible = false;
                    this.initHr();
                })
            },
            updatePass(){
                this.putRequest('/hr/pass', this.updatePassForm).then(resp=>{
                    this.dialogPassFormVisible = false;
                    if(resp){
                        this.initHr();
                    }
                })
            },
            onSuccess(){
                this.initHr();
            }
        }
    }
</script>

<style>
    .userface{
        width: 100px;
        height: 100px;
        border-radius: 100px;
    }
    .hrInfo {
        margin-top: 40px;
        color: #9fbbec;
        font-size: 14px;
    }
    .tag{
        margin:10px 15px 10px 0px
    }
</style>