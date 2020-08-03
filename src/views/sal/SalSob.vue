<template>
    <div>
        <div>
            <el-button icon="el-icon-plus" size="mini" type="success" @click="showAddSalaryView">添加账套</el-button>
            <el-button icon="el-icon-refresh" size="mini" type="success" @click="refresh">刷新</el-button>
        </div>
        <div style="margin-top: 3%">
            <el-table :data="salaries" border stripe size="mini" v-loading="loading">
                <el-table-column type="selection" width="40" fixed="left"></el-table-column>
                <el-table-column prop="name" label="账套名称" width="150" fixed="left"></el-table-column>
                <el-table-column prop="basicSalary" label="基本工资" width="100"></el-table-column>
                <el-table-column prop="trafficSalary" label="交通补助" width="100"></el-table-column>
                <el-table-column prop="lunchSalary" label="午餐补助" width="100"></el-table-column>
                <el-table-column prop="bonus" label="奖金" width="100"></el-table-column>
                <el-table-column prop="createDate" label="启用时间" width="100"></el-table-column>
                <el-table-column label="养老金" align="center">
                    <el-table-column width="70" prop="pensionPer" label="比率"></el-table-column>
                    <el-table-column width="70" prop="pensionBase" label="基数"></el-table-column>
                </el-table-column>
                <el-table-column label="医疗保险" align="center">
                    <el-table-column width="70" prop="medicalPer" label="比率"></el-table-column>
                    <el-table-column width="70" prop="medicalBase" label="基数"></el-table-column>
                </el-table-column>
                <el-table-column label="公积金" align="center">
                    <el-table-column width="70" prop="accumulationFundPer" label="比率"></el-table-column>
                    <el-table-column width="70" prop="accumulationFundBase" label="基数"></el-table-column>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button @click="showUpdateSalaryView(scope.row)" size="mini" type="success">编辑</el-button>
                        <el-button type="danger" @click="deleteSalary(scope.row)" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="50%">
            <div style="display: flex; justify-content: space-around">
                <el-steps :active="active" direction="vertical" :space="35">
                    <el-step :title="item" v-for="(item, index) in aNewSalaryChoiceItem" :key="index"></el-step>
                </el-steps>
                <el-input
                        :placeholder="'请输入' + aNewSalaryChoiceItem[index]"
                        v-for="(item, title,  index) in aNewSalary" :key="index"
                        v-show="active==index"
                        size="mini"
                        style="width: 250px"
                        v-model="aNewSalary[title]"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="prev" size="mini" :disabled="disabled">上一步</el-button>
                <el-button type="primary" @click="next" size="mini">{{this.active == this.aNewSalaryChoiceItem.length - 1? '确定' : '下一步'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SalSob.vue",
        data(){
            return{
                salaries :  [],
                dialogVisible : false,
                aNewSalary : {
                    name : '',
                    basicSalary : '',
                    lunchSalary : '',
                    trafficSalary : '',
                    bonus : '',
                    pensionPer : '',
                    pensionBase : '',
                    medicalPer : '',
                    medicalBase : '',
                    accumulationFundPer : '',
                    accumulationFundBase : '',
                },
                aNewSalaryChoiceItem : [
                    '账套名称',
                    '基本工资',
                    '午餐补助',
                    '交通补助',
                    '奖金',
                    '养老金比率',
                    '养老金基数',
                    '医疗保险比率',
                    '医疗保险基数',
                    '公积金比率',
                    '公积金基数',
                ],
                active : 0,
                disabled : true,
                dialogTitle : '',
                loading : false
            }
        },
        methods : {
            showAddSalaryView(){
                this.dialogTitle = '添加账套';
                this.dialogVisible = true;
                this.active = 0;
                this.aNewSalary = {
                    name: '',
                    basicSalary: '',
                    lunchSalary: '',
                    trafficSalary: '',
                    bonus : '',
                    pensionPer: '',
                    pensionBase: '',
                    medicalPer: '',
                    medicalBase: '',
                    accumulationFundPer: '',
                    accumulationFundBase: '',
                }
            },
            showUpdateSalaryView(data){
                this.dialogTitle = '更新账套';
                this.dialogVisible = true;
                this.aNewSalary.id = data.id;
                this.aNewSalary.name = data.name;
                this.aNewSalary.basicSalary = data.basicSalary;
                this.aNewSalary.lunchSalary = data.lunchSalary;
                this.aNewSalary.trafficSalary = data.trafficSalary;
                this.aNewSalary.bonus = data.bonus;
                this.aNewSalary.pensionPer = data.pensionPer;
                this.aNewSalary.pensionBase = data.pensionBase;
                this.aNewSalary.medicalPer = data.medicalPer;
                this.aNewSalary.medicalBase = data.medicalBase;
                this.aNewSalary.accumulationFundPer = data.accumulationFundPer;
                this.aNewSalary.accumulationFundBase = data.accumulationFundBase;
            },
            prev(){
                if(this.active == 1) {
                    this.active--;
                    this.disabled = true;
                }else if(this.active > 1){
                    this.active--;
                }
            },
            next() {
                this.disabled = false;
                if(this.active == this.aNewSalaryChoiceItem.length - 1){
                    if(this.aNewSalary.id){
                        this.putRequest("/salary/sob/", this.aNewSalary).then(resp=>{
                            if(resp){
                                this.active = 1;
                                this.dialogVisible = false;
                                this.initSalaries();
                            }
                        })
                    }else{
                        console.log(this.aNewSalary);
                        this.postRequest("/salary/sob/", this.aNewSalary).then(resp=>{
                            if(resp){
                                this.active = 1;
                                this.dialogVisible = false;
                                this.initSalaries();
                            }
                        })
                    }
                }else{
                    this.active ++;
                }
            },
            initSalaries(){
                this.loading = true;
                this.getRequest("/salary/sob/").then(resp=>{
                    this.loading = false;
                    if(resp){
                        this.salaries = resp;
                    }
                })
            },
            deleteSalary(data){
                this.$confirm('此操作将删除账套【' + data.name + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("salary/sob/" + data.id).then(resp => {
                        if (resp) {
                            this.initSalaries();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            refresh(){
                this.initSalaries();
            }
        },
        mounted() {
            this.initSalaries();
        }
    }
</script>

<style scoped>

</style>