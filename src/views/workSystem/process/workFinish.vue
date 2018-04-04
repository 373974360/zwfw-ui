<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 300px;" class="filter-item" placeholder="办件号"
                      v-model="listQuery.processNumber"></el-input>


            <el-select
                    remote
                    style="width: 400px;" class="filter-item" placeholder="公司名称"
                    v-model="listQuery.companyId"
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

            <!--<el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item" placeholder="公司名称"-->
            <!--v-model="listQuery.companyName"></el-input>-->


            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </div>

        <el-table ref="zwfwDeptWorkQueryTable" :data="zwfwDeptWorkQueryList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <!--<el-table-column align="center" label="ID" >-->
            <!--<template scope="scope">-->
            <!--<span>{{scope.row.id}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="办件号">
                <template scope="scope">
                    <span>{{scope.row.processNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办理事项" prop="itemName" width="200px">
                <template scope="scope">
                    <span>{{scope.row.itemName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="承诺期限" prop="promiseFinishTime">
                <template scope="scope">
                    <span>{{scope.row.promiseFinishTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="申请企业（个人）" min-width="200">
                <template scope="scope">
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
                <template scope="scope">
                    <span v-if="scope.row.memberType == 3">
                        <span >
                            姓名：{{scope.row.clerkName}}<br>
                        </span>联系电话：{{scope.row.clerkPhone}}<br>
                    </span>
                    <span v-if="scope.row.memberType == 1 || scope.row.memberType == 2">
                        <span >
                            姓名：{{scope.row.memberRealname}}<br>
                        </span>联系电话：{{scope.row.memberPhonenumber}}<br>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="整改状态" prop="flagCorrection">
                <template scope="scope">
                    <span>{{scope.row.flagCorrection | enums('YesNo')}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column align="center" label="企业名称" prop="companyName">-->
                <!--<template scope="scope">-->
                    <!--<span>{{scope.row.companyName}}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
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
                   :close-on-click-modal="closeOnClickModal" :before-close="resetWorkPengingForm"
                   v-loading="dialogLoading"
                   element-loading-text="拼命加载中">
            <div>
                <div>
                    <h2 class="h2-style-show">审批记录：</h2>
                    <table class="table table-responsive table-bordered">
                        <tr>
                            <th>流入时间</th>
                            <th>办理步骤</th>
                            <th>表单</th>
                            <!--<th>整改</th>-->
                            <th>
                                处理意见
                            </th>
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
                                {{h.reason}}
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
                                        <tr>
                                            <th width="140">办事员电话</th>
                                            <td >{{itemProcessVo.contactsPhone}}</td>
                                            <th width="140"></th>
                                            <td ></td>
                                        </tr>
                                        <template v-if="companyInfo.id">
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
                                <div v-if="member.naturePerson!=null && member.type == 3">
                                    <h3>授权办事员信息：</h3>
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
                                    <td>
                                        <div style="white-space: pre-line">{{h.correctionReason}}</div>
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
                                        <button type="button" class="btn btn-danger"
                                                v-if="h.timeExtendStatus==1"
                                                @click="cancelExtendTime(h.id)">撤销申请
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </el-tab-pane>
                        <el-tab-pane label="办件材料" name="fifth">
                            <el-button @click="downloadMaterialFiles()" type="primary">一键下载材料</el-button><br><br>
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
                                        <div v-if="c.multipleFile" style="color:blue">
                                            <span v-for="(file,index) in c.multipleFile">
                                            <span v-if="file.url!=null && file.url!=''">
                                            <a v-if="!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.url)"
                                               :href="file.url" :download="file.fileName"
                                               target="_blank">[{{index + 1}}]</a>
                                            <a v-else :href="file.url" target="_blank" :title="file.fileName">[{{index + 1}}]</a>
                                            </span>
                                            <span v-else>未上传</span>
                                         </span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div v-if="uploadAvatars!=null && uploadAvatars.length>0">
                    <h2 class="h2-style-show">附件材料：</h2>
                    <el-row>
                        <el-col :span="4" v-for="(item, index) in uploadAvatars" :key="item" :offset="1">
                            <el-card :body-style="{ padding: '0px' }">
                                <img :src="item.url" @click="handlePictureCardPreview(item)" class="image">
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
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
    import {getWorkFinishList, getZwfwDeptWorkDetail} from '../../../api/workSystem/process/workQuery';
    import {
        getAllCompany
    } from 'api/other/company';
    import {
        queryCompanyInfo
    } from 'api/hallSystem/window/receive/windowAccept';

    export default {
        name: 'zwfwDeptWorkQuery_table',

        data() {
            return {
                textMapTitle: null,
                zwfwDeptWorkQueryList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    companyId: undefined,
                    processNumber: null
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
                getWorkFinishList(this.listQuery).then(response => {
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
                this.listQuery.companyId = code;
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
            showDetail(row) {
                this.dialogLoading = true;
                this.uploadAvatars = [];
                this.processNumber = row.processNumber;
                this.taskId = row.taskId;
                this.textMapTitle = '部门办事 - ' + row.itemName;
                this.dialogFormVisible = true;
                const query = {
                    processNumber: this.processNumber,
                    taskId: this.taskId
                }
                getZwfwDeptWorkDetail(query).then(response => {
                    console.log(response.data);
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
                    this.itemTaskSetting = response.data.itemTaskSetting;
                    this.action = '';
                    this.correctionList = response.data.correctionList;
                    this.extendTimeVoList = response.data.extendTimeVoList;
                    const itemProcessAttachmentList = response.data.itemProcessAttachmentList;
                    for (var o in itemProcessAttachmentList) {
                        this.uploadAvatars.push(
                            {url: itemProcessAttachmentList[o].fileUrl}
                        );
                    }
                    this.queryCompanyInfo(this.member);
                }).catch(e => {
                    this.dialogLoading = false;
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
            downloadMaterialFiles() {
                // console.log(this.itemProcessVo);
                window.open('/api/common/downloadMaterialFiles?processNumber='+this.itemProcessVo.processNumber+'&taskId='+this.itemProcessVo.taskId);
            },
            print_ycxgzd(processNumber) {
                if (processNumber != null) {
                    // window.open('/api/hallSystem/hallCompositeWindow/downloadYcxgzd?processNumber=' + processNumber);
                    window.open('print/ycxgzd.html?processNumber=' + processNumber);

                }
            },
            handlePictureCardPreview(file) {
                window.open(file.url);
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
