<template>
    <div class="order-line">
        <div class="card-container">
            <div class="sum-msg">今日累计抽号排队数：{{}}人次</div>
            <el-row>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title">当前等待人数<span>（人）</span></div>
                        <div class="card-value">{{}}</div>
                        <div class="card-detail">同比：{{}}</div>
                        <div class="card-detail">环比：{{}}</div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title">平均等待时长<span>（分钟）</span></div>
                        <div class="card-value">{{}}</div>
                        <div class="card-detail">同比：{{}}</div>
                        <div class="card-detail">环比：{{}}</div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="splitBar"></div>
        <div class="chart-container">
            <div class="filter-container">
                <el-select v-model="listQuery.itemIds" class="filter-item" multiple filterable placeholder="选择事项">
                    <el-option :key="item.id" v-for="item in itemList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="listQuery.deptIds" class="filter-item" multiple filterable placeholder="选择部门" @change="reloadItemList">
                    <el-option :key="item.id" v-for="item in deptList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="listQuery.windowIds" class="filter-item" multiple filterable placeholder="选择窗口" @change="reloadItemList">
                    <el-option :key="item.id" v-for="item in windowList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="listQuery.userIds" class="filter-item" multiple filterable placeholder="选择人员">
                    <el-option :key="item.id" v-for="item in userList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-date-picker style="top: -5px;" v-model="listQuery.startDate" type="date"
                                placeholder="开始时间" @change="changeDateStart" :clearable="false">
                </el-date-picker>
                <el-date-picker style="top: -5px;" v-model="listQuery.endDate" type="date"
                                placeholder="结束时间" @change="changeDateEnd" :clearable="false">
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
            <el-radio-group v-model="tableDataType" @change="reloadTableData">
                <el-radio-button label="1">按窗口</el-radio-button>
                <el-radio-button label="2">按事项</el-radio-button>
            </el-radio-group>
            <el-row style="padding:20px;" :gutter="20">
                <el-col :span="12">
                    <div class="grid-content">
                        <el-table :data="windowWaitTopListAsc" v-loading.body="windowWaitTopListLoading" border fit
                                  highlight-current-row>
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

                <el-col :span="12">
                    <div class="grid-content">
                        <el-table :data="itemWaitTopListAsc" v-loading.body="itemWaitTopListLoading" border fit
                                  highlight-current-row>
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
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import {getAllByNameOrbasicCode} from '../../../../api/zwfwSystem/business/item'
    import {getAllDept} from '../../../../api/baseSystem/org/dept'
    import {getAllWindow} from '../../../../api/hallSystem/lobby/window';
    import {getAllUser} from '../../../../api/baseSystem/org/user';
    import {dataPlotCountByHour, dataPlotTopWaitWindow, dataPlotTopWaitItem} from '../../../../api/hallSystem/count/count';


    export default {
        name: 'orderAndLine',
        data() {
            return {
                listQuery: {
                    itemIds: [],
                    deptIds: [],
                    windowIds: [],
                    userIds: [],
                    startDate: moment(new Date()).format('YYYY-MM-DD'),
                    endDate: undefined
                },
                itemListQuery: {
                    itemDepartments: '',
                    itemWindows: ''
                },
                tableDataType: '1',
                itemList: [],
                windowList: [],
                deptList: [],
                userList: [],
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
            this.lineWaitTimeTop5()
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
                this.itemListQuery.itemDepartments = this.listQuery.deptIds.join();
                this.itemListQuery.itemWindows = this.listQuery.windowIds.join();
                getAllByNameOrbasicCode(this.itemListQuery).then(response => {
                    this.itemList = response.data
                })
            },
            reloadItemList() {
                this.getItemList();
                this.itemListQuery.itemIds = [];
            },
            reloadTableData() {
                this.lineWaitTimeTop5()
            },
            doPlot() {
                dataPlotCountByHour(this.listQuery).then(response => {
                    console.log(response)
                    const lineWaitData = response.data;
                    this.lineNum = [];
                    this.waitTime = [];
                    for (let lintWait of lineWaitData) {
                        this.lineNum.push(lintWait.total)
                        this.waitTime.push(lintWait.total)
                    }
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
                                data: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
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
                                type: 'bar',
                                data: this.waitTime
                            }
                        ]
                    })
                })
            },
            lineWaitTimeTop5() {
                dataPlotTopWaitWindow({
                    startTime: '2016-01-01 00:00:00',
                    endTime: '2017-11-01 00:00:00',
                    asc: true
                }).then(response => {
                    this.windowWaitTopListLoading = false;
                    if (response.httpCode === 200) {

                        this.windowWaitTopListAsc = response.data.asc;
                        this.windowWaitTopListDesc = response.data.desc;

                    } else {
                        this.$message.error("加载失败");
                    }
                });
                dataPlotTopWaitItem({
                    startTime: '2016-01-01 00:00:00',
                    endTime: '2017-11-01 00:00:00',
                    asc: true
                }).then(response => {
                    this.itemWaitTopListLoading = false;
                    if (response.httpCode === 200) {

                        this.itemWaitTopListAsc = response.data.asc;
                        this.itemWaitTopListDesc = response.data.desc;

                    } else {
                        this.$message.error("加载失败");
                    }
                });
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