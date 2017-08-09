<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listQuery.search" style="width: 180px;" class="filter-item" placeholder="登录名/真实姓名"></el-input>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索字典" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="delete">
                    删除
                </el-button>
            </el-tooltip>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="165" >
                <template scope="scope">
                    <span>{{scope.row.memberId}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="真实姓名"  width="95">
                <template scope="scope">
                    <span class="link-type">{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="性别" width="80" >
                <template scope="scope">
                    <span>{{scope.row.sex | enums('Gender')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="出生日期" width="120">
                <template scope="scope">
                    <span>{{scope.row.csrq}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联系电话" width="125">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电子邮箱" width="170">
                <template scope="scope">
                    <span>{{scope.row.email}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="婚姻状况" width="100">
                <template scope="scope">
                    <span>{{scope.row.hyzk | dicts('hyzk') }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="求职状态" width="150">
                <template scope="scope">
                    <span>{{scope.row.qzzt | dicts('qzzt')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册时间" width="170">
                <template scope="scope">
                    <span>{{scope.row.registerdate}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="帐号状态" width="100">
                <template scope="scope">
                    <el-tag :type="scope.row.status | enums('Enable') | statusFilter">
                        {{scope.row.status | enums('Enable')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="left" label="家庭住址">
                <template scope="scope">
                    <span>{{scope.row.jtzz}}</span>
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
</template>
<script>
    import {getPersonalList} from "api/job/member/personal";
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
                    search: ''
                },
                selectedRows: []
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
                    this.list = response.data.list;
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
            }
        }
    }
</script>