<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item" placeholder="请输入姓名"
                      v-model="listQuery.personName"></el-input>
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item" placeholder="请输入卡号"
                      v-model="listQuery.cardNos"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>

        </div>

        <el-table ref="attendanceCountTable" :data="getDoorEventsHistoryList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column align="center" label="门禁点名称">
                <template scope="scope">
                    <span>{{scope.row.doorName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发生时间" prop="personName">
                <template scope="scope">
                    <span>{{scope.row.eventTime| date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="卡号" prop="cardNo">
                <template scope="scope">
                    <span>{{scope.row.cardNo}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="事件名称" prop="cardNo">
                <template scope="scope">
                    <span>{{scope.row.eventName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="人员名称" prop="departName">
                <template scope="scope">
                    <span>{{scope.row.personName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="部门名称" prop="attName">
                <template scope="scope">
                    <span>{{scope.row.deptName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联动图片URL" prop="eventTime">
                <template scope="scope">
                    <span>{{scope.row.picUrl}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联动录像URL" prop="eventTime">
                <template scope="scope">
                    <span>{{scope.row.videoUrl}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageSize" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.pageNo" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>


    </div>
</template>

<script>
    import {
        getDoorEventsHistory
    } from '../../../api/hallSystem/count/hikvision';

    export default {
        name: 'door_events_history',
        data() {
            return {
                getDoorEventsHistoryList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    pageSize: this.$store.state.app.page,
                    pageNo: this.$store.state.app.rows,
                    personName: undefined,
                    cardNos: undefined
                },
                selectedRows: [],
                selectDateTime: undefined
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getDoorEventsHistory(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200 && response.data != null) {
                        this.getDoorEventsHistoryList = response.data.data.list;
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
