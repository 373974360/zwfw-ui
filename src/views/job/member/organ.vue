<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listQuery.name" style="width: 180px;" class="filter-item"
                      placeholder="登录名/公司名称"></el-input>
            <el-select v-model="listQuery.gsxz" placeholder="公司性质" class="filter-item" style="width: 180px">
                <el-option
                        v-for="item in dicts['gsxz']"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"/>
            </el-select>
            <el-select v-model="listQuery.gsgm" placeholder="公司规模" class="filter-item" style="width: 180px">
                <el-option
                        v-for="item in dicts['gsgm']"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"/>
            </el-select>
            <el-cascader :options="cascader" class="filter-item" @change="handleChange"
                         :show-all-levels="true" clearable filterable expand-trigger="hover"
                         :change-on-select="true" style="width: 180px" placeholder="选择行业">
            </el-cascader>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索字典" placement="top-start">
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
            <el-table-column align="center" label="电子邮箱" width="170">
                <template scope="scope">
                    <nobr class="link-type" @click="handleView(scope.row)">{{scope.row.email}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册时间" width="175">
                <template scope="scope">
                    <nobr>{{scope.row.registerdate | date('YYYY-MM-DD HH:mm:ss')}}</nobr>
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
                    <nobr>{{scope.row.hylbname}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="座机号码" width="130">
                <template scope="scope">
                    <nobr>{{scope.row.tel}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="帐号状态" width="100">
                <template scope="scope">
                    <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
                        {{scope.row.enable | enums('Enable')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="left" label="详细地址" width="364">
                <template scope="scope">
                    <nobr>{{scope.row.province}}{{scope.row.city}}{{scope.row.address}}</nobr>
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
                    <td>{{member.hylbname}}</td>
                    <th>公司座机:</th>
                    <td>{{member.tel}}</td>
                    <th>邮　　编:</th>
                    <td>{{member.yb}}</td>
                </tr>
                <tr>
                    <th>公司官网:</th>
                    <td>{{member.gsgw}}</td>
                    <th>公司邮箱:</th>
                    <td>{{member.email}}</td>
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
    import {getHyflCascader} from 'api/job/flxx/hyfl';
    import {getOrganList,delMember,getMember} from "api/job/member/organ";
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    export default{
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                cascader: [],
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: '',
                    gsxz:'',
                    gsgm:'',
                    hylb:''
                },
                selectedRows: [],
                dialogVisible: false,
                dialogStatus: '',
                member: {
                    id:'',
                    name:'',
                    gsxz:'',
                    gsgm:'',
                    hylb:'',
                    province:'',
                    city:'',
                    address:'',
                    gsgw:'',
                    yb:'',
                    email:'',
                    gsjj:'',
                    logo:'',
                    photo:'',
                    hylbname:''
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
                this.member.id = row.id;
                getMember({'id':this.member.id}).then(response => {
                    if (response.httpCode == 200) {
                        this.member = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
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
                                this.$message.success('删除成功');
                                this.getList();
                            } else {
                                this.$message.error('删除失败');
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
                this.member = {
                    id:'',
                    name:'',
                    gsxz:'',
                    gsgm:'',
                    hylb:'',
                    province:'',
                    city:'',
                    address:'',
                    gsgw:'',
                    yb:'',
                    email:'',
                    gsjj:'',
                    logo:'',
                    photo:'',
                    hylbname:''
                };
            }
        }
    }
</script>