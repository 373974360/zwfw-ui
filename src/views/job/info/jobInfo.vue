<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题"
                      v-model="listQuery.title"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleApplys()" type="primary" icon="circle-check">
                发布
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleRevokes()" type="primary" icon="circle-cross">
                撤回
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete()" type="danger" icon="delete">
                删除
            </el-button>
        </div>
        <el-row :gutter="20">
            <el-col :span="3">
                <div class="grid-content bg-purple">
                    <el-tree :data="treeList" :props="defaultProps" @node-click="handleNodeClick" highlight-current accordion></el-tree>
                </div>
            </el-col>
            <el-col :span="21">
                <div class="grid-content bg-purple" style="background:#FFF;">
                    <el-table ref="jobInfoTable" :data="jobInfoList" v-loading.body="listLoading" border fit highlight-current-row
                              style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
                        <el-table-column type="selection" width="55"/>
                        <el-table-column align="left" label="标题" prop="title">
                            <template scope="scope">
                                <nobr class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</nobr>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="点击数" prop="checknum" width="90">
                            <template scope="scope">
                                <span>{{scope.row.checknum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="发布时间" prop="applytime" width="175">
                            <template scope="scope">
                                <span>{{scope.row.applytime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="网络编辑" prop="editor" width="100">
                            <template scope="scope">
                                <span>{{scope.row.editor}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="作者" prop="author" width="100">
                            <template scope="scope">
                                <span>{{scope.row.author}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="状态" prop="state" width="80">
                            <template scope="scope">
                                <span v-if="scope.row.state==1">未发布</span>
                                <span v-if="scope.row.state==2">已发布</span>
                                <span v-if="scope.row.state==3">已撤回</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="150">
                            <template scope="scope">
                                <span v-if="scope.row.state==1 || scope.row.state==3">
                                    <el-tooltip class="item" effect="dark" content="发布" placement="right-start">
                                        <el-button type="text" icon="circle-check" @click="handleApplys(scope.row)"></el-button>
                                    </el-tooltip>
                                </span>
                                <span v-if="scope.row.state==2">
                                    <el-tooltip class="item" effect="dark" content="撤回" placement="right-start">
                                        <el-button type="text" icon="circle-cross" @click="handleRevokes(scope.row)"></el-button>
                                    </el-tooltip>
                                </span>
                                <span style="margin-left:10px;">
                                    <el-tooltip class="item" effect="dark" content="编辑" placement="right-start">
                                        <el-button type="text" icon="edit" @click="handleUpdate(scope.row)"></el-button>
                                    </el-tooltip>
                                </span>
                                <span style="margin-left:10px;">
                                    <el-tooltip class="item" effect="dark" content="删除" placement="right-start">
                                        <el-button type="text" icon="delete" @click="handleDelete(scope.row)"></el-button>
                                    </el-tooltip>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-show="!listLoading" class="pagination-container">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                       :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                                       :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="jobInfoForm" class="small-space" :model="jobInfo" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="jobInfoRules">
                <el-form-item label="标　　题" prop="title">
                    <el-input v-model="jobInfo.title"></el-input>
                </el-form-item>
                <el-form-item label="简短标题" prop="subtitle">
                    <el-input v-model="jobInfo.subtitle"></el-input>
                </el-form-item>
                <table width="100%">
                    <tr>
                        <td width="50%">
                            <el-form-item label="网络编辑" prop="editor">
                                <el-input v-model="jobInfo.editor"></el-input>
                            </el-form-item>
                        </td>
                        <td width="50%">
                            <el-form-item label="来　　源" prop="sources">
                                <el-input v-model="jobInfo.sources"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                <table width="100%">
                    <tr>
                        <td width="50%">
                            <el-form-item label="作　　者" prop="author">
                                <el-input v-model="jobInfo.author"></el-input>
                            </el-form-item>
                        </td>
                        <td width="50%">
                            <el-form-item label="发布时间" prop="applytime">
                                <el-date-picker v-model="jobInfo.applytime" type="datetime" placeholder="选择日期" @change="pickTime" style="width:284px;"></el-date-picker>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                <table width="100%">
                    <tr>
                        <td width="30%">
                            <el-form-item label="是否外链" prop="islink">
                                <el-radio-group v-model="jobInfo.islink" @change="linkChange">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="2">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item label="外链地址" prop="linkurl">
                                <span v-if="jobInfo.islink == 1"><el-input v-model="jobInfo.linkurl"></el-input></span>
                                <span v-else><el-input v-model="jobInfo.linkurl" :disabled="isLinkDisabled"></el-input></span>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                <el-form-item label="关　键字" prop="keyword">
                    <el-input v-model="jobInfo.keyword"></el-input>
                </el-form-item>
                <el-form-item label="标题图片" prop="img">
                    <el-upload name="uploadFile" list-type="picture-card" accept="image/*"
                               :action="uploadAction" :file-list="uploadAvatars"
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload"
                               :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="摘　　要" prop="description">
                    <el-input v-model="jobInfo.description" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="正文内容" prop="content">
                    <div class="editor-container">
                        <Tinymce :height=200 ref="editor" v-model="jobInfo.content"></Tinymce>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import {getJobInfoList, createJobInfo, updateJobInfo, delJobInfos,applyJobInfos,revokeJobInfos} from 'api/job/info/jobInfo';
    import {getJobInfoCatalogTree} from 'api/job/info/jobInfoCatalog';
    import Tinymce from 'components/Tinymce';

    export default {
        components: { Tinymce },
        name: 'jobInfo_table',
        data() {
            return {
                jobInfoList: [],
                treeList: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    title: undefined,
                    cid:'0'
                },
                jobInfo: {
                    id: undefined,
                    editor: undefined,
                    sources: undefined,
                    isimg: '2',
                    checknum: '0',
                    cid:undefined,
                    author: undefined,
                    description: undefined,
                    remark: undefined,
                    title: undefined,
                    applytime: undefined,
                    content: undefined,
                    islink: '2',
                    imgurl: undefined,
                    subtitle: undefined,
                    linkurl: undefined,
                    state: '1',
                    isrec: '2',
                    keyword: undefined
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                jobInfoRules: {
                    title: [
                        {required: true, message: '请输入新闻标题', trigger: 'blur'}
                    ],
                    applytime: [
                        {required: true, message: '请输入发布时间', trigger: 'change'}
                    ],
                    content: [
                        {required: true, message: '请输入正文内容', trigger: 'blur'}
                    ]
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                currCatId:undefined,
                treeType:0,
                isLinkDisabled:true,
                uploadAction: process.env.SYS_API + '/sysUpload/',
                uploadAvatars: []
            }
        },
        created() {
            this.getList();
            this.getTreeList();
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                getJobInfoList(this.listQuery).then(response => {
                    this.jobInfoList = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            getTreeList() {
                getJobInfoCatalogTree().then(response => {
                    if (response.httpCode == 200) {
                        this.treeList = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
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
                this.$refs.jobInfoTable.toggleRowSelection(row);
            },
            handleCreate(row) {
                if(this.currCatId){
                    if(this.treeType==1){
                        this.currentRow = row;
                        this.resetTemp();
                        this.dialogStatus = 'create';
                        this.dialogFormVisible = true;
                    }else{
                        this.$message.warning('请选择终极目录添加内容');
                    }
                }else{
                    this.$message.warning('请选择目录添加内容');
                }
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.jobInfo = copyProperties(this.jobInfo, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                if(row){
                    this.selectedRows = row;
                }
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let selectCounts = this.selectedRows.length;
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delJobInfos(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.total -= selectCounts;
                                for (const deleteRow of this.selectedRows) {
                                    const index = this.jobInfoList.indexOf(deleteRow);
                                    this.jobInfoList.splice(index, 1);
                                }
                                this.$message.success('删除成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            handleApplys(row) {
                if(row){
                    this.selectedRows = row;
                }
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('确定要发布选中的信息吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        applyJobInfos(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('发布成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            handleRevokes(row) {
                if(row){
                    this.selectedRows = row;
                }
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('确定要撤销选中的信息吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        revokeJobInfos(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('发布成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            create() {
                this.$refs['jobInfoForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        this.jobInfo.cid = this.currCatId;
                        createJobInfo(this.jobInfo).then(response => {
                            if (response.httpCode == 200) {
                                this.jobInfoList.unshift(response.data);
                                this.total += 1;
                                this.$message.success('创建成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['jobInfoForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateJobInfo(this.jobInfo).then(response => {
                            if (response.httpCode == 200) {
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleNodeClick(data) {
                this.listQuery.cid = data.id;
                this.currCatId = data.id;
                if(data.children==null){
                    this.treeType = 1;
                }else{
                    this.treeType = 0;
                }
                this.getList();
            },
            linkChange(val) {
                if(val == 1){
                    this.isLinkDisabled = false;
                }else{
                    this.jobInfo.linkurl = undefined;
                    this.isLinkDisabled = true;
                }
            },
            pickTime(val) {
                this.jobInfo.applytime = val;
            },
            handleAvatarSuccess(res, file, fileList) {
                fileList.length = 0;
                fileList.push(file);
                this.jobInfo.isimg = 1;
                this.jobInfo.imgurl = res.url;
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleRemove() {
                this.jobInfo.isimg = 2;
                this.jobInfo.imgurl = '';
            },
            resetTemp() {
                this.jobInfo = {
                    id: undefined,
                    editor: undefined,
                    sources: undefined,
                    isimg: '2',
                    checknum: '0',
                    cid:undefined,
                    author: undefined,
                    description: undefined,
                    remark: undefined,
                    title: undefined,
                    applytime: undefined,
                    content: undefined,
                    islink: '2',
                    imgurl: undefined,
                    subtitle: undefined,
                    linkurl: undefined,
                    state: '1',
                    isrec: '2',
                    keyword: undefined
                };
            }
        }
    }
</script>
