<template>
    <div>
        <el-table :data="emps" border stripe size="mini" v-loading="loading">
            <el-table-column type="selection" align="left" width="55"></el-table-column>
            <el-table-column prop="name" label="姓名" fixed width="120" align="left"></el-table-column>
            <el-table-column prop="workId" label="工号" width="120" align="left"></el-table-column>
            <el-table-column prop="email" label="电子邮件" width="200" align="left"></el-table-column>
            <el-table-column prop="phone" label="电话号码" width="120" align="left"></el-table-column>
            <el-table-column prop="department.name" label="所属部门" width="120" align="left"></el-table-column>
            <el-table-column label="所属部门" align="center">
                <template slot-scope="scope">
                    <el-tooltip placement="right" v-if="scope.row.salary">
                        <div slot="content">
                            <table>
                                <tr>
                                    <td>基本工资</td>
                                    <td>{{scope.row.salary.basicSalary}}</td>
                                </tr>
                                <tr>
                                    <td>交通补助</td>
                                    <td>{{scope.row.salary.trafficSalary}}</td>
                                </tr>
                                <tr>
                                    <td>午餐补助</td>
                                    <td>{{scope.row.salary.lunchSalary}}</td>
                                </tr>
                                <tr>
                                    <td>奖金</td>
                                    <td>{{scope.row.salary.bonus}}</td>
                                </tr>
                                <tr>
                                    <td>养老金比率</td>
                                    <td>{{scope.row.salary.pensionPer}}</td>
                                </tr>
                                <tr>
                                    <td>养老金基数</td>
                                    <td>{{scope.row.salary.pensionBase}}</td>
                                </tr>
                                <tr>
                                    <td>医疗保险比率</td>
                                    <td>{{scope.row.salary.medicalPer}}</td>
                                </tr>
                                <tr>
                                    <td>医疗保险基数</td>
                                    <td>{{scope.row.salary.medicalBase}}</td>
                                </tr>
                                <tr>
                                    <td>公积金比率</td>
                                    <td>{{scope.row.salary.accumulationFundPer}}</td>
                                </tr>
                                <tr>
                                    <td>公积金基数</td>
                                    <td>{{scope.row.salary.accumulationFundBase}}</td>
                                </tr>
                                <tr>
                                    <td>启用时间</td>
                                    <td>{{scope.row.salary.createDate}}</td>
                                </tr>
                            </table>
                        </div>
                        <el-tag>{{scope.row.salary.name}}</el-tag>
                    </el-tooltip>
                    <el-tag v-else>暂未设置</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-popover
                            placement="left"
                            title="修改工资账套"
                            @show="showPop(scope.row.salary)"
                            @hide="hidePop(scope.row)"
                            width="200"
                            trigger="click">
                        <div>
                            <el-select v-model="currentSalaryId" placeholder="请选择" size="mini">
                                <el-option
                                        v-for="item in salaries"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <el-button slot="reference" type="danger" size="mini">修改工资账套</el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: center; margin-top: 10px">
            <el-pagination
                    background
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    layout="sizes, prev, pager, next, jumper, ->,  slot"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SalSobCfg.vue",
        data()  {
            return {
                emps : [],
                page : 1,
                size : 10,
                total : 0,
                loading : false,
                salaries : [],
                currentSalaryId : null
            }
        },
        mounted() {
            this.initEmpWithSalary();
            this.initSalaries();
        },
        methods : {
            initEmpWithSalary(){
                this.loading = true;
                this.getRequest("/salary/sobCfg/?page=" + this.page + '&size=' + this.size).then(resp=>{
                    this.loading = false;
                    if(resp){
                        this.emps = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            sizeChange(pageSize){
                this.size = pageSize;
            },
            currentChange(currentPage){
                this.page = currentPage;
                this.initEmpWithSalary();
            },
            initSalaries(){
                this.getRequest("/salary/sob/").then(resp=>{
                    if(resp){
                        this.salaries = resp;
                    }
                })
            },
            showPop(data){
                if(data){
                    this.currentSalaryId = data.id;
                }else{
                    this.currentSalaryId = null;
                }
            },
            hidePop(data){
                if(data.salary != null && data.salary.id == this.currentSalaryId){
                    return;
                }else{
                    this.putRequest('/salary/sobCfg/?id=' + data.id + '&sid=' + this.currentSalaryId).then(resp=>{
                        if(resp)
                            this.initEmpWithSalary();
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>