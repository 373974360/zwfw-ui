<template>
    <div class="app-container calendar-list-container">
        <div class="row">
            <div class="filter-container">
                <el-select v-model="checkItemIds" class="filter-item" multiple filterable placeholder="选择事项">
                    <el-option :key="item.id" v-for="item in itemList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="checkDeptIds" class="filter-item" multiple filterable placeholder="选择部门" @change="reloadItemList">
                    <el-option :key="item.id" v-for="item in deptList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="checkWindowIds" class="filter-item" multiple filterable placeholder="选择窗口" @change="reloadItemList">
                    <el-option :key="item.id" v-for="item in windowList" :label="item.name" :value="item.id">
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
    import {date} from '../../../../filters'
    import {getAllByNameOrbasicCode} from '../../../../api/zwfwSystem/business/item'
    import {getAllDept} from '../../../../api/baseSystem/org/dept'
    import {getAllWindow} from '../../../../api/hallSystem/lobby/window';
    import {dataPlotByWindow, dataPlotAvgByWindowId} from '../../../../api/hallSystem/count/count'

    export default {
        name: 'table_demo',
        data() {
            return {
                listQuery: {
                    itemIds: undefined,
                    deptIds: undefined,
                    windowIds: undefined,
                    startDate: undefined,
                    endDate: undefined
                },
                checkItemIds: [],
                checkDeptIds: [],
                checkWindowIds: [],
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
                    if (response.httpCode === 200) {
                        this.deptList = response.data;
                    } else {
                        this.$message.error('部门信息加载失败')
                    }
                })
            },
            getWindowList() {
                getAllWindow().then(response => {
                    if (response.httpCode === 200) {
                        this.windowList = response.data;
                    } else {
                        this.$message.error('窗口信息加载失败')
                    }
                })
            },
            getItemList() {
                this.itemListQuery.itemDepartments = this.checkDeptIds.join();
                this.itemListQuery.itemWindows = this.checkWindowIds.join();
                getAllByNameOrbasicCode(this.itemListQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.itemList = response.data
                    } else {
                        this.$message.error('事项信息加载失败')
                    }
                })
            },
            reloadItemList() {
                this.getItemList();
                this.listQuery.itemIds = [];
            },
            doPlot() {
                this.listQuery.itemIds = this.checkItemIds.join();
                this.listQuery.deptIds = this.checkDeptIds.join();
                this.listQuery.windowIds = this.checkWindowIds.join();
                dataPlotByWindow(this.listQuery).then(response => {
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
                                    name: '单位：件'
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
                    } else {
                        this.$message.error('数据加载失败')
                    }
                });
                dataPlotAvgByWindowId(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
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
                                    name: '单位：分钟'
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
        width: 1614px;
        height: 540px
    }

    .splitBar {
        height: 60px;
    }
</style>