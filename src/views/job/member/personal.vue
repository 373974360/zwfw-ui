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
            <el-select v-model="listQuery.status" placeholder="帐号状态" class="filter-item" style="width: 180px">
                <el-option
                        v-for="item in enums['Enable']"
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
            <el-table-column align="center" label="序号" width="165">
                <template scope="scope">
                    <nobr>{{scope.row.id}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联系电话" width="125">
                <template scope="scope">
                    <nobr class="link-type" @click="handleView">{{scope.row.phone}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电子邮箱" width="170">
                <template scope="scope">
                    <nobr>{{scope.row.email}}</nobr>
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
            <el-table-column align="center" label="性别" width="80">
                <template scope="scope">
                    <nobr>{{scope.row.sex | enums('Gender')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="出生日期" width="120">
                <template scope="scope">
                    <nobr>{{scope.row.csrq}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="婚姻状况" width="100">
                <template scope="scope">
                    <nobr>{{scope.row.hyzk | dicts('hyzk') }}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="求职状态" width="150">
                <template scope="scope">
                    <nobr>{{scope.row.qzzt | dicts('qzzt')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="帐号状态" width="100">
                <template scope="scope">
                    <el-tag :type="scope.row.status | enums('Enable') | statusFilter">
                        {{scope.row.status | enums('Enable')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="left" label="家庭住址" width="359">
                <template scope="scope">
                    <nobr>{{scope.row.jtzz}}</nobr>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <!-- 会员添加弹出框  开始 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="member">
                    基本信息
                </el-tab-pane>
                <el-tab-pane label="详细信息" name="personal">
                    详细信息
                </el-tab-pane>
                <el-tab-pane label="求职意向" name="qzyx">求职意向</el-tab-pane>
                <el-tab-pane label="工作经历" name="gzjl">工作经历</el-tab-pane>
                <el-tab-pane label="项目经验" name="xmjy">项目经验</el-tab-pane>
                <el-tab-pane label="教育经历" name="jyjl">教育经历</el-tab-pane>
                <el-tab-pane label="荣誉证书" name="ryzs">荣誉证书</el-tab-pane>
            </el-tabs>
        </el-dialog>
        <!-- 会员添加弹出框  结束 -->
    </div>
</template>
<script>
    import {getPersonalList,delMember} from "api/job/member/personal";
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
                tabName: 'member',
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    username: '',
                    qzzt: '',
                    hyzk: '',
                    status: '',
                    zzmm: ''
                },
                selectedRows: [],
                dialogStatus: ''
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
            handleView() {
                this.dialogVisible = true;
                this.dialogStatus = 'view';
            },
            handleClick(tab) {
                this.tabName = tab.name;
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
            }
        }
    }
</script>