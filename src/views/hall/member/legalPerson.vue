<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.name"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>

        <el-table ref="zwfwLegalPersonTable" :data="zwfwLegalPersonList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="200px">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="统一社会信用代码" prop="companyCode" width="200px">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.companyCode}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="机构类型" prop="companyType">
                <template scope="scope">
                    <span>{{scope.row.companyType}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="机构名称" prop="companyName">
                <template scope="scope">
                    <span>{{scope.row.companyName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="机构代码" prop="agencyCode">
                <template scope="scope">
                    <span>{{scope.row.agencyCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="法定代表人" prop="legalPerson">
                <template scope="scope">
                    <span>{{scope.row.legalPerson}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册地址" prop="registerPlace">
                <template scope="scope">
                    <span>{{scope.row.registerPlace}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册日期" prop="registerDate">
                <template scope="scope">
                    <span>{{scope.row.registerDate | date('YYYY-MM-DD')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
                    <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
                        {{scope.row.enable | enums('Enable')}}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetZwfwLegalPersonForm">
            <el-form ref="zwfwLegalPersonForm" class="small-space" :model="zwfwLegalPerson" label-position="right"
                     label-width="100px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwLegalPersonRules">
                <el-form-item label="统一社会信用代码" prop="companyCode">
                    <el-input :disabled="readonlyFlag" v-model="zwfwLegalPerson.companyCode"></el-input>
                </el-form-item>
                <el-form-item label="机构类型" prop="companyType">
                    <el-input v-model="zwfwLegalPerson.companyType"></el-input>
                </el-form-item>
                <el-form-item label="机构名称" prop="companyName">
                    <el-input v-model="zwfwLegalPerson.companyName"></el-input>
                </el-form-item>
                <el-form-item label="机构代码" prop="agencyCode">
                    <el-input v-model="zwfwLegalPerson.agencyCode"></el-input>
                </el-form-item>
                <el-form-item label="法定代表人" prop="legalPerson">
                    <el-input v-model="zwfwLegalPerson.legalPerson"></el-input>
                </el-form-item>
                <el-form-item label="法人身份证" prop="idcard">
                    <el-input v-model="zwfwLegalPerson.idcard"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="zwfwLegalPerson.phone"></el-input>
                </el-form-item>
                <el-form-item label="注册地址" prop="registerPlace">
                    <el-input v-model="zwfwLegalPerson.registerPlace"></el-input>
                </el-form-item>
                <el-form-item label="注册日期" prop="registerDate">
                    <el-date-picker :editable="false" v-model="zwfwLegalPerson.registerDate" type="date" placeholder="选择日期" @change="formatDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="zwfwLegalPerson.password" type="password" placeholder="修改密码时填入新密码，若不需要则无需输入"/>
                </el-form-item>
                <el-form-item label="确认密码" prop="passwordConfirm">
                    <el-input v-model="zwfwLegalPerson.passwordConfirm" type="password"
                              placeholder="修改密码时填入新密码，若不需要则无需输入"/>
                </el-form-item>
                <el-form-item label="状态" prop="enable">
                    <el-radio-group v-model="zwfwLegalPerson.enable">
                        <el-radio v-for="item in enums['Enable']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="zwfwLegalPerson.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetZwfwLegalPersonForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" :loading="btnLoading" @click="create">确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" :loading="btnLoading" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import { isIdCardNo, validatMobiles, checkSocialCreditCode } from 'utils/validate'
    import {
        getAllZwfwLegalPerson,
        getZwfwLegalPersonList,
        createZwfwLegalPerson,
        updateZwfwLegalPerson,
        delZwfwLegalPersons
    } from 'api/hall/member/legalPerson';

    export default {
        name: 'zwfwLegalPerson_table',
        data() {
            const validatCompanyCode = (rule, value, callback) => {
                if (this.readonlyFlag) {
                    callback()
                    return;
                }
                if (!checkSocialCreditCode(value)) {
                    return callback(new Error('不是有效的社会统一信用代码，请重新输入'));
                } else {
                    this.listQuery.companyCode = value
                    getAllZwfwLegalPerson(this.listQuery).then(response => {
                        if (response.httpCode === 200 && response.data && response.data.length > 0) {
                            callback(new Error('统一社会信用代码已存在，请重新输入'))
                        }
                        callback()
                    }).catch(error => {
                        callback(new Error(error))
                    })
                }
            };
            const validateIdcard = (rule, value, callback) => {
                if (!isIdCardNo(value)) {
                    callback(new Error('身份证号格式不正确，请重新输入'));
                }
                callback();
            };
            const validateMobiles = (rule, value, callback) => {
                if (!validatMobiles(value)) {
                    callback(new Error('手机号码格式不正确'));
                }
                callback();
            };
            const validatePassword = (rule, value, callback) => {
                if (this.zwfwLegalPerson.passwordConfirm) {
                    this.$refs.zwfwLegalPersonForm.validateField('passwordConfirm')
                }
                callback()
            };
            const validatePass2 = (rule, value, callback) => {
                if (this.zwfwLegalPerson.password && this.zwfwLegalPerson.passwordConfirm
                    && this.zwfwLegalPerson.password != this.zwfwLegalPerson.passwordConfirm) {
                    callback(new Error('两次密码输入不同，请重新输入'))
                }
                callback()
            };
            return {
                zwfwLegalPersonList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined
                },
                zwfwLegalPerson: {
                    id: undefined,
                    companyCode: '',
                    companyType: '',
                    companyName: '',
                    agencyCode: '',
                    legalPerson: '',
                    idcard: '',
                    phone: '',
                    registerPlace: '',
                    registerDate: '',
                    password: '',
                    passwordConfirm: '',
                    remark: '',
                    enable: 1
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                btnLoading: false,
                readonlyFlag: false,
                zwfwLegalPersonRules: {
                    companyCode: [
                        {required: true, message: '请输入统一社会信用代码', trigger: 'blur'},
                        {validator: validatCompanyCode, trigger: 'blur'}
                    ],
                    companyType: [
                        {required: true, message: '请输入机构类型', trigger: 'blur'}
                    ],
                    companyName: [
                        {required: true, message: '请输入机构名称', trigger: 'blur'}
                    ],
                    agencyCode: [
                        {required: true, message: '请输入机构代码', trigger: 'blur'}
                    ],
                    legalPerson: [
                        {required: true, message: '请输入法定代表人', trigger: 'blur'}
                    ],
                    idcard: [
                        {required: true, message: '请输入法人身份证号', trigger: 'blur'},
                        {validator: validateIdcard, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'},
                        {validator: validateMobiles, trigger: 'blur'}
                    ],
                    registerPlace: [
                        {required: true, message: '请输入注册地址', trigger: 'blur'}
                    ],
                    registerDate: [
                        {required: true, message: '请选择注册日期', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'},
                        {validator: validatePassword, trigger: 'blur'}
                    ],
                    passwordConfirm: [
                        {required: true, message: '请输入确认密码', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
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
                getZwfwLegalPersonList(this.listQuery).then(response => {
                    this.zwfwLegalPersonList = response.data.list;
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
                this.$refs.zwfwLegalPersonTable.toggleRowSelection(row);
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.readonlyFlag = false;
                this.zwfwLegalPersonRules.password[0].required = true;
                this.zwfwLegalPersonRules.passwordConfirm[0].required = true;
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.readonlyFlag = true;
                this.zwfwLegalPerson = copyProperties(this.zwfwLegalPerson, row);
                this.zwfwLegalPerson.password = '';
                this.zwfwLegalPersonRules.password[0].required = false;
                this.zwfwLegalPersonRules.passwordConfirm[0].required = false;
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
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
                        this.listLoading = true;
                        let selectCounts = this.selectedRows.length;
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delZwfwLegalPersons(ids).then(response => {
                            if (response.httpCode === 200) {
                                this.total -= selectCounts;
                                for (const deleteRow of this.selectedRows) {
                                    const index = this.zwfwLegalPersonList.indexOf(deleteRow);
                                    this.zwfwLegalPersonList.splice(index, 1);
                                }
                                this.$message.success('删除成功');
                                this.listLoading = false;
                            } else {
                                this.$message.error('删除失败');
                                this.listLoading = false;
                            }
                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            create() {
                this.$refs['zwfwLegalPersonForm'].validate((valid) => {
                    if (valid) {
                        this.btnLoading = true;
                        createZwfwLegalPerson(this.zwfwLegalPerson).then(response => {
                            if (response.httpCode === 200) {
                                this.btnLoading = false;
                                this.zwfwLegalPersonList.unshift(response.data);
                                this.total += 1;
                                this.$message.success('创建成功');
                                this.dialogFormVisible = false;
                            } else {
                                this.btnLoading = false;
                                this.$message.error('创建失败');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['zwfwLegalPersonForm'].validate((valid) => {
                    if (valid) {
                        this.btnLoading = true;
                        updateZwfwLegalPerson(this.zwfwLegalPerson).then(response => {
                            if (response.httpCode === 200) {
                                this.btnLoading = false;
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
                                this.dialogFormVisible = false;
                            } else {
                                this.btnLoading = false;
                                this.$message.error('更新失败');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            formatDate() {
                this.zwfwLegalPerson.registerDate = moment(this.zwfwLegalPerson.registerDate).format('YYYY-MM-DD')
            },
            resetTemp() {
                this.zwfwLegalPerson = {
                    id: undefined,
                    companyCode: '',
                    companyType: '',
                    companyName: '',
                    agencyCode: '',
                    legalPerson: '',
                    idcard: '',
                    phone: '',
                    registerPlace: '',
                    registerDate: '',
                    password: '',
                    passwordConfirm: '',
                    remark: '',
                    enable: 1
                };
            },
            resetZwfwLegalPersonForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'zwfwLegalPersonForm');
            }
        }
    }
</script>
