<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="部门管理" name="DepManage">
            <DepManage></DepManage>
        </el-tab-pane>
        <el-tab-pane label="职位管理" name="PosManage">
            <PosManage></PosManage>
        </el-tab-pane>
        <el-tab-pane label="职称管理" name="JobLevelManage">
            <JobLevelManage></JobLevelManage>
        </el-tab-pane>
        <el-tab-pane label="奖惩规则" name="EcManage">
            <EcManage></EcManage>
        </el-tab-pane>
        <el-tab-pane label="权限组" name="PerManage">
            <PerManage></PerManage>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import DepManage from "../../components/sys/basic/DepManage";
    import JobLevelManage from "../../components/sys/basic/JobLevelManage";
    import PosManage from "../../components/sys/basic/PosManage";
    import EcManage from "../../components/sys/basic/EcManage";
    import PerManage from "../../components/sys/basic/PerManage";
    export default {
        name: "SysBasic.vue",
        components: {PerManage, EcManage, PosManage, DepManage, JobLevelManage},
        data(){
            return{
                activeName:'DepManage'
            }
        },
    }
</script>

<style scoped>
</style>