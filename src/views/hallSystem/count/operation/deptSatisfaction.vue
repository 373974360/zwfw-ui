<template>
    <div class="app-container calendar-list-container">
        <div class="row">
            <div class="filter-container">
                <el-radio-group v-model="listQuery.categoryType" @change="doPlot">
                    <el-radio-button label="1">按部门</el-radio-button>
                    <el-radio-button label="2">按窗口</el-radio-button>
                </el-radio-group>
            </div>
            <div class="className" id="deptSatisfaction"></div>
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
    import {dataPlotSatisfactionLevelByDept, dataPlotSatisfactionLevelByWindow} from '../../../../api/hallSystem/count/count'

    export default {
        name: 'table_demo',
        data() {
            return {
                listQuery: {
                    categoryType: '1'
                },
                deptName: [],
                deptOneNum: [],
                deptTwoNum: [],
                deptThreeNum: [],
                deptFourNum: [],
                deptFiveNum: [],
                deptZeroNum: [],
                deptSatisfactionRates: [],
                windowName: [],
                windowOneNum: [],
                windowTwoNum: [],
                windowThreeNum: [],
                windowFourNum: [],
                windowFiveNum: [],
                windowZeroNum: [],
                windowSatisfactionRates: []
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
            this.doPlot();
        },
        methods: {
            doPlot() {
                if (this.listQuery.categoryType == 1) { // 按部门统计
                    dataPlotSatisfactionLevelByDept(this.listQuery).then(response => {
                        if (response.httpCode === 200) {
                            const deptData = response.data;
                            this.deptName = [];
                            this.deptOneNum = [];
                            this.deptTwoNum = [];
                            this.deptThreeNum = [];
                            this.deptFourNum = [];
                            this.deptFiveNum = [];
                            this.deptZeroNum = [];
                            this.deptSatisfactionRates = [];
                            for (let dept of deptData) {
                                this.deptName.push(dept.deptName);
                                this.deptOneNum.push(dept.onetotal);
                                this.deptTwoNum.push(dept.twototal);
                                this.deptThreeNum.push(dept.threetotal);
                                this.deptFourNum.push(dept.fourtotal);
                                this.deptFiveNum.push(dept.fivetotal);
                                this.deptZeroNum.push(0);
                                this.deptSatisfactionRates.push(dept.satisfactionRate);
                            }
                            const e = echarts.init(document.getElementById('deptSatisfaction'));
                            e.setOption({
                                title: {
                                    text: '部门满意度统计'
                                },
                                legend: {
                                    data: ['非常满意', '满意', '一般', '不满意', '非常不满意', '未评价']
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
                                        name: '非常满意',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.deptFiveNum
                                    },
                                    {
                                        name: '满意',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.deptFourNum
                                    },
                                    {
                                        name: '一般',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.deptThreeNum
                                    },
                                    {
                                        name: '不满意',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.deptTwoNum
                                    },
                                    {
                                        name: '非常不满意',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.deptOneNum
                                    },
                                    {
                                        name: '未评价',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.deptZeroNum
                                    },
                                    {
                                        name: '满意率',
                                        type: 'line',
                                        yAxisIndex: 1,
                                        data: this.deptSatisfactionRates
                                    }
                                ]
                            })
                        } else {
                            this.$message.error('数据加载失败')
                        }
                    })
                } else { // 按窗口统计
                    dataPlotSatisfactionLevelByWindow(this.listQuery).then(response => {
                        if (response.httpCode === 200) {
                            const windowData = response.data;
                            this.windowName = [];
                            this.windowOneNum = [];
                            this.windowTwoNum = [];
                            this.windowThreeNum = [];
                            this.windowFourNum = [];
                            this.windowFiveNum = [];
                            this.windowZeroNum = [];
                            this.windowSatisfactionRates = [];
                            for (let window of windowData) {
                                this.windowName.push(window.windowName);
                                this.windowOneNum.push(window.onetotal);
                                this.windowTwoNum.push(window.twototal);
                                this.windowThreeNum.push(window.threetotal);
                                this.windowFourNum.push(window.fourtotal);
                                this.windowFiveNum.push(window.fivetotal);
                                this.windowZeroNum.push(0);
                                this.windowSatisfactionRates.push(window.satisfactionRate);
                            }
                            const e = echarts.init(document.getElementById('deptSatisfaction'));
                            e.setOption({
                                title: {
                                    text: '窗口满意度统计'
                                },
                                legend: {
                                    data: ['非常满意', '满意', '一般', '不满意', '非常不满意', '未评价']
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
                                        data: this.windowName
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
                                        name: '非常满意',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.windowFiveNum
                                    },
                                    {
                                        name: '满意',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.windowFourNum
                                    },
                                    {
                                        name: '一般',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.windowThreeNum
                                    },
                                    {
                                        name: '不满意',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.windowTwoNum
                                    },
                                    {
                                        name: '非常不满意',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.windowOneNum
                                    },
                                    {
                                        name: '未评价',
                                        type: 'bar',
                                        stack: '总分',
                                        data: this.windowZeroNum
                                    },
                                    {
                                        name: '满意率',
                                        type: 'line',
                                        yAxisIndex: 1,
                                        data: this.windowSatisfactionRates
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
</style>