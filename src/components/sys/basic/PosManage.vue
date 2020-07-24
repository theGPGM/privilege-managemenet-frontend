<template>
    <div>
        <div>
            <el-input
                    placeholder="添加职位"
                    v-model="pos.name"
                    clearable
                    class="PosInput"
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition"
                    size="mini">
            </el-input>
            <el-button size="mini" type="success" icon="el-icon-plus" @click="addPosition">添加</el-button>
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
                <el-table-column
                        prop="enabled"
                        label="是否启用"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
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
            <el-button type="danger" plain size="mini" style="margin-top: 10px"
                       :disabled="multipleSelection.length == 0" @click="multiDelete">批量删除
            </el-button>
        </div>
        <el-dialog title="修改职位" :visible.sync="dialogFormVisible"
                   width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag size="medium" style="margin-bottom: 10px">
                                职位名称
                            </el-tag>
                        </td>
                        <td>
                            <el-input size="mini"
                                      style="margin-bottom: 10px"
                                      v-model="editPos.name"
                            ></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag size="medium">
                                是否启用
                            </el-tag>
                        </td>
                        <td>
                            <el-switch
                                    style="display: block"
                                    v-model="editPos.enabled"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    size="mini">
                            </el-switch>
                        </td>
                    </tr>
                </table>
            </div>
            <el-button size="mini" @click="dialogFormVisible = false" style="margin-left: 3px; margin-top: 10px">取 消</el-button>
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
                    name: '',
                },
                positions: [],
                editPos: {
                    name: '',
                    enabled : true
                },
                dialogFormVisible: false,
                multipleSelection: []
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
                this.putRequest("system/basic/pos/", this.editPos).then(resp => {
                    if (resp) {
                        this.initPositions();
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            multiDelete() {
                this.$confirm('此操作将删除【' + this.multipleSelection.length + '】条记录，是否继续', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                    })
                    this.deleteRequest("system/basic/pos/" + ids).then(resp => {
                        if (resp) {
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
        margin-right: 5px;
    }

    .PosTable {
        margin-top: 20px;
        width: 70%;
    }
</style>