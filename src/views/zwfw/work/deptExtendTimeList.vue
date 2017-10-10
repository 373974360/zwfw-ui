<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select style="bottom: 4px;" v-model="listQuery.timeExtendStatus" placeholder="请选择">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </div>

        <el-table ref="zwfwItemProcessExtendTimeTable" :data="zwfwItemProcessExtendTimeList"
                  v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column align="center" label="ID" width="">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办件流水" width="">
                <template scope="scope">
                    <span>{{scope.row.processNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="延期任务" width="">
                <template scope="scope">
                    <span>{{scope.row.taskName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="延期原因">
                <template scope="scope">
                    <div style="white-space:pre-wrap;text-align: left;">{{scope.row.reason}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="申请人">
                <template scope="scope">
                    <span>{{scope.row.applyUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="申请时间">
                <template scope="scope">
                    <span>{{scope.row.timeExtendApply | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="延期工作日">
                <template scope="scope">
                    <span>{{scope.row.timeExtendWorkdates}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="延期到">
                <template scope="scope">
                    <span>{{scope.row.timeExtendToDate | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
                    <span>{{scope.row.timeExtendStatus | zwfwEnumData('TimeExtendStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <div v-show="scope.row.timeExtendStatus == 1"class="filter-container" style="display: flex;">
                        <el-button class="filter-item" type="primary" @click="agree(scope.row)">同意
                        </el-button>
                        <el-button class="filter-item" type="primary" @click="disagree(scope.row)">不同意
                        </el-button>
                    </div>
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
        getZwfwItemProcessExtendTimeList, workAgree, workDisagree
    } from 'api/zwfw/zwfwItemProcessExtendTime';

    export default {
        name: 'zwfwDeptWorkPending_table',
        data() {
            return {
                zwfwItemProcessExtendTimeList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                    timeExtendStatus: 1
                },
                options: [
                    {
                        value: 1,
                        label: '待审核状态'
                    }, {
                        value: 2,
                        label: '审核通过状态'
                    }, {
                        value: 3,
                        label: '撤销申请状态'
                    }, {
                        value: 4,
                        label: '驳回申请状态'
                    }],
                selectedRows: [],
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
            getList() {
                this.listLoading = true;
                getZwfwItemProcessExtendTimeList(this.listQuery).then(response => {
                    this.zwfwItemProcessExtendTimeList = response.data.list;
                    this.total = response.data.total;
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
                this.$refs.zwfwItemProcessExtendTimeTable.toggleRowSelection(row);
            },
            resetTemp() {
            },
            resetZwfwLegalPersonForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'zwfwDeptWorkPendingForm');
            },
            agree(row) {
                workAgree(row.id).then(response => {
                    if (response.httpCode == 200) {
                        const index = this.zwfwItemProcessExtendTimeList.indexOf(row);
                        this.zwfwItemProcessExtendTimeList.splice(index, 1);
                        this.$message.success('保存成功');
                    } else {
                        this.$message.error('审批失败');
                    }
                })
            },
            disagree(row) {
                workDisagree(row.id).then(response => {
                    if (response.httpCode == 200) {
                        const index = this.zwfwItemProcessExtendTimeList.indexOf(row);
                        this.zwfwItemProcessExtendTimeList.splice(index, 1);
                        this.$message.success('保存成功');
                    } else {
                        this.$message.error('审批失败');
                    }
                })
            }
        }
    }
</script>
