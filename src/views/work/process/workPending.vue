<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select style="bottom: 4px;" v-model="listQuery.me" placeholder="请选择" @change="handleFilter">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="办件号"
                      v-model="listQuery.pretrialNumber"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </div>

        <el-table ref="zwfwDeptWorkPendingTable" :data="zwfwDeptWorkPendingList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column align="center" label="ID">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="流水号">
                <template scope="scope">
                    <span>{{scope.row.pretrialNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办理事项" prop="itemName">
                <template scope="scope">
                    {{scope.row.itemName}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="当前步骤" prop="currentTaskName">
                <template scope="scope">
                    <span>{{scope.row.currentTaskName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="步骤时限" prop="taskLimitTime">
                <template scope="scope">
                    <span>{{scope.row.taskLimitTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
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
                    <span>{{scope.row.flagCorrection | enums('YesNo')}}</span>
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
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button @click="showDetail(scope.row)">查看</el-button>
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
        <el-dialog class="s-dialog-title" size="large" :title="textMapTitle" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetWorkPendingForm">
            <div>
                <div>
                    <!--{{itemProcessVo.currentTaskName}}-->
                    <h2 class="h2-style-show">审批处理：{{itemProcessVo.currentTaskName}} </h2>
                    <input type="hidden" name="taskId" :value='itemProcessVo.taskId'/>
                    <input type="hidden" name="id" :value='itemProcessVo.id'/>


                    <div style="margin-bottom:20px;">
                        <el-button class="filter-item" type="primary" @click="action='pass'">提交办理</el-button>
                        <el-button v-if="itemTaskSetting.supportCorrection" class="filter-item" type="primary"
                                   @click="action='correction'" :disabled="itemProcessVo.flagCorrection">整改
                        </el-button>
                        <el-button v-if="itemTaskSetting.supportExtendTime" class="filter-item" type="primary"
                                   @click="action='extendTime'"
                                   :disabled="itemProcessVo.flagCorrection || itemProcessVo.extendTimeApplying ">申请延期
                        </el-button>
                        <el-button v-if="itemTaskSetting.supportClose" class="filter-item" type="primary"
                                   @click="action='close'">不予处理
                        </el-button>
                    </div>

                    <el-form ref="deptWorkPendingForm" :model="itemProcessVo" label-suffix="：">

                        <el-form-item v-show="action=='pass'" v-for="field in taskForm" :label="field.name"
                                      :key="field.id">
                            <template v-if="field.type=='enum'">
                                <select v-bind:name="'form_'+field.id"
                                        v-bind:id="'form_field_'+field.id" placeholder="请选择"
                                        v-model="formData['form_'+field.id]">
                                    <option v-for="(v,k) in field.values" :value="k">{{v}}</option>
                                </select>
                            </template>
                            <template v-else>
                                <el-input v-bind:name="'form_'+field.id"
                                          v-bind:id="'form_field_'+field.id"
                                          v-model="formData['form_'+field.id]"></el-input>
                            </template>
                        </el-form-item>

                        <el-form-item v-show="action=='pass'" class="h2-style-show" label="提交办理意见">
                            <el-input v-model="passRemark" type="textarea"></el-input>
                        </el-form-item>
                        <el-button v-show="action=='pass'" style="width: 100%;" type="primary" @click="submitComplete">
                            确定提交
                        </el-button>
                        <el-form-item v-show="action=='correction'" class="h2-style-show" label="请输入整改原因">
                            <el-input class="input-textarea" v-model="correctionReason" type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item v-show="action=='correction'">
                            <el-input v-model="extendTimeDays" type="text"
                                      :placeholder='"请输入在"+$options.filters.date(itemProcessVo.taskLimitTime, "YYYY-MM-DD HH:mm:ss")+"上的延期天数"'
                                      min="1"></el-input>
                        </el-form-item>
                        <el-button v-show="action=='correction'" type="primary" style="width: 100%;"
                                   @click="submitCorrection">确定整改
                        </el-button>
                        <el-form-item v-show="action=='extendTime'" label="申请延期">
                            <el-input v-model="extendTimeReason" type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item v-show="action=='extendTime'">
                            <el-input v-model="extendTimeDays" type="text"
                                      :placeholder='"请输入在"+$options.filters.date(itemProcessVo.taskLimitTime, "YYYY-MM-DD HH:mm:ss")+"上的延期天数"'
                                      min="1"></el-input>
                        </el-form-item>
                        <el-button style="width: 100%;" v-show="action=='extendTime'" type="primary"
                                   @click="submitExtendTime">确定延期申请
                        </el-button>
                        <el-form-item v-show="action=='close'" label="请输入不予受理原因">
                            <el-input class="input-textarea" v-model="closeReason" type="textarea"></el-input>
                        </el-form-item>
                        <el-button style="width: 100%;" v-show="action=='close'" type="primary" @click="submitClose">
                            确定不予受理
                        </el-button>
                    </el-form>
                </div>
                <div>
                    <h2 class="h2-style-show">审批记录：</h2>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <th>流入时间</th>
                            <th>办理步骤</th>
                            <th>表单</th>
                            <!--<th>整改</th>-->
                            <th>意见</th>
                            <th>办理时间</th>
                            <th>耗时</th>
                            <th>办理人</th>
                        </tr>
                        <tr v-for="h in history">
                            <td>{{h.createTime | date('YYYY-MM-DD HH:mm')}}</td>
                            <td>{{h.name}}</td>
                            <td>
                                <table v-if="h.formValue!=null" class="table table-bordered">
                                    <tr v-for="(v,k) in h.formValue">
                                        <th>{{k}}:</th>
                                        <td>{{v}}</td>
                                    </tr>
                                </table>
                            </td>
                            <!--<td>X</td>-->
                            <td>
                                <div style="white-space: pre-line">{{h.reason }}</div>
                            </td>
                            <td>
                                <template v-if="h.endTime">{{h.endTime | date('YYYY-MM-DD HH:mm')}}
                                </template>
                            </td>
                            <td>
                                <template v-if="h.durationInMillis">{{h.durationInMillis | duration}}
                                </template>
                            </td>
                            <td>
                                <template v-if="h.assignee">{{users[h.assignee]}}</template>
                            </td>
                        </tr>
                    </table>
                </div>
                <div>
                    <el-tabs v-model="tabPaneShow" type="card">
                        <el-tab-pane label="申请企业/个人" name="first">
                            <div>
                                <div>
                                    <table class="table table-responsive table-bordered">
                                        <tr>
                                            <th width="140">办事企业/机构</th>
                                            <td>{{legalPerson.companyName}}</td>
                                            <th width="140">统一社会信用代码</th>
                                            <td>{{legalPerson.companyCode}}</td>
                                        </tr>
                                        <tr>
                                            <th width="140">法人姓名</th>
                                            <td>{{legalPerson.legalPerson}}</td>
                                            <th width="140">法人身份证号</th>
                                            <td>{{legalPerson.idcard}}</td>
                                        </tr>
                                        <tr>
                                            <th width="140">企业/机构地址</th>
                                            <td colspan="3">{{legalPerson.registerPlace}}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div>
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
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="办件进度" name="second">
                            <div v-if="itemProcessVo.status==10">
                                <table class="table table-bordered table-responsive">
                                    <tr v-if="itemProcessVo.taskLimitTime">
                                        <td>当前步骤期限</td>
                                        <td>
                                            {{itemProcessVo.taskLimitTime | date('YYYY-MM-DD HH:mm:ss')}}
                                            <!--包括工作日{{itemProcessVo.taskLimitTime|fromNow}}-->
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
                                        <td>{{itemProcessVo.startItemTime | date('YYYY-MM-DD HH:mm:ss')}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>承诺办结日期</td>
                                        <td>{{itemProcessVo.promiseFinishTime | date('YYYY-MM-DD HH:mm:ss')}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>流入当前步骤时间</td>
                                        <td>{{itemProcessVo.taskCreateTime | date('YYYY-MM-DD HH:mm:ss')}}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div v-if="itemProcessVo.status==15">
                                已办结
                            </div>

                            <div v-if="itemProcessVo.status==99">
                                不予受理
                            </div>

                        </el-tab-pane>
                        <el-tab-pane label="整改记录" name="third">
                            <table class="table table-responsive table-bordered">
                                <tr>
                                    <th>整改时间</th>
                                    <th>所在步骤</th>
                                    <th>整改原因</th>
                                    <th>操作人</th>
                                </tr>
                                <tr v-for="h in correctionList">
                                    <td>{{h.correctionTime | date('YYYY-MM-DD HH:mm')}}</td>
                                    <td>{{h.taskName}}</td>
                                    <div style="white-space: pre-line"><strong v-if="h.correctionFlag">整改：</strong>
                                        <strong v-if="h.status==1">通过：</strong>
                                        <strong v-if="h.status==2">未通过：</strong>
                                        <strong v-else></strong>{{h.reason}}
                                    </div>
                                    <td>{{h.correctionUserName}}</td>
                                </tr>
                            </table>
                        </el-tab-pane>
                        <el-tab-pane label="延期记录" name="fourth">
                            <table class="table table-responsive table-bordered">
                                <tr>
                                    <th>申请时间</th>
                                    <th>延期天数</th>
                                    <th>延期到</th>
                                    <th>所在步骤</th>
                                    <th>延期原因</th>
                                    <th>审核状态</th>
                                    <th>申请人</th>
                                    <th>审核人</th>
                                    <th>操作</th>
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
                                    <td>
                                        <el-button
                                                v-if="h.timeExtendStatus==1"
                                                @click="cancelExtendTime(h.id)">撤销申请
                                        </el-button>
                                    </td>
                                </tr>
                            </table>
                        </el-tab-pane>
                        <el-tab-pane label="办件材料" name="fifth">
                            <table class="table table-bordered table-responsive">
                                <tr>
                                    <th>序号</th>
                                    <th>材料</th>
                                    <th width="50">查看</th>
                                </tr>
                                <tr v-for="(c,index) in itemMaterialVoList">
                                    <td>{{index + 1}}</td>
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
                    </el-tabs>
                </div>
                <div>
                    <el-button v-if="itemProcessVo.flagCorrection || itemProcessVo.status == 99"
                               type="button" @click="print_ycxgzd(itemProcessVo.pretrialNumber)">打印一次性告知单</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {
        getZwfwDeptWorkPendingList,
        getZwfwDeptWorkDetail,
        workComplete,
        workCorrection,
        workExtendTime,
        workClose,
        workCancelExtendTime
    } from 'api/zwfw/zwfwDeptWorkPending';

    import {getZwfwApiHost} from 'utils/fetch';

    export default {
        name: 'zwfwDeptWorkPending_table',
        data() {
            return {
                textMapTitle: null,
                zwfwDeptWorkPendingList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    pretrialNumber: undefined,
                    me: true
                },
                options: [
                    {
                        value: true,
                        label: '我的待处理任务'
                    }, {
                        value: false,
                        label: '所有待处理任务'
                    }],
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
                formData: {},
                taskForm: [],
                itemVo: {},
                member: {},
                legalPerson: {},
                history: [],
                users: {},
                itemTaskSetting: {},
                action: '',
                correctionList: [],
                extendTimeVoList: []
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

            /**
             * 处理搜索条件的变化
             * */
            handleFilter() {
                this.getList();
            },
            /**
             * 刷新列表
             **/
            getList() {
                this.listLoading = true;
                getZwfwDeptWorkPendingList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.zwfwDeptWorkPendingList = response.data.list;
                        this.total = response.data.total;
                        this.listLoading = false;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            /**
             * 显示详细
             * */
            showDetail(row) {
                this.pretrialNumber = row.pretrialNumber;
                this.taskId = row.taskId;
                this.textMapTitle = '部门办事 - ' + row.itemName;
                this.dialogFormVisible = true;

                this.passRemark = '确认通过';
                this.correctionReason = '1、\n2、\n3、\n4、\n5、\n';
                this.closeReason = '1、\n2、\n3、\n4、\n5、\n';
                this.extendTimeReason = null;
                this.extendTimeDays = '';
                const query = {
                    processNumber: this.pretrialNumber,
                    taskId: this.taskId
                }
                getZwfwDeptWorkDetail(query).then(response => {
                    if (response.httpCode === 200) {
                        this.approveStepList = response.data.approveStepList;
                        this.itemConditionVoList = response.data.itemConditionVoList;
                        this.itemMaterialVoList = response.data.itemMaterialVoList;
                        this.itemProcessVo = response.data.itemProcessVo;
                        this.taskForm = response.data.taskForm;
                        this.itemVo = response.data.itemVo;
                        this.member = response.data.member;
                        this.legalPerson = response.data.legalPerson;
                        this.history = response.data.history;
                        this.users = response.data.users;
                        this.itemTaskSetting = response.data.itemTaskSetting || {};
                        this.action = '';
                        this.correctionList = response.data.correctionList;
                        this.extendTimeVoList = response.data.extendTimeVoList;
                    } else {
                        this.$message.error(response.msg);
                    }

                });
            },
            /**
             * 取消延期申请
             */
            cancelExtendTime(id) {
                const query = {
                    id: id
                };
                workCancelExtendTime(query).then(response => {
                    if (response.httpCode === 200) {
                        this.dialogFormVisible = false;
                        this.$message.success('取消成功');
                        this.getList();

                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            /**
             * 提交到下一步
             * */
            submitComplete() {
                var form = this.$refs.deptWorkPendingForm;
//                console.log(Qs.parse($(form.$el).serialize()));
                console.log(this.formData);

                const query = Object.assign({
                    taskId: this.itemProcessVo.taskId,
                    passReason: this.passRemark
                }, this.formData);
                workComplete(query).then(response => {
                    if (response.httpCode === 200) {
                        this.dialogFormVisible = false;
                        this.$message.success('提交成功');
                        this.getList();
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            /**
             * 提交整改
             * */
            submitCorrection() {
                const query = {
                    taskId: this.itemProcessVo.taskId,
                    correctionReason: this.correctionReason,
                    extendTimeDays: this.extendTimeDays
                }
                workCorrection(query).then(response => {
                    if (response.httpCode === 200) {
                        this.dialogFormVisible = false;
                        this.$message.success('提交成功');
                        this.getList();

                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            /**
             * 提交延期申请
             * */
            submitExtendTime() {
                const query = {
                    taskId: this.itemProcessVo.taskId,
                    extendTimeDays: this.extendTimeDays,
                    extendTimeReason: this.extendTimeReason
                }
                workExtendTime(query).then(response => {
                    if (response.httpCode === 200) {
                        this.dialogFormVisible = false;
                        this.$message.success('提交成功');
                        this.getList();

                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            /**
             * 提交不予受理
             * */
            submitClose() {
                const query = {
                    taskId: this.itemProcessVo.taskId,
                    closeReason: this.closeReason
                }
                workClose(query).then(response => {
                    if (response.httpCode === 200) {
                        this.dialogFormVisible = false;
                        this.$message.success('提交成功');
                        this.getList();

                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            resetTemp() {
                this.itemProcessVo = {
                    taskLimitTime: ''
                }
            },
            resetWorkPendingForm() {
                this.dialogFormVisible = false;
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
            print_ycxgzd(pretrialNumber) {
                if (pretrialNumber != null) {
                    window.open(getZwfwApiHost() + '/zwfwItemPretrial/downloadYcxgzd?pretrialNumber=' + pretrialNumber);
                }
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
        font-weight: 100;
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

    .s-dialog-title .el-dialog__header {
        margin-bottom: -29px;
    }

    .s-dialog-title .input-textarea .el-textarea__inner {
        height: 10em;
    }
</style>
