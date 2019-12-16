<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width:230px;" class="filter-item" placeholder="取证人姓名"
                      v-model="listQuery.name"></el-input>
            <el-input @keyup.enter.native="handleFilter" style="width: 230px;" class="filter-item" placeholder="证照名称"
                      v-model="listQuery.licenceName"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </div>

        <el-table ref="licenceRecordTable" :data="licenceRecordList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="取件人姓名" prop="name">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="取件人身份证号" prop="idNum">
                <template slot-scope="scope">
                    <span>{{scope.row.idNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="证照名称" prop="licenceName">
                <template slot-scope="scope">
                    <span>{{scope.row.licenceName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="正本份数" prop="printNum">
                <template slot-scope="scope">
                    <span>{{scope.row.printNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="副本份数" prop="copyNum">
                <template slot-scope="scope">
                    <span>{{scope.row.copyNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template slot-scope="scope">
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

    </div>
</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {
        getLicenceList
    } from '../../../../api/hallSystem/window/licenceRecord'

    export default {
        name: 'licenceRecord_table',
        data() {
            return {
                licenceRecordList: [],
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                    licenceName:undefined
                },
                licenceRecord: {
                    id: undefined,
                    name: undefined,
                    idNum: undefined,
                    licenceName: undefined,
                    printNum: undefined,
                    copyNum: undefined
                },
                currentRow: null,
                selectedRows: [],
                total: null,
                listLoading: true,
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false
            }
        },
        created() {
            this.getList();
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        methods: {
            handleFilter() {
                this.getList();
            },
            getList() {
                this.listLoading = true;
                getLicenceList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.licenceRecordList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listLoading = false;
                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.name = null;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.licenceRecordTable.toggleRowSelection(row);
            }
        }
    }
</script>
