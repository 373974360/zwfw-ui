<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listQuery.zwmc" style="width: 180px;" class="filter-item"
                      placeholder="职位名称"></el-input>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="审核" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="circle-check"
                           @click="handleIsRec">
                    审核
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="delete"
                           @click="handleNoRec">
                    驳回
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
                    <nobr class="link-type" @click="handleView(scope.row)">
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
            <el-table-column align="center" label="刷新日期" width="173">
                <template scope="scope">
                    <nobr>{{scope.row.reloadtime | date('YYYY-MM-DD HH:mm:ss')}}</nobr>
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
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="招聘信息" name="zpxx">
                    <table class="member_view" width="100%">
                        <tr>
                            <th>公司名称:</th>
                            <td>{{zpxx.organName}}</td>
                            <th>职位名称:</th>
                            <td>{{zpxx.zwmc}}</td>
                            <th>职位编号:</th>
                            <td>{{zpxx.zwbh}}</td>
                        </tr>
                        <tr>
                            <th>招聘人数:</th>
                            <td>{{zpxx.zprs}}</td>
                            <th>最低学历:</th>
                            <td>
                                <span v-if="zpxx.zdxl!='' && zpxx.zdxl!=null">
                                  {{zpxx.zdxl | dics('xueli')}}
                                </span>
                                <span v-else>
                                    不限
                                </span>
                            </td>
                            <th>年龄要求:</th>
                            <td>{{zpxx.nlmin}} 至 {{zpxx.nlmax}}</td>
                        </tr>
                        <tr>
                            <th>职能类别:</th>
                            <td>{{zpxx.znflName}}</td>
                            <th>工作年限:</th>
                            <td>
                                {{zpxx.gznx}}
                            </td>
                            <th>工作性质:</th>
                            <td>
                                <span v-if="zpxx.gzxz!='' && zpxx.gzxz!=null">
                                    {{zpxx.gzxz | dics('gzxz')}}
                                </span>
                                <span v-else>
                                    不限
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>关 键 字:</th>
                            <td>{{zpxx.zwgjz}}</td>
                            <th>刷新日期:</th>
                            <td>{{zpxx.reloadtime | date("YYYY-MM-DD HH:mm:ss")}}</td>
                            <th>薪资标准:</th>
                            <td>{{zpxx.xzlx | dics('xzfw')}}</td>
                        </tr>
                        <tr>
                            <th>政治面貌:</th>
                            <td>
                                <span v-if="zpxx.zzmm!='' && zpxx.zzmm!=null">
                                    {{zpxx.zzmm | dics('zzmm')}}
                                </span>
                                <span v-else>
                                    不限
                                </span>
                            </td>
                            <th>语言要求:</th>
                            <td>
                                <span v-if="zpxx.yyyq!='' && zpxx.yyyq!=null">
                                    {{zpxx.yyyq | dics('yuyan')}}
                                </span>
                                <span v-else>
                                    不限
                                </span>
                            </td>
                            <th>熟练程度:</th>
                            <td>
                                <span v-if="zpxx.slcd!='' && zpxx.slcd!=null">
                                    {{zpxx.slcd | dics('slcd')}}
                                </span>
                                <span v-else>
                                    不限
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>工作地点:</th>
                            <td colspan="5">{{zpxx.sbdz}}</td>
                        </tr>
                        <tr>
                            <th valign="top">要求/描述:</th>
                            <td colspan="5">{{zpxx.zwms}}</td>
                        </tr>
                    </table>
                </el-tab-pane>
                <!--<el-tab-pane label="投递记录" name="tdjl">-->

                <!--</el-tab-pane>-->
            </el-tabs>
        </el-dialog>
        <!-- 招聘信息查看弹出框  结束 -->
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
    import {getOrganZpxxList, delOrganZpxx, resetOrganZpxx} from "api/jobSystem/zpxx/zpxx";
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
                    status: 2,
                    isrec: 3
                },
                selectedRows: [],
                dialogVisible: false,
                dialogStatus: '',
                zpxx: {
                    organName: '',
                    znflName: '',
                    zwmc: '',
                    zwbh: '',
                    zprs: '',
                    sbdz: '',
                    zdxl: '',
                    nlmax: '',
                    nlmin: '',
                    znlb: '',
                    gznx: '',
                    gzxz: '',
                    xzlx: '',
                    zwgjz: '',
                    zwms: '',
                    zzmm: '',
                    yyyq: '',
                    slcd: '',
                    reloadtime: ''
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
            handleView(row) {
                this.resetTemp();
                this.zpxx = copyProperties(this.zpxx, row);
                console.log(zpxx);
                this.dialogVisible = true;
                this.dialogStatus = 'view';
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
            handleIsRec() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将通过招聘信息的推荐申请, 是否继续?', '提示', {
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
                                this.$message.success('审核成功');
                            } else {
                                this.$message.error('审核失败！');
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
            handleNoRec() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将驳回招聘信息的推荐申请, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        resetOrganZpxx({"ids": ids, "isrec": 4}).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('驳回成功');
                            } else {
                                this.$message.error('驳回失败！');
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
                    organName: '',
                    znflName: '',
                    zwmc: '',
                    zwbh: '',
                    zprs: '',
                    sbdz: '',
                    zdxl: '',
                    nlmax: '',
                    nlmin: '',
                    znlb: '',
                    gznx: '',
                    gzxz: '',
                    xzlx: '',
                    zwgjz: '',
                    zwms: '',
                    zzmm: '',
                    yyyq: '',
                    slcd: '',
                    reloadtime: ''
                };
            }
        }
    }
</script>