<template>
    <div>
        <div style="display:flex; justify-content: space-between">
            <div style="width: 80%">
                <el-input size="mini"
                          placeholder="请输入员工姓名"
                          v-model="keywords"
                          prefix-icon="el-icon-search"
                          style="width:30%; margin-right: 10px" @keydown.enter.native="initEmployees"></el-input>
                <el-button size="mini" type="success" icon="el-icon-search" @click="initEmployees">搜索</el-button>
            </div>
            <div style="width: 35%; display:flex; justify-content: center">
                <el-upload
                        style="margin-right: 10px"
                        action="emp/basic/import"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="onSuccess"
                        :on-error="onError">
                    <el-button size="mini" type="success" :icon="importBtnIcon" :disabled="importDisable">
                        {{importBtnText}}
                    </el-button>
                </el-upload>
                <el-button type="success" size="mini" icon="el-icon-printer" @click="exportData">导出数据</el-button>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddEmpView">添加员工
                </el-button>
            </div>
        </div>
        <div style="margin-top: 40px">
            <el-table
                    :data="employees.data"
                    border
                    style="width: 100%"
                    v-loading="loading"
                    size="mini">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        fixed="left"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="workId"
                        label="工号"
                        width="100"></el-table-column>
                <el-table-column
                        prop="gender"
                        label="性别">
                </el-table-column>
                <el-table-column
                        prop="nation.name"
                        label="民族"></el-table-column>
                <el-table-column
                        prop="birthday"
                        label="出生日期"
                        width="100"></el-table-column>
                <el-table-column
                        prop="idCard"
                        label="身份证号码"
                        width="180"></el-table-column>
                <el-table-column
                        prop="address"
                        label="地址"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="nativePlace"
                        label="籍贯"></el-table-column>
                <el-table-column
                        prop="politicsStatus.name"
                        label="政治面貌"></el-table-column>
                <el-table-column
                        prop="wedlock"
                        label="婚姻状况"></el-table-column>
                <el-table-column
                        prop="phone"
                        label="电话号码"
                        width="130"></el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="180"></el-table-column>
                <el-table-column
                        prop="tipTopDegree"
                        label="最高学历"></el-table-column>
                <el-table-column
                        prop="school"
                        label="毕业院校"
                        width="150"></el-table-column>
                <el-table-column
                        prop="specialty"
                        label="专业"
                        width="150"></el-table-column>
                <el-table-column
                        prop="department.name"
                        width="150"
                        label="部门">
                </el-table-column>
                <el-table-column
                        prop="position.name"
                        label="职位"
                        width="120"></el-table-column>
                <el-table-column
                        prop="jobLevel.name"
                        label="职称"
                        width="120"></el-table-column>
                <el-table-column
                        prop="engageForm"
                        label="合同形式"></el-table-column>
                <el-table-column
                        prop="beginDate"
                        label="入职日期"
                        width="100"></el-table-column>
                <el-table-column
                        prop="conversionTime"
                        label="转正日期"
                        width="100"></el-table-column>
                <el-table-column
                        prop="beginContract"
                        label="合同起始日期"
                        width="100"></el-table-column>
                <el-table-column
                        prop="endContract"
                        label="合同终止日期"
                        width="100"></el-table-column>
                <el-table-column
                        prop="contractTerm"
                        label="合同期限">
                    <template slot-scope="scope">{{scope.row.contractTerm}}年</template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="260">
                    <template slot-scope="scope">
                        <el-button type="plain" size="mini" @click="showUpdateView(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="doDelete(scope.row)">删除</el-button>
                        <el-button type="primary" @click="handleClick(scope.row)" size="mini">查看高级资料</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 2%; display: flex; justify-content: center">
                <el-pagination
                        background
                        layout="sizes, prev, pager, next, jumper, ->, slot"
                        @current-change="getPage"
                        @size-change="sizeChange"
                        :total="total">
                </el-pagination>
            </div>
            <el-dialog :title="title"
                       :visible.sync="dialogFormVisible"
                       width="90%">
                <div>
                    <el-form
                            :rules="rules"
                            :model="emp"
                            ref="empForm">
                        <el-row class="empInfoRow">
                            <el-col :span="5">
                                <el-form-item label="姓名" prop="name" size="mini">
                                    <el-input v-model="emp.name" style="width: 68%" prefix-icon="el-icon-edit"
                                              placeholder="请输入员工姓名"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="性别" prop="gender" size="mini">
                                    <el-radio-group v-model="emp.gender">
                                        <el-radio label="男">男</el-radio>
                                        <el-radio label="女" style="margin-left: -15px">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="出生日期" prop="birthday" size="mini">
                                    <el-date-picker
                                            v-model="emp.birthday"
                                            type="date"
                                            placeholder="选择日期"
                                            value-format="yyyy-MM-dd"
                                            style="width: 60%">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="政治面貌" size="mini" prop="politicId">
                                    <el-select v-model="emp.politicId" placeholder="请选择" style="width: 68%">
                                        <el-option
                                                v-for="item in politics"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="empInfoRow">
                            <el-col :span="5">
                                <el-form-item label="民族" size="mini" prop="nationId">
                                    <el-select v-model="emp.nationId" placeholder="请选择" style="width: 68%">
                                        <el-option
                                                v-for="item in wholeNations"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="籍贯" prop="nativePlace" size="mini">
                                    <el-input v-model="emp.nativePlace" prefix-icon="el-icon-edit" style="width: 67%"
                                              placeholder="请输入籍贯"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="电子邮箱" prop="email" size="mini">
                                    <el-input v-model="emp.email" prefix-icon="el-icon-message"
                                              style="width: 60%"
                                              placeholder="请输入邮箱"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="联系地址" prop="address" size="mini">
                                    <el-input v-model="emp.address" prefix-icon="el-icon-edit"
                                              style="width: 68%"
                                              placeholder="请输入联系地址"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="empInfoRow">
                            <el-col :span="5">
                                <el-form-item label="职位" prop="posId" size="mini">
                                    <el-select v-model="emp.posId" placeholder="请选择职位" style="width: 68%">
                                        <el-option
                                                v-for="item in positions"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="职称" prop="jobLevelId" size="mini">
                                    <el-select v-model="emp.jobLevelId" placeholder="请选择职称" style="width: 67%">
                                        <el-option
                                                v-for="item in jobLevels"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="所属部门" prop="departmentId" size="mini">
                                    <el-popover
                                            placement="right"
                                            title="请选择部门"
                                            width="250"
                                            trigger="manual"
                                            v-model="popVisible">
                                        <el-tree :data="deps" :props="defaultProps" default-expand-all
                                                 @node-click="handleNodeClick"></el-tree>
                                        <div slot="reference" style="width: 60%;
                                            display: inline-flex;
                                            font-size:13px;
                                            border: 1px solid #dedede;
                                            height: 26px;
                                            border-radius:5px; cursor: pointer; align-items: center" @click="choiceDep">
                                    <span style="margin-left: 15px">
                                        {{inputDepName}}
                                    </span>
                                        </div>
                                    </el-popover>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="电话号码" prop="phone" size="mini">
                                    <el-input v-model="emp.phone"
                                              prefix-icon="el-icon-phone"
                                              style="width: 68%"
                                              placeholder="请输入电话号码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="empInfoRow">
                            <el-col :span="5">
                                <el-form-item label="工号" prop="workId" size="mini">
                                    <el-input v-model="emp.workId" style="width: 68%" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="学历" prop="tipTopDegree" size="mini">
                                    <el-select v-model="emp.tipTopDegree" placeholder="最高学历" style="width: 67%">
                                        <el-option
                                                v-for="item in degrees"
                                                :key="item.name"
                                                :label="item.name"
                                                :value="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="毕业院校" prop="school" size="mini">
                                    <el-input v-model="emp.school" style="width: 60%" prefix-icon="el-icon-edit"
                                              placeholder="请输入毕业院校"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="专业名称" prop="specialty" size="mini">
                                    <el-input v-model="emp.specialty" style="width: 68%" prefix-icon="el-icon-edit"
                                              placeholder="请输入专业名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="empInfoRow">
                            <el-col :span="5">
                                <el-form-item label="入职日期" prop="beginDate" size="mini">
                                    <el-date-picker
                                            v-model="emp.beginDate"
                                            type="date"
                                            placeholder="选择日期"
                                            value-format="yyyy-MM-dd"
                                            style="width: 55%">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="转正日期" prop="conversionTime" size="mini">
                                    <el-date-picker
                                            v-model="emp.conversionTime"
                                            type="date"
                                            placeholder="选择日期"
                                            value-format="yyyy-MM-dd"
                                            style="width: 55%">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="合同起始日期" prop="beginContract" size="mini">
                                    <el-date-picker
                                            v-model="emp.beginContract"
                                            type="date"
                                            placeholder="选择日期"
                                            value-format="yyyy-MM-dd"
                                            style="width: 51%">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="合同终止日期" prop="endContract" size="mini">
                                    <el-date-picker
                                            v-model="emp.endContract"
                                            type="date"
                                            placeholder="选择日期"
                                            value-format="yyyy-MM-dd"
                                            style="width: 60%">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom: -30px">
                            <el-col :span="8">
                                <el-form-item label="身份证号码" prop="idCard" size="mini">
                                    <el-input prefix-icon="el-icon-edit" v-model="emp.idCard" placeholder="请输入身份证号码"
                                              style="width: 60%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="聘用形式" prop="engageForm" size="mini">
                                    <el-radio-group v-model="emp.engageForm">
                                        <el-radio label="劳动合同">劳动合同</el-radio>
                                        <el-radio label="劳务合同">劳务合同</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="婚姻状况" prop="wedlock">
                                    <el-radio-group v-model="emp.wedlock">
                                        <el-radio label="已婚">已婚</el-radio>
                                        <el-radio label="未婚" style="margin-left: -15px">未婚</el-radio>
                                        <el-radio label="离异" style="margin-left: -15px">离异</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
                    <el-button type="primary" @click="addOrUpdateEmp" size="mini">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EmpBasic.vue",
        data() {
            return {
                importBtnText: '导入数据',
                importBtnIcon: 'el-icon-document-copy',
                importDisable: false,
                employees: [],
                loading: false,
                keywords: '',
                total: 0,
                page: 1,
                size: 10,
                dialogTableVisible: false,
                dialogFormVisible: false,
                popVisible: false,
                emp: {
                    id: null,
                    name: '',
                    gender: '',
                    birthday: '',
                    idCard: '',
                    wedlock: '',
                    nationId: null,
                    nativePlace: '',
                    politicId: null,
                    email: '',
                    phone: '',
                    address: '',
                    departmentId: null,
                    jobLevelId: null,
                    posId: null,
                    engageForm: '',
                    tipTopDegree: '',
                    specialty: '',
                    school: '',
                    beginDate: '',
                    workId: '',
                    conversionTime: '',
                    notworkDate: null,
                    beginContract: '',
                    endContract: '',
                    workAge: null
                },
                deps: [],
                wholeNations: [],
                politics: [],
                jobLevels: [],
                positions: [],
                degrees: [{
                    name: '本科',
                }, {
                    name: '大专',
                }, {
                    name: '硕士',
                }, {
                    name: '博士',
                }, {
                    name: '高中',
                }, {
                    name: '初中',
                }, {
                    name: '小学',
                }, {
                    name: '其他',
                },],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                inputDepName: '',
                title: '',
                rules: {
                    name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
                    birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
                    idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}, {
                        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        message: '身份证号码格式不正确',
                        trigger: 'blur'
                    }],
                    wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
                    nationId: [{required: true, message: '请输入您组', trigger: 'blur'}],
                    nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
                    politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
                    email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }],
                    phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
                    address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
                    departmentId: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
                    jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
                    posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
                    engageForm: [{required: true, message: '请输入聘用形式', trigger: 'blur'}],
                    tipTopDegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
                    specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
                    school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
                    beginDate: [{required: true, message: '请输入入职日期', trigger: 'blur'}],
                    workState: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
                    workId: [{required: true, message: '请输入工号', trigger: 'blur'}],
                    contractTerm: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
                    conversionTime: [{required: true, message: '请输入转正日期', trigger: 'blur'}],
                    notworkDate: [{required: true, message: '请输入离职日期', trigger: 'blur'}],
                    beginContract: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
                    endContract: [{required: true, message: '请输入合同结束日期', trigger: 'blur'}],
                    workAge: [{required: true, message: '请输入工龄', trigger: 'blur'}],
                }
            }
        },
        mounted() {
            this.initEmployees();
            this.initData();
        },
        methods: {
            beforeUpload() {
                this.importBtnText = '正在导入';
                this.importBtnIcon = 'el-icon-loading';
                this.importDisable = true;
            },
            onSuccess(response, file, fileList) {
                this.importBtnText = '导入数据'
                this.importBtnIcon = 'el-icon-document-copy'
                this.importDisable = false;
                this.initEmployees();
            },
            onError(err, file, fileList) {
                this.importBtnText = '导入数据'
                this.importBtnIcon = 'el-icon-document-copy'
                this.importDisable = false;
            },
            /**
             * 导出员工信息表.xls
             */
            exportData() {
                window.open("/emp/basic/export");
            },
            initEmployees() {
                this.loading = true;
                if (this.keywords)
                    this.page = 1;
                this.getRequest("/emp/basic/?page=" + this.page + '&size=' + this.size + '&keywords=' + this.keywords).then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.employees = resp;
                        this.total = this.employees.total;
                    }
                })
            },
            sizeChange(pageSize) {
                this.size = pageSize;
                this.initEmployees();
            },
            /**
             * 通过 currentPage 查询当前分页的员工信息
             */
            getPage(currentPage) {
                this.page = currentPage;
                this.initEmployees();
            },
            initData() {
                if (!sessionStorage.jobLevels) {
                    this.getRequest("/emp/basic/job").then(resp => {
                        if (resp) {
                            this.jobLevels = resp;
                            sessionStorage.jobLevels = JSON.stringify(resp);
                        }
                    })
                } else {
                    this.jobLevels = JSON.parse(sessionStorage.jobLevels);
                }
                if (!sessionStorage.politics) {
                    this.getRequest("/emp/basic/politic").then(resp => {
                        if (resp) {
                            this.politics = resp;
                            sessionStorage.politics = JSON.stringify(resp);
                        }
                    })
                } else {
                    this.politics = JSON.parse(sessionStorage.politics);
                }
                if (!sessionStorage.nations) {
                    this.getRequest("/emp/basic/nation").then(resp => {
                        if (resp) {
                            this.wholeNations = resp;
                            sessionStorage.nations = JSON.stringify(resp);
                        }
                    })
                } else {
                    this.wholeNations = JSON.parse(sessionStorage.nations);
                }
                if (!sessionStorage.positions) {
                    this.getRequest("/emp/basic/pos").then(resp => {
                        if (resp) {
                            this.positions = resp;
                            sessionStorage.positons = JSON.stringify(resp);
                        }
                    })
                } else {
                    this.positions = JSON.parse(sessionStorage.positions);
                }
            },
            /**
             * 删除用户
             */
            doDelete(data) {
                this.$confirm('此操作将删除员工【' + data.name + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("emp/basic/" + data.id).then(resp => {
                        if (resp) {
                            this.initEmployees();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            choiceDep() {
                this.popVisible = !this.popVisible;
                if (!sessionStorage.deps) {
                    this.getRequest("/emp/basic/dep").then(resp => {
                        if (resp) {
                            this.deps = resp;
                            sessionStorage.deps = JSON.stringify(resp);
                        }
                    })
                } else {
                    this.deps = JSON.parse(sessionStorage.deps);
                }
            },
            handleNodeClick(data) {
                this.popVisible = !this.popVisible;
                this.inputDepName = data.name;
                this.emp.departmentId = data.id;
            },
            /**
             * 根据是否由员工 id 执行更新或添加操作
             */
            addOrUpdateEmp() {
                //添加
                if (!this.emp.id) {
                    this.$refs['empForm'].validate((valid) => {
                        if (valid) {
                            this.postRequest("/emp/basic/", this.emp).then(resp => {
                                this.dialogFormVisible = false;
                                sessionStorage.removeItem("incWorkId");
                                this.initEmployees();
                            })
                        }
                    })
                } else {//修改
                    this.$refs['empForm'].validate((valid) => {
                        if (valid) {
                            this.putRequest("/emp/basic/", this.emp).then(resp => {
                                this.dialogFormVisible = false;
                                this.initEmployees();
                            })
                        }
                    })
                }
            },
            /**
             * 展开添加员工弹框
             */
            showAddEmpView() {
                this.dialogFormVisible = true;
                this.title = '添加员工';
                this.emptyEmp();
                this.inputDepName = '';
                if (!sessionStorage.incWorkId) {
                    this.getRequest("/emp/basic/workId").then(resp => {
                        this.emp.workId = resp.obj;
                        sessionStorage.incWorkId = resp.obj;
                    })
                } else {
                    this.emp.workId = sessionStorage.incWorkId
                }
            },
            /**
             * 展开更新员工信息弹框
             * @param data
             */
            showUpdateView(data) {
                this.title = '修改员工信息';
                this.dialogFormVisible = true;
                this.inputDepName = data.department.name
                this.emp = data;
            },
            /**
             * 因为员工信息的添加和更新复用同一个对象 emp
             * 在添加员工之前需要先将该对象内容清空
             */
            emptyEmp() {
                this.emp = {
                    id: null,
                    name: '',
                    gender: '',
                    birthday: '',
                    idCard: '',
                    wedlock: '',
                    nationId: null,
                    nativePlace: '',
                    politicId: null,
                    email: '',
                    phone: '',
                    address: '',
                    departmentId: null,
                    jobLevelId: null,
                    posId: null,
                    engageForm: '',
                    tipTopDegree: '',
                    specialty: '',
                    school: '',
                    beginDate: '',
                    workId: '',
                    conversionTime: '',
                    notworkDate: null,
                    beginContract: '',
                    endContract: '',
                    workAge: null
                }
            }
        }
    }
</script>

<style>
    .empInfoRow {
        margin-bottom: 10px;
    }

    .highLevelSearchRow {
        display: flex;
        justify-content: center;
    }
</style>