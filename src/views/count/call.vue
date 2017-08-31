<template>
    <div class="app-container calendar-list-container">
        <div class="row">
            <div>
                <span>按部门统计</span>
            </div>
            <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
            <div class="filter-container">
                <el-date-picker style="top: -5px;" v-model="listQuery.selectDateTime" type="datetimerange"
                                placeholder="选择时间范围" format="yyyy-MM-dd HH:mm:ss" @change="changeDate">
                </el-date-picker>
                <el-select v-model="listQuery.categorys" class="filter-item" multiple filterable placeholder="选择部门">
                    <el-option :key="item.id" v-for="item in categoryList" :label="item.name" :value="item.id"/>
                </el-select>
                <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="统计" placement="top-start">
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="doCategoryPlot">
                        统计
                    </el-button>
                </el-tooltip>
            </div>
            <div :class="className" :id="id" :style="{height:height,width:width}"></div>
        </div>
        <div class="row">
            <div>
                <span>按窗口统计</span>
            </div>
            <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
            <div class="filter-container">
                <el-date-picker style="top: -5px;" v-model="listQuery.selectDateTime" type="datetimerange"
                                placeholder="选择时间范围" format="yyyy-MM-dd HH:mm:ss" @change="changeDate">
                </el-date-picker>
                <el-select v-model="listQuery.windows" class="filter-item" multiple filterable placeholder="选择窗口">
                    <el-option :key="item.id" v-for="item in windowList" :label="item.name" :value="item.id"/>
                </el-select>
                <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="统计" placement="top-start">
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="doWindowPlot">
                        统计
                    </el-button>
                </el-tooltip>
            </div>
        </div>
        <div class="row">
            <div>
                <span>按用户统计</span>
            </div>
            <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
            <div class="filter-container">
                <el-date-picker style="top: -5px;" v-model="listQuery.selectDateTime" type="datetimerange"
                                placeholder="选择时间范围" format="yyyy-MM-dd HH:mm:ss" @change="changeDate">
                </el-date-picker>
                <el-select v-model="listQuery.users" class="filter-item" multiple filterable placeholder="选择用户">
                    <el-option :key="item.id" v-for="item in userList" :label="item.name" :value="item.id"/>
                </el-select>
                <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="统计" placement="top-start">
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="doUserPlot">
                        统计
                    </el-button>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    require('echarts/lib/component/visualMap');
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import {getAllCategory} from 'api/zwfw/category';
    import {getAllWindow} from 'api/zwfw/window';
    import {getAllUser} from 'api/sys/org/user';

    export default {
        name: 'table_demo',
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            id: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '200px'
            },
            height: {
                type: String,
                default: '200px'
            }
        },
        data() {
            return {
                listQuery: {
                    selectDateTime: undefined,
                    categorys: undefined,
                    windows: undefined,
                    users: undefined
                },
                userList: [],
                windowList: [],
                categoryList: []
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        mounted() {
            this.initBar();
        },
        created() {
            this.getCategoryList();
            this.getWindowList();
            this.getUserList();
        },
        methods: {
            initBar() {
                this.chart = echarts.init(document.getElementById(this.id));
//                const xAxisData = [];
//                const data = [];
//                for (let i = 0; i < 30; i++) {
//                    xAxisData.push(i + '号');
//                    data.push(Math.round(Math.random() * 2 + 3))
//                }
//
//                this.chart.setOption(
//                    {
//                        backgroundColor: '#08263a',
//                        tooltip: {
//                            trigger: 'axis'
//                        },
//                        xAxis: {
//                            show: false,
//                            data: xAxisData
//                        },
//                        visualMap: {
//                            show: false,
//                            min: 0,
//                            max: 50,
//                            dimension: 0,
//                            inRange: {
//                                color: ['#4a657a', '#308e92', '#b1cfa5', '#f5d69f', '#f5898b', '#ef5055']
//                            }
//                        },
//                        yAxis: {
//                            axisLine: {
//                                show: false
//                            },
//                            axisLabel: {
//                                textStyle: {
//                                    color: '#4a657a'
//                                }
//                            },
//                            splitLine: {
//                                show: true,
//                                lineStyle: {
//                                    color: '#08263f'
//                                }
//                            },
//                            axisTick: {}
//                        },
//                        series: [{
//                            type: 'bar',
//                            data,
//                            name: '撸文数',
//                            itemStyle: {
//                                normal: {
//                                    barBorderRadius: 5,
//                                    shadowBlur: 10,
//                                    shadowColor: '#111'
//                                }
//                            },
//                            animationEasing: 'elasticOut',
//                            animationEasingUpdate: 'elasticOut',
//                            animationDelay(idx) {
//                                return idx * 20;
//                            },
//                            animationDelayUpdate(idx) {
//                                return idx * 20;
//                            }
//                        }]
//                    })
            },

            getCategoryList() {
                getAllCategory().then(response => {
                    this.categoryList = response.data;
                })
            },
            getWindowList() {
                getAllWindow().then(response => {
                    this.windowList = response.data;
                })
            },
            getUserList() {
                getAllUser().then(response => {
                    this.userList = response.data;
                })
            },
            changeDate() {
                if (this.listQuery.selectDateTime[0] == null) {
                    this.listQuery.selectDateTime = [];
                } else {
                    this.listQuery.selectDateTime[0] = moment(this.listQuery.selectDateTime[0]).format("YYYY-MM-DD HH:mm:ss");
                    this.listQuery.selectDateTime[1] = moment(this.listQuery.selectDateTime[1]).format("YYYY-MM-DD HH:mm:ss");
                }
            },
            doCategoryPlot(){

            },
            doWindowPlot(){

            },
            doUserPlot(){

            }
        }
    }
</script>
<style>
    .row {
        margin-right: -15px;
        margin-left: -15px;
    }
</style>