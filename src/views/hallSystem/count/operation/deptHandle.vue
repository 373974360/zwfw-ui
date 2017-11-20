<template>
    <div class="app-container calendar-list-container">
        <div class="row">
            <div class="filter-container">
                <el-select v-model="listQuery.itemIds" class="filter-item" multiple filterable placeholder="选择事项">
                    <el-option :key="item.id" v-for="item in itemList" :label="item.name" :value="item.id">
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
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import {getAllByNameOrbasicCode} from '../../../../api/zwfwSystem/business/item'
    import {dataPlotByDept, dataPlotAvgBydeptId} from '../../../../api/hallSystem/count/count'

    export default {
        name: 'table_demo',
        data() {
            return {
                listQuery: {
                    itemIds: undefined,
                    startDate: moment(new Date()).format('YYYY-MM-DD'),
                    endDate: undefined
                },
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
                    this.itemList = response.data
                })
            },
            doPlot() {
                let query = {};
                if (this.listQuery.itemIds != undefined) {
                    const itemId = this.listQuery.itemIds.toString();
                    query = {
                        startDate: this.listQuery.startDateCategory,
                        endDate: this.listQuery.endDateCategory,
                        itemIds: itemId
                    }
                }
                dataPlotByDept(query).then(response => {
                    console.log('deptHandle:', response);
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
                        yAxis: [
                            {
                                type: 'value',
                                name: '单位：件',
                                nameLocation: 'center',
                                nameRotate: 90
                            }
                        ],
                        series: [
                            {
                                name: '受理量',
                                type: 'bar',
                                data: this.handleNum
                            }
                        ]
                    })
                })
                dataPlotAvgBydeptId(this.listQuery).then(response => {
                    console.log('deptWait:', response)
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
                        yAxis: [
                            {
                                type: 'value',
                                name: '单位：分钟',
                                nameLocation: 'center',
                                nameRotate: 90
                            }
                        ],
                        series: [
                            {
                                name: '等待时长',
                                type: 'bar',
                                data: this.waitNum
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

    .splitBar {
        height: 60px;
    }
</style>