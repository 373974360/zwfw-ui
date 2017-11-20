<template>
    <div class="app-container calendar-list-container business">
        <div class="row">
            <div class="title">业务审批统计分析</div>
            <div class="card-container">
                <el-row>
                    <el-col :span="8">
                        <el-card>
                            <div class="card-title">待审批<span>（件）</span></div>
                            <div class="card-value">{{pending}}</div>
                            <div class="card-detail">同比：{{}}</div>
                            <div class="card-detail">环比：{{}}</div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card>
                            <div class="card-title">办理中<span>（件）</span></div>
                            <div class="card-value">{{handling}}</div>
                            <div class="card-detail">同比：{{}}</div>
                            <div class="card-detail">环比：{{}}</div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card>
                            <div class="card-title">已办结<span>（件）</span></div>
                            <div class="card-value">{{finish}}</div>
                            <div class="card-detail">同比：{{}}</div>
                            <div class="card-detail">环比：{{}}</div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <div class="splitBar"></div>
            <div class="filter-container">
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
            <div class="className" id="handleNum"></div>
            <div class="splitBar"></div>
            <div class="filter-container">
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
            <div class="className" id="handleRate"></div>
        </div>
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
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import {dataPlotPendingByPretrial, dataPlotHandleByProcess, dataPlotFlagByProcess, dataPlotBusinessByProcess} from '../../../../api/hallSystem/count/count'

    export default {
        name: 'table_demo',
        data() {
            return {
                listQuery: {
                    startDate: undefined,
                    endDate: undefined
                },
                pending: undefined,
                handling: undefined,
                finish: undefined,
                closed: undefined,
                deptName: [],
                timeoutNum: [],
                superviedNum: [],
                correctionNum: [],
                deptName2: [],
                businessNum: [],
                timeoutRate: [],
                handledRate: []
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
            this.approvalPlot();
            this.doPlot();
        },
        methods: {
            approvalPlot() {
                dataPlotPendingByPretrial().then(response => {
                    console.log('pending:', response)
                    const pengdingData = response.data[0]
                    this.pending = pengdingData.pendingTotal
                })
                dataPlotHandleByProcess().then(response => {
                    console.log('handle:', response)
                    for (let handleData of response.data) {
                        if (handleData.status == 10) {
                            this.handling = handleData.total
                        } else if (handleData.status == 15) {
                            this.finish = handleData.total
                        } else if (handleData.status == 99) {
                            this.closed = handleData.total
                        }
                    }
                })
            },
            doPlot() {
                dataPlotFlagByProcess(this.listQuery).then(response => {
                    console.log('handleNum:', response);
                    const handleNumData = response.data;
                    this.deptName = [];
                    this.timeoutNum = [];
                    this.superviedNum = [];
                    this.correctionNum = [];
                    for (let handleNum of handleNumData) {
                        this.deptName.push(handleNum.deptName);
                        this.timeoutNum.push(handleNum.timeout);
                        this.superviedNum.push(handleNum.supervied);
                        this.correctionNum.push(handleNum.correction);
                    }
                    const e = echarts.init(document.getElementById('handleNum'));
                    e.setOption({
                        legend: {
                            data: ['超期件', '整改件', '督办件']
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
                                data: this.deptName
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '超期件',
                                type: 'bar',
                                stack: '总分',
                                data: this.timeoutNum
                            },
                            {
                                name: '整改件',
                                type: 'bar',
                                stack: '总分',
                                data: this.correctionNum
                            },
                            {
                                name: '督办件',
                                type: 'bar',
                                stack: '总分',
                                data: this.superviedNum
                            }
                        ]
                    })
                })
                dataPlotBusinessByProcess(this.listQuery).then(response => {
                    console.log('handleRate:', response);
                    const handleRateData = response.data;
                    this.deptName2 = [];
                    this.businessNum = [];
                    this.timeoutRate = [];
                    this.handledRate = [];
                    for (let handleRate of handleRateData) {
                        this.deptName2.push(handleRate.deptName);
                        this.businessNum.push(handleRate.total);
                        this.timeoutRate.push(handleRate.timeOutRate);
                        this.handledRate.push(handleRate.untimeOutRate);
                    }
                    const e = echarts.init(document.getElementById('handleRate'));
                    e.setOption({
                        legend: {
                            data: ['业务量', '超期率', '正常办结率']
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
                                data: this.deptName2
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            },
                            {
                                type: 'value',
                                min: 0,
                                max: 100,
                                interval: 10,
                                axisLabel: {
                                    formatter: '{value} %'
                                }
                            }
                        ],
                        series: [
                            {
                                name: '业务量',
                                type: 'bar',
                                data: this.businessNum
                            },
                            {
                                name: '超期率',
                                type: 'line',
                                yAxisIndex: 1,
                                data: this.timeoutRate
                            },
                            {
                                name: '正常办结率',
                                type: 'line',
                                yAxisIndex: 1,
                                data: this.handledRate
                            }
                        ]
                    })
                })
            },
            changeDateStart() {
                if (this.listQuery.startDate == null || this.listQuery.startDate == '') {
                    this.listQuery.startDate = [];
                } else {
                    this.listQuery.startDate = moment(this.listQuery.startDate).format('YYYY-MM-DD');
                }
            },
            changeDateEnd() {
                if (this.listQuery.endDate == null || this.listQuery.endDate == '') {
                    this.listQuery.endDate = [];
                } else {
                    this.listQuery.endDate = moment(this.listQuery.endDate).format('YYYY-MM-DD');
                }
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    .business {
        .row {
            margin-right: -15px;
            margin-left: -15px;
        }

        .title {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            padding: 12px 0 24px 0;
        }

        .card-container {
            padding: 0 300px 0 300px;
            .el-card {
                width: 300px;
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

        .filter-container {
            padding-left: 100px;
        }

        .className {
            width: 1614px;
            height: 540px;
        }

        .splitBar {
            height: 60px;
        }
    }
</style>