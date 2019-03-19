<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 300px;" class="filter-item" placeholder="办件号"
                      v-model="listQuery.processNumber"></el-input>


            <el-select
                    remote
                    style="width: 400px;" class="filter-item" placeholder="公司名称"
                    v-model="listQuery.ownerPersonId"
                    filterable clearable
                    :remote-method="queryCompanySearch"
                    @change="handleCompanySelect">
                <el-option
                        v-for="companyInfo in companyList"
                        :key="companyInfo.id"
                        :label="companyInfo.companyName"
                        :value="companyInfo.id">
                </el-option>
            </el-select>


            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </div>

        <el-table ref="zwfwDeptWorkQueryTable" :data="zwfwDeptWorkQueryList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column align="center" label="办件号">
                <template slot-scope="scope">
                    <span>{{scope.row.processNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办理事项" prop="itemName" width="200px">
                <template slot-scope="scope">
                    <span>{{scope.row.itemName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="申请企业（个人）" min-width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.memberType == 1">
                        姓名：{{scope.row.memberRealname}}<br>联系电话：{{scope.row.memberPhonenumber}}<br>
                    </span>
                    <span v-if="scope.row.memberType == 2 || scope.row.memberType == 3">
                        <span v-if="scope.row.companyName">
                            公司：{{scope.row.companyName}}<br>
                        </span>
                        法人姓名：{{scope.row.memberRealname}}<br>联系电话：{{scope.row.memberPhonenumber}}<br>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="办事员信息" min-width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.memberType == 3">
                        <span>
                            姓名：{{scope.row.clerkName}}<br>
                        </span>联系电话：{{scope.row.clerkPhone}}<br>
                    </span>
                    <span v-if="scope.row.memberType == 1 || scope.row.memberType == 2">
                        <span>
                            姓名：{{scope.row.memberRealname}}<br>
                        </span>联系电话：{{scope.row.memberPhonenumber}}<br>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办结时间" prop="finishItemTime">
                <template slot-scope="scope">
                    <span>{{scope.row.finishItemTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status | enums('ItemProcessStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sum" label="金额">
                <template slot-scope="scope">
                    <span>{{scope.row.sum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.sum == null" @click="handleCreate(scope.row)" type="primary">录入金额
                    </el-button>
                    <el-button v-else @click="handleUpdate(scope.row)" type="primary">修改金额</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <!--查看-->
        <el-dialog :title="textMapTitle" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetSumEntryForm"
                   v-loading="dialogLoading"
                   element-loading-text="拼命加载中">
            <el-form ref="sumEntryForm" class="small-space" :model="sumEntry" label-position="right"
                     label-width="134px"
                     style="width: 80%; margin-left: 10%" :rules="sumEntryRules">
                <el-form-item label="金额" prop="sum">
                    <el-input v-model="sumEntry.sum"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetSumEntryForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="doCreate">确 定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="doUpdate" @click="doUpdate">确 定
                </el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {resetForm} from 'utils';
    import {getZwfwDeptWorkQueryList} from '../../../api/workSystem/process/workQuery';
    import {createSum, updateSum} from '../../../api/workSystem/policyCashing/sumEntry';
    import {
        getAllCompany
    } from 'api/other/company';
    import {
        queryCompanyInfo
    } from 'api/hallSystem/window/receive/windowAccept';

    export default {
        name: 'sum_entry',

        data() {
            const sumValidate = (rule, value, callback) => {
                if (!/^\d+(\.\d{1,2})?$/.test(this.sumEntry.sum)) {
                    callback(new Error('请输入正确的数字，小数点保留后两位'));
                }
                callback();
            };
            return {
                textMapTitle: null,
                zwfwDeptWorkQueryList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    inStatus: 'FINISH',
                    ownerPersonId: undefined,
                    processNumber: null,
                    categoryIdChild: '7508770076364288'
                },
                zwfwDeptWorkQuery: {
                    id: undefined,
                    companyId: '',
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
                sumEntry: {
                    id: undefined,
                    sum: '',
                    processNumber: '',
                    enable: 1,
                    remark: '',
                    createBy: '',
                    createTime: '',
                    updateBy: '',
                    updateTime: ''
                },
                companyList: [],
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                passRemark: '确认通过',
                correctionReason: '1、\n2、\n3、\n4、\n5、\n',
                closeReason: '1、\n2、\n3、\n4、\n5、\n',
                extendTimeReason: null,
                extendTimeDays: '',
                tabPaneShow: 'first',
                approveStepList: [],
                itemConditionVoList: [],
                itemMaterialVoList: [],
                itemProcessVo: {
                    id: undefined,
                    taskId: '',
                    taskLimitTime: ''
                },
                taskForm: [],
                itemVo: {},
                member: {},
                history: [],
                users: {},
                itemTaskSetting: {},
                action: '',
                correctionList: [],
                extendTimeVoList: [],
                uploadAvatars: [],
                companyInfo: {
                    id: '',
                    node_id: '',
                    ty_code: '',
                    zz_code: '',
                    gs_code: '',
                    qymc: '',
                    fr: '',
                    lxr: '',
                    lxdh: '',
                    qllx: '',
                    jgzs: '',
                    zczj: '',
                    clrq: '',
                    yyqx: '',
                    jyfw: '',
                    djjg: '',
                    hzrq: '',
                    djzt: '',
                    bak: '',
                    add_type: '',
                    add_time: '',
                    add_user: '',
                    up_time: '',
                    up_user: '',
                    ssjd: '',
                    vtype: ''
                },
                sumEntryRules: {
                    sum: [
                        {required: true, validator: sumValidate, trigger: 'blur'}
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
                getZwfwDeptWorkQueryList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        if (response.data == null) {
                            this.zwfwDeptWorkQueryList = response.data;
                        } else {
                            this.zwfwDeptWorkQueryList = response.data.list;
                            this.total = response.data.total;
                        }
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listLoading = false;

                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
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
                this.$refs.zwfwDeptWorkQueryTable.toggleRowSelection(row);
            },
            resetWorkPengingForm() {
                this.dialogFormVisible = false;
            },
            handleCompanySelect(code) {
                this.listQuery.ownerPersonId = code;
                this.getList();
            },
            queryCompanySearch(queryString) {

                if (queryString.length < 2) {
                    return;
                }
                // 调用 callback 返回建议列表的数据
                const query = {
                    companyName: queryString
                };
                getAllCompany(query).then(response => {
                    if (response.httpCode == 200) {
                        this.companyList = (response.data);
                    } else {
                        this.$message.error("查询失败");
                    }
                });
            },
            handleCreate(row) {
                this.resetTemp();
                this.sumEntry.sum = row.sum;
                this.sumEntry.processNumber = row.processNumber;
                this.textMapTitle = '录入金额';
                this.dialogStatus = 'create'
                this.dialogFormVisible = true;
            },

            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.sumEntry.sum = row.sum;
                this.sumEntry.processNumber = row.processNumber;
                this.textMapTitle = '修改金额';
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            doCreate() {
                this.$refs['sumEntryForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        createSum(this.sumEntry).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetSumEntryForm();
                                this.$message.success('创建成功！');
                                this.getList();
                            } else {
                                this.$message.error('创建失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['sumEntryForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        updateSum(this.sumEntry).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetSumEntryForm();
                                this.$message.success('更新成功！');
                                this.getList();
                            } else {
                                this.$message.error('更新失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetSumEntryForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'sumEntryForm');
            },
            resetTemp() {
                this.sumEntry = {
                    id: undefined,
                    sum: '',
                    processNumber: '',
                    enable: 1,
                    remark: '',
                    createBy: '',
                    createTime: '',
                    updateBy: '',
                    updateTime: ''
                };
            },
            /**
             * 查询企业信息
             */
            queryCompanyInfo(memberInfo) {
                this.companyInfo = {};
                if (memberInfo.memberCode == '' || memberInfo.memberCode.length != 18) {
                    this.companyInfo = {};
                    return;
                }
                queryCompanyInfo({
                    memberCode: memberInfo.memberCode,
                    diff: 'gwq'
                }).then(response => {
                    if (response.httpCode === 200) {
                        let c = response.data;
                        if (c) {
                            this.companyInfo = c;
                        }
                    } else {
                        this.companyInfo = {};
                    }
                })
            }
        }
    }
</script>
<style>
    .input-textarea {
    }

    .table-bordered {
        border: 1px solid #EBEBEB;
    }

    .table-responsive {
        min-height: .01%;
        overflow-x: auto;
    }

    .table {
        width: 100%;
        max-width: 100%;
        margin-bottom: 20px;
        background-color: transparent;
        border-spacing: 0;
        border-collapse: collapse;
    }

    .table > tr > td, .table > tr > th {
        border-top: 1px solid #e7eaec;
        line-height: 1.42857;
        padding: 8px;
        vertical-align: middle;
        text-align: left;
        font-weight: 500;
    }

    .table-bordered > tr > td, .table-bordered > tr > th {
        border: 1px solid #e7e7e7;
    }

    .h2-style-show {
        font-weight: 400;
        font-size: 24px;
    }

    .s-dialog-title .el-form-item__label {
        font-size: 24px;
    }

    .s-dialog-title label {
        font-weight: 100;
    }

    .s-dialog-title .el-dialog__title {
        font-size: 17px;
        font-weight: 500;
    }

    .s-dialog-title .input-textarea .el-textarea__inner {
        height: 10em;
    }

    .company-autocomplete {

    li {
        line-height: normal;
        padding: 7px;

    .name {
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .addr {
        font-size: 12px;
        color: #b4b4b4;
    }

    .highlighted .addr {
        color: #ddd;
    }

    }
    }

    .image {
        width: 100%;
        height: 250px;
        display: block;
    }

</style>
