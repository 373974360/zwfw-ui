<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.name"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </div>

        <el-table ref="zwfwDeptWorkPendingTable" :data="zwfwDeptWorkPendingList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column align="center" label="ID" width="200px">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="流水号" width="200px">
                <template scope="scope">
                    <span>{{scope.row.pretrialNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办理事项" prop="itemName" width="200px">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.itemName}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="当前步骤" prop="currentTaskName">
                <template scope="scope">
                    <span>{{scope.row.currentTaskName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="步骤时限" prop="limitTime">
                <template scope="scope">
                    <span>{{scope.row.limitTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="承诺期限" prop="promiseFinishTime">
                <template scope="scope">
                    <span>{{scope.row.promiseFinishTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="申请办理人" prop="memberRealname">
                <template scope="scope">
                    <span>{{scope.row.memberRealname}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="整改状态" prop="flagCorrection">
                <template scope="scope">
                    <span>{{scope.row.flagCorrection}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="企业名称" prop="companyName">
                <template scope="scope">
                    <span>{{scope.row.companyName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
                    <span>{{scope.row.status | enums('ItemProcessStatus')}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>


    </div>
</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {
        getZwfwDeptWorkPendingList
    } from 'api/zwfw/zwfwDeptWorkPending';

    export default {
        name: 'zwfwDeptWorkPending_table',
        data() {
            const validatCompanyCode = (rule, value, callback) => {
                if (!/[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/.test(value) || value.length !== 18) {
                    return callback(new Error('统一代码由十八位的数字或大写英文字母（不适用I、O、Z、S、V）组成,且第3-8位为数字'));
                } else {
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (this.zwfwDeptWorkPending.password === '') {
                    callback();
                } else {
                    if (value === '') {
                        callback(new Error('请再次输入密码'));
                    } else if (value !== this.zwfwDeptWorkPending.password) {
                        callback(new Error('两次输入密码不一致!'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                zwfwDeptWorkPendingList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined
                },
                zwfwDeptWorkPending: {
                    id: undefined,
                    companyCode: '',
                    password: '',
                    passwordConfirm: '',
                    registerPlace: '',
                    companyType: '',
                    companyName: '',
                    legalPerson: '',
                    remark: '',
                    enable: 1,
                    agencyCode: ''
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                zwfwDeptWorkPendingRules: {
                    companyCode: [
                        {required: true, validator: validatCompanyCode}
                    ],
                    password: [
                        {required: true, message: '请输入密码'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符'}
                    ],
                    passwordConfirm: [
                        {required: true, validator: validatePass2}
                    ],
                    registerPlace: [
                        {required: true, message: '请输入注册地址'}
                    ],
                    companyType: [
                        {required: true, message: '请输入机构类型'}
                    ],
                    companyName: [
                        {required: true, message: '请输入机构名称'}
                    ],
                    legalPerson: [
                        {required: true, message: '请输入法定代表人'}
                    ],
                    agencyCode: [
                        {required: true, message: '请输入机构代码'}
                    ]
                }
            }
        },
        created() {
            this.getList();
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                getZwfwDeptWorkPendingList(this.listQuery).then(response => {
                    this.zwfwDeptWorkPendingList = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.name = null;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.zwfwDeptWorkPendingTable.toggleRowSelection(row);
            },
            handleCreate(row) {
//                this.currentRow = row;
//                this.resetTemp();
//                this.zwfwDeptWorkPendingRules.password[0].required = true;
//                this.zwfwDeptWorkPendingRules.passwordConfirm[0].required = true;
//                this.dialogStatus = 'create';
//                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
//                this.currentRow = row;
//                this.resetTemp();
//                this.zwfwDeptWorkPending = copyProperties(this.zwfwDeptWorkPending, row);
//                this.zwfwDeptWorkPending.password = '';
//                this.zwfwDeptWorkPendingRules.password[0].required = false;
//                this.zwfwDeptWorkPendingRules.passwordConfirm[0].required = false;
//                this.dialogStatus = 'update';
//                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
//                        this.listLoading = true;
//                        let selectCounts = this.selectedRows.length;
//                        let ids = new Array();
//                        for (const deleteRow of this.selectedRows) {
//                            ids.push(deleteRow.id);
//                        }
//                        delZwfwLegalPersons(ids).then(response => {
//                            this.total -= selectCounts;
//                            for (const deleteRow of this.selectedRows) {
//                                const index = this.zwfwDeptWorkPendingList.indexOf(deleteRow);
//                                this.zwfwDeptWorkPendingList.splice(index, 1);
//                            }
//                            this.$message.success('删除成功');
//                            this.listLoading = false;
//                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            create() {
                this.$refs['zwfwDeptWorkPendingForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
//                        createZwfwLegalPerson(this.zwfwDeptWorkPending).then(response => {
//                            this.zwfwDeptWorkPendingList.unshift(response.data);
//                            this.total += 1;
//                            this.$message.success('创建成功');
//                            this.listLoading = false;
//                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['zwfwDeptWorkPendingForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
//                        updateZwfwLegalPerson(this.zwfwDeptWorkPending).then(response => {
//                            copyProperties(this.currentRow, response.data);
//                            this.$message.success('更新成功');
//                            this.listLoading = false;
//                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.zwfwDeptWorkPending = {
                    id: undefined,
                    companyCode: '',
                    password: '',
                    passwordConfirm: '',
                    registerPlace: '',
                    companyType: '',
                    companyName: '',
                    legalPerson: '',
                    remark: '',
                    enable: 1,
                    agencyCode: ''
                };
            },
            resetZwfwLegalPersonForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'zwfwDeptWorkPendingForm');
            }
        }
    }
</script>
