<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="预审号"
                      v-model="listQuery.pretrialNumber" no-match-text="没有找到哦">
            </el-input>
            <el-button style="margin-left: 10px;" class="filter-item" type="primary" v-waves icon="search" @click="getList" >搜索
            </el-button>
        </div>
        <el-table :data="pretrialList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column min-width="200px" align="center" label="预审号">
                <template scope="scope">
                    <span>{{scope.row.number}}<br/>({{scope.row.itemName}})</span>
                </template>
            </el-table-column>
            <el-table-column width="250px" align="center" label="企业名称">
                <template scope="scope">
                    <span>{{scope.row.companyName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="提交预审的时间">
                <template scope="scope">
                    <span>{{scope.row.applyTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="审核时间">
                <template scope="scope">
                    <span>-</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="审核期限">
                <template scope="scope">
                    <span>{{scope.row.expireDate | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="250px" align="center" label="状态">
                <template scope="scope">
                    <span>{{scope.row.status | zwfwEnumData('PretrialStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="250px" align="center" label="备注">
                <template scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button class="filter-item" style="margin-left: 10px;" type="primary"
                               @click="editAudit(scope.row)">审 核
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
                   :before-close="resetItemPretrialForm">
            <div>
                <div>
                    <h3>办事企业/机构信息:</h3>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <th width="140">办事企业/机构</th>
                            <td>{{company.name}}</td>
                            <th width="140">统一社会信用代码</th>
                            <td>{{company.unifyCode}}</td>
                        </tr>
                        <tr>
                            <th width="140">法人姓名</th>
                            <td>{{company.legalPerson}}</td>
                            <th width="140">法人身份证号</th>
                            <td>{{company.legalPersonCard}}</td>
                        </tr>
                        <tr>
                            <th width="140">企业/机构地址</th>
                            <td colspan="3">{{company.address}}</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3>申请人信息:</h3>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <th width="140">姓名</th>
                            <td>{{member.name}}</td>
                            <th width="140">身份证号</th>
                            <td>{{member.idNumber}}</td>
                        </tr>
                        <tr>
                            <th width="140">邮箱</th>
                            <td>{{member.email}}</td>
                            <th width="140">手机</th>
                            <td>{{member.mobilephone}}</td>
                        </tr>
                        <tr>
                            <th width="140">地址</th>
                            <td colspan="3">{{member.address}}</td>
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
                        <el-form ref="zwfwItemPretrial" label-width="140px" :model="ItemPretrial"
                                 :rules="ItemPretrialRules">
                            <el-form-item label="预审编号">
                                <el-input v-model="ItemPretrial.number" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="办理事项">
                                <el-input v-model="ItemPretrial.itemName" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="提交资料时间">
                                <el-input v-model="ItemPretrial.applyTime" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="审核结果" prop="status">
                                <el-select v-model="ItemPretrial.status">
                                    <el-option label="通过" value="4"></el-option>
                                    <el-option label="整改" value="3"></el-option>
                                    <el-option label="不予受理" value="5"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="ItemPretrial.status==3" label="整改原因">
                                <el-input v-model="changeRemark" type="textarea"></el-input>
                            </el-form-item>
                            <el-form-item v-if="ItemPretrial.status==4" label="通过备注">
                                <el-input v-model="passRemark" type="textarea"></el-input>
                            </el-form-item>
                            <el-form-item v-if="ItemPretrial.status==5" label="不予受理原因">
                                <el-input v-model="changeRemark" type="textarea"></el-input>
                            </el-form-item>
                        </el-form>
                        <div style="text-align: center" slot="footer" class="dialog-footer">
                            <el-button type="primary" icon="circle-check" @click="submitReview">提交预审结果
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {getZwfwItemPretrialList, getPretrialDetail, submitReview} from 'api/zwfw/zwfwItemPretrial';
    import {mapGetters} from 'vuex';
    import {copyProperties, resetForm} from 'utils';
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";
    import ElOption from "../../../../node_modules/element-ui/packages/select/src/option";

    export default {
        components: {
            ElOption,
            ElFormItem
        },
        name: 'table_demo',
        data() {
            return {
                pretrialList: null,
                total: null,
                listLoading: true,
                listQuery: {
                    pretrialNumber: undefined,
                    status: 2,
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows
                },
                company: [],
                member: [],
                materialList: [],
                titleName: '办件预审',
                currentItemPretrial: [],
                pretrialInfo: [],
                statusPreSubmit: '',
                dialogStatus: '',
                dialogFormVisible: false,
                changeRemark: '1、\n2、\n3、\n',
                passRemark: '确认通过',
                ItemPretrial: {
                    id: undefined,
                    number: '',
                    companyName: '',
                    applyTime: '',
                    auditTime: '',
                    expireDate: '',
                    itemName: '',
                    status: '',
                    remark: ''
                },
                ItemPretrialRules: {
                    status: [
                        {required: true, message: '请选择审核结果', trigger: 'change'}
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
                'zwfwEnumData',
                'closeOnClickModal'
            ])
        },
        methods: {
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
                    this.company = response.data.company;
                    this.member = response.data.member;
                    this.materialList = response.data.pretrialMaterialList;
                    this.ItemPretrial = this.currentItemPretrial;
                    this.ItemPretrial.status = '';
                    this.ItemPretrialRules.status[0].required = false;
                })
            },
            submitReview() {
                this.ItemPretrialRules.status[0].required = true;
                this.$refs['zwfwItemPretrial'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        const querry = {
                            id: this.ItemPretrial.id,
                            status: this.ItemPretrial.status,
                            remark: null
                        }
                        if (this.ItemPretrial.status == 3 || this.ItemPretrial.status == 5) {
                            querry.remark = this.changeRemark;
                        } else if (this.ItemPretrial.status == 4) {
                            querry.remark = this.passRemark;
                        }
                        submitReview(querry).then(response => {
                            const index = this.pretrialList.indexOf(this.selectedRows);
                            this.pretrialList.splice(index, 1);
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.ItemPretrial = {
                    id: undefined,
                    number: '',
                    companyName: '',
                    applyTime: '',
                    auditTime: '',
                    expireDate: '',
                    status: '',
                    remark: ''
                };
            },
            resetItemPretrialForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'zwfwItemPretrial');
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
