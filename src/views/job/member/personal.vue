<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listQuery.username" style="width: 180px;" class="filter-item"
                      placeholder="登录名/真实姓名"></el-input>
            <el-select v-model="listQuery.qzzt" placeholder="求职状态" class="filter-item" style="width: 180px">
                <el-option
                        v-for="item in dicts['qzzt']"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"/>
            </el-select>
            <el-select v-model="listQuery.hyzk" placeholder="婚姻状况" class="filter-item" style="width: 180px">
                <el-option
                        v-for="item in dicts['hyzk']"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"/>
            </el-select>
            <el-select v-model="listQuery.zzmm" placeholder="政治面貌" class="filter-item" style="width: 180px">
                <el-option
                        v-for="item in dicts['zzmm']"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"/>
            </el-select>
            <el-select v-model="listQuery.zgxl" placeholder="学历" class="filter-item" style="width: 180px">
                <el-option
                        v-for="item in dicts['xueli']"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"/>
            </el-select>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="danger" @click="handleDelete" icon="delete">
                    删除
                </el-button>
            </el-tooltip>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="联系电话" width="125">
                <template scope="scope">
                    <nobr>{{scope.row.phone}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电子邮箱">
                <template scope="scope">
                    <nobr class="link-type" @click="handleView(scope.row)">{{scope.row.email}}</nobr>
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
                    <nobr>{{scope.row.zgxl | dicts('xueli')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="婚姻状况" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.hyzk | dicts('hyzk') }}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="政治面貌" width="150">
                <template scope="scope">
                    <nobr>{{scope.row.zzmm | dicts('zzmm') }}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="工作年份" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.ksgznf}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="求职状态" width="140">
                <template scope="scope">
                    <nobr>{{scope.row.qzzt | dicts('qzzt')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="帐号状态" width="100">
                <template scope="scope">
                    <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
                        {{scope.row.enable | enums('Enable')}}
                    </el-tag>
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
                            <th>姓　　名:</th>
                            <td>{{member.username}}</td>
                            <th>联系电话:</th>
                            <td>{{member.phone}}</td>
                            <th>电子邮箱:</th>
                            <td>{{member.email}}</td>
                        </tr>
                        <tr>
                            <th>出生日期:</th>
                            <td>{{member.csrq}}</td>
                            <th>工作年份:</th>
                            <td>{{member.ksgznf}}</td>
                            <th>户口/国籍:</th>
                            <td>{{member.hkgj}}</td>
                        </tr>
                        <tr>
                            <th>婚姻状况:</th>
                            <td>{{member.hyzk | dicts('hyzk')}}</td>
                            <th>求职状态:</th>
                            <td>{{member.qzzt | dicts('qzzt')}}</td>
                            <th>政治面貌:</th>
                            <td>{{member.zzmm | dicts('zzmm')}}</td>
                        </tr>
                        <tr>
                            <th>证件类型:</th>
                            <td>{{member.zjlx | dicts('zjlx')}}</td>
                            <th>证件号码:</th>
                            <td>{{member.zjhm}}</td>
                            <th>{{member.qtlxfslx | dicts('lxfs')}}:</th>
                            <td>{{member.qtlxfs }}</td>
                        </tr>
                        <tr>
                            <th>身　　高:</th>
                            <td>{{member.sg}}</td>
                            <th>邮　　编:</th>
                            <td>{{member.yb}}</td>
                            <th>目前收入:</th>
                            <td>{{member.mqnsr | dicts('xzfw')}}</td>
                        </tr>
                        <tr>
                            <th>个人主页:</th>
                            <td>{{member.grzy}}</td>
                            <th>最高学历:</th>
                            <td colspan="3">{{member.zgxl | dicts('xueli')}}</td>
                        </tr>
                        <tr>
                            <th>目前住址:</th>
                            <td colspan="5">{{member.jzd}}</td>
                        </tr>
                        <tr>
                            <th>家庭住址:</th>
                            <td colspan="5">{{member.jtzz}}</td>
                        </tr>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="求职意向" name="qzyx">
                    <table class="member_view" width="100%">
                        <tr>
                            <th>期望薪资:</th>
                            <td>{{qzyx.qwxz | dicts('xzfw')}}</td>
                            <th>工作地点:</th>
                            <td>{{qzyx.gzdd}}</td>
                            <th>职　　能:</th>
                            <td>{{qzyx.znName}}</td>
                        </tr>
                        <tr>
                            <th>行　　业:</th>
                            <td>{{qzyx.hyName}}</td>
                            <th>个人标签:</th>
                            <td>{{qzyx.grbq}}</td>
                            <th>到岗时间:</th>
                            <td>{{qzyx.dgsj | dicts('dgsj')}}</td>
                        </tr>
                        <tr>
                            <th>工作类型:</th>
                            <td colspan="5">{{qzyx.gzlx | dicts('gzxz')}}</td>
                        </tr>
                        <tr>
                            <th>自我评价:</th>
                            <td colspan="5">{{qzyx.zwpj}}</td>
                        </tr>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="工作经历" name="gzjl">
                    <table v-for="gzjl in gzjlList" class="member_view" style="width: 100%" >
                        <tr>
                            <th>公司名称:</th>
                            <td>
                                <nobr>{{gzjl.gsmc}}　{{gzjl.ksrq}} 至 {{gzjl.jsrq}}　［{{gzjl.gsgm | dicts('gsgm')}}］</nobr>
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
                                <nobr>{{gzjl.gsxz | dicts('gsxz')}}　｜　{{gzjl.gzlx |  dicts('gzxz')}}</nobr>
                            </td>
                        </tr>
                        <tr>
                            <th>责任描述:</th>
                            <td>
                                <nobr>{{gzjl.zrms}}</nobr>
                            </td>
                        </tr>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="项目经验" name="xmjy">
                    <table v-for="xmjy in xmjyList" class="member_view" style="width: 100%" >
                        <tr>
                            <th>项目名称:</th>
                            <td>
                                <nobr>{{xmjy.xmmc}}　{{xmjy.kssj}} 至 {{xmjy.jssj}}</nobr>
                            </td>
                        </tr>
                        <tr>
                            <th>责任描述:</th>
                            <td>
                                <nobr>{{xmjy.zrms}}</nobr>
                            </td>
                        </tr>
                        <tr>
                            <th>项目描述:</th>
                            <td>
                                <nobr>{{xmjy.xmms}}</nobr>
                            </td>
                        </tr>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="教育经历" name="jyjl">
                    <table v-for="jyjl in jyjlList" class="member_view" style="width: 100%" >
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
                </el-tab-pane>
                <el-tab-pane label="荣誉证书" name="ryzs">
                    <el-table :data="ryzsList" border fit style="width: 100%">
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
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <!-- 会员查看弹出框  结束 -->
    </div>
</template>
<style>
    .member_view td,th{line-height:45px;}
    .member_view th{text-align:right;width:100px;}
    .member_view td{text-align:left;padding-left:10px;}
</style>
<script>
    import {getPersonalList,delMember,getPersonal,getPersonalQzyx,getPersonalGzjl,getPersonalItem,getPersonalJyjl,getPersonalZs} from "api/job/member/personal";
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    export default{
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                dialogVisible: false,
                activeName: 'member',
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    username: '',
                    qzzt: '',
                    hyzk: '',
                    zzmm: '',
                    zgxl: ''
                },
                selectedRows: [],
                dialogStatus: '',
                member: {
                    csrq: '',
                    email:'',
                    grzy: '',
                    hkgj: '',
                    hyzk: '',
                    jtzz: '',
                    jzd: '',
                    ksgznf: '',
                    mqnsr: '',
                    phone: '',
                    qtlxfs: '',
                    qtlxfslx: '',
                    qzzt: '',
                    registerdatec: '',
                    sex: '',
                    sg: '',
                    status: '',
                    username: '',
                    yb: '',
                    zjhm: '',
                    zjlx: '',
                    zzmm: ''
                },
                qzyx: {
                    qwxz: '',
                    gzdd: '',
                    znName: '',
                    hyName: '',
                    grbq: '',
                    zwpj: '',
                    dgsj: '',
                    gzlx: ''
                },
                gzjlList: null,
                xmjyList: null,
                jyjlList: null,
                ryzsList: null
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
                this.dialogVisible = true;
                this.dialogStatus = 'view';
                this.member.id = row.id;
                getPersonal({'id':this.member.id}).then(response => {
                    if (response.httpCode == 200) {
                        this.member = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            handleClick(tab) {
                if(tab.name=='qzyx'){
                    getPersonalQzyx({'memberId':this.member.id}).then(response => {
                        if (response.httpCode == 200) {
                            this.qzyx = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                    })
                }else if(tab.name=='gzjl'){
                    getPersonalGzjl({'memberId':this.member.id}).then(response => {
                        if (response.httpCode == 200) {
                            this.gzjlList = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                        this.listLoading = false;
                    })
                }else if(tab.name=='xmjy'){
                    getPersonalItem({'memberId':this.member.id}).then(response => {
                        if (response.httpCode == 200) {
                            this.xmjyList = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                        this.listLoading = false;
                    })
                }else if(tab.name=='jyjl'){
                    getPersonalJyjl({'memberId':this.member.id}).then(response => {
                        if (response.httpCode == 200) {
                            this.jyjlList = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                        this.listLoading = false;
                    })
                }else if(tab.name=='ryzs'){
                    getPersonalZs({'memberId':this.member.id}).then(response => {
                        if (response.httpCode == 200) {
                            this.ryzsList = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                        this.listLoading = false;
                    })
                }
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
                        delMember(ids).then(response => {
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
            resetTemp() {
                this.gzjlList = null,
                this.mjyList = null,
                this.jyjlList = null,
                this.ryzsList = null
                this.member = {
                    csrq: '',
                    email:'',
                    grzy: '',
                    hkgj: '',
                    hyzk: '',
                    jtzz: '',
                    jzd: '',
                    ksgznf: '',
                    mqnsr: '',
                    phone: '',
                    qtlxfs: '',
                    qtlxfslx: '',
                    qzzt: '',
                    registerdatec: '',
                    sex: '',
                    sg: '',
                    status: '',
                    username: '',
                    yb: '',
                    zjhm: '',
                    zjlx: '',
                    zzmm: ''
                };
                this.qzyx = {
                    qwxz: '',
                    gzdd: '',
                    znName: '',
                    hyName: '',
                    grbq: '',
                    zwpj: '',
                    dgsj: '',
                    gzlx: ''
                };
            }
        }
    }
</script>