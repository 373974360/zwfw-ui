<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
<!--            <el-select v-model="listQuery.proDepartment" clearable placeholder="请选择受理部门" class="filter-item">
                <el-option
                    v-for="item in departmentList"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code">
                </el-option>
            </el-select>-->
            <el-date-picker
                class="filter-item"
                style="width: 320px"
                v-model="submitTimeRange"
                type="datetimerange"
                align="right"
                placeholder="选择时间范围"
                @change="submitTimeRangeChange">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="doPlot" class="filter-item">查询</el-button>
            <el-button icon="el-icon-delete" @click="resetSearch" class="filter-item">清空</el-button>
            <el-button type="primary" icon="el-icon-download" @click="export2Excel" class="filter-item">数据导出</el-button>
        </div>
        <div class="splitBar"></div>
        <div class="row">
            <div class="filter-container"></div>
            <div class="className">
                <div class="class-item" id="countByLevel"></div>
                <div class="class-item" id="countByChannel"></div>
            </div>
            <div class="className" id="evaluationStatistics"></div>
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
    require('echarts/lib/component/dataZoom');
    import {mapGetters} from 'vuex';
    import { getStatistics } from '../../../api/hallSystem/evaluate/detail';
    import { queryEvaluateCountByLevel, queryEvaluateCountByChannel } from "../../../api/hallSystem/evaluate/count";

    export default {
        name: 'evaluationStatistics',
        data() {
            return {
                detailList: undefined,
                xAxisNames: [],
                userSatisfactionRates: [],
                veryDissatisfiedTotals: [],
                dissatisfiedTotals: [],
                basicSatisfiedTotals: [],
                satisfiedTotals: [],
                verySatisfiedTotals: [],
                satisfactionRates: [],

                listQuery: {
                    /**
                     * 统计类型：
                     * 1. 根据时间段、受理部门统计所有评价数据
                     * 2. 根据时间段统计每一天的评价数据
                     */
                    statisticsType: undefined,

                    proDepartment: undefined,
                    evaluationTimeStart: undefined,
                    evaluationTimeEnd: undefined
                },
                departmentList: [],
                submitTimeRange: [],
                countByLevelList: [],
                channelList: [],
                countByChannelList: [],
                channelMap: {}
            }
        },
        computed: {
            ...mapGetters([
                'enums',
                'closeOnClickModal',
            ])
        },
        created() {
            this.getToday();
            this.doPlot();
        },
        mounted() {
            this.queryCountByLevel().then(() => {
                this.initCountByLevel();
            });
            this.queryCountByChannel().then(() => {
                this.initCountByChannel();
            });
        },
        methods: {
            initChannelMap() {
                const channelEnum = this.$store.state.app.enums['EvaluationChannelEnum'];
                for (let e of channelEnum) {
                    this.channelMap[e.code] = e.value;
                }
            },
            resetSearch() {
                this.listQuery.statisticsType = undefined
                this.listQuery.proDepartment = undefined;
                this.listQuery.evaluationTimeStart = undefined;
                this.listQuery.evaluationTimeEnd = undefined;
                this.submitTimeRange = [];
            },
            submitTimeRangeChange(submitTimeRange) {
                if (submitTimeRange && submitTimeRange.length > 0) {
                    const timeRange = submitTimeRange.split(' - ');
                    this.listQuery.evaluationTimeStart = timeRange[0];
                    this.listQuery.evaluationTimeEnd = timeRange[1];
                } else {
                    this.listQuery.evaluationTimeStart = undefined;
                    this.listQuery.evaluationTimeEnd = undefined;
                }
            },
            queryCountByLevel() {
                return new Promise((resolve, reject) => {
                    queryEvaluateCountByLevel().then(res => {
                        let countByLevelMap = res.data;
                        this.countByLevelList.push({name: '非常满意', value: countByLevelMap['5'] ? countByLevelMap['5'].count : 0});
                        this.countByLevelList.push({name: '满意', value: countByLevelMap['4'] ? countByLevelMap['4'].count : 0});
                        this.countByLevelList.push({name: '基本满意', value: countByLevelMap['3'] ? countByLevelMap['3'].count : 0});
                        this.countByLevelList.push({name: '不满意', value: countByLevelMap['2'] ? countByLevelMap['2'].count : 0});
                        this.countByLevelList.push({name: '非常不满意', value: countByLevelMap['1'] ? countByLevelMap['1'].count : 0});
                        resolve();
                    })
                });
            },
            queryCountByChannel() {
                return new Promise((resolve, reject) => {
                    queryEvaluateCountByChannel().then(res => {
                        this.initChannelMap();
                        for (let countByChannel of res.data) {
                            this.channelList.push(this.channelMap[countByChannel.channel]);
                            this.countByChannelList.push({name: this.channelMap[countByChannel.channel], value: countByChannel.count});
                        }
                        resolve();
                    })
                });
            },
            initCountByLevel() {
                const countByLevelEl = echarts.init(document.getElementById('countByLevel'));
                countByLevelEl.setOption({
                    title : {
                        text: '好差评总体情况',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['非常满意', '满意', '基本满意', '不满意', '非常不满意']
                    },
                    series : [
                        {
                            name: '评价详情',
                            type: 'pie',
                            radius : '50%',
                            center: ['50%', '50%'],
                            data: this.countByLevelList,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            initCountByChannel() {
                const countByChannelEl = echarts.init(document.getElementById('countByChannel'));
                countByChannelEl.setOption({
                    title : {
                        text: '按来源渠道统计评价数据',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: this.channelList
                    },
                    series : [
                        {
                            name: '评价详情',
                            type: 'pie',
                            radius : '50%',
                            center: ['50%', '50%'],
                            data: this.countByChannelList,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            doPlot() {
                if (!this.listQuery.evaluationTimeStart && !this.listQuery.evaluationTimeEnd) {
                    this.$message.error('请选择评价时间');
                    return;
                }
                if (!!this.listQuery.proDepartment) {
                    this.listQuery.statisticsType = "1";
                }
                if (!this.listQuery.proDepartment) {
                    this.listQuery.statisticsType = "2";
                }
                getStatistics(this.listQuery).then(response => {
                    if (response.status === 200) {
                        this.detailList = response.data;
                        this.xAxisNames = [];
                        this.veryDissatisfiedTotals = [];
                        this.dissatisfiedTotals = [];
                        this.basicSatisfiedTotals = [];
                        this.satisfiedTotals = [];
                        this.verySatisfiedTotals = [];
                        this.satisfactionRates = [];
                        for (let detail of this.detailList) {
                            if (this.listQuery.statisticsType == "1") {
                                this.xAxisNames.push(detail.proDepartment);
                            }
                            if (this.listQuery.statisticsType == "2") {
                                this.xAxisNames.push(detail.evaluationTime);
                            }
                            this.veryDissatisfiedTotals.push(detail.veryDissatisfiedTotal ? detail.veryDissatisfiedTotal : 0);
                            this.dissatisfiedTotals.push(detail.dissatisfiedTotal ? detail.dissatisfiedTotal : 0);
                            this.basicSatisfiedTotals.push(detail.basicSatisfiedTotal ? detail.basicSatisfiedTotal : 0);
                            this.satisfiedTotals.push(detail.satisfiedTotal ? detail.satisfiedTotal : 0);
                            this.verySatisfiedTotals.push(detail.verySatisfiedTotal ? detail.verySatisfiedTotal : 0);
                            this.satisfactionRates.push(detail.satisfactionRate ? detail.satisfactionRate : 0);
                        }
                        const e = echarts.init(document.getElementById('evaluationStatistics'));
                        e.setOption({
                            title: {
                                text: '评价汇总统计'
                            },
                            legend: {
                                data: ['非常满意', '满意', '基本满意', '不满意', '非常不满意']
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line'/*, 'bar'*/]},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 45
                                    },
                                    data: this.xAxisNames
                                }
                            ],
/*                            dataZoom: [
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
                                    left: '6%'
                                }
                            ],*/
                            yAxis: [
                                {
                                    type: 'value',
                                    minInterval: 1
                                },
                                {
                                    type: 'value',
                                    min: 0,
                                    max: 100,
                                    interval: 10,
                                    axisLabel: {
                                        formatter: '{value}.00 %'
                                    }
                                }
                            ],
                            series: [
                                {
                                    name: '非常满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.verySatisfiedTotals
                                },
                                {
                                    name: '满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.satisfiedTotals
                                },
                                {
                                    name: '基本满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.basicSatisfiedTotals
                                },
                                {
                                    name: '不满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.dissatisfiedTotals
                                },
                                {
                                    name: '非常不满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.veryDissatisfiedTotals
                                },
                                {
                                    name: '满意率',
                                    type: 'line',
                                    yAxisIndex: 1,
                                    data: this.satisfactionRates
                                }
                            ]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },

            export2Excel() {
                require.ensure([], () => {
                    const Export2excel = require('vendor/Export2excel');

                    if (this.listQuery.statisticsType == "1") {
                        //对应表格输出的title
                        var tHeader = ['受理部门', '非常满意', '满意', '一般', '不满意', "非常不满意", '满意率'];
                        // 对应表格输出的数据
                        var filterVal = ['proDepartment', 'verySatisfiedTotal', 'satisfiedTotal', 'basicSatisfiedTotal',
                            'dissatisfiedTotal', 'veryDissatisfiedTotal', 'satisfactionRate'];
                    }
                    if (this.listQuery.statisticsType == "2") {
                        //对应表格输出的title
                        var tHeader = ['评价日期', '非常满意', '满意', '一般', '不满意', "非常不满意", '满意率'];
                        // 对应表格输出的数据
                        var filterVal = ['evaluationTime', 'verySatisfiedTotal', 'satisfiedTotal', 'basicSatisfiedTotal',
                            'dissatisfiedTotal', 'veryDissatisfiedTotal', 'satisfactionRate'];
                    }

                    const excelData = this.formatJson(filterVal, this.detailList);
                    //对应下载文件的名字
                    Export2excel.export2Excel(tHeader, excelData, '评价汇总统计excel' + new Date().toLocaleDateString().replace(/\//g,'-'));
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            getToday() {
                // yyyy-MM-dd HH:mm:ss
                let endTime = new Date();
                let YYYY = endTime.getFullYear();
                let m = endTime.getMonth() + 1;
                let MM = m < 10 ? ('0' + m) : m;
                let d = endTime.getDate();
                let DD = d < 10 ? ('0' + d) : d;
                // const end = new Date(YYYY, MM, DD, 23, 59, 59);
                const end = YYYY + '-' + MM + '-' + DD + ' ' + '23:59:59';

                let startTime = new Date();
                startTime.setTime(endTime.getTime() - 3600 * 1000 * 24 * 30);

                YYYY = startTime.getFullYear();
                m = startTime.getMonth() + 1;
                MM = m < 10 ? ('0' + m) : m;
                d = startTime.getDate();
                DD = d < 10 ? ('0' + d) : d;
                // const start = new Date(YYYY, MM, DD, 0, 0, 0);
                const start = YYYY + '-' + MM + '-' + DD + ' ' + '00:00:00';

                this.submitTimeRange.push(start);
                this.submitTimeRange.push(end);

                this.submitTimeRangeChange(this.submitTimeRange.join(' - '));
            },
        }
    }
</script>
<style>
    .row {
        margin-right: -15px;
        margin-left: -15px;
    }

    .className {
        width: 100%;
        height: 540px
    }

    .class-item {
        width: 50%;
        height: 540px;
        float: left;
    }

/*    .filter-item {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 10px;
        margin-left: 10px;
    }*/

    .splitBar {
        height: 60px;
    }
</style>
