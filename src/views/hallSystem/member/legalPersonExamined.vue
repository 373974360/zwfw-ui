<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item" placeholder="请输入公司名称"
                      v-model="listQuery.companyName"></el-input>
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                      placeholder="请输入统一社会信用代码"
                      v-model="listQuery.companyCode"></el-input>
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item" placeholder="请输入法定代表人"
                      v-model="listQuery.legalPerson"></el-input>
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item" placeholder="请输入法人身份证号"
                      v-model="listQuery.idcard"></el-input>
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item" placeholder="请输入联系电话"
                      v-model="listQuery.phone"></el-input>
            <el-select class="filter-item" v-model="listQuery.verifyStatus" clearable placeholder="请选择审核状态">
                <el-option value="0" label="未审核"></el-option>
                <el-option value="1" label="已审核"></el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <!--<el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">-->
            <!--添加-->
            <!--</el-button>-->
            <!--<el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">-->
            <!--删除-->
            <!--</el-button>-->
        </div>

        <el-table ref="legalPersonVerifyTable" :data="legalPersonVerifyList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <!--<el-table-column type="selection" width="55"/>-->
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="统一社会信用代码" prop="companyCode" width="200">
                <template scope="scope">
                    <span>{{scope.row.companyCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="机构名称" prop="companyName" width="300">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="天眼查" placement="right-start">
                        <a :href="'https://www.tianyancha.com/search?key='+scope.row.companyCode"
                           target="_blank">{{scope.row.companyName}}</a>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="left" label="联系电话" prop="phone">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="法定代表人" prop="legalPerson" width="120">
                <template scope="scope">
                    <span>{{scope.row.legalPerson}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="法人身份证/登录名" prop="legalPerson" width="180px">
                <template scope="scope">
                    <span>{{scope.row.idcard}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="机构类型" prop="companyType">
                <template scope="scope">
                    <span>{{scope.row.companyType | dics('gsxz')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="注册地址" prop="registerPlace">
                <template scope="scope">
                    <span>{{scope.row.registerPlace}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="审核状态">
                <template scope="scope">
                    <el-tag :type="scope.row.verifyStatus | enums('VerifyStatus') | statusFilter">
                        {{scope.row.verifyStatus | enums('VerifyStatus')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button v-if="scope.row.verifyStatus == 0" @click="showDetail(scope.row)" type="primary">审核
                    </el-button>
                    <el-button v-else @click="showDetail(scope.row)" type="primary">查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog title="帐号审核" :close-on-click-modal="closeOnClickModal" :visible.sync="dialogFormVisible">
            <div>
                <div>
                    <h2 class="h2-style-show">企业信息:</h2>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <th width="140">统一社会信用代码</th>
                            <td>{{legalPersonVerify.companyCode}}</td>
                            <th width="140">机构名称</th>
                            <td>{{legalPersonVerify.companyName}}</td>
                        </tr>
                        <tr>
                            <th width="140">法人身份证号</th>
                            <td>{{legalPersonVerify.idcard}}</td>
                            <th width="140">机构类型</th>
                            <td>{{legalPersonVerify.companyType | dics('gsxz')}}</td>
                        </tr>
                        <tr>
                            <th width="140">法定代表人</th>
                            <td>{{legalPersonVerify.legalPerson}}</td>
                            <th width="140">联系电话</th>
                            <td>{{legalPersonVerify.phone}}</td>
                        </tr>
                        <tr>
                            <th width="140">注册地址</th>
                            <td>{{legalPersonVerify.registerPlace}}</td>
                            <th width="140">注册日期</th>
                            <td>{{legalPersonVerify.registerDate}}</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <div v-show="!showExamined">
                        <h2 class="h2-style-show">审核结果:</h2>
                        <el-form ref="legalPersonVerifyForm" label-width="140px" :model="legalPersonVerify"
                                 :rules="legalPersonVerifyRules">
                            <el-form-item label="审核结果" prop="verifyStatus">
                                <el-select v-model="legalPersonVerify.verifyStatus" placeholder="请选择">
                                    <el-option label="通过" value="1"></el-option>
                                    <el-option label="未通过" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="审核结果说明">
                                <el-input v-model="legalPersonVerify.verifyResult" type="textarea"></el-input>
                            </el-form-item>
                        </el-form>
                        <div style="text-align: center" slot="footer" class="dialog-footer">
                            <el-button type="primary" icon="circle-check" @click="submitReview">提交
                            </el-button>
                        </div>
                    </div>
                    <div v-show="showExamined">
                        <h2 class="h2-style-show">审核结果:</h2>
                        <table class="table table-responsive table-bordered">
                            <tr>
                                <th width="140">审核结果</th>
                                <td>{{legalPersonVerify.verifyStatus | enums('VerifyStatus')}}</td>
                            </tr>
                            <tr>
                                <th width="140">审核结果说明</th>
                                <td>{{legalPersonVerify.verifyResult}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import {getPage, verify} from '../../../api/hallSystem/member/legalPersonVerify';

    export default {
        name: 'legalPersonVerify_table',
        data() {
            return {
                showExamined: false,
                legalPersonVerifyList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    companyName: undefined,
                    companyCode: undefined,
                    idcard: undefined,
                    phone: undefined,
                    legalPerson: undefined,
                    verifyStatus: undefined
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                passRemark: '确认通过',
                noPassRemark: '信息不符',
                dialogLoading: false,
                btnLoading: false,
                legalPersonVerify: {
                    id: undefined,
                    companyCode: undefined,
                    companyType: undefined,
                    companyName: undefined,
                    agencyCode: undefined,
                    legalPerson: undefined,
                    idcard: undefined,
                    phone: undefined,
                    registerPlace: undefined,
                    registerDate: undefined,
                    verifyStatus: undefined,
                    verifyResult: undefined
                },
                legalPersonVerifyRules: {
                    verifyStatus: [{required: true, message: '请选择审核结果', trigger: 'blur'}]
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
                'closeOnClickModal',
                'dics'
            ])
        },
        filters: {
            statusFilter(status) {
                const statusMap = {
                    '审核中': 'primary',
                    '审核通过': 'success',
                    '审核不通过': 'danger'
                };
                return statusMap[status];
            }
        },
        methods: {
            getList() {
                this.listLoading = true;
                getPage(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.legalPersonVerifyList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            showDetail(row) {
                this.currentRow = row;
                this.resetTemp();
                this.legalPersonVerify = copyProperties(this.legalPersonVerify, row);
                if (this.legalPersonVerify.verifyStatus == 0) {
                    this.showExamined = false;
                    this.legalPersonVerify.verifyStatus = undefined;
                } else {
                    this.showExamined = true;
                }
                this.dialogFormVisible = true;
            },
            submitReview() {
                this.$refs['legalPersonVerifyForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        verify({
                            id: this.legalPersonVerify.id,
                            verifyStatus: this.legalPersonVerify.verifyStatus,
                            verifyResult: this.legalPersonVerify.verifyResult
                        }).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('审核成功！');
                                this.getList();
                            } else {
                                this.$message.error(response.msg);
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.legalPersonVerify = {
                    id: undefined,
                    companyCode: undefined,
                    companyType: undefined,
                    companyName: undefined,
                    agencyCode: undefined,
                    legalPerson: undefined,
                    idcard: undefined,
                    phone: undefined,
                    registerPlace: undefined,
                    registerDate: undefined,
                    verifyStatus: undefined,
                    verifyResult: undefined
                }
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
                this.$refs.legalPersonVerifyTable.toggleRowSelection(row);
            }
        }
    }
</script>
<style>

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

    label {
        font-weight: 500;
    }

    .table > tr > td, .table > tr > th {
        border-top: 1px solid #e7eaec;
        line-height: 1.42857;
        padding: 8px;
        vertical-align: middle;
    }

    .table-bordered > tr > td, .table-bordered > tr > th {
        border: 1px solid #e7e7e7;
        font-weight: 500;
    }

    .table-inline {
        width: 49%;
    }

    .table-show {
        display: -webkit-box;
    }

    .el-textarea__inner {
        height: 100px;
    }

    a {
        color: #337ab7;
    }

    .el-dialog__title {
        font-size: 20px;
        font-weight: 500;
    }

    .h2-style-show {
        font-weight: 400;
        font-size: 24px;
        margin-top: 5px;
    }
</style>
