<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 300px;" class="filter-item" placeholder="预审号"
                      v-model="listQuery.processNumber" no-match-text="没有找到哦">
            </el-input>
            <el-button style="margin-left: 10px;" class="filter-item" type="primary" v-waves icon="search" @click="getList"
            >搜索
            </el-button>
        </div>
        <el-table :data="pretrialList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column min-width="200px" align="center" label="预审号">
                <template scope="scope">
                    <span>{{scope.row.processNumber}}<br/>({{scope.row.itemName}})</span>
                </template>
            </el-table-column>
            <el-table-column width="250px" align="center" label="申请企业（个人）">
            <template scope="scope">
                <span v-if="scope.row.companyName != null">{{scope.row.companyName}}</span>
                <span v-if="scope.row.memberName != null">{{scope.row.memberName}}</span>
            </template>
        </el-table-column>
            <el-table-column width="200px" align="center" label="提交预审的时间">
                <template scope="scope">
                    <span>{{scope.row.applyTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="审核时间">
                <template scope="scope">
                    <span>{{scope.row.auditTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="审核期限">
                <template scope="scope">
                    <span>{{scope.row.expireDate | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="状态">
                <template scope="scope">
                    <span>{{scope.row.status | enums('PretrialStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="250px" align="center" label="备注">
                <template scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button class="filter-item"  type="primary"
                               @click="editAudit(scope.row)">查 看
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
        <el-dialog size="large" :close-on-click-modal="closeOnClickModal" :title="titleName" :visible.sync="dialogFormVisible"
                   >
            <div>
                <div v-if="member.legalPerson != null">
                    <h2 class="h2-style-show">办事企业/机构信息:</h2>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <th width="140">办事企业/机构</th>
                            <td>{{member.legalPerson.companyName}}</td>
                            <th width="140">统一社会信用代码</th>
                            <td>{{member.legalPerson.companyCode}}</td>
                        </tr>
                        <tr>
                            <th width="140">法人姓名</th>
                            <td>{{member.legalPerson.legalPerson}}</td>
                            <th width="140">法人身份证号</th>
                            <td>{{member.legalPerson.idcard}}</td>
                        </tr>
                        <tr>
                            <th width="140">企业/机构地址</th>
                            <td colspan="3">{{member.legalPerson.registerPlace}}</td>
                        </tr>
                    </table>
                </div>
                <div v-if="member.naturePerson != null">
                    <h2 class="h2-style-show">申请人信息:</h2>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <th width="140">姓名</th>
                            <td>{{member.naturePerson.name}}</td>
                            <th width="140">身份证号</th>
                            <td>{{member.naturePerson.idcard}}</td>
                        </tr>
                        <tr>

                            <th width="140">手机</th>
                            <td>{{member.naturePerson.phone}}</td>
                            <th width="140">地址</th>
                            <td >{{member.naturePerson.address}}</td>
                        </tr>

                    </table>
                </div>
                <div class="table-show">
                    <div class="table-inline">
                        <h2 class="h2-style-show">预审材料:</h2>
                        <table class="table table-bordered table-responsive">
                            <tr>
                                <th>名称</th>
                                <th width="50">链接</th>
                            </tr>
                            <tr v-for="m in materialList">
                                <td>{{m.itemMaterialName}}</td>
                                <td  style="text-align: center;">
                                    <template v-for="(file,index) in m.itemMaterialUrl.split('|')">
                                        <a v-if="index>0" target="_blank" :href="file">[{{index}}]</a>
                                    </template>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="table-inline" style="padding-left: 30px;">
                        <h2 class="h2-style-show">审核结果:</h2>
                        <table class="table table-responsive table-bordered">
                            <tr>
                                <th width="140">预审编号</th>
                                <td>{{ItemPretrial.processNumber}}</td>
                            </tr>
                            <tr>
                                <th width="140">办理事项</th>
                                <td>{{ItemPretrial.itemName}}</td>
                            </tr>
                            <tr>
                                <th width="140">提交资料时间</th>
                                <td>{{ItemPretrial.applyTime}}</td>
                            </tr>
                            <tr>
                                <th width="140">审核人</th>
                                <td>{{ItemPretrial.auditName}}</td>
                            </tr>
                            <tr>
                                <th width="140">审核时间</th>
                                <td>{{ItemPretrial.auditTime | date('YYYY-MM-DD HH:mm:ss')}}</td>
                            </tr>
                            <tr>
                                <th width="140">状态</th>
                                <td>{{ItemPretrial.status | enums('PretrialStatus')}}</td>
                            </tr>
                            <tr>
                                <th width="140">备注</th>
                                <td>{{ItemPretrial.remark}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {getZwfwItemPretrialList, getPretrialDetail, submitReview} from 'api/hallSystem/window/pretrial/itemPretrial';
    import {mapGetters} from 'vuex';
    import {copyProperties} from 'utils';

    export default {
        name: 'table_demo',
        data() {
            return {
                pretrialList: null,
                total: null,
                listLoading: true,
                listQuery: {
                    processNumber: undefined,
                    inStatus: 'PASS',
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows
                },
                legalPerson: [],
                member: [],
                materialList: [],
                ItemPretrial: [],
                titleName: '',
                currentItemPretrial: [],
                dialogStatus: '',
                dialogFormVisible: false
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
            handleFilter() {
                this.getList();
            },
            getList() {
                this.listLoading = true;
                getZwfwItemPretrialList(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.pretrialList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            handleSelectionChange(row) {
                this.selectedRows = row;
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            editAudit(row) {
                this.currentItemPretrial = row;
                this.resetTemp();
                this.ItemPretrial = copyProperties(this.ItemPretrial, row);
                this.processNumber = row.id;
                this.titleName = '办件预审' + " | 办件号：" + row.processNumber;
                this.dialogFormVisible = true;
                this.getPretrialDetail();
            },
            getPretrialDetail() {
                getPretrialDetail(this.processNumber).then(response => {
                    if (response.httpCode === 200) {
                        this.member = response.data.member;
                        this.materialList = response.data.pretrialMaterialList;
                        this.ItemPretrial = this.currentItemPretrial;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            resetTemp() {
                this.ItemPretrial = {
                    id: undefined,
                    processNumber: '',
                    companyName: '',
                    applyTime: '',
                    auditTime: '',
                    expireDate: '',
                    status: '',
                    remark: ''
                };
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
        font-weight: 100;
        font-size: 24px;
        margin-top: 5px;
    }
</style>
