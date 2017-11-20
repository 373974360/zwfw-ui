<template>
    <div class="app-container calendar-list-container">
        <div class="row">
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
            <div class="className" id="windowHandle"></div>
            <div class="splitBar"></div>
            <div class="className" id="windowWait"></div>
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
    import {getAllDept} from '../../../../api/baseSystem/org/dept'
    import {getAllWindow} from '../../../../api/hallSystem/lobby/window';
    import {dataPlotByWindow, dataPlotAvgByWindowId} from '../../../../api/hallSystem/count/count'

    export default {
        name: 'table_demo',
        data() {
            return {
                listQuery: {
                    itemIds: [],
                    deptIds: [],
                    windowIds: [],
                    startDate: moment(new Date()).format('YYYY-MM-DD'),
                    endDate: undefined
                },
                itemListQuery: {
                    itemDepartments: '',
                    itemWindows: ''
                },
                itemList: [],
                windowList: [],
                deptList: [],
                handleWindowName: [],
                handleNum: [],
                waitWindowName: [],
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
            this.getDeptList();
            this.getWindowList();
            this.getItemList();
            this.doPlot();
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
            doPlot() {
                dataPlotByWindow(this.listQuery).then(response => {
                    console.log('windowHandle:', response);
                    const handleData = response.data;
                    this.handleWindowName = [];
                    this.handleNum = [];
                    for (let handle of handleData) {
                        this.handleWindowName.push(handle.windowName);
                        this.handleNum.push(handle.total);
                    }
                    const e = echarts.init(document.getElementById('windowHandle'));
                    e.setOption({
                        title: {
                            text: '窗口受理量'
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
                                data: this.handleWindowName
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
                dataPlotAvgByWindowId(this.listQuery).then(response => {
                    console.log('windowWait:', response)
                    const waitData = response.data;
                    this.waitWindowName = [];
                    this.waitNum = [];
                    for (let wait of waitData) {
                        this.waitWindowName.push(wait.windowName);
                        this.waitNum.push(wait.avgtime);
                    }
                    const e = echarts.init(document.getElementById('windowWait'));
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
                                data: this.waitWindowName
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