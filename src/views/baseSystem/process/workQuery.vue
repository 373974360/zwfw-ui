<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 300px;" class="filter-item" placeholder="办件号"
                      v-model="listQuery.processNumber"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </div>
        <el-table ref="zwfwDeptWorkPendingTable" :data="zwfwDeptWorkQueryList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column align="center" label="办件号">
                <template scope="scope">
                    <span>{{scope.row.processNumber}}</span>
                </template>
            </el-table-column>
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
                <el-form-item label="当前步骤" v-if="itemProcessVo.status != 15">
                    <el-col :span="15">
                        <el-input v-model="itemProcessVo.currentTaskName" auto-complete="off"
                                  :disabled="true"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="附件列表" prop="description">
                    <el-col :span="15">
                        <el-upload class="upload" disabled name="uploadFile" :accept="fileAccepts"
                                   :action="uploadAction" :file-list="uploadAvatars"
                                   :show-file-list="true"
                                   multiple
                                   :limit="3"
                                   :on-preview="handlePictureCardPreview">
                        </el-upload>
                    </el-col>
                </el-form-item>
                <a ref="downloadFile" v-show="false" target="_blank"></a>
                <el-form-item label="办件状态">
                    <el-col :span="15">
                        <el-input :value="itemProcessVo.status | enums('ItemProcessStatus')" auto-complete="off"
                                  :disabled="true"></el-input>
                    </el-col>
                </el-form-item>
                <template v-for="h in history" v-if="itemProcessVo.status == 15">
                    <el-form-item label="办理耗时">
                        <el-col :span="15">
                            <el-input :value="h.durationInMillis | duration" auto-complete="off"
                                      :disabled="true"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="处理意见">
                        <el-col :span="15">
                            <el-input class="input-textarea" :value="h.reason" type="textarea" :rows="7"></el-input>
                        </el-col>
                    </el-form-item>
                </template>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {
        getZwfwDeptWorkQueryList,
        getZwfwDeptWorkDetail,
    } from 'api/baseSystem/process/work';

    export default {
        name: 'zwfwDeptWorkPending_table',
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                textMapTitle: null,
                zwfwDeptWorkQueryList: [],
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
                getZwfwDeptWorkQueryList(this.listQuery).then(response => {
                    this.zwfwDeptWorkQueryList = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
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
                        const itemProcessAttachmentList = response.data.itemProcessAttachmentList;
                        for (var o in itemProcessAttachmentList) {
                            this.uploadAvatars.push(
                                {
                                    name: itemProcessAttachmentList[o].fileName,
                                    url: itemProcessAttachmentList[o].fileUrl,
                                    id: itemProcessAttachmentList[o].id,
                                    taskId: itemProcessAttachmentList[o].taskId
                                }
                            );
                        }
                    }
                }).catch(e => {
                    this.dialogLoading = false;
                    this.$message.error(response.msg || '加载超时');
                });
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
            handlePictureCardPreview(file) {
                let url = '';
                let name = '';
                if(file.response){
                    url = file.response.url;
                    name = file.response.title
                }else{
                    url = file.url;
                    name = file.name;
                }
                if(url.indexOf('.mp3') >= 0){
                    window.open(url);
                }else{
                    this.$refs.downloadFile.href = url;
                    this.$refs.downloadFile.download = name;
                    this.$refs.downloadFile.click();
                }
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
    .upload .el-upload{display: none;}
</style>