<template>
    <div class="app-container calendar-list-container">
        <div class="row">
            <div class="filter-container">
            </div>
            <div class="className" id="staffSatisfaction"></div>
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
    import {getPlotFiveStarByUser} from '../../../../api/hallSystem/count/count'

    export default {
        name: 'table_demo',
        data() {
            return {
                userName: [],
                userOneNum: [],
                userTwoNum: [],
                userThreeNum: [],
                userFourNum: [],
                userFiveNum: [],
                userZeroNum: [],
                userSatisfactionRates: []
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
                getPlotFiveStarByUser().then(response => {
                    const userData = response.data;
                    this.userName = [];
                    this.userOneNum = [];
                    this.userTwoNum = [];
                    this.userThreeNum = [];
                    this.userFourNum = [];
                    this.userFiveNum = [];
                    this.userZeroNum = [];
                    this.userSatisfactionRates = [];
                    for (let user of userData) {
                        this.userName.push(user.userName);
                        this.userOneNum.push(user.onetotal);
                        this.userTwoNum.push(user.twototal);
                        this.userThreeNum.push(user.threetotal);
                        this.userFourNum.push(user.fourtotal);
                        this.userFiveNum.push(user.fivetotal);
                        this.userZeroNum.push(0);
                        this.userSatisfactionRates.push(user.satisfactionRate);
                    }
                    const e = echarts.init(document.getElementById('staffSatisfaction'));
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
                                axisLabel: {
                                    interval: 0,
                                    rotate: 45
                                },
                                data: this.userName
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
                                data: this.userFiveNum
                            },
                            {
                                name: '满意',
                                type: 'bar',
                                stack: '总分',
                                data: this.userFourNum
                            },
                            {
                                name: '一般',
                                type: 'bar',
                                stack: '总分',
                                data: this.userThreeNum
                            },
                            {
                                name: '不满意',
                                type: 'bar',
                                stack: '总分',
                                data: this.userTwoNum
                            },
                            {
                                name: '非常不满意',
                                type: 'bar',
                                stack: '总分',
                                data: this.userOneNum
                            },
                            {
                                name: '未评价',
                                type: 'bar',
                                stack: '总分',
                                data: this.userZeroNum
                            },
                            {
                                name: '满意率',
                                type: 'line',
                                yAxisIndex: 1,
                                data: this.userSatisfactionRates
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
<style>
    .row {
        margin-right: -15px;
        margin-left: -15px;
    }

    .className {
        width: 1614px;
        height: 540px
    }
</style>