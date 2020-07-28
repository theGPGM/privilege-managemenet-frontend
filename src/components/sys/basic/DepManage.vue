<template>
    <div style="width:45%;">
        <el-input
                placeholder="请输入部门名称进行查询"
                v-model="filterText"
                size="small"
                style="margin-bottom: 20px"
                prefix-icon="el-icon-search">
        </el-input>
        <el-tree
                class="filter-tree"
                :data="departments"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="tree"
                :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }"
                  style="display: flex; justify-content: space-between; width: 100%;">
                <span style="font-size:87%; padding-top: 2px">{{ data.name }}</span>
                <span>
                    <el-button
                            type="success"
                            size="mini"
                            @click="() => showAddDepView(data)"
                            style="padding: 2px">
                        添加部门
                    </el-button>
                    <el-button
                            type="danger"
                            size="mini"
                            @click="() => deleteDep(data)"
                            style="padding: 2px">
                        删除部门
                    </el-button>
                </span>
              </span>
        </el-tree>
        <el-dialog
                v-loading="loading"
                title="添加部门"
                :visible.sync="dialogVisible"
                width="30%">
            <div style="margin-bottom: 10px">
                <el-tag size="mini" style="margin-right: 5px">上级部门：{{parentDepName}}</el-tag>
                <span></span>
            </div>
            <el-input prefix-icon="el-icon-plus"
                      placeholder="请输入部门名称"
                      size="mini"
                      style="margin-bottom: 25px"
                      v-model="aNewDep.name">
            </el-input>
            <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="addDep" size="mini">确 定</el-button>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DepManager",
        data() {
            return {
                filterText: '',
                aNewDep: {
                    name: '',
                    parentId : -1,
                },
                parentDepName : '',
                departments: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                dialogVisible: false,
                loading : false
            }
        },
        mounted() {
            this.initDeps();
        },
        methods: {
            initDeps() {
                this.getRequest("/system/basic/dep/").then(resp => {
                    if (resp) {
                        this.departments = resp;
                        console.log(this.departments);
                    }
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            showAddDepView(data) {
                this.aNewDep.parentId = data.id;
                this.parentDepName = data.name;
                this.dialogVisible = true;
            },
            addDep2Deps(deps, dep){
                for(let i = 0; i < deps.length; i++){
                    if(deps[i].id == dep.parentId){
                        deps[i].children = deps[i].children.concat(dep);
                        deps[i].parent = true;
                        return;
                    }else{
                        this.addDep2Deps(deps[i].children, dep);
                    }
                }
            },
            addDep() {
                if(!this.aNewDep.name){
                    this.$message.error("部门名不能为空!");
                    return;
                }
                this.loading = true;
                this.postRequest("system/basic/dep/", this.aNewDep).then(resp=>{
                    this.loading = false;
                    if(resp){
                        this.dialogVisible = false;
                        this.addDep2Deps(this.departments, resp.obj);
                        this.aNewDep.name = '';
                    }
                })
            },
            deleteDepFromDeps(parentDep, deps, id){
                for(let i = 0; i < deps.length; i++){
                    let d = deps[i];
                    if(d.id == id){
                        deps.splice(i, 1);
                        if(deps.length == 0){
                            parentDep.parent = false;
                        }
                        return;
                    }else{
                        this.deleteDepFromDeps(d, d.children, id);
                    }
                }
            }
            ,deleteDep(data) {
                if(data.parent){
                    this.$message.error("有子部门存在，无法删除父部门！");
                    return;
                }
                this.$confirm('此操作将删除部门【' + data.name + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("system/basic/dep/" + data.id).then(resp=>{
                        if(resp){
                            this.dialogVisible = false;
                            this.deleteDepFromDeps(null, this.departments, data.id);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        }
    }
</script>

<style scoped>

</style>