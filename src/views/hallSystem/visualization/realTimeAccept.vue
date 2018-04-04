<template>
    <div class="app-container order-line-msg">
        <el-button type="primary" @click="showAll">全屏</el-button>

        <div class="top-center-title">
            <h1>实时受理数据可视化</h1>
        </div>
        <div class="card-container-msg">

            <el-row>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title">今日累计受理量</div>
                        <div class="card-value">{{acceptCount.todayToTal}}</div>
                        <div class="card-detail" v-if="acceptCount.rate < 0">比上一工作日 下降：{{-acceptCount.rate}}%</div>
                        <div class="card-detail" v-if="acceptCount.rate >= 0">比上一工作日 增长：{{acceptCount.rate}}%</div>
                        <div class="card-detail">快件箱 交件/取件数</div>
                        <div class="card-detail">{{mailBoxAndPost.handMailbox}}/{{mailBoxAndPost.takeMailbox}}</div>
                        <div class="card-detail">快递邮寄 交件/取件数</div>
                        <div class="card-detail">{{mailBoxAndPost.handPost}}/{{mailBoxAndPost.takePost}}</div>

                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title">当前等待人数</div>
                        <div class="card-value">{{currentWait.total}}<span>（人）</span></div>
                        <div class="card-title">平均等待时长</div>
                        <div class="card-value">{{avgWaitTime.total}}<span>（分钟）</span></div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title">历史累计总受理量</div>
                        <div class="card-value">{{acceptCount.historyTotal}}<span></span></div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="splitBar"></div>
        <div class="top-center-title"><h3>窗口实时受理量情况</h3></div>
        <div style="width: 80%;text-align: center;margin-left: auto;margin-right: auto;">
            <el-table ref="listTable" :data="list" v-loading.body="pageLoading" border fit
                      highlight-current-row
                      style="width: 100%">
                <el-table-column prop="callTime" align="center" label="时间" width="">
                    <template scope="scope">
                        <span>{{scope.row.callTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="personName" align="center" label="姓名">
                    <template scope="scope">
                        <span>{{scope.row.personName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="personIdcard" align="center" label="身份证号">
                    <template scope="scope">
                        <span>{{scope.row.personIdcard}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="itemName" align="center" label="事项名称">
                    <template scope="scope">
                        <span>{{scope.row.itemName}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="top-center-title"><h3>各窗口业务受理量</h3></div>
        <div class="className" id="windowHandle"></div>
        <div class="splitBar"></div>
        <div class="top-center-title"><h3>各时段业务统计量</h3></div>
        <div class="className" id="hourAcceptCount"></div>
        <div class="splitBar"></div>
        <div class="top-center-title"><h3>本周热门业务Top5</h3></div>
        <div class="className" id="weekHotBusinessTop5"></div>
        <div class="top-center-title"><h3>本月热门业务Top5</h3></div>
        <div class="className" id="monthHotBusinessTop5"></div>
        <div class="top-center-title"><h3>各业务窗口实时等待情况</h3></div>
        <div class="main-wait-time" id="businessWindowRealTimeWait"></div>

    </div>
</template>
<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/pie');
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');
    require('echarts/lib/component/toolbox');
    require('echarts/lib/component/title');
    require('echarts/lib/component/visualMap');
    require('echarts/lib/component/dataZoom');


    import {
        getAcceptCount,
        getRealTimeAcceptCountByWindow,
        getWindowsRealTimeAccept,
        getAdmissibilityAndWaitTimeAtHours,
        getRealWaitTimeByWindow,
        getThisWeekHotBusiness,
        getThisMonthHotBusiness
    } from '../../../api/hallSystem/count/count';


    export default {
        name: 'real-time-accept',
        data() {
            return {
                pageLoading: true,
                total: null,
                acceptCount: '',
                currentWait: '',
                avgWaitTime: '',
                mailBoxAndPost: '',
                list: [],
                lineNum: [],
                waitTime: [],
                windowWaitTopListAsc: [],
                windowWaitTopListDesc: [],
                itemWaitTopListAsc: [],
                itemWaitTopListDesc: [],
                windowWaitTopListLoading: false,
                itemWaitTopListLoading: false
            }
        },
        created() {
            this.getAcceptCount(); // 今日、历史累计受理量、比上一工作日增长/下降百分比、等待时长、等待人数、交件、取件数
            this.getRealTimeAcceptCountByWindow(); // 各窗口业务受理量
            this.getAdmissibilityAndWaitTimeAtHours(); // 工作时间段内受理量和等待时长
            this.getWindowsRealTimeAccept(); // 窗口受理情况
            this.getRealWaitTimeByWindow(); // 各业务窗口实时等待情况
            this.getThisWeekHotBusiness(); // 本周热门业务Top5
            this.getThisMonthHotBusiness(); // 本月热门业务Top5
        },
        methods: {
            showAll() {
                window.open('/static/keshihuadaping/realTimeAccept.html')
            },
            getWindowsRealTimeAccept() {
                this.pageLoading = true;
                getWindowsRealTimeAccept().then(response => {
                    if (response.httpCode === 200) {
                        this.list = response.data;
                    } else {
                        this.$message.error('数据加载失败');
                    }
                    this.pageLoading = false;
                })
            },
            getAcceptCount() {
                getAcceptCount().then(response => {
                    if (response.httpCode === 200) {
                        this.acceptCount = response.data.acceptCount;
                        this.currentWait = response.data.currentWait;
                        this.avgWaitTime = response.data.avgWaitTime;
                        this.mailBoxAndPost = response.data.mailBoxAndPost;
                    } else {
                        this.$message.error('数据加载失败');
                    }
                })
            },
            getAdmissibilityAndWaitTimeAtHours() {
                getAdmissibilityAndWaitTimeAtHours().then(response => {
                    if (response.httpCode === 200) {
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
                        const e = echarts.init(document.getElementById('hourAcceptCount'));
                        e.setOption({
                            legend: {
                                data: ['业务量', '等待时长']
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    dataView: {show: true, readOnly: false},
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
                                    type: 'value',
                                    name: '件'
                                },
                                {
                                    type: 'value',
                                    name: '分钟'
                                }
                            ],
                            series: [
                                {
                                    name: '业务量',
                                    type: 'line',
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
                    } else {
                        this.$message.error('数据加载失败')
                    }
                });
            },

            getRealTimeAcceptCountByWindow() {
                getRealTimeAcceptCountByWindow().then(response => {
                    if (response.httpCode === 200) {
                        const handleData = response.data;
                        this.handleWindowName = [];
                        this.handleNum = [];
                        for (let handle of handleData) {
                            this.handleWindowName.push(handle.windowName);
                            this.handleNum.push(handle.total);
                        }
                        const e = echarts.init(document.getElementById('windowHandle'));
                        e.setOption({
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
                                    data: this.handleWindowName
                                }
                            ],
                            dataZoom: [
                                {
                                    show: true,
                                    start: 0,
                                    end: 100
                                },
                                {
                                    type: 'inside',
                                    start: 0,
                                    end: 100
                                },
                                {
                                    show: true,
                                    yAxisIndex: 0,
                                    filterMode: 'empty',
                                    width: 30,
                                    showDataShadow: false,
                                    left: '93%'
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '单位：件'
                                }
                            ],
                            series: [
                                {
                                    name: '受理量',
                                    type: 'bar',
                                    data: this.handleNum,
                                    itemStyle: {
                                        normal: {
                                            color: new echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#83bff6'},
                                                    {offset: 0.5, color: '#188df0'},
                                                    {offset: 1, color: '#188df0'}
                                                ]
                                            )
                                        },
                                        emphasis: {
                                            color: new echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#2378f7'},
                                                    {offset: 0.7, color: '#2378f7'},
                                                    {offset: 1, color: '#83bff6'}
                                                ]
                                            )
                                        }
                                    },
                                    barMaxWidth: '150'
                                }
                            ]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                });
            },
            getRealWaitTimeByWindow() {
                getRealWaitTimeByWindow().then(response => {
                    if (response.httpCode === 200) {
                        const handleData = response.data;
                        this.handleWindowName = [];
                        this.handleNum = [];
                        for (let handle of handleData) {
                            this.handleWindowName.push(handle.windowName);
                            this.handleNum.push(handle.avgtime);
                        }
                        const e = echarts.init(document.getElementById('businessWindowRealTimeWait'));
                        e.setOption({
                            color: ['#3398DB'],
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            yAxis: [
                                {
                                    type: 'category',

                                    data: this.handleWindowName,
                                    axisTick: {
                                        alignWithLabel: true
                                    }
                                }
                            ],
                            xAxis: [
                                {
                                    type: 'value',
                                    position: 'top'
                                }
                            ],
                            series: [
                                {
                                    name: '直接访问',
                                    type: 'bar',
                                    data: this.handleNum,
                                }
                            ]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                });
            },
            getThisWeekHotBusiness() {
                getThisWeekHotBusiness().then(response => {
                    if (response.httpCode === 200) {
                        const list = response.data;
                        this.itemName = [];
                        this.total = [];
                        this.all = 0;
                        for (let i = 0; i < list.length; i++) {
                            this.itemName.push(list[i].itemName);
                            const map = {};
                            map.name = list[i].itemName;
                            map.value = list[i].total;
                            this.all += list[i].total;
                            this.total.push(map);
                        }
                        const e = echarts.init(document.getElementById('weekHotBusinessTop5'));
                        e.setOption({
                            tooltip: {trigger: 'item'},
                            calculable: !0,
                            series: [
                                {
                                    type: 'pie',
                                    radius: '55%',
                                    center: ['50%', '60%'],
                                    data: this.total,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        },
                                        normal: {
                                            label: {
                                                show: true,
                                                formatter: '{b} : {c}个 ({d}%)'
                                            },
                                            labelLine: {show: true}
                                        }
                                    }
                                }
                            ]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getThisMonthHotBusiness() {
                getThisMonthHotBusiness().then(response => {
                    if (response.httpCode === 200) {
                        const list = response.data;
                        this.itemName = [];
                        this.total = [];
                        this.all = 0;
                        for (let i = 0; i < list.length; i++) {
                            this.itemName.push(list[i].itemName);
                            const map = {};
                            map.name = list[i].itemName;
                            map.value = list[i].total;
                            this.all += list[i].total;
                            this.total.push(map);
                        }
                        const e = echarts.init(document.getElementById('monthHotBusinessTop5'));
                        e.setOption({
                            tooltip: {trigger: 'item'},
                            calculable: !0,
                            series: [
                                {
                                    type: 'pie',
                                    radius: '55%',
                                    center: ['50%', '60%'],
                                    data: this.total,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        },
                                        normal: {
                                            label: {
                                                show: true,
                                                formatter: '{b} : {c}个 ({d}%)'
                                            },
                                            labelLine: {show: true}
                                        }
                                    },
                                }
                            ]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .order-line-msg {
        .card-container-msg {
            .sum-msg {
                font-weight: bold;
                font-size: 24px;
                text-align: center;
                padding: 12px 0 12px 0;
            }
            .el-card {
                width: 300px;
                margin-left: 50%;
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
                width: 100%;
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
        .top-center-title {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
        }
        .el-card__body {
            width: 298px;
            height: 238px;
        }
        .el-col-8 {
            width: 27.33333%;
        }
    }

    .className {
        width: 100%;
        height: 540px
    }

    .main-wait-time {
        width: 100%;
        height: 1314px;
    }
</style>