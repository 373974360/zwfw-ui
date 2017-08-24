<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题"
                      v-model="listQuery.title"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>
        <el-row :gutter="20">
            <el-col :span="3">
                <div class="grid-content bg-purple">
                    <el-tree :data="treeList" :props="defaultProps" @node-click="handleNodeClick" highlight-current="true" accordion="true"></el-tree>
                </div>
            </el-col>
            <el-col :span="21">
                <div class="grid-content bg-purple" style="background:#FFF;">
                    <el-table ref="jobInfoTable" :data="jobInfoList" v-loading.body="listLoading" border fit highlight-current-row
                              style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
                        <el-table-column type="selection" width="55"/>
                        <el-table-column align="left" label="标题" prop="title">
                            <template scope="scope">
                                <nobr>{{scope.row.title}}</nobr>
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
                        <el-table-column align="center" label="发布状态" prop="state" width="100">
                            <template scope="scope">
                                <span v-if="scope.row.state==1">草稿</span>
                                <span v-if="scope.row.state==2">未发布</span>
                                <span v-if="scope.row.state==3">已发布</span>
                                <span v-if="scope.row.state==4">已撤回</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="150">
                            <template scope="scope">
                                <el-tooltip class="item" effect="dark" content="撤回" placement="right-start">
                                    <el-button type="text" icon="circle-cross"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="发布" placement="right-start">
                                    <el-button type="text" icon="circle-check"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="编辑" placement="right-start">
                                    <el-button type="text" icon="edit"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="删除" placement="right-start">
                                    <el-button type="text" icon="delete"></el-button>
                                </el-tooltip>
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
                <el-form-item label="网络编辑" prop="editor">
                    <el-input v-model="jobInfo.editor"></el-input>
                </el-form-item>
                <el-form-item label="来源" prop="sources">
                    <el-input v-model="jobInfo.sources"></el-input>
                </el-form-item>
                <el-form-item label="是否有标题图片1：是，2：否" prop="isimg">
                    <el-input v-model="jobInfo.isimg"></el-input>
                </el-form-item>
                <el-form-item label="点击数" prop="checknum">
                    <el-input v-model="jobInfo.checknum"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="jobInfo.author"></el-input>
                </el-form-item>
                <el-form-item label="摘要" prop="description">
                    <el-input v-model="jobInfo.description"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="jobInfo.remark"></el-input>
                </el-form-item>
                <el-form-item label="发布时间" prop="applytime">
                    <el-input v-model="jobInfo.applytime"></el-input>
                </el-form-item>
                <el-form-item label="正文内容" prop="content">
                    <el-input v-model="jobInfo.content"></el-input>
                </el-form-item>
                <el-form-item label="是否外部链接，1：是，2：否" prop="islink">
                    <el-input v-model="jobInfo.islink"></el-input>
                </el-form-item>
                <el-form-item label="标题图片地址" prop="imgurl">
                    <el-input v-model="jobInfo.imgurl"></el-input>
                </el-form-item>
                <el-form-item label="外部链接地址" prop="linkurl">
                    <el-input v-model="jobInfo.linkurl"></el-input>
                </el-form-item>
                <el-form-item label="发布状态：1草稿，2未发布，3已发布，4已撤回" prop="state">
                    <el-input v-model="jobInfo.state"></el-input>
                </el-form-item>
                <el-form-item label="是否推荐1：是，2否" prop="isrec">
                    <el-input v-model="jobInfo.isrec"></el-input>
                </el-form-item>
                <el-form-item label="关键字" prop="keyword">
                    <el-input v-model="jobInfo.keyword"></el-input>
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
    import {getJobInfoList, createJobInfo, updateJobInfo, delJobInfos} from 'api/job/info/jobInfo';
    import {getJobInfoCatalogTree} from 'api/job/info/jobInfoCatalog';

    export default {
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
                    isimg: undefined,
                    checknum: undefined,
                    author: undefined,
                    description: undefined,
                    remark: undefined,
                    title: undefined,
                    applytime: undefined,
                    content: undefined,
                    islink: undefined,
                    imgurl: undefined,
                    subtitle: undefined,
                    linkurl: undefined,
                    state: undefined,
                    isrec: undefined,
                    keyword: undefined
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                jobInfoRules: {
                    editor: [
                        {required: true, message: '请输入网络编辑', trigger: 'blur'}
                    ],
                    sources: [
                        {required: true, message: '请输入来源', trigger: 'blur'}
                    ],
                    isimg: [
                        {required: true, message: '请输入是否有标题图片1：是，2：否', trigger: 'blur'}
                    ],
                    checknum: [
                        {required: true, message: '请输入点击数', trigger: 'blur'}
                    ],
                    author: [
                        {required: true, message: '请输入作者', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入摘要', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入备注', trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: '请输入新闻标题', trigger: 'blur'}
                    ],
                    applytime: [
                        {required: true, message: '请输入发布时间', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '请输入正文内容', trigger: 'blur'}
                    ],
                    islink: [
                        {required: true, message: '请输入是否外部链接，1：是，2：否', trigger: 'blur'}
                    ],
                    imgurl: [
                        {required: true, message: '请输入标题图片地址', trigger: 'blur'}
                    ],
                    subtitle: [
                        {required: true, message: '请输入简短标题', trigger: 'blur'}
                    ],
                    linkurl: [
                        {required: true, message: '请输入外部链接地址', trigger: 'blur'}
                    ],
                    state: [
                        {required: true, message: '请输入发布状态：1草稿，2未发布，3已发布，4已撤回', trigger: 'blur'}
                    ],
                    isrec: [
                        {required: true, message: '请输入是否推荐1：是，2否', trigger: 'blur'}
                    ],
                    keyword: [
                        {required: true, message: '请输入关键字', trigger: 'blur'}
                    ]
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
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
                if(this.listQuery.cid){
                    this.currentRow = row;
                    this.resetTemp();
                    this.dialogStatus = 'create';
                    this.dialogFormVisible = true;
                }else{
                    this.$message.warning('请选择要添加的目录');
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
            create() {
                this.$refs['jobInfoForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
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
                this.getList();
            },
            resetTemp() {
                this.jobInfo = {
                    id: undefined,
                    editor: undefined,
                    sources: undefined,
                    isimg: undefined,
                    checknum: undefined,
                    author: undefined,
                    description: undefined,
                    remark: undefined,
                    title: undefined,
                    applytime: undefined,
                    content: undefined,
                    islink: undefined,
                    imgurl: undefined,
                    subtitle: undefined,
                    linkurl: undefined,
                    state: undefined,
                    isrec: undefined,
                    keyword: undefined
                };
            }
        }
    }
</script>
