<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listQuery.search" style="width: 180px;" class="filter-item"
                      placeholder="登录名/公司名称"></el-input>
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
            <el-table-column align="center" label="序号" width="165">
                <template scope="scope">
                    <nobr>{{scope.row.id}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联系电话" width="125">
                <template scope="scope">
                    <nobr>{{scope.row.phone}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电子邮箱" width="170">
                <template scope="scope">
                    <nobr>{{scope.row.email}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册时间" width="175">
                <template scope="scope">
                    <nobr>{{scope.row.registerdate | date('YYYY-MM-DD HH:mm:ss')}}</nobr>
                </template>
            </el-table-column>
            <el-table-column align="left" label="公司名称" width="210">
                <template scope="scope">
                    <nobr class="link-type">{{scope.row.name}}</nobr>
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
            <el-table-column align="left" label="详细地址" width="299">
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
    </div>
</template>
<script>
    import {getOrganList,delMember} from "api/job/member/organ";
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
<style>
    .nobr{
        text-overflow:ellipsis;
        overflow:hidden;
    }

</style>