<template>
    <div class="app-container order-line">
        <div class="card-container">
            <div class="sum-msg">今日累计抽号排队数：{{todayCount.total}}人次</div>
            <el-row>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title">当前等待人数<span>（人）</span></div>
                        <div class="card-value">{{currentWait.total}}</div>
                        <div class="card-detail">同比：{{currentWait.yoy}}%</div>
                        <div class="card-detail">环比：{{currentWait.mom}}%</div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title">平均等待时长<span>（分钟）</span></div>
                        <div class="card-value">{{avgWaitTime.total}}</div>
                        <div class="card-detail">同比：{{avgWaitTime.yoy}}%</div>
                        <div class="card-detail">环比：{{avgWaitTime.mom}}%</div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="splitBar"></div>
        <div class="chart-container">
            <div class="filter-container">
                <el-select v-model="checkItemIds" class="filter-item" multiple filterable placeholder="选择事项">
                    <el-option :key="item.id" v-for="item in itemList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="checkDeptIds" class="filter-item" multiple filterable placeholder="选择部门" @change="reloadItemUserList">
                    <el-option :key="item.id" v-for="item in deptList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="checkWindowIds" class="filter-item" multiple filterable placeholder="选择窗口" @change="reloadItemUserList">
                    <el-option :key="item.id" v-for="item in windowList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="checkUserIds" class="filter-item" multiple filterable placeholder="选择人员">
                    <el-option :key="item.id" v-for="item in userList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-date-picker style="top: -5px;" v-model="listQuery.startDate" type="datetime" :editable="false"
                                placeholder="开始时间" :clearable="false" format="yyyy-MM-dd HH:mm" @change="formatStartDate">
                </el-date-picker>
                <el-date-picker style="top: -5px;" v-model="listQuery.endDate" type="datetime" :editable="false"
                                placeholder="结束时间" :clearable="false" format="yyyy-MM-dd HH:mm" @change="formatEndDate">
                </el-date-picker>
                <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="统计" placement="top-start">
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="doPlot">
                        统计
                    </el-button>
                </el-tooltip>
            </div>
            <div class="className" id="lineWaitTime"></div>
        </div>
        <div class="splitBar"></div>
        <div class="line-top5">
            <div class="title">排队等待时长 Top 5</div>
            <el-radio-group v-model="tableDataType" @change="lineWaitTimeTop5">
                <el-radio-button label="1">按窗口</el-radio-button>
                <el-radio-button label="2">按事项</el-radio-button>
            </el-radio-group>
            <el-row style="padding:20px;" :gutter="20">
                <div v-show="windowDisplay">
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-table :data="windowWaitTopListAsc" v-loading.body="windowWaitTopListLoading" border fit
                                      highlight-current-row>
                                <el-table-column type="index" label="排名" width="80" align="center"></el-table-column>
                                <el-table-column align="center" label="窗口" >
                                    <template scope="scope">
                                        <span>{{scope.row.windowName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="所属部门" >
                                    <template scope="scope">
                                        <span>{{scope.row.deptName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="平均等待时间" >
                                    <template scope="scope">
                                        <span>{{scope.row.avgtime * 1000 | duration}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>

                    <el-col :span="12" >
                        <div class="grid-content">
                            <el-table :data="windowWaitTopListDesc" v-loading.body="windowWaitTopListLoading" border fit
                                      highlight-current-row>
                                <el-table-column type="index" label="排名" width="80" align="center"></el-table-column>
                                <el-table-column align="center" label="窗口" >
                                    <template scope="scope">
                                        <span>{{scope.row.windowName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="所属部门" >
                                    <template scope="scope">
                                        <span>{{scope.row.deptName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="平均等待时间" >
                                    <template scope="scope">
                                        <span>{{scope.row.avgtime * 1000 | duration}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </div>

                <div v-show="itemDisplay">
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-table :data="itemWaitTopListAsc" v-loading.body="itemWaitTopListLoading" border fit
                                      highlight-current-row>
                                <el-table-column type="index" label="排名" width="80" align="center"></el-table-column>
                                <el-table-column align="center" label="事项" >
                                    <template scope="scope">
                                        <div style="height:2em;overflow:hidden">{{scope.row.itemName}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="所属部门" >
                                    <template scope="scope">
                                        <div>{{scope.row.deptName}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="平均等待时间" >
                                    <template scope="scope">
                                        <span>{{scope.row.avgtime * 1000 | duration}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="grid-content">
                            <el-table :data="itemWaitTopListDesc" v-loading.body="itemWaitTopListLoading" border fit
                                      highlight-current-row>
                                <el-table-column type="index" label="排名" width="80" align="center"></el-table-column>
                                <el-table-column align="center" label="事项" >
                                    <template scope="scope">
                                        <div style="height:2em;overflow:hidden">{{scope.row.itemName}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="所属部门" >
                                    <template scope="scope">
                                        <div>{{scope.row.deptName}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="平均等待时间" >
                                    <template scope="scope">
                                        <span>{{scope.row.avgtime * 1000 | duration}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </div>
            </el-row>
        </div>
    </div>
</template>
<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/pie');
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    require('echarts/lib/component/visualMap');
    import {date} from '../../../../filters'
    import {getAllByNameOrbasicCode} from '../../../../api/zwfwSystem/business/item'
    import {getAllDept} from '../../../../api/baseSystem/org/dept'
    import {getAllWindow} from '../../../../api/hallSystem/lobby/window';
    import {getAllUser} from '../../../../api/baseSystem/org/user';
    import {dataPlotQueueCount, dataPlotCountByHour, dataPlotTopWaitWindow, dataPlotTopWaitItem} from '../../../../api/hallSystem/count/count';


    export default {
        name: 'orderAndLine',
        data() {
            return {
                todayCount: undefined,
                currentWait: undefined,
                avgWaitTime: undefined,
                listQuery: {
                    itemIds: undefined,
                    deptIds: undefined,
                    windowIds: undefined,
                    userIds: undefined,
                    startDate: undefined,
                    endDate: undefined
                },
                checkItemIds: [],
                checkDeptIds: [],
                checkWindowIds: [],
                checkUserIds: [],
                itemListQuery: {
                    itemDepartments: '',
                    itemWindows: ''
                },
                userListQuery: {
                    userDepartments: '',
                    userWindows: ''
                },
                tableDataType: '1',
                itemList: [],
                windowList: [],
                deptList: [],
                userList: [],
                windowDisplay: true,
                itemDisplay: false,
                lineNum: [],
                waitTime: [],
                windowWaitTopListAsc: [],
                windowWaitTopListDesc: [],
                itemWaitTopListAsc: [],
                itemWaitTopListDesc: [],
                windowWaitTopListLoading: true,
                itemWaitTopListLoading: true
            }
        },
        created() {
            this.listQuery.startDate = this.getTodayFirst();
            this.listQuery.endDate = this.getTodayLast();
            this.plotQueueCount();
            this.getDeptList();
            this.getWindowList();
            this.getItemList();
            this.getUserList();
            this.doPlot();
        },
        methods: {
            getDeptList() {
                getAllDept().then(response => {
                    this.deptList = response.data;
                })
            },
            getWindowList() {
                getAllWindow().then(response => {
                    this.windowList = response.data;
                })
            },
            getItemList() {
                this.itemListQuery.itemDepartments = this.checkDeptIds.join();
                this.itemListQuery.itemWindows = this.checkWindowIds.join();
                getAllByNameOrbasicCode(this.itemListQuery).then(response => {
                    this.itemList = response.data
                })
            },
            getUserList() {
                this.userListQuery.userDepartments = this.checkDeptIds.join();
                this.userListQuery.userWindows = this.checkWindowIds.join();
                getAllUser(this.userListQuery).then(response => {
                    this.userList = response.data
                })
            },
            reloadItemUserList() {
                this.reloadItemList();
                this.reloadUserList();
            },
            reloadItemList() {
                this.getItemList();
                this.listQuery.itemIds = [];
            },
            reloadUserList() {
                this.getUserList();
                this.listQuery.userIds = [];
            },
            plotQueueCount() {
                dataPlotQueueCount().then(response => {
                    if (response.httpCode === 200) {
                        this.todayCount = response.data.todayCount;
                        this.currentWait = response.data.currentWait;
                        this.avgWaitTime = response.data.avgWaitTime;
                    } else {
                        this.$message.error('数据加载失败');
                    }
                })
            },
            doPlot() {
                this.listQuery.itemIds = this.checkItemIds.join();
                this.listQuery.deptIds = this.checkDeptIds.join();
                this.listQuery.windowIds = this.checkWindowIds.join();
                this.listQuery.userIds = this.checkUserIds.join();
                dataPlotCountByHour(this.listQuery).then(response => {
                    const lineWaitData = response.data;
                    this.lineNum = [];
                    this.waitTime = [];
                    this.lineNum.push(
                        lineWaitData.count_wait_hour_8,
                        lineWaitData.count_wait_hour_9,
                        lineWaitData.count_wait_hour_10,
                        lineWaitData.count_wait_hour_11,
                        lineWaitData.count_wait_hour_12,
                        lineWaitData.count_wait_hour_13,
                        lineWaitData.count_wait_hour_14,
                        lineWaitData.count_wait_hour_15,
                        lineWaitData.count_wait_hour_16,
                        lineWaitData.count_wait_hour_17);
                    this.waitTime.push(
                        lineWaitData.avg_wait_hour_8,
                        lineWaitData.avg_wait_hour_9,
                        lineWaitData.avg_wait_hour_10,
                        lineWaitData.avg_wait_hour_11,
                        lineWaitData.avg_wait_hour_12,
                        lineWaitData.avg_wait_hour_13,
                        lineWaitData.avg_wait_hour_14,
                        lineWaitData.avg_wait_hour_15,
                        lineWaitData.avg_wait_hour_16,
                        lineWaitData.avg_wait_hour_17);
                    const e = echarts.init(document.getElementById('lineWaitTime'));
                    e.setOption({
                        legend: {
                            data: ['排队数', '等待时长']
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: {show: true},
                                dataView: {show: true, readOnly: false},
                                magicType: {show: true, type: ['line', 'bar']},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        calculable: true,
                        xAxis: [
                            {
                                type: 'category',
                                data: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            },
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '排队数',
                                type: 'bar',
                                data: this.lineNum
                            },
                            {
                                name: '等待时长',
                                type: 'line',
                                yAxisIndex: 1,
                                data: this.waitTime
                            }
                        ]
                    })
                });
                this.lineWaitTimeTop5();
            },
            lineWaitTimeTop5() {
                if (this.tableDataType == 1) {
                    this.loadTop5WindowData();
                    this.windowDisplay = true;
                    this.itemDisplay = false;
                } else {
                    this.loadTop5ItemData();
                    this.windowDisplay = false;
                    this.itemDisplay = true;
                }
            },
            loadTop5WindowData() {
                dataPlotTopWaitWindow(this.listQuery).then(response => {
                    this.windowWaitTopListLoading = false;
                    if (response.httpCode === 200) {
                        this.windowWaitTopListAsc = response.data.asc;
                        this.windowWaitTopListDesc = response.data.desc;
                    } else {
                        this.$message.error('加载失败');
                    }
                });
            },
            loadTop5ItemData() {
                dataPlotTopWaitItem(this.listQuery).then(response => {
                    this.itemWaitTopListLoading = false;
                    if (response.httpCode === 200) {
                        this.itemWaitTopListAsc = response.data.asc;
                        this.itemWaitTopListDesc = response.data.desc;
                    } else {
                        this.$message.error('加载失败');
                    }
                });
            },
            getTodayFirst() {
                return date(new Date().setHours(0, 0), 'YYYY-MM-DD HH:mm');
            },
            getTodayLast() {
                return date(new Date().setHours(23, 59), 'YYYY-MM-DD HH:mm');
            },
            formatStartDate() {
                this.listQuery.startDate = date(this.listQuery.startDate, 'YYYY-MM-DD HH:mm')
            },
            formatEndDate() {
                this.listQuery.endDate = date(this.listQuery.endDate, 'YYYY-MM-DD HH:mm')
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .order-line {
        .card-container {
            .sum-msg {
                font-weight: bold;
                font-size: 24px;
                text-align: center;
                padding: 12px 0 12px 0;
            }
            .el-card {
                width: 300px;
                margin-left: 400px;
                .card-title {
                    font-weight: bold;
                    font-size: 20px;
                    text-align: center;
                    padding-bottom: 10px;
                    span {
                        font-size: 14px;
                    }
                }
                .card-value {
                    font-weight: bold;
                    font-size: 18px;
                    text-align: center;
                    padding-bottom: 10px;
                }
                .card-detail {
                    font-size: 16px;
                    text-align: center;
                }
            }
        }

        .chart-container {
            .className {
                width: 1614px;
                height: 540px;
            }
        }

        .line-top5 {
            .title {
                font-weight: bold;
                font-size: 20px;
                text-align: center;
            }
        }

        .splitBar {
            height: 60px;
        }
    }
</style>