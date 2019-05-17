<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listQuery.zwmc" style="width: 180px;" class="filter-item"
                      placeholder="职位名称"></el-input>
            <el-select v-model="listQuery.isrec" placeholder="请选择" style="width: 120px;" class="filter-item">
                <el-option
                        v-for="item in recOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleIsRec" type="primary" icon="circle-check">
                推荐
            </el-button>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="取消推荐" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="circle-cross"
                           @click="handleNotRec">
                    取消推荐
                </el-button>
            </el-tooltip>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handlePublish" type="primary" icon="circle-check">
                发布
            </el-button>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="撤销发布" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="delete"
                           @click="handleUnaudit">
                    撤销发布
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="delete"
                           @click="handleDelete">
                    删除
                </el-button>
            </el-tooltip>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="left" label="职位名称" min-width="300">
                <template scope="scope">
                    <nobr class="link-type" @click="handleUpdate(scope.row)">
                        <el-tag v-if="scope.row.isrec==2" type="primary">推荐</el-tag>
                        <el-tag v-if="scope.row.status==1" type="danger">未发布</el-tag>
                        {{scope.row.zwmc}}
                    </nobr>
                </template>
            </el-table-column>
            <el-table-column align="left" label="公司名称" width="200">
                <template scope="scope">
                    <nobr>{{scope.row.organName}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="职位编号" width="120">
                <template scope="scope">
                    <nobr>{{scope.row.zwbh}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="招聘人数" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.zprs}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最低学历" width="100">
                <template scope="scope">
                    <span v-if="scope.row.zdxl!='' && scope.row.zdxl!=null">
                        <nobr>{{scope.row.zdxl | dics('xueli')}}</nobr>
                    </span>
                    <span v-else>
                        <nobr>不限</nobr>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="年龄" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.nlmin}} 至 {{scope.row.nlmax}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="工作年限" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.gznx}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="工作性质" width="100">
                <template scope="scope">
                    <span v-if="scope.row.gzxz!='' && scope.row.gzxz!=null">
                        <nobr>{{scope.row.gzxz | dics('gzxz')}}</nobr>
                    </span>
                    <span v-else>
                        <nobr>不限</nobr>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="薪资标准" width="150">
                <template scope="scope">
                    <nobr>{{scope.row.xzlx | dics('xzfw')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="关键字" width="170">
                <template scope="scope">
                    <nobr>{{scope.row.zwgjz}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发布日期" width="173">
                <template scope="scope">
                    <nobr>{{scope.row.createTime | date('YYYY-MM-DD HH:mm:ss')}}</nobr>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!-- 招聘信息查看弹出框  开始 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
            <el-form ref="zpxxForm" class="small-space" :model="zpxx" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zpxxRules">
                <table style="width:100%;">
                    <tr>
                        <td>
                            <el-form-item label="职位名称" prop="zwmc" label-width="100px">
                                <el-input v-model="zpxx.zwmc"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item label="企业名称" prop="organName" label-width="100px">
                                <el-input v-model="zpxx.organName"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-form-item label="职位编号" prop="zwbh" label-width="100px">
                                <el-input v-model="zpxx.zwbh"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item label="招聘人数" prop="zprs" label-width="100px">
                                <el-input v-model="zpxx.zprs"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-form-item label="最低学历" prop="zdxl" label-width="100px">
                                <el-select v-model="zpxx.zdxl" placeholder="请选择学历">
                                    <el-option
                                            v-for="item in dics['xueli']"
                                            :key="item.code"
                                            :label="item.value"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item label="工作性质" prop="gzxz" label-width="100px">
                                <el-select v-model="zpxx.gzxz" placeholder="请选择工作性质">
                                    <el-option
                                            v-for="item in dics['gzxz']"
                                            :key="item.code"
                                            :label="item.value"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </td>
                    </tr><tr>
                    <td>
                        <el-form-item label="语言要求" prop="yyyq" label-width="100px">
                            <el-select v-model="zpxx.yyyq" placeholder="请选择语言要求">
                                <el-option
                                        v-for="item in dics['yuyan']"
                                        :key="item.code"
                                        :label="item.value"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                    <td>
                        <el-form-item label="熟练程度" prop="slcd" label-width="100px">
                            <el-select v-model="zpxx.slcd" placeholder="请选择熟练程度">
                                <el-option
                                        v-for="item in dics['slcd']"
                                        :key="item.code"
                                        :label="item.value"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                </tr>
                    <tr>
                        <td>
                            <el-form-item label="政治面貌" prop="zzmm" label-width="100px">
                                <el-select v-model="zpxx.zzmm" placeholder="请选择政治面貌">
                                    <el-option
                                            v-for="item in dics['zzmm']"
                                            :key="item.code"
                                            :label="item.value"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item label="薪资范围" prop="xzlx" label-width="100px">
                                <el-select v-model="zpxx.xzlx" placeholder="请选择薪资范围">
                                    <el-option
                                            v-for="item in dics['xzfw']"
                                            :key="item.code"
                                            :label="item.value"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-form-item label="年龄要求" label-width="100px">
                                <el-input v-model="zpxx.nlmin" style="width: 100px;"></el-input>　-　
                                <el-input v-model="zpxx.nlmax" style="width: 100px;"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item label="职能类别" prop="znlb" label-width="100px">
                                <el-input v-model="zpxx.znlb"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-form-item label="工作年限" prop="gznx" label-width="100px">
                                <el-input v-model="zpxx.gznx"></el-input>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item label="工作地址" prop="sbdz" label-width="100px">
                                <el-input v-model="zpxx.sbdz"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <el-form-item label="关键字" prop="zwgjz" label-width="100px">
                                <el-input v-model="zpxx.zwgjz"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <el-form-item label="职位描述" prop="zwms" label-width="100px">
                                <el-input type="textarea" v-model="zpxx.zwms" :rows="10"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style>
    .member_view td, th {
        line-height: 45px;
    }

    .member_view th {
        text-align: right;
        width: 100px;
    }

    .member_view td {
        text-align: left;
        padding-left: 10px;
    }
</style>
<script>
    import {getZnflCascader} from 'api/jobSystem/flxx/znfl';
    import {getOrganZpxxList, delOrganZpxx, resetOrganZpxx, createZpxx, updateZpxx} from "api/jobSystem/zpxx/zpxx";
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import SplitPane from "../../../components/SplitPane/index";
    export default{
        components: {SplitPane},
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                activeName: 'zpxx',
                cascader: [],
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    zwmc: '',
                    status: '',
                    isrec: ''
                },
                recOptions: [{
                    value: '0',
                    label: '全部'
                }, {
                    value: '1',
                    label: '未推荐'
                }, {
                    value: '2',
                    label: '已推荐'
                }],
                currentRow: null,
                selectedRows: [],
                dialogVisible: false,
                dialogStatus: '',
                zpxx: {
                    id: null,
                    organName: null,
                    zwmc: null,
                    zwbh: null,
                    zprs: null,
                    sbdz: null,
                    zdxl: null,
                    nlmax: null,
                    nlmin: null,
                    znlb: null,
                    gznx: null,
                    gzxz: null,
                    xzlx: null,
                    zwgjz: null,
                    zwms: null,
                    status: '1',
                    yyyq: null,
                    slcd: null,
                    zzmm: null,
                    isrec: '1'
                },
                zpxxRules: {
                    organName: [
                        {required: true, message: '请输入企业名称', trigger: 'blur'}
                    ],
                    zwmc: [
                        {required: true, message: '请输入职位名称', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'dics'
            ])
        },
        created() {
            this.getList();
            this.getOptions();
        },
        methods: {
            getOptions(id) {
                this.dialogLoading = true;
                getZnflCascader(id).then(response => {
                    if (response.httpCode == 200) {
                        this.cascader = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.dialogLoading = false;
                })
            },
            handleChange(value) {
                this.listQuery.znlb = null;
                if (value.length > 0) {
                    this.listQuery.znlb = value[value.length - 1];
                }
            },
            getList() {
                this.listLoading = true;
                getOrganZpxxList(this.listQuery).then(response => {
                    if (response.httpCode == 200) {
                        this.list = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listLoading = false;
                })
            },
            handleSelectionChange(row) {
                this.selectedRows = row;
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.zpxx = copyProperties(this.zpxx, row);
                this.dialogStatus = 'update';
                this.dialogVisible = true;
            },
            create() {
                this.$refs['zpxxForm'].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.listLoading = true;
                        createZpxx(this.zpxx).then(response => {
                            if (response.httpCode == 200) {
                                this.list.unshift(response.data);
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
                this.$refs['zpxxForm'].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.listLoading = true;
                        updateZpxx(this.zpxx).then(response => {
                            if (response.httpCode == 200) {
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
                                this.getList();
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
            handleDelete() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        delOrganZpxx(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.total -= selectCounts;
                                for (const deleteRow of this.selectedRows) {
                                    const index = this.list.indexOf(deleteRow);
                                    this.list.splice(index, 1);
                                }
                                this.$message.success('删除成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                        for (const deleteRow of this.selectedRows) {
                            const index = this.list.indexOf(deleteRow);
                            this.list.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handlePublish() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将发布招聘信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        resetOrganZpxx({"ids": ids, "status": 2}).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('发布成功');
                            } else {
                                this.$message.error('发布失败！');
                            }
                            this.listLoading = false;
                        })
                        for (const deleteRow of this.selectedRows) {
                            const index = this.list.indexOf(deleteRow);
                            this.list.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handleUnaudit() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将撤销招聘信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        resetOrganZpxx({"ids": ids, "status": 1}).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('撤销成功');
                            } else {
                                this.$message.error('撤销失败！');
                            }
                            this.listLoading = false;
                        })
                        for (const deleteRow of this.selectedRows) {
                            const index = this.list.indexOf(deleteRow);
                            this.list.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handleIsRec() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将推荐招聘信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        resetOrganZpxx({"ids": ids, "isrec": 2}).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('推荐成功');
                            } else {
                                this.$message.error('推荐失败！');
                            }
                            this.listLoading = false;
                        })
                        for (const deleteRow of this.selectedRows) {
                            const index = this.list.indexOf(deleteRow);
                            this.list.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handleNotRec() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将取消推荐招聘信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        resetOrganZpxx({"ids": ids, "isrec": 1}).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('取消成功');
                            } else {
                                this.$message.error('取消失败！');
                            }
                            this.listLoading = false;
                        })
                        for (const deleteRow of this.selectedRows) {
                            const index = this.list.indexOf(deleteRow);
                            this.list.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            resetTemp() {
                this.zpxx = {
                    id: null,
                    organName: null,
                    zwmc: null,
                    zwbh: null,
                    zprs: null,
                    sbdz: null,
                    zdxl: null,
                    nlmax: null,
                    nlmin: null,
                    znlb: null,
                    gznx: null,
                    gzxz: null,
                    xzlx: null,
                    zwgjz: null,
                    zwms: null,
                    status: '1',
                    yyyq: null,
                    slcd: null,
                    zzmm: null,
                    isrec: '1'
                };
            }
        }
    }
</script>