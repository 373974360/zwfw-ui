<template>
    <div class="app-container order-line-msg">

        <el-button type="primary" @click="showAll">全屏</el-button>

        <div class="top-center-title">
            <h1>业务审批数据可视化</h1>
        </div>
        <!--本月预审量、办理中事项、本月办结量-->
        <div class="card-container-msg">
            <el-row>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title-msg">本月预审量</div>
                        <div class="card-value-msg">{{itemAcceptount.pendingTotal}}</div>

                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title-msg">办理中事项</div>
                        <div class="card-value-msg">{{itemAcceptount.handleTotal}}</div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title-msg">本月办结事项</div>
                        <div class="card-value-msg">{{itemAcceptount.finishTotal}}<span></span></div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="splitBar"></div>
        <!--窗口业务受理量-->
        <div class="top-center-title"><h3>窗口业务受理量</h3></div>
        <div class="className" id="windowAcceptHandle"></div>
        <div class="splitBar"></div>
        <!--实施审批进度-->
        <div class="top-center-title"><h3>实施审批进度</h3></div>
        <div style="width: 100%;text-align: center;margin-left: auto;margin-right: auto;">
            <el-table :data="realTimeAcceptList" v-loading.body="realTimeAcceptListLoading" border fit
                      highlight-current-row
                      style="width: 100%">
                <el-table-column prop="processNumber" align="center" label="事项编号" width="">
                    <template slot-scope="scope">
                        <span>{{scope.row.processNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.itemName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="当前状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 15">已办结</span>
                        <span v-if="scope.row.status == 10">办理中</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="当前环节">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 15">已办结</span>
                        <span v-if="scope.row.status == 10">{{scope.row.currentLine}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="预计办结时长">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 15">/</span>
                        <span v-if="scope.row.status == 10">{{scope.row.expectTime}}天</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="splitBar"></div>
        <!--窗口满意度Top10、热门事项正常办结率-->
        <div id="container">
            <el-row style="padding:20px;" :gutter="20">
                <div id="sidebar">
                    <div class="title"><h3>窗口满意度Top10</h3></div>
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-table :data="windowSatisfaction" v-loading.body="windowSatisfactionLoading" border fit
                                      highlight-current-row>
                                <el-table-column align="center" label="窗口">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.windowName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="参评率">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.joincommentRate}}%</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="满意率">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.satisfactionRate}}%</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </div>
                <div id="content">
                    <div class="title"><h3>热门事项正常办结率</h3></div>
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-table :data="topItemFinishRate" v-loading.body="topItemFinishRateLoading" border fit
                                      highlight-current-row>
                                <el-table-column align="center" label="部门">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.deptName}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="业务量">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.total}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="超期率">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.timeOutRate}}%</div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="正常办结率">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.untimeOutRate}}%</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </div>
            </el-row>
        </div>
        <div class="splitBar"></div>
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
        getItemAcceptCount,
        getSatisfactionTop10,
        getTopItemFinishRate,
        dataPlotByWindow,
        getRealTimeApproveSchedule
    } from '../../../api/hallSystem/count/count';


    export default {
        name: 'business-approve',
        data() {
            return {
                topItemFinishRate: [],
                windowSatisfaction: [],
                realTimeAcceptList: [],
                realTimeAcceptListLoading: false,
                windowSatisfactionLoading: false,
                topItemFinishRateLoading: false,
                pageLoading: true,
                total: null,
                itemAcceptount: {
                    pendingTotal: '',
                    handleTotal: '',
                    finishTotal: ''
                }
            }
        },
        created() {
            // 本月预审量、办理中事项、本月办结量
            this.getItemAcceptCount();
            // 实时审批进度
            this.getRealTimeApproveSchedule();
            // 窗口满意度Top10
            this.getSatisfactionTop10();
            // 热门事项正常办结率Top10
            this.getTopItemFinishRate();
            // 窗口业务受理量
            this.dataPlotByWindow();
        },
        methods: {
            showAll() {
                window.open('keshihuadaping/lunbo.html')
            },
            getSatisfactionTop10() {
                this.windowSatisfactionLoading = true;
                getSatisfactionTop10().then(response => {
                    if (response.httpCode === 200) {
                        this.windowSatisfaction = response.data;
                    } else {
                        this.$message.error('数据加载失败');
                    }
                    this.windowSatisfactionLoading = false;
                })
            },
            getTopItemFinishRate() {
                this.topItemFinishRateLoading = true;
                getTopItemFinishRate().then(response => {
                    if (response.httpCode === 200) {
                        this.topItemFinishRate = response.data;
                    } else {
                        this.$message.error('数据加载失败');
                    }
                    this.topItemFinishRateLoading = false;
                })
            },
            getRealTimeApproveSchedule() {
                this.realTimeAcceptListLoading = true;
                getRealTimeApproveSchedule().then(response => {
                    if (response.httpCode === 200) {
                        this.realTimeAcceptList = response.data;
                    } else {
                        this.$message.error('数据加载失败');
                    }
                    this.realTimeAcceptListLoading = false;
                })
            },
            getItemAcceptCount() {
                getItemAcceptCount().then(response => {
                    if (response.httpCode === 200) {
                        this.itemAcceptount = response.data;
                    } else {
                        this.$message.error('数据加载失败');
                    }
                })
            },
            dataPlotByWindow() {
                dataPlotByWindow().then(response => {
                    if (response.httpCode === 200) {
                        const handleData = response.data;
                        this.handleWindowName = [];
                        this.handleNum = [];
                        for (let handle of handleData) {
                            this.handleWindowName.push(handle.windowName);
                            this.handleNum.push(handle.total);
                        }
                        const e = echarts.init(document.getElementById('windowAcceptHandle'));
                        e.setOption({
                            legend: {
                                data: ['窗口受理量']
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
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .order-line-msg {
        .card-container-msg {
            padding-top: 35px;
            .el-card {
                width: 300px;
                margin-left: 50%;
                .card-title-msg {
                    font-weight: bold;
                    font-size: 20px;
                    text-align: center;
                    padding-bottom: 10px;
                    padding-top: 19%;
                    span {
                        font-size: 14px;
                    }
                }
                .card-value-msg {
                    font-weight: bold;
                    font-size: 18px;
                    text-align: center;
                    padding-bottom: 10px;
                }
                .card-detail-msg {
                    font-size: 16px;
                    text-align: center;
                }
            }
            .el-card__body > div {
                top: 50%;
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
            width: 287px;
            height: 238px;
        }
        .el-col-8 {
            width: 27.33333%;
        }
        .el-col-12 {
            width: 95%;
        }
    }

    .className {
        width: 100%;
        height: 540px
    }

    #container {
        margin: 0 auto 20px auto;
        width: 100%;
    }

    #container .title {
        text-align: center;
    }

    #sidebar {
        float: left;
        width: 50%;
        height: 500px;
    }

    #content {
        float: right;
        width: 50%;
        height: 500px;
    }
</style>