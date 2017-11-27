<template>
    <div class="app-container calendar-list-container">
        <div class="row">
            <div>
                <span>按部门统计</span>
            </div>
            <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
            <div class="filter-container">
                <el-date-picker style="top: -5px;" v-model="listQuery.startDateCategory" type="date"
                                placeholder="开始时间" @change="changeDateStartCategory" :clearable="false">
                </el-date-picker>
                <el-date-picker style="top: -5px;" v-model="listQuery.endDateCategory" type="date"
                                placeholder="结束时间" @change="changeDateEndCategory" :clearable="false">
                </el-date-picker>
                <el-select v-model="listQuery.categoryIds" class="filter-item" multiple filterable placeholder="选择部门">
                    <el-option :key="item.id" v-for="item in categoryList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="统计" placement="top-start">
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="doCategoryPlot">
                        统计
                    </el-button> 
                </el-tooltip>
            </div>
            <div class="className" id="plotbyCategory"></div>
        </div>
        <div class="row">
            <div>
                <span>按窗口统计</span>
            </div>
            <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
            <div class="filter-container">
                <el-date-picker style="top: -5px;" v-model="listQuery.startDateWindow" type="date"
                                placeholder="开始时间" @change="changeDateStartWindow" :clearable="false">
                </el-date-picker>
                <el-date-picker style="top: -5px;" v-model="listQuery.endDateWindow" type="date"
                                placeholder="结束时间" @change="changeDateEndWindow" :clearable="false">
                </el-date-picker>
                <el-select v-model="listQuery.windowIds" class="filter-item" multiple filterable placeholder="选择窗口">
                    <el-option :key="item.id" v-for="item in windowList" :label="item.name" :value="item.id"/>
                </el-select>
                <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="统计" placement="top-start">
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="doWindowPlot">
                        统计
                    </el-button>
                </el-tooltip>
            </div>
            <div class="className" id="plotbyWindow"></div>
        </div>
        <div class="row">
            <div>
                <span>按用户统计</span>
            </div>
            <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
            <div class="filter-container">
                <el-date-picker style="top: -5px;" v-model="listQuery.startDateUser" type="date"
                                placeholder="开始时间" @change="changeDateStartUser" :clearable="false">
                </el-date-picker>
                <el-date-picker style="top: -5px;" v-model="listQuery.endDateUser" type="date"
                                placeholder="结束时间" @change="changeDateEndUser" :clearable="false">
                </el-date-picker>
                <el-select v-model="listQuery.userIds" class="filter-item" multiple filterable placeholder="选择用户">
                    <el-option :key="item.id" v-for="item in userList" :label="item.name" :value="item.id"/>
                </el-select>
                <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="统计" placement="top-start">
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="doUserPlot">
                        统计
                    </el-button>
                </el-tooltip>
            </div>
            <div class="className" id="plotbyUser"></div>
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
    require('echarts/lib/component/title');
    require('echarts/lib/component/visualMap');
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import {getAllCategory} from 'api/zwfwSystem/business/category';
    import {getAllWindow} from 'api/hallSystem/lobby/window';
    import {plotByCategory, plotByWindow, plotByUser} from 'api/hallSystem/count/dataPlot';
    import {getAllUser} from 'api/baseSystem/org/user';

    export default {
        name: 'table_demo',
        data() {
            return {
                listQuery: {
                    startDateCategory: moment(new Date()).format('YYYY-MM-DD'),
                    endDateCategory: undefined,
                    startDateWindow: moment(new Date()).format('YYYY-MM-DD'),
                    endDateWindow: undefined,
                    startDateUser: moment(new Date()).format('YYYY-MM-DD'),
                    endDateUser: undefined,
                    categoryIds: undefined,
                    windowIds: undefined,
                    userIds: undefined
                },
                clearable_show: false,
                userList: [],
                windowList: [],
                categoryList: [],
                categoryName: [],
                categoryTotal: [],
                windowName: [],
                windowTotal: [],
                userName: [],
                userTotal: [],
                all: 0
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
            this.getCategoryList();
            this.getWindowList();
            this.getUserList();
            this.plotByCategory();
            this.plotByWindow();
            this.plotByUser();
        },
        methods: {
            getCategoryList() {
                getAllCategory().then(response => {
                    if (response.httpCode === 200) {
                        this.categoryList = response.data;
                    } else {
                        this.$message.error('事项分类信息加载失败')
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
            getUserList() {
                getAllUser().then(response => {
                    if (response.httpCode === 200) {
                        this.userList = response.data;
                    } else {
                        this.$message.error('人员信息加载失败')
                    }
                })
            },
            plotByCategory() {
                let query = {};
                if (this.listQuery.categoryIds != undefined) {
                    const categoryId = this.listQuery.categoryIds.toString();
                    query = {
                        startDate: this.listQuery.startDateCategory,
                        endDate: this.listQuery.endDateCategory,
                        categoryIds: categoryId
                    }
                } else {
                    query = {
                        startDate: this.listQuery.startDateCategory,
                        endDate: this.listQuery.endDateCategory,
                        categoryIds: this.listQuery.categoryIds
                    }
                }
                plotByCategory(query).then(response => {
                    if (response.httpCode === 200) {
                        const list = response.data;
                        this.categoryName = [];
                        this.categoryTotal = [];
                        this.all = 0;
                        for (let i = 0; i < list.length; i++) {
                            this.categoryName.push(list[i].categoryName);
                            const map = {};
                            map.name = list[i].categoryName;
                            map.value = list[i].total;
                            this.all += list[i].total;
                            this.categoryTotal.push(map);
                        }
                        const e = echarts.init(document.getElementById('plotbyCategory'));
                        e.setOption({
                            title: {
                                text: '按部门统计叫号数据',
                                subtext: '叫号总计：' + this.all,
                                x: 'center'
                            },
                            tooltip: {trigger: 'item'},
                            legend: {top: 55, orient: 'horizontal', x: 'center', data: this.categoryName},
                            calculable: !0,
                            series: [{
                                name: '叫号统计',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '70%'],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            formatter: '{b} : {c}个 ({d}%)'
                                        },
                                        labelLine: {show: true}
                                    }
                                },
                                data: this.categoryTotal
                            }]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            plotByWindow() {
                let query = {};
                if (this.listQuery.windowIds != undefined) {
                    const windowId = this.listQuery.windowIds.toString();
                    query = {
                        startDate: this.listQuery.startDateWindow,
                        endDate: this.listQuery.endDateWindow,
                        windowIds: windowId
                    }
                } else {
                    query = {
                        startDate: this.listQuery.startDateWindow,
                        endDate: this.listQuery.endDateWindow,
                        windowIds: this.listQuery.windowId
                    }
                }
                plotByWindow(query).then(response => {
                    if (response.httpCode === 200) {
                        const list = response.data;
                        this.windowName = [];
                        this.windowTotal = [];
                        for (let i = 0; i < list.length; i++) {
                            this.windowName.push(list[i].windowName);
                            this.windowTotal.push(list[i].total);
                        }
                        const e = echarts.init(document.getElementById('plotbyWindow'));
                        e.setOption({
                            title: {text: '按窗口统计叫号数据', x: 'center'},
                            tooltip: {trigger: 'axis'},
                            legend: {top: 40, orient: 'horizontal', x: 'center', data: this.windowName},
                            grid: {x: 40, x2: 40, y2: 24},
                            calculable: !0,
                            xAxis: [{type: 'category', data: this.windowName}],
                            yAxis: [{type: 'value'}],
                            series: [{
                                name: '叫号数',
                                type: 'bar',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                data: this.windowTotal
                            }]
                        });
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            plotByUser() {
                let query = {};
                if (this.listQuery.userIds != undefined) {
                    const userId = this.listQuery.userIds.toString();
                    query = {
                        startDate: this.listQuery.startDateUser,
                        endDate: this.listQuery.endDateUser,
                        userIds: userId
                    }
                } else {
                    query = {
                        startDate: this.listQuery.startDateUser,
                        endDate: this.listQuery.endDateUser,
                        windowIds: this.listQuery.userId
                    }
                }
                plotByUser(query).then(response => {
                    if (response.httpCode === 200) {
                        const list = response.data;
                        this.userName = [];
                        this.userTotal = [];
                        for (let i = 0; i < list.length; i++) {
                            this.userName.push(list[i].userName);
                            this.userTotal.push(list[i].total);
                        }
                        const e = echarts.init(document.getElementById('plotbyUser'));
                        e.setOption({
                            title: {text: '按用户统计叫号数据', x: 'center'},
                            tooltip: {trigger: 'axis'},
                            legend: {top: 40, orient: 'horizontal', x: 'center', data: this.userName},
                            grid: {x: 40, x2: 40, y2: 24},
                            calculable: !0,
                            xAxis: [{type: 'category', data: this.userName}],
                            yAxis: [{type: 'value'}],
                            series: [{
                                name: '叫号数',
                                type: 'bar',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                data: this.userTotal
                            }]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            changeDateStartCategory() {
                if (this.listQuery.startDateCategory == null || this.listQuery.startDateCategory == '') {
                    this.listQuery.startDateCategory = [];
                } else {
                    this.listQuery.startDateCategory = moment(this.listQuery.startDateCategory).format('YYYY-MM-DD');
                }
            },
            changeDateEndCategory() {
                if (this.listQuery.endDateCategory == null || this.listQuery.endDateCategory == '') {
                    this.listQuery.endDateCategory = [];
                } else {
                    this.listQuery.endDateCategory = moment(this.listQuery.endDateCategory).format('YYYY-MM-DD');
                }
            },
            changeDateStartWindow() {
                if (this.listQuery.startDateWindow == null || this.listQuery.startDateWindow == '') {
                    this.listQuery.startDateWindow = [];
                } else {
                    this.listQuery.startDateWindow = moment(this.listQuery.startDateWindow).format('YYYY-MM-DD');
                }
            },
            changeDateEndWindow() {
                if (this.listQuery.endDateWindow == null || this.listQuery.endDateWindow == '') {
                    this.listQuery.endDateWindow = [];
                } else {
                    this.listQuery.endDateWindow = moment(this.listQuery.endDateWindow).format('YYYY-MM-DD');
                }
            },
            changeDateStartUser() {
                if (this.listQuery.startDateUser == null || this.listQuery.startDateUser == '') {
                    this.listQuery.startDateUser = [];
                } else {
                    this.listQuery.startDateUser = moment(this.listQuery.startDateUser).format('YYYY-MM-DD');
                }
            },
            changeDateEndUser() {
                if (this.listQuery.endDateUser == null || this.listQuery.endDateUser == '') {
                    this.listQuery.endDateUser = [];
                } else {
                    this.listQuery.endDateUser = moment(this.listQuery.endDateUser).format('YYYY-MM-DD');
                }
            },
            doCategoryPlot() {
                this.plotByCategory();
            },
            doWindowPlot() {
                this.plotByWindow();
            },
            doUserPlot() {
                this.plotByUser()
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