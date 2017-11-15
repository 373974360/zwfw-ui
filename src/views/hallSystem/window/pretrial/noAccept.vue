<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 300px;" class="filter-item"  placeholder="预审号"
                      v-model="listQuery.pretrialNumber" no-match-text="没有找到哦">
            </el-input>
            <el-button style="margin-left: 10px;" class="filter-item" type="primary" v-waves icon="search" @click="getList"
            >搜索
            </el-button>
        </div>
        <el-table :data="pretrialList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column min-width="200px" align="center" label="预审号">
                <template scope="scope">
                    <span>{{scope.row.pretrialNumber}}<br/>({{scope.row.itemName}})</span>
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
                    <span>{{scope.row.status | zwfwEnumData('PretrialStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="250px" align="center" label="备注">
                <template scope="scope">
                    <div style="white-space:pre-wrap;text-align: left;">{{scope.row.remark}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button class="filter-item" style="margin-left: 10px;" type="primary"
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
        <el-dialog :close-on-click-modal="closeOnClickModal" :title="titleName" :visible.sync="dialogFormVisible"
        >
            <div>
                <div v-if="member.legalPerson != null">
                    <h3>办事企业/机构信息:</h3>
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
                    <h3>申请人信息:</h3>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <th width="140">姓名</th>
                            <td>{{member.naturePerson.name}}</td>
                            <th width="140">身份证号</th>
                            <td>{{member.naturePerson.idcard}}</td>
                        </tr>
                        <tr>
                            <th width="140">邮箱</th>
                            <td>{{member.email}}</td>
                            <th width="140">手机</th>
                            <td>{{member.naturePerson.phone}}</td>
                        </tr>
                        <tr>
                            <th width="140">地址</th>
                            <td colspan="3">{{member.naturePerson.address}}</td>
                        </tr>
                    </table>
                </div>
                <div class="table-show">
                    <div class="table-inline">
                        <h3>预审材料:</h3>
                        <table class="table table-bordered table-responsive">
                            <tr>
                                <th>名称</th>
                                <th width="50">链接</th>
                            </tr>
                            <tr v-for="m in materialList">
                                <td>{{m.itemMaterialName}}</td>
                                <td>
                                    <template v-for="(file,index) in m.multipleFile">
                                        <template v-if="file.url!=null && file.url!=''">
                                            <a target="_blank"
                                               v-if="file.fileType == 'doc' || file.fileType == 'docx' || file.fileType == 'xls' || file.fileType == 'xlsx' || file.fileType == 'ppt'"
                                               :href="'https://view.officeapps.live.com/op/view.aspx?src='+file.url">[{{index
                                            + 1}}]</a>
                                            <a v-else :href="file.url"
                                               target="_blank">[{{index + 1}}]</a>
                                        </template>
                                    </template>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="table-inline" style="padding-left: 30px;">
                        <h3>审核结果:</h3>
                        <table class="table table-responsive table-bordered">
                            <tr>
                                <th width="140">预审编号</th>
                                <td>{{ItemPretrial.pretrialNumber}}</td>
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
                                <td>{{ItemPretrial.status | zwfwEnumData('PretrialStatus')}}</td>
                            </tr>
                            <tr>
                                <th width="140">备注</th>
                                <td style="white-space:pre-wrap;text-align: left;">{{ItemPretrial.remark}}</td>
                            </tr>
                        </table>
                        <div  style="margin-top:20px;">
                            <el-button type="primary" @click="print_ycxgzd">打印一次性告知单</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {getZwfwApiHost} from 'utils/fetch';
    import {getZwfwItemPretrialList, getPretrialDetail} from 'api/hallSystem/window/pretrial/itemPretrial';
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
                    pretrialNumber: undefined,
                    status: 5,
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows
                },
                legalPerson: [],
                member: [],
                materialList: [],
                ItemPretrial: [],
                titleName: '办件预审',
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
                'zwfwEnumData',
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
                    this.pretrialList = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
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
                this.dialogFormVisible = true;
                this.itemPretrialId = row.id;
                this.getPretrialDetail();
            },
            getPretrialDetail() {
                getPretrialDetail(this.itemPretrialId).then(response => {
                    console.log(response.data);
                    this.member = response.data.member;
                    this.materialList = response.data.pretrialMaterialList;
                    this.ItemPretrial = this.currentItemPretrial;
                })
            },
            print_ycxgzd() {
                if (this.ItemPretrial != null) {
                    window.open('/api/workSystem/itemPretrial/downloadYcxgzd?pretrialNumber=' + this.ItemPretrial.pretrialNumber);
                }
            },
            resetTemp() {
                this.ItemPretrial = {
                    id: undefined,
                    pretrialNumber: '',
                    auditName: '',
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
</style>
