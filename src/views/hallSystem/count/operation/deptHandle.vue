<template>
    <div class="app-container calendar-list-container">
        <div class="row">
            <div class="filter-container">
                <el-select v-model="checkItemIds" class="filter-item" multiple filterable placeholder="选择事项">
                    <el-option :key="item.id" v-for="item in itemList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-date-picker style="top: -5px;" v-model="listQuery.startDate" type="datetime" :editable="false"
                                placeholder="开始时间" @change="formatStartDate" :clearable="false" format="yyyy-MM-dd HH:mm">
                </el-date-picker>
                <el-date-picker style="top: -5px;" v-model="listQuery.endDate" type="datetime" :editable="false"
                                placeholder="结束时间" @change="formatEndDate" :clearable="false" format="yyyy-MM-dd HH:mm">
                </el-date-picker>
                <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="统计" placement="top-start">
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="doPlot">
                        统计
                    </el-button>
                </el-tooltip>
            </div>
            <div class="splitBar"></div>
            <div class="className" id="deptHandle"></div>
            <div class="splitBar"></div>
            <div class="className" id="deptWait"></div>
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
    import {date} from '../../../../filters'
    import {getAllByNameOrbasicCode} from '../../../../api/zwfwSystem/business/item'
    import {dataPlotByDept, dataPlotAvgBydeptId} from '../../../../api/hallSystem/count/count'

    export default {
        name: 'table_demo',
        data() {
            return {
                listQuery: {
                    itemIds: undefined,
                    startDate: undefined,
                    endDate: undefined
                },
                checkItemIds: [],
                itemListQuery: {
                    itemDepartments: '',
                    itemWindows: ''
                },
                itemList: [],
                handleDeptName: [],
                handleNum: [],
                waitDeptName: [],
                waitNum: []
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
            this.getItemList();
            this.doPlot();
        },
        methods: {
            getItemList() {
                getAllByNameOrbasicCode(this.itemListQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.itemList = response.data
                    } else {
                        this.$message.error('事项信息加载失败')
                    }
                })
            },
            doPlot() {
                this.listQuery.itemIds = this.checkItemIds.join()
                dataPlotByDept(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        const handleData = response.data;
                        this.handleDeptName = [];
                        this.handleNum = [];
                        for (let handle of handleData) {
                            this.handleDeptName.push(handle.deptName);
                            this.handleNum.push(handle.total);
                        }
                        const e = echarts.init(document.getElementById('deptHandle'));
                        e.setOption({
                            title: {
                                text: '部门受理量'
                            },
                            legend: {
                                data: ['受理量']
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
                                    data: this.handleDeptName
                                }
                            ],
                            dataZoom: [
                                {
                                    show: true,
                                    start: 0,
                                    end: 100,
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
                })
                dataPlotAvgBydeptId(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        const waitData = response.data;
                        this.waitDeptName = [];
                        this.waitNum = [];
                        for (let wait of waitData) {
                            this.waitDeptName.push(wait.deptName);
                            this.waitNum.push(wait.avgtime);
                        }
                        const e = echarts.init(document.getElementById('deptWait'));
                        e.setOption({
                            title: {
                                text: '平均等待时长'
                            },
                            legend: {
                                data: ['等待时长']
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
                                    data: this.waitDeptName
                                }
                            ],
                            dataZoom: [
                                {
                                    show: true,
                                    start: 0,
                                    end: 100,
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
                                    name: '单位：分钟'
                                }
                            ],
                            series: [
                                {
                                    name: '等待时长',
                                    type: 'bar',
                                    data: this.waitNum,
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
                })
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
<style>
    .row {
        margin-right: -15px;
        margin-left: -15px;
    }

    .className {
        width: 100%;
        height: 540px
    }

    .splitBar {
        height: 60px;
    }
</style>