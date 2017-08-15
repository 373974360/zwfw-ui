<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.name"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>
        <el-table ref="jobTzggTable" :data="jobTzggList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="165">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="标题" prop="title">
                <template scope="scope">
                    <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作者" prop="author" width="100">
                <template scope="scope">
                    <span>{{scope.row.author}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="点击数" prop="checknum" width="100">
                <template scope="scope">
                    <span>{{scope.row.checknum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发布时间" prop="replytime" width="185">
                <template scope="scope">
                    <span>{{scope.row.replytime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发布状态" prop="status" width="100">
                <template scope="scope">
                    <span v-if="scope.row.status == 0">未发布</span>
                    <span v-else>已发布</span>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="jobTzggForm" class="small-space" :model="jobTzgg" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="jobTzggRules">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="jobTzgg.title"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="jobTzgg.author"></el-input>
                </el-form-item>
                <el-form-item label="标题图片" prop="titleimg">
                    <el-input v-model="jobTzgg.titleimg"></el-input>
                </el-form-item>
                <el-form-item label="发布时间" prop="replytime">
                    <el-date-picker v-model="jobTzgg.replytime" type="datetime" placeholder="选择日期" :picker-options="pickerOptions" @change="pickTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input v-model="jobTzgg.remark" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="正文内容" prop="content">
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定</el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import {getJobTzggList, createJobTzgg, updateJobTzgg, delJobTzggs} from 'api/job/nrgl/jobTzgg';
    export default {
        name: 'jobTzgg_table',
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                jobTzggList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                },
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'id'
                    },
                    {
                        text: '标题图片',
                        dataIndex: 'titleimg'
                    },
                    {
                        text: '发布时间',
                        dataIndex: 'replytime'
                    },
                    {
                        text: '作者',
                        dataIndex: 'author'
                    },
                    {
                        text: '备注',
                        dataIndex: 'remark'
                    },
                    {
                        text: '点击数',
                        dataIndex: 'checknum'
                    },
                    {
                        text: '标题',
                        dataIndex: 'title'
                    },
                    {
                        text: '正文内容',
                        dataIndex: 'content'
                    }
                ],
                jobTzgg: {
                    id: undefined,
                    titleimg: undefined,
                    replytime: undefined,
                    author: undefined,
                    remark: undefined,
                    checknum: 0,
                    title: undefined,
                    content: undefined,
                    status: 0
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                jobTzggRules: {
                    titleimg: [
                        {required: true, message: '请输入标题图片', trigger: 'blur'}
                    ],
                    replytime: [
                        {required: true, message: '请输入发布时间', trigger: 'blur'}
                    ],
                    author: [
                        {required: true, message: '请输入作者', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入描述', trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '请输入正文内容', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getList();
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
                getJobTzggList(this.listQuery).then(response => {
                    this.jobTzggList = response.data.list;
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
                this.$refs.jobTzggTable.toggleRowSelection(row);
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.jobTzgg = copyProperties(this.jobTzgg, row);
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
                        delJobTzggs(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.total -= selectCounts;
                                for (const deleteRow of this.selectedRows) {
                                    const index = this.jobTzggList.indexOf(deleteRow);
                                    this.jobTzggList.splice(index, 1);
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
                this.$refs['jobTzggForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createJobTzgg(this.jobTzgg).then(response => {
                            if (response.httpCode == 200) {
                                this.jobTzggList.unshift(response.data);
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
                this.$refs['jobTzggForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateJobTzgg(this.jobTzgg).then(response => {
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
            pickTime(val) {
                this.jobTzgg.replytime = val;
            },
            resetTemp() {
                this.jobTzgg = {
                    id: undefined,
                    titleimg: undefined,
                    replytime: undefined,
                    author: undefined,
                    remark: undefined,
                    checknum: 0,
                    title: undefined,
                    content: undefined,
                    status: 0
                };
            }
        }
    }
</script>
