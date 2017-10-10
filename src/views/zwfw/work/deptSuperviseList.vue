<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.name"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </div>

        <el-table ref="zwfwDeptWorkPendingTable" :data="list" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column align="center" label="办件序号" width="100px">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办理事项" width="200px">
                <template scope="scope">
                    <span>{{scope.row.itemName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="开始时间" prop="startItemTime">
                <template scope="scope">
                    <span>{{scope.row.startItemTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="承诺办结时间" prop="promiseFinishTime">
                <template scope="scope">
                    <span>{{scope.row.promiseFinishTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="超期件" prop="flagTimeout">
                <template scope="scope">
                    <span>{{scope.row.flagTimeout | enums('YesNo')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="督办件" prop="flagSupervied">
                <template scope="scope">
                    <span>{{scope.row.flagSupervied | enums('YesNo')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="资料存档状态" prop="flagArchive">
                <template scope="scope">
                    <span>{{scope.row.flagArchive | enums('YesNo')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="申请办理人" prop="memberRealname">
                <template scope="scope">
                    <span>{{scope.row.memberRealname}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="企业名称" prop="companyName">
                <template scope="scope">
                    <span>{{scope.row.companyName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
                    <span>{{scope.row.status | zwfwEnumData('ItemProcessStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="250px">
                <template scope="scope">
                    <el-button class="filter-item" type="primary" @click="handleDetailList(scope.row)">查看
                    </el-button>
                    <el-button v-show="scope.row.flagSupervied != null && scope.row.flagSupervied == 0"
                               class="filter-item"
                               type="primary"
                               @click="setSupervised(scope.row)">标记督办
                    </el-button>
                    <el-button v-show="scope.row.flagSupervied != null && scope.row.flagSupervied == 1"
                               class="filter-item"
                               type="primary"
                               @click="cancelSupervised(scope.row)">取消督办
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

        <el-dialog class="s-dialog-title" :title="textMapTitle" :close-on-click-modal="closeOnClickModal" :visible.sync="dialogFormVisible">
            <div>
                <div>
                    <h3 class="h2-style-show">申请人信息：</h3>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <td width="140">姓名</td>
                            <td>{{member.name}}</td>
                            <td width="140">身份证号</td>
                            <td>{{member.idNumber}}</td>
                        </tr>
                        <tr>
                            <td width="140">邮箱</td>
                            <td>{{member.email}}</td>
                            <td width="140">手机</td>
                            <td>{{member.mobilephone}}</td>
                        </tr>
                        <tr>
                            <td width="140">地址</td>
                            <td colspan="3">{{member.address}}</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3 class="h2-style-show">办件进度：</h3>
                    <table class="table table-bordered table-responsive">
                        <tr v-if="itemProcessVo.limitTime">
                            <td>当前步骤期限</td>
                            <td>
                                {{itemProcessVo.limitTime | date('YYYY-MM-DD HH:mm:ss')}}
                                <!--包括工作日{{itemProcessVo.limitTime|fromNow}}-->
                            </td>
                        </tr>
                        <tr>
                            <td>当前办理步骤</td>
                            <td>{{itemProcessVo.currentTaskName}}</td>
                        </tr>
                        <tr>
                            <td>督办件</td>
                            <td>{{itemProcessVo.flagSupervied | enums('YesNo')}}</td>
                        </tr>
                        <tr>
                            <td>超期件</td>
                            <td>{{itemProcessVo.flagTimeout | enums('YesNo')}}</td>
                        </tr>
                        <tr>
                            <td>整改状态</td>
                            <td>{{itemProcessVo.flagCorrection | enums('YesNo')}}</td>
                        </tr>
                        <tr>
                            <td>申请办件时间</td>
                            <td>{{itemProcessVo.startItemTime | date('YYYY-MM-DD HH:mm:ss')}}</td>
                        </tr>
                        <tr>
                            <td>承诺办结日期</td>
                            <td>{{itemProcessVo.promiseFinishTime | date('YYYY-MM-DD HH:mm:ss')}}
                            </td>
                        </tr>
                        <tr>
                            <td>流入当前步骤时间</td>
                            <td>{{itemProcessVo.taskCreateTime | date('YYYY-MM-DD HH:mm:ss')}}</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3 class="h2-style-show">审批记录：</h3>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <td>流入时间</td>
                            <td>办理步骤</td>
                            <td>信息</td>
                            <td>办理时间</td>
                            <td>耗时</td>
                            <td>办理人</td>
                        </tr>
                        <tr v-for="h in history">
                            <td>{{h.createTime | date('YYYY-MM-DD HH:mm')}}</td>
                            <td>{{h.name}}</td>
                            <td>
                                <table v-if="h.formValue!=null" class="table table-bordered">
                                    <tr v-for="(k,v) in h.formValue">
                                        <th>{{k}}:</th>
                                        <td>{{v}}</td>
                                    </tr>
                                </table>
                            </td>
                            <td>
                                <template v-if="h.endTime">{{h.endTime | date('YYYY-MM-DD HH:mm')}}
                                </template>
                            </td>
                            <td>
                                <template v-if="h.durationInMillis">{{h.durationInMillis}}
                                </template>
                            </td>
                            <td>
                                <template v-if="h.assignee">{{users[h.assignee]}}</template>
                            </td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3 class="h2-style-show">整改记录：</h3>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <td>整改时间</td>
                            <td>所在步骤</td>
                            <td>整改原因</td>
                            <td>操作人</td>
                        </tr>
                        <tr v-for="h in correctionList">
                            <td>{{h.correctionTime | date('YYYY-MM-DD HH:mm')}}</td>
                            <td>{{h.taskName}}</td>
                            <td>{{h.correctionReason}}</td>
                            <td>{{h.correctionUserName}}</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3 class="h2-style-show">延期记录：</h3>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <td>申请时间</td>
                            <td>延期天数</td>
                            <td>延期到</td>
                            <td>所在步骤</td>
                            <td>延期原因</td>
                            <td>审核状态</td>
                            <td>申请人</td>
                            <td>审核人</td>
                        </tr>
                        <tr v-for="h in extendTimeVoList">
                            <td>{{h.timeExtendApply | date('YYYY-MM-DD HH:mm')}}</td>
                            <td>{{h.timeExtendWorkdates}}</td>
                            <td>{{h.timeExtendToDate | date('YYYY-MM-DD HH:mm')}}</td>
                            <td>{{h.taskName}}</td>
                            <td>{{h.reason}}</td>
                            <td>{{h.timeExtendStatus | zwfwEnumData('TimeExtendStatus')}}</td>
                            <td>{{h.applyUserName}}</td>
                            <td>{{h.auditUserName}}</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <el-tabs v-model="tabPaneShow" type="card">
                        <el-tab-pane label="办理事项" name="first">
                            <table class="table table-bordered table-responsive">
                                <tr>
                                    <td>办理事项</td>
                                    <td>{{itemVo.name}}</td>
                                </tr>
                                <tr>
                                    <td>办理主体</td>
                                    <td>{{itemVo.departmentName}}</td>
                                </tr>
                                <tr>
                                    <td>事项审批涉及的部门</td>
                                    <td>{{itemVo.departmentNames}}</td>
                                </tr>
                                <tr>
                                    <td>办件类型</td>
                                    <td>{{itemVo.type | zwfwEnumData('ItemType')}}</td>
                                </tr>
                                <tr>
                                    <td>承诺时限</td>
                                    <td>{{itemVo.promiseDay}} 天</td>
                                </tr>
                                <tr>
                                    <td>法定时限</td>
                                    <td>{{itemVo.legalDay}} 天</td>
                                </tr>
                                <tr>
                                    <td>核准数量</td>
                                    <td>{{itemVo.authorizedQuantity == 0
                                        ? '无限' : itemVo.authorizedQuantity}}
                                    </td>
                                </tr>
                                <tr>
                                    <td>收费情况</td>
                                    <td>{{itemVo.chargeStandard}}</td>
                                </tr>
                                <tr>
                                    <td>收费依据</td>
                                    <td>{{itemVo.chargeBasis}}</td>
                                </tr>
                                <tr>
                                    <td>批准证件</td>
                                    <td>{{itemVo.approvalDocumentName}}</td>
                                </tr>
                                <tr>
                                    <td>联系电话</td>
                                    <td>{{itemVo.tellphone}}</td>
                                </tr>
                                <tr>
                                    <td>监督电话</td>
                                    <td>{{itemVo.superviseTellphone}}</td>
                                </tr>
                            </table>

                            <div v-if="itemVo.commonRequestion!=null && itemVo.commonRequestion!=''">
                                <h3>注意事项:</h3>
                                <pre class="panel-warning">{{itemVo.commonRequestion}}</pre>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="法定依据" name="second">
                            <span>{{itemVo.setBasis}}</span>
                        </el-tab-pane>
                        <el-tab-pane label="办理条件" name="third">
                            <span v-for="c in itemConditionVoList">
                                {{c.content}}
                            </span>
                        </el-tab-pane>
                        <el-tab-pane label="办件材料" name="fifth">
                            <table class="table table-bordered table-responsive">
                                <tr>
                                    <th>序号</th>
                                    <th>材料</th>
                                    <th width="50">查看</th>
                                </tr>
                                <tr v-for="c in itemMaterialVoList">
                                    <td>{{c.id}}</td>
                                    <td>{{c.name}}</td>
                                    <td>
                                        <template v-for="(file,index) in c.multipleFile">
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
                        </el-tab-pane>
                        <el-tab-pane label="内部办理流程描述" name="itemStep">
                            <div id="itemStepInfo" style="white-space:pre-wrap">{{itemVo.workflowDescription}}</div>
                        </el-tab-pane>

                    </el-tabs>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {
        getZwfwDeptSuperviseList, getZwfwDeptWorkDetail, workCancelSupervised, workSetSupervised
    } from 'api/zwfw/zwfwDeptSupervise';

    export default {
        name: 'zwfwDeptWorkPending_table',
        data() {
            return {
                textMapTitle: null,
                itemNumber: [],
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined
                },
                itemMaterialVoList: [],
                itemProcessVo: [],
                correctionList: [],
                member: [],
                company: [],
                history: [],
                extendTimeVoList: [],
                itemConditionVoList: [],
                itemVo: [],
                taskFormValue: {},
                users: {},
                selectedRows: [],
                currentRow: null,
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                tabPaneShow: 'first'
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
                getZwfwDeptSuperviseList(this.listQuery).then(response => {
                    this.list = response.data.list;
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
            handleDetailList(row) {
                this.pretrialNumber = row.pretrialNumber;
                this.taskId = row.taskId;
                this.textMapTitle = '部门办事 - ' + row.itemName;
                this.dialogFormVisible = true;
                const query = {
                    processNumber: this.pretrialNumber,
                    taskId: this.taskId
                }
                getZwfwDeptWorkDetail(query).then(response => {
                    console.log(response.data);
                    this.itemConditionVoList = response.data.itemConditionVoList;
                    this.itemMaterialVoList = response.data.itemMaterialVoList;
                    this.itemProcessVo = response.data.itemProcessVo;
                    this.taskForm = response.data.taskForm;
                    this.itemVo = response.data.itemVo;
                    this.member = response.data.member;
                    this.company = response.data.company;
                    this.history = response.data.history;
                    this.users = response.data.users;
                    this.correctionList = response.data.correctionList;
                    this.extendTimeVoList = response.data.extendTimeVoList;
                });
            },
            setSupervised(id) {
                workSetSupervised(id).then(response => {
                    console.log(response.data);
                    this.getList();
                })
            },
            cancelSupervised(id) {
                workCancelSupervised(id).then(response => {
                    console.log(response.data);
                    this.getList();
                })
            },
            resetTemp() {
                this.itemNumber = {
                    id: undefined,
                    itemName: '',
                    startItemTime: '',
                    promiseFinishTime: '',
                    flagTimeout: '',
                    flagSupervied: '',
                    flagArchive: '',
                    memberRealname: '',
                    companyName: '',
                    status: '',
                    enable: 1
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

    .h2-style-show {
        font-weight: 100;
        font-size: 24px;
    }

    #itemStepInfo table {
        width: 100%;
        margin-top: 20px;
    }

    #itemStepInfo table th, #itemInfo table td {
        height: 30px;
        line-height: 30px;
        border: 1px solid #bfcbd9;
        padding: 6px;
    }

    #itemStepInfo table th {
        text-align: left;
        background-color: #eef1f6;

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

    .s-dialog-title .el-dialog__header {
        margin-bottom: -29px;
    }

    .s-dialog-title .input-textarea .el-textarea__inner {
        height: 10em;
    }
</style>