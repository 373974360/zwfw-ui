<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select style="bottom: 4px;" v-model="listQuery.my" placeholder="请选择" @change="handleFilter">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input @keyup.enter.native="handleFilter" style="width: 230px;" class="filter-item" placeholder="办件号"
                      v-model="listQuery.processNumber"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </div>

        <el-table ref="zwfwDeptWorkPendingTable" :data="zwfwDeptWorkPendingList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <!--<el-table-column align="center" label="ID">-->
                <!--<template scope="scope">-->
                    <!--<span>{{scope.row.id}}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="办件号">
                <template scope="scope">
                    <span>{{scope.row.processNumber}}</span>
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
                    <div>{{scope.row.memberRealname}}</div>
                    <div>{{scope.row.memberPhonenumber}}</div>
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
                    <span>{{scope.row.status | enums('ItemProcessStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button @click="showDetail(scope.row)" type="primary">查看</el-button>
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
                   :close-on-click-modal="closeOnClickModal" :before-close="resetWorkPendingForm" v-loading="dialogLoading"
                   element-loading-text="拼命加载中">
            <div>
                    <h2 class="h2-style-show">审批处理：{{itemProcessVo.currentTaskName}} </h2>
                    <input type="hidden" name="taskId" :value='itemProcessVo.taskId'/>
                    <input type="hidden" name="id" :value='itemProcessVo.id'/>


                    <div style="margin-bottom:20px;">
                        <el-button class="filter-item" type="primary" @click="action='pass'">提交办理</el-button>
                        <el-button v-if="itemTaskSetting.supportCorrection" class="filter-item" type="primary"
                                   @click="action='correction'" :disabled="itemProcessVo.flagCorrection || dialogLoading">整改
                        </el-button>
                        <el-button v-if="itemTaskSetting.supportExtendTime" class="filter-item" type="primary"
                                   @click="action='extendTime'"
                                   :disabled="itemProcessVo.flagCorrection || itemProcessVo.extendTimeApplying || dialogLoading ">申请延期
                        </el-button>
                        <el-button v-if="itemTaskSetting.supportClose" class="filter-item" type="primary"
                                   @click="action='close' || dialogLoading">不予处理
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
                        <el-button v-show="action=='pass'" style="width: 100%;" type="primary" @click="submitComplete" :disabled="dialogLoading">
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
                                   @click="submitCorrection" :disabled="dialogLoading">确定整改
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
                                   @click="submitExtendTime" :disabled="dialogLoading">确定延期申请
                        </el-button>
                        <el-form-item v-show="action=='close'" label="请输入不予受理原因">
                            <el-input class="input-textarea" v-model="closeReason" type="textarea"></el-input>
                        </el-form-item>
                        <el-button style="width: 100%;" v-show="action=='close'" type="primary" @click="submitClose" :disabled="dialogLoading">
                            确定不予受理
                        </el-button>
                    </el-form>
                    <h2 class="h2-style-show">上传附件：</h2>
                    <div style="margin-bottom:20px;">
                        <el-upload name="uploadFile" list-type="picture-card" accept="image/*"
                                   :action="uploadAction" :file-list="uploadAvatars"
                                   :on-success="handleAvatarSuccess"
                                   :on-error="handlerAvatarError"
                                   :show-file-list="true"
                                   :on-preview="handlePictureCardPreview"
                                   :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
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
                            <td>{{h.reason}}</td>
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
                    <el-tabs v-model="tabPaneShow" type="card">
                        <el-tab-pane label="申请企业/个人" name="first">
                            <div>
                                <div v-if="member.legalPerson!=null">
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
                                            <td >{{member.legalPerson.registerPlace}}</td>
                                            <th width="140">联系电话</th>
                                            <td >{{member.legalPerson.phone}}</td>
                                        </tr>
                                        <template v-if="companyInfo.id" >
                                            <tr>
                                                <th width="140">联系电话</th>
                                                <td>{{companyInfo.lxdh}}</td>
                                                <th width="140">企业类型</th>
                                                <td>{{companyInfo.qllx}}</td>
                                            </tr>
                                            <tr>
                                                <th width="140">注册资金</th>
                                                <td>{{companyInfo.zczj}}</td>
                                                <th width="140">成立日期</th>
                                                <td>{{companyInfo.clrq}}</td>
                                            </tr>
                                            <tr>
                                                <th width="140">营业期限</th>
                                                <td colspan="3">{{companyInfo.yyqx}}</td>
                                            </tr>
                                            <tr>
                                                <th width="140">经营范围</th>
                                                <td colspan="3">{{companyInfo.jyfw}}</td>
                                            </tr>
                                            <tr>
                                                <th width="140">状态</th>
                                                <td>{{companyInfo.djzt}}</td>
                                                <th width="140">所属街道</th>
                                                <td>{{companyInfo.ssjd}}</td>
                                            </tr>
                                        </template>
                                    </table>
                                </div>
                                <div v-if="member.naturePerson!=null">
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
                                    <td style="white-space: pre-line">{{h.correctionReason}}
                                    </td>
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
                                    <td>{{h.timeExtendStatus | enums('TimeExtendStatus')}}</td>
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
                                    <td  style="text-align: center;">
                                        <div v-if="c.multipleFile" style="color:blue">
                                            <span v-for="(file,index) in c.multipleFile">
                                            <span v-if="file.url!=null && file.url!=''">
                                            <a  :href="file.url" :download="file.fileName"
                                                target="_blank">[{{index + 1}}]</a>
                                            </span>
                                            <span v-else>未上传</span>
                                         </span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </el-tab-pane>
                    </el-tabs>
                <div>
                    <el-button v-if="itemProcessVo.flagCorrection || itemProcessVo.status == 99"
                               type="button" @click="print_ycxgzd(itemProcessVo.processNumber)">打印一次性告知单
                    </el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {
        getZwfwDeptWorkPendingList,
        getZwfwDeptWorkDetail,
        workComplete,
        workCorrection,
        workExtendTime,
        workClose,
        workCancelExtendTime,
        workuploadImg,
        workUploadImgRemove
    } from 'api/workSystem/process/workPending';

    import {
        queryCompanyInfo
    } from 'api/hallSystem/window/receive/windowAccept';


    export default {
        name: 'zwfwDeptWorkPending_table',
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                textMapTitle: null,
                zwfwDeptWorkPendingList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    processNumber: undefined,
                    my: true
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
                history: [],
                users: {},
                itemTaskSetting: {},
                action: '',
                correctionList: [],
                extendTimeVoList: [],
                uploadAction: this.$store.state.app.uploadUrl,
                uploadImgs: [],
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
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.zwfwDeptWorkPendingList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e=>{
                    this.listLoading = false;
                    this.$message.error(response.msg || '加载超时');
                })
            },
            /**
             * 显示详细
             * */
            showDetail(row) {
                this.dialogLoading = true;

                this.uploadAvatars = []
                this.processNumber = row.processNumber;
                this.taskId = row.taskId;
                this.textMapTitle = '部门办事 - ' + row.itemName + " | 办件号："+row.processNumber;
                this.dialogFormVisible = true;
                this.passRemark = '确认通过';
                this.correctionReason = '1、\n2、\n3、\n4、\n5、\n';
                this.closeReason = '1、\n2、\n3、\n4、\n5、\n';
                this.extendTimeReason = null;
                this.extendTimeDays = '';
                const query = {
                    processNumber: this.processNumber,
                    taskId: this.taskId
                }
                getZwfwDeptWorkDetail(query).then(response => {
                    if (response.httpCode === 200) {
                        this.dialogLoading = false;
                        this.approveStepList = response.data.approveStepList;
                        this.itemConditionVoList = response.data.itemConditionVoList;
                        this.itemMaterialVoList = response.data.itemMaterialVoList;
                        this.itemProcessVo = response.data.itemProcessVo;
                        this.taskForm = response.data.taskForm;
                        this.itemVo = response.data.itemVo;
                        this.member = response.data.member;
                        this.history = response.data.history;
                        this.users = response.data.users;
                        this.itemTaskSetting = response.data.itemTaskSetting || {};
                        this.action = '';
                        this.correctionList = response.data.correctionList;
                        this.extendTimeVoList = response.data.extendTimeVoList;
                        const itemProcessAttachmentList = response.data.itemProcessAttachmentList;
                        for (var o in itemProcessAttachmentList) {
                            this.uploadAvatars.push(
                                {url: itemProcessAttachmentList[o].fileUrl,
                                id: itemProcessAttachmentList[o].id,
                                taskId: itemProcessAttachmentList[o].taskId}
                            );
                        }
                        this.queryCompanyInfo(this.member);
                    } else {
                    }

                }).catch(e => {
                    this.dialogLoading = false;
                    this.$message.error(response.msg || '加载超时');
                });
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
                    memberCode: memberInfo.memberCode
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
                this.dialogLoading = true;
                var form = this.$refs.deptWorkPendingForm;
                console.log(this.formData);
                const query = Object.assign({
                    taskId: this.itemProcessVo.taskId,
                    passReason: this.passRemark
                }, this.formData);
                workComplete(query).then(response => {
                    this.dialogLoading = false;
                    if (response.httpCode === 200) {
                        this.dialogFormVisible = false;
                        this.$message.success('提交成功');
                        this.getList();
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e=>{
                    this.dialogLoading = false;
                })
            },
            /**
             * 提交整改
             * */
            submitCorrection() {
                this.dialogLoading = true;
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
                        this.this.dialogLoading =  false;
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e =>{
                    this.dialogLoading =false;
                })
            },
            /**
             * 提交延期申请
             * */
            submitExtendTime() {
                this.dialogLoading = true;
                const query = {
                    taskId: this.itemProcessVo.taskId,
                    extendTimeDays: this.extendTimeDays,
                    extendTimeReason: this.extendTimeReason
                }
                workExtendTime(query).then(response => {
                    this.dialogLoading = false;

                    if (response.httpCode === 200) {
                        this.dialogFormVisible = false;
                        this.$message.success('提交成功');
                        this.getList();

                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e=>{
                    this.dialogLoading = true;
                })
            },
            /**
             * 提交不予受理
             * */
            submitClose() {
                this.dialogLoading = true;

                const query = {
                    taskId: this.itemProcessVo.taskId,
                    closeReason: this.closeReason
                }
                workClose(query).then(response => {
                    this.dialogLoading = false;
                    if (response.httpCode === 200) {
                        this.dialogFormVisible = false;
                        this.$message.success('提交成功');
                        this.getList();

                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e =>{
                    this.dialogLoading = false;
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
            print_ycxgzd(processNumber) {
                if (processNumber != null) {
                    window.open('/api/hallSystem/hallCompositeWindow/downloadYcxgzd?processNumber=' + processNumber);
                }
            },

            /**
             *
             * 后台返回响应就会触发
             *
             */
            handleAvatarSuccess(res, file, fileList) {
                if (res.state === 'SUCCESS') {
                    const query = {
                        processNumber: this.processNumber,
                        taskId: this.taskId,
                        fileUrl: res.url
                    }
                    workuploadImg(query).then(response => {
                        if (response.httpCode === 200) {
                            this.$message.success("保存成功");
                            console.log(response);
                        } else {
                            this.$message.error(response.msg);
                        }
                    })
                } else {
                    this.$message.error('上传失败！');
                }
            },
            /**
             * 网络无法联通时会触发，其他的场景没有进入
             * @param err
             * @param file
             * @param fileList
             */
            handlerAvatarError(err, file, fileList) {
                console.log(err);
                this.$message.error("网络不稳定，上传失败");
            },
            handlePictureCardPreview(file) {
                window.open(file.url);
            },
            handleRemove(file) {
                this.dialogLoading = true;

                console.log(file);
                const data = {
                    id: file.id,
                    taskId: file.taskId
                }
                workUploadImgRemove(data).then(response => {
                    this.dialogLoading = false;
                    if(response.httpCode === 200){
                        this.$message.success("删除成功");
                    }else{
                        this.$message.error("删除失败");
                    }
                }).then(e=>{
                    this.dialogLoading = false;
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
        font-weight: 500;
    }

    .h2-style-show {
        font-weight: 100;
        font-size: 24px;
        margin-top: 5px;
    }

    .s-dialog-title .el-form-item__label {
        font-size: 24px;
    }

    .s-dialog-title label {
        font-weight: 100;
    }

    .s-dialog-title .el-dialog__title {
        font-size: 20px;
        font-weight: 500;
    }

    .s-dialog-title .input-textarea .el-textarea__inner {
        height: 10em;
    }
</style>
