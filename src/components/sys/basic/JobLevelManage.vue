<template>
    <div>
        <div>
            <el-input placeholder="添加职称"
                      v-model="newJobLevel.name"
                      size="mini"
                      class="JobLevelInput"
                      prefix-icon="el-icon-plus"
                      style="width:250px">
            </el-input>
            <el-select v-model="newJobLevel.titleLevel" placeholder="职称等级" size="mini" class="titleLevelInput"
                       style="width: 150px; margin-left: 5px; margin-right: 5px">
                <el-option
                        v-for="item in titleLevels"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addJobLevel">添加</el-button>
            <el-table
                    :data="jobLevels"
                    border
                    stripe
                    class="JobLevelTable"
                    size="mini">
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
                        label="职称名称"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        label="职称级别"
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
                                @click="deleteJobLevel(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="修改职称" :visible.sync="dialogFormVisible"
                   width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag size="medium" style="margin-right: 5px">
                                职称名称
                            </el-tag>
                        </td>
                        <td>
                            <el-input size="mini"
                                      style="width:70%"
                                      v-model="editJobLevel.name">

                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag size="medium">
                                职称等级
                            </el-tag>
                        </td>
                        <td>
                            <el-select v-model="editJobLevel.titleLevel" placeholder="职称等级" size="mini"
                                       class="titleLevelInput" style="width: 70%">
                                <el-option
                                        v-for="item in titleLevels"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
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
                                    v-model="editJobLevel.enabled"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    size="mini">
                            </el-switch>
                        </td>
                    </tr>
                </table>
            </div>
            <el-button size="mini" @click="dialogFormVisible = false" style="margin-left: 3px">取 消</el-button>
            <el-button size="mini" type="primary" @click="doUpdate">确 定</el-button>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TitManage",
        data() {
            return {
                newJobLevel: {
                    name: '',
                    titleLevel: '',
                },
                editJobLevel: {
                    name: '',
                    titleLevel: '',
                    enabled: true
                },
                titleLevels: [
                    '正高级',
                    '副高级',
                    '初级',
                    '中级',
                    '员级'
                ],
                jobLevels: [],
                dialogFormVisible: false
            }
        },
        mounted() {
            this.initJobLevels()
        },
        methods: {
            initJobLevels() {
                this.getRequest("system/basic/job/").then(resp => {
                    if (resp) {
                        this.jobLevels = resp
                    }
                })
            },
            addJobLevel() {
                if (this.newJobLevel.titleLevel && this.newJobLevel.name) {
                    this.postRequest("/system/basic/job/", this.newJobLevel).then(resp => {
                        if (resp) {
                            this.initJobLevels();
                            this.newJobLevel.name = '';
                            this.newJobLevel.titleLevel = ''
                        }
                    });
                } else {
                    this.$message.error("【职称】和【职称等级】都不能为空");
                }
            },
            deleteJobLevel(index, data) {
                this.$confirm('此操作将删除【' + data.name + '】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/job/" + data.id).then(resp => {
                        if (resp) {
                            this.initJobLevels();
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
                Object.assign(this.editJobLevel, data);
                this.dialogFormVisible = true;
            },
            doUpdate() {
                this.dialogFormVisible = false;
                this.putRequest("system/basic/job/", this.editJobLevel).then(resp => {
                    if (resp) {
                        this.initJobLevels();
                    }
                })
            }
        }
    }
</script>

<style>
    .JobLevelTable {
        margin-top: 10px;
        width: 80%;
    }
</style>