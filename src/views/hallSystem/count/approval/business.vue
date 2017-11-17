<template>
    <div class="app-container calendar-list-container">
        <div class="row">
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
    require('echarts/lib/component/title');
    require('echarts/lib/component/visualMap');
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import {dataPlotPendingByPretrial, dataPlotHandleByProcess, dataPlotflagByProcess} from '../../../../api/hallSystem/count/count'

    export default {
        name: 'table_demo',
        data() {
            return {
                listQuery: {
                    startDate: undefined,
                    endDate: undefined
                },
                userName: [],
                userNum: []
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
                dataPlotPendingByPretrial(this.listQuery).then(response => {
                    console.log('userSatisfaction:', response);
                    const userDate = response.data;
                    this.userName = [];
                    this.userNum = [];
                    for (let user of userDate) {
                        this.userName.push(user.userName);
                        this.userNum.push(user.total);
                    }
                    const e = echarts.init(document.getElementById('staffSatisfaction'));
                    e.setOption({
                        title: {
                            text: '部门满意度统计'
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
                                data: this.userName
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '非常满意',
                                type: 'bar',
                                stack: '总分',
                                data: ''
                            },
                            {
                                name: '满意',
                                type: 'bar',
                                stack: '总分',
                                data: ''
                            },
                            {
                                name: '一般',
                                type: 'bar',
                                stack: '总分',
                                data: ''
                            },
                            {
                                name: '不满意',
                                type: 'bar',
                                stack: '总分',
                                data: ''
                            },
                            {
                                name: '非常不满意',
                                type: 'bar',
                                stack: '总分',
                                data: ''
                            },
                            {
                                name: '未评价',
                                type: 'bar',
                                stack: '总分',
                                data: ''
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
        height: 240px
    }
</style>