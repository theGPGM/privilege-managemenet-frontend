<template>
    <div>
        <div class="PermissionInput">
            <el-input size="mini" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="mini" placeholder="请输入角色中文名" v-model="role.nameZh"></el-input>
            <el-button @click="addRole" size="mini" type="success" icon="el-icon-plus">添加角色</el-button>
        </div>
        <div style="width: 60%;">
            <el-collapse accordion @change="change" v-model="activeName" v-loading="loading">
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r, index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问资源</span>
                            <el-button style="float: right; padding: 3px 0; color: #ff4558; background-color: #eeeaea" icon="el-icon-delete" type="plain" @click="deleteRole(r)"></el-button>
                        </div>
                        <el-tree
                                show-checkbox
                                node-key="id"
                                :default-checked-keys="selectedMenus"
                                :data="allMenus"
                                :props="defaultProps"
                                ref="tree">
                        </el-tree>
                        <div style="display: flex; justify-content: flex-end">
                            <el-button size="mini" type="success" @click="cancel">取消修改</el-button>
                            <el-button size="mini" type="danger" @click="doUpdate(r.id, index)">确认修改</el-button>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PerManage",
        data() {
            return {
                role: {
                    name: '',
                    nameZh: ''
                },
                roles: [],
                allMenus : [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                selectedMenus : [],
                editMenus : [],
                activeName : -1,
                loading : false
            }
        },
        mounted() {
            this.initRoles();
        },
        methods: {
            /**
             * 初始化所有角色
             */
             initRoles() {
                this.loading = true;
                this.getRequest("/system/basic/per/").then(resp => {
                    this.loading = false;
                    if(resp){
                        this.roles = resp;
                    }
                })
            },
            change(rid){
                if(rid){
                    this.initMenus();
                    this.initSelectedMenus(rid);
                }
            },
            /**
             * 初始化所有菜单项
             */
            initMenus(){
                this.getRequest("/system/basic/per/menus").then(resp => {
                    if(resp)
                        this.allMenus = resp;
                })
            },
            /**
             * 通过角色 id 查看角色拥有的可访问菜单项
             * @param rid
             */
            initSelectedMenus(rid){
                this.getRequest("/system/basic/per/menus/" + rid).then(resp => {
                    this.selectedMenus = resp;
                })
            },
            /**
             * 更新角色的可访问资源
             * @param rid
             * @param index
             */
            doUpdate(rid, index){
                let tree = this.$refs.tree[index];
                // 只选择子节点
                let checkedKeys = tree.getCheckedKeys(true);
                let update = '?rid=' + rid
                checkedKeys.forEach(item=>{
                    update += '&menuId=' + item;
                })
                if(checkedKeys.length == 0) update += '&menuId='
                this.putRequest("/system/basic/per/" + update).then(resp => {
                    this.initSelectedMenus(rid);
                    this.activeName = -1;
                })
            },
            addRole() {
                this.postRequest("system/basic/per/", this.role).then(resp=>{
                    if(resp){
                        this.role = [];
                        this.initRoles();
                    }
                })
            },
            /**
             * 取消更新
             */
            cancel(){
                this.activeName = -1;
            },
            deleteRole(data){
                this.$confirm('此操作将删除【' + data.nameZh + '】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("system/basic/per/" + data.id).then(resp=>{
                        if(resp){
                            this.initRoles();
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
    .PermissionInput {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
    }

    .PermissionInput .el-input {
        width: 25%;
        margin-right: 5px;
    }
</style>