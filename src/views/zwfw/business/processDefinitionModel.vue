<template>
    <div class="app-container calendar-list-container">
        <!--搜索区-->
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="流程模型名称"
                      v-model="listQuery.name" no-match-text="没有找到哦">
            </el-input>

            <el-button style="margin-left: 10px;" class="filter-item" type="primary" v-waves icon="search"
                       @click="getList">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-upload
                    class="upload-bpmn-file"
                    :multiple="false"
                    :show-file-list="false"
                    :action="getUploadUrl"
            :on-success="onUploadSuccess"
            :before-upload="onBeforeUpload"
            :on-error="onUploadError">
                <el-button class="filter-item" style="margin-left: 10px;"  type="primary" icon="upload">
                    上传
                </el-button>
            </el-upload>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDeploy" type="danger" icon="check">
                发布
            </el-button>
        </div>
        <!--表格-->
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="模型ID" width="200">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="流程模型名称">
                <template scope="scope">
                    <el-tooltip content="点击编辑" placement="right" effect="dark">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column min-width="50px" align="center" label="修订">
                <template scope="scope">
                    {{scope.row.revision}}
                </template>
            </el-table-column>
            <el-table-column min-width="50px" align="center" label="发布的流程定义">
                <template scope="scope">
                    {{scope.row.deploymentId}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="200">
                <template scope="scope">
                    <span>{{scope.row.createTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>

        </el-table>
        <!--列表分页-->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

        <!--弹出层-->
        <el-dialog title="创建流程模型" :visible.sync="addDialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetActivitiModelForm">
            <el-form ref="activitiModelForm" :model="activitiModel" label-position="right" label-width="110px"
                     :rules="rules">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="activitiModel.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="description">
                    <el-input type="textarea" v-model="activitiModel.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="create">创建</el-button>
                <el-button @click="resetActivitiModelForm">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {
        getZwfwActivitiModelList, getZwfwActivitiModelEditUrl, getZwfwActivitiModelUploadUrl, createZwfwActivitiModel, deleteZwfwActivitiModel,
        deployZwfwActivitiModel
    } from 'api/zwfw/zwfwActiviti';
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    id: '',
                    name: '',
                    page: this.$store.state.app.page,
                    pageSize: this.$store.state.app.rows
                },
                activitiModel: {
                    id: undefined,
                    name: '',
                    category: '',
                    description: ''
                },
                dialogStatus: '',
                checked: true,
                addDialogFormVisible: false,
                selectedRows: [],
                rules: {
                    name: [{
                        required: true, message: '请输入模型名称'
                    }]
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
            ]),
            getUploadUrl() {
                return getZwfwActivitiModelUploadUrl();
            }
        },
        methods: {
            getList() {
                this.listLoading = true;
                getZwfwActivitiModelList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleSelectionChange(row) {
                this.selectedRows = row;
                console.log(this.selectedRows);
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            resetForm(activitiModelForm) {
                this.$refs[activitiModelForm].resetFields();
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.addDialogFormVisible = true;
            },
            handleUpdate(row) {
                window.open(getZwfwActivitiModelEditUrl(row.id));
            },
            handleDelete() {
                const selectCounts = this.selectedRows.length;
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将删除关联信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        deleteZwfwActivitiModel(ids).then(response => {
                            this.listLoading = false;
                            console.log(response);
                            this.total -= selectCounts;
                            this.$message.success('删除成功');

                        });
                        this.getList();
                    }).catch((e) => {
                        console.log('发生错误', e);
                    });
                }
            },
            handleDeploy() {
                const selectCounts = this.selectedRows.length;
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将模型发布为流程定义, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const ids = new Array();
                        for (const deployRow of this.selectedRows) {
                            ids.push(deployRow.id);
                        }
                        deployZwfwActivitiModel(ids).then(response => {
                            console.log(response);
                            this.listLoading = false;
                            this.$message.success('发布成功');
                            this.getList();
                        });
                    }).catch((e) => {
                        console.log('发生错误', e);
                    });
                }
            },
            create() {
                this.$refs['activitiModelForm'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwActivitiModel(this.activitiModel).then(response => {
                            if (response.httpCode === 200) {
                                this.listLoading = false;
                                this.$message.success('创建成功');
                                this.getList();
                                window.open(response.data.editUrl);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            onBeforeUpload(file){
                this.listLoading = true;

            },
            onUploadSuccess(response, file, fileList) {
                this.listLoading = false;
                this.getList();
            },
            onUploadError(err,file,fileList){
                this.listLoading = false;
            },
            resetTemp() {
                this.activitiModel = {
                    id: undefined,
                    name: '',
                    description: '',
                    category: ''
                };
            },
            resetActivitiModelForm() {
                this.addDialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'activitiModelForm');
            }
        }
    }
</script>
<style>
    .upload-bpmn-file {
       display:inline-block;
    }
</style>
