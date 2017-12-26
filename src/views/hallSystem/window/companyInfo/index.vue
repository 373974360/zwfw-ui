<template xmlns="http://www.w3.org/1999/html">
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                      placeholder="企业名称"
                      v-model="listQuery.qymc"></el-input>

            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                      placeholder="企业统一信用代码"
                      v-model="listQuery.tyCode"></el-input>

            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                      placeholder="法人姓名"
                      v-model="listQuery.fr"></el-input>


            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                搜索
            </el-button>
        </div>


        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="编号" width="140">
                <template scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="统一社会信用代码">
                <template scope="scope">
                    <span>{{scope.row.ty_code}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="企业名称">
                <template scope="scope">
                    <span>{{scope.row.qymc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="法人姓名">
                <template scope="scope">
                    <span>{{scope.row.fr}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联系电话">
                <template scope="scope">
                    <span>{{scope.row.lxdh}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="企业类型">
                <template scope="scope">
                    <span>{{scope.row.qllx}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="经营类型">
                <template scope="scope">
                    <span>{{scope.row.jyfw}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属街道">
                <template scope="scope">
                    <span>{{scope.row.ssjd}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>


    </div>
</template>


<script>
    import {
        queryCompanysInfo
    } from 'api/hallSystem/window/receive/windowAccept';
    import {mapGetters} from 'vuex';

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    qymc: undefined,
                    tyCode: undefined,
                    fr: undefined
                },
                dialogFormVisible: false,
                dialogLoading: false
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                queryCompanysInfo(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        const data2 = response.data;
                        this.list = data2.list;
                        this.total = data2.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                }).catch(e=>{
                    this.listLoading = false;
                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            handlePageChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
        }
    }
</script>
