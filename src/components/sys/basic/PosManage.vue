<template>
    <div>
        <div>
            <el-input
                    placeholder="添加职位"
                    v-model="pos.name"
                    clearable
                    size="mini"
                    class="PosInput"
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition">
            </el-input>
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addPosition">添加</el-button>
        </div>
        <div>
            <el-table
                    :data="positions"
                    stripe
                    border
                    class="PosTable"
                    size="mini"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位名称"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" plain size="mini" style="margin-top: 10px" :disabled="multipleSelection.length == 0" @click="multiDelete">批量删除</el-button>
        </div>
        <el-dialog title="修改职位" :visible.sync="dialogFormVisible"
                    width="30%">
            <div>
                <el-tag size="mini"style="margin-bottom: 10px">
                    职位名称
                </el-tag>
                <el-input size="mini"
                        style="margin-bottom: 10px"
                        v-model="editPos.name"></el-input>
            </div>
            <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="doUpdate">确 定</el-button>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "PosManage",
        data() {
            return {
                pos: {
                    name: ''
                },
                positions: [],
                editPos : {
                    name : '',
                },
                dialogFormVisible: false,
                multipleSelection : []
            }
        },
        /**
         * 在访问这个 vue 之后就挂载 initPositions() 方法
         */
        mounted() {
            this.initPositions();
        },
        methods: {
            initPositions() {
                this.getRequest("/system/basic/pos/").then(resp => {
                    if (resp) {
                        this.positions = resp;
                    }
                })
            },
            addPosition() {
                if (!this.pos.name) {
                    this.$message.error('职位名称不可以为空');
                } else {
                    this.postRequest("/system/basic/pos/", this.pos).then(resp => {
                        if (resp) {
                            this.initPositions();
                            this.pos.name = '';
                        }
                    });
                }
            },
            handleDelete(index, data) {
                this.$confirm('此操作将删除【' + data.name + '】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/" + data.id).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            showEditView(index, data) {
                Object.assign(this.editPos, data);
                this.dialogFormVisible = true;
            },
            doUpdate() {
                this.dialogFormVisible = false;
                this.putRequest("system/basic/pos/", this.editPos).then(resp=>{
                    if(resp){
                        this.initPositions();
                    }
                })
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            multiDelete(){
                this.$confirm('此操作将删除【'+ this.multipleSelection.length +'】条记录，是否继续', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids='?';
                    this.multipleSelection.forEach(item=>{
                        ids += 'ids=' + item.id + '&';
                    })
                    this.deleteRequest("system/basic/pos/" + ids).then(resp=>{
                        if(resp){
                            this.initPositions();
                        }
                    });
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

<style scoped>
    .PosInput {
        width: 300px;
        margin-right: 10px;
    }

    .PosTable {
        margin-top: 20px;
        width: 60%;
    }
</style>