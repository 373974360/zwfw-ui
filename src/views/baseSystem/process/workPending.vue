<template>
    <div class="app-container calendar-list-container">
        <el-table ref="zwfwDeptWorkPendingTable" :data="zwfwDeptWorkPendingList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <!--<el-table-column align="center" label="办件号">
                <template scope="scope">
                    <span>{{scope.row.processNumber}}</span>
                </template>
            </el-table-column>-->
            <!--<el-table-column align="center" label="办理事项" prop="itemName">
                <template scope="scope">
                    {{scope.row.itemName}}
                </template>
            </el-table-column>-->
            <el-table-column align="center" label="办件名称" prop="name">
                <template scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="当前步骤" prop="currentTaskName">
                <template scope="scope">
                    <span>{{scope.row.currentTaskName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="步骤时限" prop="taskLimitTime">
                <template scope="scope">
                    <span><font color="red">{{scope.row.taskLimitTime | date('YYYY-MM-DD HH:mm:ss')}}</font></span>
                </template>
            </el-table-column>
            <!--<el-table-column align="center" label="承诺期限" prop="promiseFinishTime">
                <template scope="scope">
                    <span>{{scope.row.promiseFinishTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="整改状态" prop="flagCorrection">
                <template scope="scope">
                    <span>{{scope.row.flagCorrection | enums('YesNo')}}</span>
                </template>
            </el-table-column>-->
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
                    <span>{{scope.row.status | enums('ItemProcessStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button @click="showDetail(scope.row)" type="primary">办理</el-button>
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
        <el-dialog class="s-dialog-title" :title="textMapTitle" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetWorkPendingForm"
                   v-loading="dialogLoading"
                   element-loading-text="拼命加载中">
            <el-form label-position="right" label-width="200px" label-suffix="：">
                <el-form-item label="办件名称">
                    <el-col :span="15">
                        <el-input v-model="itemProcessVo.name" auto-complete="off" :disabled="true"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="当前步骤">
                    <el-col :span="15">
                        <el-input v-model="itemProcessVo.currentTaskName" auto-complete="off"
                                  :disabled="true"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="办件附件" prop="description">
                    <el-col :span="15">
                        <template v-for="att in itemProcessAttachmentList">
                            <a class="el-upload-list__item-name" :href="att.fileUrl" :download="att.fileName" target="_blank">
                                <i class="el-icon-document"></i>{{att.fileName}}</a>
                        </template>
                    </el-col>
                </el-form-item>
                <el-form-item label="处理方式">
                    <el-col :span="15">
                        <el-button class="filter-item" type="primary" @click="action='pass'">提交办理</el-button>
                        <el-button v-if="itemTaskSetting.supportCorrection" class="filter-item" type="primary"
                                   @click="action='correction'"
                                   :disabled="itemProcessVo.flagCorrection || dialogLoading">整改
                        </el-button>
                        <el-button v-if="itemTaskSetting.supportExtendTime" class="filter-item" type="primary"
                                   @click="action='extendTime'"
                                   :disabled="itemProcessVo.flagCorrection || itemProcessVo.extendTimeApplying || dialogLoading ">
                            申请延期
                        </el-button>
                        <el-button v-if="itemTaskSetting.supportClose" class="filter-item" type="primary"
                                   @click="action='close' || dialogLoading">不予处理
                        </el-button>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-form ref="deptWorkPendingForm" :model="itemProcessVo" label-suffix="：" label-position="right"
                     label-width="200px">
                <el-form-item label="答复附件" v-show="action=='pass'" >
                    <el-row>
                        <el-col :span="15">
                            <el-upload name="uploadFile" :accept="fileAccepts"
                                       :action="uploadAction" :file-list="uploadAvatars"
                                       :on-success="handleAvatarSuccess"
                                       :on-error="handlerAvatarError"
                                       :show-file-list="true"
                                       multiple
                                       :limit="3"
                                       :on-preview="handlePictureCardPreview"
                                       :on-remove="handleRemove">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                            <a ref="downloadFile" v-show="false" target="_blank"></a>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-show="action=='pass'" label="办理意见">
                    <el-row>
                        <el-col :span="15">
                            <el-input v-model="passRemark" type="textarea" :rows="7"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15" align="center">
                            <el-button type="primary" @click="submitComplete"
                                       :disabled="dialogLoading" >
                                确定提交
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-show="action=='correction'" label="整改原因">
                    <el-row>
                        <el-col :span="15">
                            <el-input class="input-textarea" v-model="correctionReason" type="textarea"
                                      :rows="7"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15" align="center">
                            <el-button type="primary"
                                       @click="submitCorrection" :disabled="dialogLoading">确定整改
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-show="action=='extendTime'" label="延期原因">
                    <el-row>
                        <el-col :span="15">
                            <el-input class="input-textarea" v-model="extendTimeReason" type="textarea"
                                      :rows="7"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-input v-model="extendTimeDays" type="text"
                                      :placeholder='"请输入在"+$options.filters.date(itemProcessVo.taskLimitTime, "YYYY-MM-DD HH:mm:ss")+"上的延期小时数"'
                                      min="1"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15" align="center">
                            <el-button type="primary"
                                       @click="submitExtendTime" :disabled="dialogLoading">确定延期
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-show="action=='close'" label="不予受理原因">
                    <el-row>
                        <el-col :span="15">
                            <el-input class="input-textarea" v-model="closeReason" type="textarea" :rows="7"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15" align="center">
                            <el-button type="primary"
                                       @click="submitClose" :disabled="dialogLoading">不予受理
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <el-row v-if="false">
                <el-col :span="3">&nbsp;</el-col>
                <el-col :span="15">
                    <el-tabs v-model="tabPaneShow" type="card">
                        <el-tab-pane label="办件进度" name="first">
                            <div v-if="itemProcessVo.status==10">
                                <table class="table table-bordered table-responsive">
                                    <tr v-if="itemProcessVo.taskLimitTime">
                                        <td>当前步骤期限</td>
                                        <td>
                                            <font color="red">{{itemProcessVo.taskLimitTime | date('YYYY-MM-DD HH:mm:ss')}}</font>
                                            <!--包括工作日{{itemProcessVo.taskLimitTime|fromNow}}-->
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>当前办理步骤</td>
                                        <td>{{itemProcessVo.currentTaskName}}</td>
                                    </tr>
                                    <!--<tr>
                                        <td>督办件</td>
                                        <td>{{itemProcessVo.flagSupervied | enums('YesNo')}}</td>
                                    </tr>-->
                                    <tr>
                                        <td>超期件</td>
                                        <td>{{itemProcessVo.flagTimeout | enums('YesNo')}}</td>
                                    </tr>
                                    <!--<tr>
                                        <td>整改状态</td>
                                        <td>{{itemProcessVo.flagCorrection | enums('YesNo')}}</td>
                                    </tr>-->
                                    <tr>
                                        <td>申请办件时间</td>
                                        <td>{{itemProcessVo.startItemTime | date('YYYY-MM-DD HH:mm:ss')}}
                                        </td>
                                    </tr>
                                    <!--<tr>
                                        <td>承诺办结日期</td>
                                        <td>{{itemProcessVo.promiseFinishTime | date('YYYY-MM-DD HH:mm:ss')}}
                                        </td>
                                    </tr>-->
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
                        <el-tab-pane label="延期记录" name="second">
                            <table class="table table-responsive table-bordered">
                                <tr>
                                    <th>申请时间</th>
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
                    </el-tabs>
                </el-col>
            </el-row>

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
    } from 'api/baseSystem/process/work';

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
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                passRemark: '',
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
                itemProcessAttachmentList: [],
                uploadAction: this.$store.state.app.uploadUrl,
                fileAccepts: this.$store.state.app.fileAccepts,
                uploadImgs: [],
                uploadAvatars: [],
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
                }).catch(e => {
                    this.listLoading = false;
                    this.$message.error(response.msg || '加载超时');
                })
            },
            /**
             * 显示详细
             * */
            showDetail(row) {
                this.dialogFormVisible = true;
                this.dialogLoading = true;
                this.uploadAvatars = []
                this.processNumber = row.processNumber;
                this.taskId = row.taskId;
                this.textMapTitle = '部门办事 - ' + row.itemName;
                this.passRemark = '';
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
                        this.itemProcessAttachmentList = response.data.itemProcessAttachmentList;
                    }
                }).catch(e => {
                    this.dialogLoading = false;
                    this.$message.error(response.msg || '加载超时');
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
                }).catch(e => {
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
                        this.this.dialogLoading = false;
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e => {
                    this.dialogLoading = false;
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
                }).catch(e => {
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
                }).catch(e => {
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
            /**
             *
             * 后台返回响应就会触发
             *
             */
            handleAvatarSuccess(res, file, fileList) {
                console.dir(res);
                console.dir(file);
                if (res.state === 'SUCCESS') {
                    const query = {
                        processNumber: this.processNumber,
                        taskId: this.taskId,
                        fileUrl: res.url,
                        fileName: file.name,
                        remark: 'apply'
                    }
                    workuploadImg(query).then(response => {
                        if (response.httpCode === 200) {
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
                    if (response.httpCode === 200) {
                        console.log(response);
                    } else {
                        this.$message.error("删除失败");
                    }
                }).then(e => {
                    this.dialogLoading = false;
                })
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
        text-align: left;
        font-weight: 500;
    }

    .table-bordered > tr > td, .table-bordered > tr > th {
        border: 1px solid #e7e7e7;
        font-weight: 500;
    }
    .el-input.is-disabled .el-input__inner{color:#383535}
    .el-upload-list__item-name:hover{color: red}
</style>