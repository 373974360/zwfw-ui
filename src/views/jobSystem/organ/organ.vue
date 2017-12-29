<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listQuery.name" style="width: 180px;" class="filter-item"
                      placeholder="公司名称"></el-input>
            <!--<el-select v-model="listQuery.gsxz" placeholder="公司性质" class="filter-item" style="width: 180px">-->
            <!--<el-option-->
            <!--v-for="item in dicts['gsxz']"-->
            <!--:key="item.code"-->
            <!--:label="item.value"-->
            <!--:value="item.code"/>-->
            <!--</el-select>-->
            <!--<el-select v-model="listQuery.gsgm" placeholder="公司规模" class="filter-item" style="width: 180px">-->
            <!--<el-option-->
            <!--v-for="item in dicts['gsgm']"-->
            <!--:key="item.code"-->
            <!--:label="item.value"-->
            <!--:value="item.code"/>-->
            <!--</el-select>-->
            <!--<el-cascader :options="cascader" class="filter-item" @change="handleChange"-->
            <!--:show-all-levels="true" clearable filterable expand-trigger="hover"-->
            <!--:change-on-select="true" style="width: 180px" placeholder="选择行业">-->
            <!--</el-cascader>-->
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="审核" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="circle-check"
                           @click="handleSh">
                    审核
                </el-button>
            </el-tooltip>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="撤销审核" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="circle-cross"
                           @click="handleCx">
                    撤销审核
                </el-button>
            </el-tooltip>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="推荐" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="circle-check"
                           @click="handleTj">
                    推荐
                </el-button>
            </el-tooltip>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="取消推荐" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="circle-cross"
                           @click="handleQxtj">
                    取消推荐
                </el-button>
            </el-tooltip>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="认证" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="circle-check"
                           @click="handleAuth">
                    认证
                </el-button>
            </el-tooltip>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="取消认证" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="circle-cross"
                           @click="handleQxAuth">
                    取消认证
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="danger" @click="handleDelete"
                           icon="delete">
                    删除
                </el-button>
            </el-tooltip>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="手机号码" width="125">
                <template scope="scope">
                    <nobr>{{scope.row.jobMember.phone}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="left" label="电子邮箱" min-width="300">
                <template scope="scope">
                    <nobr class="link-type" @click="handleView(scope.row)">
                        <el-tag v-if="scope.row.status == 1" type="gray">未审核</el-tag>
                        <el-tag v-if="scope.row.isauth == 1 || scope.row.isauth == 3" type="gray">未认证</el-tag>
                        <el-tag v-if="scope.row.enable == 0" type="danger">禁用</el-tag>
                        <el-tag v-if="scope.row.isrec==1" type="danger">推荐</el-tag>
                        {{scope.row.jobMember.email}}
                    </nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册时间" width="175">
                <template scope="scope">
                    <nobr>{{scope.row.jobMember.registerdate | date('YYYY-MM-DD HH:mm:ss')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="会员级别" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.memberLevelName}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="left" label="公司名称" width="210">
                <template scope="scope">
                    <nobr>{{scope.row.name}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="公司性质" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.gsxz | dicts('gsxz')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="公司规模" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.gsgm | dicts('gsgm')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="行业类别" width="170">
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

        <!-- 会员查看弹出框  开始 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="member">
                    <table class="member_view" width="100%">
                        <tr>
                            <th>公司名称:</th>
                            <td>{{member.name}}</td>
                            <th>公司性质:</th>
                            <td>{{member.gsxz | dicts('gsxz')}}</td>
                            <th>公司规模:</th>
                            <td>{{member.gsgm | dicts('gsgm')}}</td>
                        </tr>
                        <tr>
                            <th>行业类别:</th>
                            <td>{{member.hylbName}}</td>
                            <th>公司座机:</th>
                            <td>{{member.tel}}</td>
                            <th>邮　　编:</th>
                            <td>{{member.yb}}</td>
                        </tr>
                        <tr>
                            <th>公司官网:</th>
                            <td>{{member.gsgw}}</td>
                            <th>公司邮箱:</th>
                            <td>{{member.jobMember.email}}</td>
                        </tr>
                        <tr>
                            <th>地　　址:</th>
                            <td colspan="5">{{member.province}}{{member.city}}{{member.address}}</td>
                        </tr>
                        <tr>
                            <th>公司简介:</th>
                            <td colspan="5">{{member.gsjj}}</td>
                        </tr>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="认证信息" name="auth">
                    <table v-if="this.organAuth != null" class="member_view" width="100%">
                        <tr>
                            <th>资料1:</th>
                            <td>{{organAuth.img1}}</td>
                        </tr>
                        <tr>
                            <th>资料2:</th>
                            <td>{{organAuth.img2}}</td>
                        </tr>
                        <tr>
                            <th>资料3:</th>
                            <td>{{organAuth.img3}}</td>
                        </tr>
                    </table>
                    <table v-else class="member_view" width="100%">
                        <tr>
                            <td>暂未提交认证信息</td>
                        </tr>
                    </table>
                </el-tab-pane>
                <!--<el-tab-pane label="积分信息" name="integral">-->
                    <!--<el-table :data="memberIntegralList" border fit style="width: 100%">-->
                        <!--<el-table-column align="center" label="积分">-->
                            <!--<template scope="scope">-->
                                <!--<nobr>{{scope.row.integral}}</nobr>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column align="center" label="时间">-->
                            <!--<template scope="scope">-->
                                <!--<nobr>{{scope.row.createTime}}</nobr>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                    <!--</el-table>-->
                <!--</el-tab-pane>-->
            </el-tabs>
        </el-dialog>
        <!-- 会员查看弹出框  结束 -->
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
    import {getHyflCascader} from 'api/jobSystem/flxx/hyfl';
    import {
        getOrganList,
        delOrgan,
        getMember,
        jobOrganAuth,
        jobMemberIntegral,
        shOrgan,
        cxOrgan,
        tjOrgan,
        qxtjOrgan,
        authOrgan,
        qxauthOrgan
    } from "api/jobSystem/organ/organ";
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    export default{
        name: 'table_demo',
        data() {
            return {
                list: null,
                memberIntegralList: null,
                total: null,
                listLoading: true,
                cascader: [],
                activeName: 'member',
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: '',
                    gsxz: '',
                    gsgm: '',
                    hylb: ''
                },
                selectedRows: [],
                dialogVisible: false,
                dialogStatus: '',
                member: {
                    jobMember: {},
                    memberId: '',
                    name: '',
                    gsxz: '',
                    gsgm: '',
                    hylb: '',
                    province: '',
                    city: '',
                    address: '',
                    gsgw: '',
                    yb: '',
                    tel: '',
                    gsjj: '',
                    level: '',
                    isauth: '',
                    logo: '',
                    photo: '',
                    hylbName: ''
                },
                organAuth: {
                    id: '',
                    memberId: '',
                    img1: '',
                    img2: '',
                    img3: ''
                }
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'dicts'
            ])
        },
        created() {
            this.getList();
            this.getOptions();
        },
        methods: {
            getOptions(id) {
                this.dialogLoading = true;
                getHyflCascader(id).then(response => {
                    if (response.httpCode == 200) {
                        this.cascader = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.dialogLoading = false;
                })
            },
            handleChange(value) {
                this.listQuery.hylb = null;
                if (value.length > 0) {
                    this.listQuery.hylb = value[value.length - 1];
                }
            },
            getList() {
                this.listLoading = true;
                getOrganList(this.listQuery).then(response => {
                    if (response.httpCode == 200) {
                        this.list = response.data.list;
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
                this.dialogVisible = true;
                this.dialogStatus = 'view';
                this.member = copyProperties(this.member, row);
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
                            ids.push(deleteRow.memberId);
                        }
                        this.listLoading = true;
                        delOrgan(ids).then(response => {
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
            handleClick(tab) {
                if (tab.name == 'auth') {
                    jobOrganAuth({'memberId': this.member.memberId}).then(response => {
                        if (response.httpCode == 200) {
                            this.organAuth = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                    })
                } else if (tab.name == 'integral') {
                    jobMemberIntegral({'memberId': this.member.memberId}).then(response => {
                        if (response.httpCode == 200) {
                            this.memberIntegralList = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                    })
                }
            },
            handleSh() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('确定通过审核选中的信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        shOrgan(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('审核成功');
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
            handleCx() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('确定撤销审核选中的信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        cxOrgan(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('撤销成功');
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
            handleTj() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('确定推荐选中的信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        tjOrgan(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('推荐成功');
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
            handleQxtj() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('确定取消推荐选中的信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        qxtjOrgan(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('取消成功');
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
            handleAuth() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('确定认证选中的信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        authOrgan(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('认证成功');
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
            handleQxAuth() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('确定取消认证选中的信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.listLoading = true;
                        qxauthOrgan(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.getList();
                                this.$message.success('取消成功');
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
            resetTemp() {
                this.memberIntegralList = null;
                this.organAuth = {
                    id: '',
                    memberId: '',
                    img1: '',
                    img2: '',
                    img3: ''
                }
                this.member = {
                    jobMember: {},
                    memberId: '',
                    name: '',
                    gsxz: '',
                    gsgm: '',
                    hylb: '',
                    province: '',
                    city: '',
                    address: '',
                    gsgw: '',
                    yb: '',
                    tel: '',
                    gsjj: '',
                    level: '',
                    isauth: '',
                    logo: '',
                    photo: '',
                    hylbName: ''
                };
            }
        }
    }
</script>