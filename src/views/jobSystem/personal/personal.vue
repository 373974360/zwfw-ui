<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listQuery.search" style="width: 180px;" class="filter-item"
                      placeholder="真实姓名"></el-input>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="delete">
                    删除
                </el-button>
            </el-tooltip>
        </div>
        <el-table ref="table_demo" :data="list" v-loading.body="listLoading" border fit style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="165">
                <template scope="scope">
                    <span>{{scope.row.m_id}}</span>
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
            <el-table-column align="center" label="真实姓名" width="95">
                <template scope="scope">
                    <nobr>{{scope.row.username}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="性别" width="70">
                <template scope="scope">
                    <nobr>{{scope.row.sex | enums('Gender')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="出生日期" width="120">
                <template scope="scope">
                    <nobr>{{scope.row.csrq}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学历" width="120">
                <template scope="scope">
                    <nobr>{{scope.row.zgxl | dics('xueli')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="婚姻状况" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.hyzk | dics('hyzk') }}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="政治面貌" width="150">
                <template scope="scope">
                    <nobr>{{scope.row.zzmm | dics('zzmm') }}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="求职状态" width="140">
                <template scope="scope">
                    <nobr>{{scope.row.qzzt | dics('qzzt')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="刷新时间" width="175">
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
        <el-dialog title="会员信息查看" :visible.sync="dialogVisible">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="first">
                    <table class="member_view" width="100%" v-if="jobPersonal != null">
                        <tr>
                            <th>姓　　名:</th>
                            <td>{{jobPersonal.username}}</td>
                            <th>电子邮箱:</th>
                            <td>{{jobPersonalEmail}}</td>
                            <th>电子邮箱:</th>
                            <td>{{jobPersonalPhone}}</td>
                        </tr>
                        <tr>
                            <th>出生日期:</th>
                            <td>{{jobPersonal.csrq}}</td>
                            <th>工作年份:</th>
                            <td>{{jobPersonal.ksgznf}}</td>
                            <th>户口/国籍:</th>
                            <td>{{jobPersonal.hkgj}}</td>
                        </tr>
                        <tr>
                            <th>婚姻状况:</th>
                            <td>{{jobPersonal.hyzk | dics('hyzk')}}</td>
                            <th>求职状态:</th>
                            <td>{{jobPersonal.qzzt | dics('qzzt')}}</td>
                            <th>政治面貌:</th>
                            <td>{{jobPersonal.zzmm | dics('zzmm')}}</td>
                        </tr>
                        <tr>
                            <th>身　　高:</th>
                            <td>{{jobPersonal.sg}}</td>
                            <th>证件类型:</th>
                            <td>{{jobPersonal.zjlx | dics('zjlx')}}</td>
                            <th>证件号码:</th>
                            <td>{{jobPersonal.zjhm}}</td>
                        </tr>
                        <tr>
                            <th>邮　　编:</th>
                            <td>{{jobPersonal.yb}}</td>
                            <th>目前收入:</th>
                            <td>{{jobPersonal.mqnsr | dics('xzfw')}}</td>
                            <th>个人主页:</th>
                            <td>{{jobPersonal.grzy}}</td>
                        </tr>
                        <tr>
                            <th>最高学历:</th>
                            <td>{{jobPersonal.zgxl | dics('xueli')}}</td>
                            <th>
                                <span v-if="jobPersonal.qtlxfslx!=null">
                                    {{jobPersonal.qtlxfslx | dics('lxfs')}}:
                                </span>
                            </th>
                            <td colspan="3">{{jobPersonal.qtlxfs }}</td>
                        </tr>
                        <tr>
                            <th>目前住址:</th>
                            <td colspan="5">{{jobPersonal.jzd}}</td>
                        </tr>
                        <tr>
                            <th>家庭住址:</th>
                            <td colspan="5">{{jobPersonal.jtzz}}</td>
                        </tr>
                    </table>
                    <table class="member_view" width="100%" v-else>
                        <tr>
                            <td>该会员暂未完善相关信息！</td>
                        </tr>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="求职意向" name="second">
                    <table v-if="jobPersonalQzyx!=null" class="member_view" width="100%">
                        <tr>
                            <th>期望薪资:</th>
                            <td>{{jobPersonalQzyx.qwxz | dics('xzfw')}}</td>
                            <th>工作地点:</th>
                            <td>{{jobPersonalQzyx.gzdd}}</td>
                            <th>职　　能:</th>
                            <td>{{jobPersonalQzyx.znName}}</td>
                        </tr>
                        <tr>
                            <th>行　　业:</th>
                            <td>{{jobPersonalQzyx.hyName}}</td>
                            <th>个人标签:</th>
                            <td>{{jobPersonalQzyx.grbq}}</td>
                            <th>到岗时间:</th>
                            <td>{{jobPersonalQzyx.dgsj | dics('dgsj')}}</td>
                        </tr>
                        <tr>
                            <th>工作类型:</th>
                            <td colspan="5">{{jobPersonalQzyx.gzlx | dics('gzxz')}}</td>
                        </tr>
                        <tr>
                            <th>自我评价:</th>
                            <td colspan="5">{{jobPersonalQzyx.zwpj}}</td>
                        </tr>
                    </table>
                    <table class="member_view" width="100%" v-else>
                        <tr>
                            <td>该会员暂未完善相关信息！</td>
                        </tr>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="工作经历" name="third">
                    <span v-if="jobPersonalGzjl.length>0">
                        <table v-for="gzjl in jobPersonalGzjl" class="member_view" style="width: 100%">
                            <tr>
                                <th>公司名称:</th>
                                <td>
                                    <nobr>{{gzjl.gsmc}}　{{gzjl.ksrq}} 至 {{gzjl.jsrq}}　［{{gzjl.gsgm | dics('gsgm')}}］</nobr>
                                </td>
                            </tr>
                            <tr>
                                <th>任职部门:</th>
                                <td>
                                    <nobr>{{gzjl.rzbm}}　｜　{{gzjl.znName}}　｜　{{gzjl.zw}}</nobr>
                                </td>
                            </tr>
                            <tr>
                                <th>公司性质:</th>
                                <td>
                                    <nobr>{{gzjl.gsxz | dics('gsxz')}}　｜　{{gzjl.gzlx | dics('gzxz')}}</nobr>
                                </td>
                            </tr>
                            <tr>
                                <th>责任描述:</th>
                                <td>
                                    <nobr>{{gzjl.zrms}}</nobr>
                                </td>
                            </tr>
                        </table>
                    </span>
                    <span v-else>
                        <table class="member_view" width="100%">
                            <tr>
                                <td>该会员暂未完善相关信息！</td>
                            </tr>
                        </table>
                    </span>
                </el-tab-pane>
                <el-tab-pane label="项目经验" name="fourth">
                    <span v-if="jobPersonalItem.length>0">
                        <table v-for="item in jobPersonalItem" class="member_view" style="width: 100%">
                            <tr>
                                <th>项目名称:</th>
                                <td>
                                    <nobr>{{item.xmmc}}　{{item.kssj}} 至 {{item.jssj}}</nobr>
                                </td>
                            </tr>
                            <tr>
                                <th>责任描述:</th>
                                <td>
                                    <nobr>{{item.zrms}}</nobr>
                                </td>
                            </tr>
                            <tr>
                                <th>项目描述:</th>
                                <td>
                                    <nobr>{{item.xmms}}</nobr>
                                </td>
                            </tr>
                        </table>
                    </span>
                    <span v-else>
                        <table class="member_view" width="100%">
                            <tr>
                                <td>该会员暂未完善相关信息！</td>
                            </tr>
                        </table>
                    </span>
                </el-tab-pane>
                <el-tab-pane label="教育经历" name="five">
                    <span v-if="jobPersonalJyjl.length>0">
                        <table v-for="jyjl in jobPersonalJyjl" class="member_view" style="width: 100%">
                            <tr>
                                <th>学校名称:</th>
                                <td>
                                    <nobr>{{jyjl.xxmc}}　 | 　{{jyjl.xlxw | dicts('xueli')}}　 | 　{{jyjl.zyName}}</nobr>
                                </td>
                            </tr>
                            <tr>
                                <th>起止日期:</th>
                                <td>
                                    <nobr>
                                        {{jyjl.ksrq}} 至 {{jyjl.jsrq}}　 | 　
                                        <span v-if="jyjl.sfqrz==1">全日制</span>
                                        <span v-else>非全日制</span>
                                    </nobr>
                                </td>
                            </tr>
                            <tr>
                                <th>专业描述:</th>
                                <td>
                                    <nobr>{{jyjl.zyms}}</nobr>
                                </td>
                            </tr>
                        </table>
                    </span>
                    <span v-else>
                        <table class="member_view" width="100%">
                            <tr>
                                <td>该会员暂未完善相关信息！</td>
                            </tr>
                        </table>
                    </span>
                </el-tab-pane>
                <el-tab-pane label="获得证书" name="six">
                    <span v-if="jobPersonalZs.length>0">
                        <el-table :data="jobPersonalZs" border fit style="width: 100%">
                            <el-table-column align="center" label="证书名称">
                                <template scope="scope">
                                    <nobr>{{scope.row.zsmc}}</nobr>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="获得日期">
                                <template scope="scope">
                                    <nobr>{{scope.row.hdrq}}</nobr>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="获得成绩">
                                <template scope="scope">
                                    <nobr>{{scope.row.cj}}</nobr>
                                </template>
                            </el-table-column>
                        </el-table>
                    </span>
                    <span v-else>
                        <table class="member_view" width="100%">
                            <tr>
                                <td>该会员暂未完善相关信息！</td>
                            </tr>
                        </table>
                    </span>
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
    import {getPersonalList, getPersional, getPersionalQzyx, getPersionalGzjl, getPersionalItem, getPersionalJyjl, getPersionalZs} from "api/jobSystem/personal/personal";
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
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    search: ''
                },
                selectedRows: [],
                dialogVisible: false,
                activeName: 'first',
                memberId: null,
                jobPersonal: [],
                jobPersonalQzyx: [],
                jobPersonalGzjl: [],
                jobPersonalItem: [],
                jobPersonalJyjl: [],
                jobPersonalZs: [],
                jobPersonalEmail: '',
                jobPersonalPhone: ''
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
                getPersonalList(this.listQuery).then(response => {
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
                this.activeName = 'first';
                this.dialogVisible = true;
                this.memberId = row.m_id;
                this.jobPersonalEmail = row.email;
                this.jobPersonalPhone = row.phone;
                this.jobPersonalView();
            },
            handleClick(tab, event) {
                if (tab.name == 'first') {
                    this.jobPersonalView();
                }
                if (tab.name == 'second') {
                    this.jobPersonalQzyxView();
                }
                if (tab.name == 'third') {
                    this.jobPersonalGzjlView();
                }
                if (tab.name == 'fourth') {
                    this.jobPersonalItemView();
                }
                if (tab.name == 'five') {
                    this.jobPersonalJyjlView();
                }
                if (tab.name == 'six') {
                    this.jobPersonalZsView();
                }
            },
            jobPersonalView() {
                getPersional(this.memberId).then(response => {
                    if (response.httpCode == 200) {
                        this.jobPersonal = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            jobPersonalQzyxView() {
                getPersionalQzyx(this.memberId).then(response => {
                    if (response.httpCode == 200) {
                        this.jobPersonalQzyx = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            jobPersonalGzjlView() {
                getPersionalGzjl(this.memberId).then(response => {
                    if (response.httpCode == 200) {
                        this.jobPersonalGzjl = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            jobPersonalItemView() {
                getPersionalGzjl(this.memberId).then(response => {
                    if (response.httpCode == 200) {
                        this.jobPersonalItem = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            jobPersonalJyjlView() {
                getPersionalJyjl(this.memberId).then(response => {
                    if (response.httpCode == 200) {
                        this.jobPersonalJyjl = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            jobPersonalZsView() {
                getPersionalZs(this.memberId).then(response => {
                    if (response.httpCode == 200) {
                        this.jobPersonalZs = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            resetTemp() {
                this.memberId = null,
                this.jobPersonal = [],
                this.jobPersonalQzyx = [],
                this.jobPersonalGzjl = [],
                this.jobPersonalItem = [],
                this.jobPersonalJyjl = [],
                this.jobPersonalZs = [],
                this.jobPersonalEmail = '',
                this.jobPersonalPhone = ''
            }
        }
    }
</script>