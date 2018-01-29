<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listQuery.search" style="width: 180px;" class="filter-item"
                      placeholder="搜索关键字"></el-input>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleIsRec" type="primary" icon="circle-check">
                推荐
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="danger" @click="handleNotRec" icon="delete">
                撤销推荐
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleUnaudit" type="danger" icon="delete">
                撤销审核
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleNotAuth" type="danger" icon="delete">
                撤销实名认证
            </el-button>
        </div>
        <el-table ref="table_demo" :data="list" v-loading.body="listLoading" border fit style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="left" label="公司名称" min-width="260">
                <template scope="scope">
                    <nobr class="link-type" @click="handleView(scope.row)">
                        <el-tag v-if="scope.row.islock == 2" type="info">禁用</el-tag>
                        <el-tag v-if="scope.row.isrec==2" type="danger">推荐</el-tag>
                        <el-tag v-if="scope.row.isauth==3" type="success">认证</el-tag>
                        {{scope.row.name}}
                    </nobr>
                </template>
            </el-table-column>
            <el-table-column align="left" label="电子邮箱" min-width="260">
                <template scope="scope">
                    <nobr class="link-type" @click="handleView(scope.row)">
                        {{scope.row.email}}
                    </nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联系电话" width="125">
                <template scope="scope">
                    <nobr>{{scope.row.phone}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="会员级别" width="125">
                <template scope="scope">
                    <nobr>{{scope.row.levelsName}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册时间" width="180">
                <template scope="scope">
                    <nobr>{{scope.row.registerdate | date('YYYY-MM-DD HH:mm:ss')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="公司性质" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.gsxz | dics('gsxz')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="公司规模" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.gsgm | dics('gsgm')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="left" label="行业类别" width="170">
                <template scope="scope">
                    <nobr>{{scope.row.hylbName}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="座机号码" width="130">
                <template scope="scope">
                    <nobr>{{scope.row.tel}}</nobr>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="会员信息查看" :visible.sync="dialogVisible">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="first">
                    <table class="member_view" width="100%" v-if="jobOrgan != null">
                        <tr>
                            <th>公司名称:</th>
                            <td>{{jobOrgan.name}}</td>
                            <th>公司性质:</th>
                            <td>{{jobOrgan.gsxz | dics('gsxz')}}</td>
                            <th>公司规模:</th>
                            <td>{{jobOrgan.gsgm | dics('gsgm')}}</td>
                        </tr>
                        <tr>
                            <th>行业类别:</th>
                            <td>{{jobOrgan.hylbName}}</td>
                            <th>公司座机:</th>
                            <td>{{jobOrgan.tel}}</td>
                            <th>邮　　编:</th>
                            <td>{{jobOrgan.yb}}</td>
                        </tr>
                        <tr>
                            <th>公司官网:</th>
                            <td>{{jobOrgan.gsgw}}</td>
                            <th>公司邮箱:</th>
                            <td>{{jobOrganEmail}}</td>
                            <th>注册手机:</th>
                            <td>{{jobOrganPhone}}</td>
                        </tr>
                        <tr>
                            <th>地　　址:</th>
                            <td colspan="5">{{jobOrgan.province}}{{jobOrgan.city}}{{jobOrgan.address}}</td>
                        </tr>
                        <tr>
                            <th valign="top">公司简介:</th>
                            <td colspan="5">{{jobOrgan.gsjj}}</td>
                        </tr>
                    </table>
                    <table v-else class="member_view" width="100%">
                        <tr>
                            <td>该会员暂未完善相关信息！</td>
                        </tr>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="认证信息" name="second">
                    <table v-if="this.jobOrganAuth.length>0" class="member_view" width="100%">
                        <tr>
                            <th>资料1:</th>
                            <td>{{jobOrganAuth.img1}}</td>
                        </tr>
                        <tr>
                            <th>资料2:</th>
                            <td>{{jobOrganAuth.img2}}</td>
                        </tr>
                        <tr>
                            <th>资料3:</th>
                            <td>{{jobOrganAuth.img3}}</td>
                        </tr>
                    </table>
                    <table v-else class="member_view" width="100%">
                        <tr>
                            <td>该会员暂未完善相关信息！</td>
                        </tr>
                    </table>
                </el-tab-pane>
            </el-tabs>
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
        width: 160px;
    }
</style>
<script>
    import {getOrganList, getOrgan, getOrganAuth, resetJobOrgan} from "api/jobSystem/organ/organ";
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    export default{
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    search: '',
                    audit: 2
                },
                selectedRows: [],
                dialogVisible: false,
                activeName: 'first',
                memberId: null,
                jobOrgan: [],
                jobOrganAuth: [],
                jobOrganEmail: '',
                jobOrganPhone: ''
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
        },
        methods: {
            getList() {
                this.listLoading = true;
                getOrganList(this.listQuery).then(response => {
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
                this.activeName = 'first';
                this.dialogVisible = true;
                this.memberId = row.m_id;
                this.jobOrganEmail = row.email;
                this.jobOrganPhone = row.phone;
                this.jobOrganView();
            },
            handleClick(tab, event) {
                if (tab.name == 'first') {
                    this.jobOrganView();
                }
            },
            jobOrganView() {
                getOrgan(this.memberId).then(response => {
                    if (response.httpCode == 200) {
                        this.jobOrgan = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            jobOrganAuthView() {
                getOrganAuth(this.memberId).then(response => {
                    if (response.httpCode == 200) {
                        this.jobOrganAuth = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            handleIsRec() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将推荐会员, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = [];
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id_);
                        }
                        resetJobOrgan({"ids": ids, "isrec": 2}).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('推荐成功！');
                                this.getList();
                            } else {
                                this.$message.error('推荐失败！');
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handleNotRec() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将取消会员推荐设置, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = [];
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id_);
                        }
                        resetJobOrgan({"ids": ids, "isrec": 1}).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('取消成功！');
                                this.getList();
                            } else {
                                this.$message.error('取消失败！');
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handleUnaudit() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将撤销企业信息审核, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = [];
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id_);
                        }
                        resetJobOrgan({"ids": ids, "status": 1}).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('撤销成功！');
                                this.getList();
                            } else {
                                this.$message.error('撤销失败！');
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handleNotAuth() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将撤销企业实名认证, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = [];
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id_);
                        }
                        resetJobOrgan({"ids": ids, "isauth": 1}).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('撤销成功！');
                                this.getList();
                            } else {
                                this.$message.error('撤销失败！');
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            resetTemp() {
                this.memberId = null,
                this.jobOrgan = [],
                this.jobOrganAuth = [],
                this.jobOrganEmail = '',
                this.jobOrganPhone = ''
            }
        }
    }
</script>