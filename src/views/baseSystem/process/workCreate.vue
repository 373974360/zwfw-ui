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
            <el-button class="filter-item" type="primary" v-waves icon="plus" @click="createProcess">新建办件</el-button>
        </div>

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
                    <span>{{scope.row.taskLimitTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="承诺期限" prop="promiseFinishTime">
                <template scope="scope">
                    <span>{{scope.row.promiseFinishTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column align="center" label="整改状态" prop="flagCorrection">
                <template scope="scope">
                    <span>{{scope.row.flagCorrection | enums('YesNo')}}</span>
                </template>
            </el-table-column>-->
            <el-table-column align="center" prop="enable" class-name="status-col" label="状态">
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


        <!--弹出层-->
        <el-dialog title="创建新的待办任务" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetProcessModelForm">
            <el-form ref="activitiModelForm" :model="processVo" label-position="right" label-width="200px"
                     :rules="rules" label-suffix="：" v-loading="formLoading" >
                <el-form-item label="选择事项" prop="itemId">
                    <el-col :span="15">
                        <el-select v-model="processVo.itemId" filterable placeholder="选择事项" clearable>
                            <el-option
                                    v-for="item in itemList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="办件名称" prop="name">
                    <el-col :span="15">
                        <el-input v-model="processVo.name" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="选择处理部门" prop="deptId">
                    <el-col :span="15">
                        <el-cascader :options="deptCascader" class="filter-item" @change="handleChanges" v-model="updateModel"
                                     :show-all-levels="true"
                                     :change-on-select="true" expand-trigger="hover" :clearable="true"
                                     placeholder="选择处理部门"
                        ></el-cascader>
                    </el-col>
                </el-form-item>

                <el-form-item label="上传附件" prop="description">
                    <el-col :span="15">
                        <el-upload name="uploadFile" :accept="fileAccepts"
                                   :action="uploadAction" :file-list="fileList"
                                   :on-success="handleAvatarSuccess"
                                   :on-error="handlerAvatarError"
                                   :show-file-list="true"
                                   multiple
                                   :limit="3"
                                   :on-preview="handlePictureCardPreview"
                                   :on-remove="handleRemove">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-col>
                </el-form-item>
                <a ref="downloadFile" v-show="false" target="_blank"></a>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!editDsiable">
                <el-button type="primary" @click="doCreate" :loading="submitLoading">确定</el-button>
                <el-button @click="resetProcessModelForm">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {copyProperties, resetForm} from 'utils';
    import {
        getZwfwDeptWorkCreateList,
        getWorkAttchements,
        workCreate
    } from 'api/baseSystem/process/work';
    import {
        getAllByNameOrbasicCode
    } from 'api/baseSystem/business/item';
    import {
        getDeptCascader
    } from 'api/baseSystem/org/dept';
    import {
        getProcessList
    } from 'api/baseSystem/process/process';

    export default {
        name: 'zwfwDeptWorkPending_table',
        data() {
            return {
                itemList: [],
                deptCascader: [],
                dialogVisible: false,
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
                        label: '我创建的任务'
                    }, {
                        value: false,
                        label: '所有任务'
                    }],
                rules: {
                    deptId: [
                        {required: true, message: '请选择部门'}
                    ],
                    itemId: [
                        {required: true, message: '请选择事项'}
                    ],
                    name: [
                        {required: true, message: '办件名称'}
                    ]
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                formLoading: false,
                submitLoading: false,
                editDsiable: false,
                itemVo: {},
                processVo: {
                    id: undefined,
                    itemId: undefined,
                    deptId: undefined,
                    deptVo: {
                        id: '',
                        name: '',
                        treePosition: '',
                    },
                    name: '',
                    fileNames: [],
                    fileUrls: []
                },
                fileList: [],
                uploadAction: this.$store.state.app.uploadUrl,
                fileAccepts: this.$store.state.app.fileAccepts
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
            ]),
            updateModel() {
                let result = [];
                if (this.processVo.deptVo.treePosition) {
                    result = (this.processVo.deptVo.treePosition + '&' + this.processVo.deptVo.id).split('&');
                } else {
                    result = [this.processVo.deptVo.id + ''];
                }
                return result;
            }
        },
        methods: {
            /**
             *
             * 加载事项列表
             */
            loadItemList() {
                this.formLoading = true;
                const _this = this;
                getAllByNameOrbasicCode().then((response) => {
                    _this.itemList = response.data;
                    this.formLoading = false;
                })
            },
            /**
             *
             * 加载部门列表
             */
            loadDeptCascader() {
                this.formLoading = true;
                getDeptCascader().then(response => {
                    if (response.httpCode === 200) {
                        this.deptCascader = response.data;
                        this.formLoading = false;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            handleChanges(value) {
                if (value.length > 0) {
                    this.processVo.deptId = value[value.length - 1];
                } else {
                    this.processVo.deptId = 0;
                }
            },
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
                getZwfwDeptWorkCreateList(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.zwfwDeptWorkPendingList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e => {
                    this.listLoading = false;
                    this.$message.error(e.msg || '加载超时');
                })
            },
            showDetail(row){
                this.dialogFormVisible = true;
                this.editDsiable = true;
                this.formLoading = true;
                this.resetProcessModelForm();
                if(!this.deptCascader.length){
                    this.loadDeptCascader();
                }
                if(!this.itemList.length){
                    this.loadItemList();
                }
                this.processVo = copyProperties(this.processVo, row);
                getWorkAttchements({processNumber:row.processNumber}).then(response => {
                    if (response.httpCode === 200) {
                        this.formLoading = false;
                        for(const attchment of response.data){
                            let file = {};
                            file.name = attchment.fileName;
                            file.url = attchment.fileUrl;
                            this.fileList.push(file);
                        }
                    }
                }).catch(e => {
                    this.formLoading = false;
                    this.$message.error(response.msg || '加载超时');
                });
            },
            /**
             * 新建办件
             * */
            createProcess() {
                this.resetProcessModelForm();
                this.dialogFormVisible = true;
                this.editDsiable = false;
                if(!this.deptCascader.length){
                    this.loadDeptCascader();
                }
                if(!this.itemList.length){
                    this.loadItemList();
                }
            },
            doCreate(){
                this.$refs.activitiModelForm.validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        for(const file of this.fileList){
                            this.processVo.fileNames.push(file.raw.name);
                            this.processVo.fileUrls.push(file.response.url)
                        }
                        workCreate(this.processVo).then(response => {
                            if (response.httpCode === 200) {
                                this.dialogFormVisible = false;
                                this.submitLoading = false;
                                this.$message.success("创建成功！");
                                this.getList();
                            } else {
                                this.$message.error(response.msg);
                            }
                        }).catch(e => {
                            this.submitLoading = false;
                            this.$message.error(e.msg || '加载超时');
                        });
                    }
                });
            },
            resetProcessModelForm() {
                this.dialogFormVisible = false;
                this.processVo = {
                    id: undefined,
                    itemId: undefined,
                    deptId: undefined,
                    deptVo: {
                        id: '',
                        name: '',
                        treePosition: '',
                    },
                    name: '',
                    fileNames: [],
                    fileUrls: []
                };
                this.fileList = [];

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
                if (res.state === 'SUCCESS') {
                    this.fileList = fileList;
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
                this.$message.error("网络不稳定，上传失败");
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
            },
            handleRemove(file,fileList) {
                this.fileList = fileList;
            }
        }
    }
</script>
<style>
    .el-dialog
    .el-select {
        width: 100%;
    }
    .el-cascader {
        width: 100%;
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
</style>
