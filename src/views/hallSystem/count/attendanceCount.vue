<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item" placeholder="请输入姓名"
                      v-model="listQuery.personName"></el-input>
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                      placeholder="请输入部门"
                      v-model="listQuery.departName"></el-input>
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item" placeholder="请输入卡号"
                      v-model="listQuery.cardNo"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>

        </div>

        <el-table ref="attendanceCountTable" :data="attendanceList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column align="center" label="记录Id">
                <template scope="scope">
                    <span>{{scope.row.recordId}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名" prop="personName">
                <template scope="scope">
                        <span>{{scope.row.personName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="卡号" prop="cardNo">
                <template scope="scope">
                    <span>{{scope.row.cardNo}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="部门" prop="departName">
                <template scope="scope">
                    <span>{{scope.row.departName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="考勤点名称" prop="attName">
                <template scope="scope">
                    <span>{{scope.row.attName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="刷卡时间" prop="eventTime">
                <template scope="scope">
                    <span>{{scope.row.eventTime | date('YYYY-MM-DD')}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageSize" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>


    </div>
</template>

<script>
    import {
        getAttClockRecords
    } from '../../../api/hallSystem/count/attendance';

    export default {
        name: 'attendance_count',
        data() {
            return {
                attendanceList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    pageSize: this.$store.state.app.page,
                    pageNo: this.$store.state.app.rows,
                    personName: undefined,
                    departName: undefined,
                    cardNo: undefined
                },
                selectedRows: []
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getAttClockRecords(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200 && response.data != null) {
                        this.attendanceList = response.data.data.list;
                        this.total = response.data.data.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            handleSizeChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.attendanceCountTable.toggleRowSelection(row);
            }
        }
    }
</script>
