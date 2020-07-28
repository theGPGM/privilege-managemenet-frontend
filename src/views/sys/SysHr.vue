<template>
    <div>
        <div style="display: flex; justify-content: center; margin-bottom: 5%">
            <el-input
                    v-model="keywords"
                    prefix-icon="el-icon-search"
                    placeholder="请输入用户名进行查询"
                    size="mini"
                    style="width: 25%; margin-right: 5px"></el-input>
            <el-button type="success" size="mini" icon="el-icon-search" @click="doSearch">搜索</el-button>
        </div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center" v-loading="wholeLoading">
            <el-card class="hr-card" v-for="(hr,index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; padding: 3px 0; color:red" type="text"
                               icon="el-icon-delete" @click="doDelete(hr)"></el-button>
                </div>
                <div style="display: flex; justify-content: center;">
                    <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface"/>
                </div>
                <div class="hrInfo">
                    <div>用户名：{{hr.name}}</div>
                    <div>手机号码：{{hr.phone}}</div>
                    <div>电话号码：{{hr.telephone}}</div>
                    <div>地址：{{hr.address}}</div>
                    <div style="margin-top: 10px">用户状态：
                        <el-switch
                                v-model="hr.enabled"
                                active-text="启用"
                                inactive-text="禁用"
                                inactive-color="red"
                                @change="change(hr)">
                        </el-switch>
                    </div>
                    <div style="margin-top: 10px">用户角色：
                        <el-tag v-for="(role, index) in hr.roles" :key="index" type="success" size="mini"
                                style="margin-right: 10px; margin-bottom: 2px">{{role.nameZh}}
                        </el-tag>
                        <el-popover
                                placement="right"
                                @show="showAllRoles(hr)"
                                title="角色"
                                width="200"
                                trigger="click"
                                @hide="hideRoles(hr)">
                            <el-select v-model="selectedRoles" placeholder="请选择角色" size="mini" multiple>
                                <el-option
                                        v-for="(role, i) in roles"
                                        :key="i"
                                        :label="role.nameZh"
                                        :value="role.id">
                                </el-option>
                            </el-select>
                            <el-button slot="reference" siz="mini" icon="el-icon-more" type="text"></el-button>
                        </el-popover>
                    </div>
                    <div>备注：{{hr.remark}}</div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysHr.vue",
        data() {
            return {
                keywords: '',
                hrs: [],
                roles: [],
                selectedRoles: [],
                wholeLoading : false
            }
        },
        mounted() {
            this.initHrs();
        },
        methods: {
            doSearch() {
                this.initHrs();
            },
            initHrs() {
                this.wholeLoading = true;
                this.getRequest("/system/operator/?keywords=" + this.keywords).then(resp => {
                    this.wholeLoading = false;
                    if (resp) {
                        this.hrs = resp;
                    }
                })
            },
            showAllRoles(hr) {
                this.selectedRoles = [];
                hr.roles.forEach(role => {
                    this.selectedRoles.push(role.id);
                })
                console.log(this.selectedRoles);
                this.initAllRoles();
            },
            change(hr) {
                this.putRequest("/system/operator/", hr).then(resp => {
                    if (resp) {
                        this.initHrs();
                    }
                })
            },
            initAllRoles() {
                this.getRequest("/system/operator/roles").then(resp => {
                    if (resp) {
                        this.roles = resp;
                    }
                })
            },
            hideRoles(hr) {
                let roles = hr.roles;
                let flag = false;
                let i = 0;
                /**
                 * 检查数组是否发生变化
                 */
                if(roles.length == this.selectedRoles.length){
                    this.selectedRoles.forEach(sr=>{
                        roles.forEach(r=>{
                            if(r.id == sr) i++;
                        })
                    })
                    flag = i != roles.length;
                }else{
                    flag = true;
                }
                if (flag) {
                    let url = '/system/operator/roles?id=' + hr.id + '&rid=';
                    this.selectedRoles.forEach(item => {
                        url += item + '&rid=';
                    })
                    this.putRequest(url).then(resp => {
                        this.initHrs();
                    })
                }
            },
            doDelete(hr){
                this.$confirm('此操作将删除用户【' + hr.name + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("system/operator/" + hr.id).then(resp=>{
                        if(resp){
                            this.initHrs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style>
    .hr-card {
        width: 33%;
        margin-bottom: 5%;
        margin-right: 5%;
    }

    .userface {
        width: 72px;
        height: 72px;
        border-radius: 72px;
    }

    .hrInfo {
        margin-top: 40px;
        color: #9fbbec;
        font-size: 12px;
    }
</style>