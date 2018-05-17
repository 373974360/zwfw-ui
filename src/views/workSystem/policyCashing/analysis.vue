<template>
    <div class="app-container order-line">
        <div class="chart-container">
            <div class="filter-container">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-select style="width: 100%" v-model="checkItemIds" class="filter-item" multiple filterable placeholder="选择事项">
                            <el-option :key="item.itemId" v-for="item in itemList" :label="item.itemName" :value="item.itemId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-cascader style="width: 100%" :options="cascader" @change="handleChange" placeholder="选择部门"
                                     :show-all-levels="true" expand-trigger="hover" :clearable="true"
                                     :change-on-select="true"></el-cascader>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker  style="width: 100%" v-model="listQuery.startDate" type="datetime"
                                        :editable="false"
                                        placeholder="开始时间" :clearable="false" format="yyyy-MM-dd HH:mm:ss"
                                        @change="formatStartDate">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker  style="width: 100%" v-model="listQuery.endDate" type="datetime" :editable="false"
                                        placeholder="结束时间" :clearable="false" format="yyyy-MM-dd HH:mm:ss"
                                        @change="formatEndDate">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-button class="filter-item" type="primary" v-waves @click="statisticalData">统计
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="className" id="lineWaitTime"></div>
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

    import {date} from '../../../filters'
    import {
        getCategoryTreeByIds
    } from 'api/zwfwSystem/business/category';
    import {
        getAllCategoeyItem
    } from 'api/zwfwSystem/business/categoryItem';
    import {getPolicyNumberByHours} from 'api/workSystem/policyCashing/sumEntry';

    export default {
        name: "analysis",
        data() {
            return {
                listQuery: {
                    itemIds: undefined,
                    startDate: undefined,
                    endDate: undefined,
                    categoryIdChild: undefined,
                    categoryIdFather: undefined
                },
                checkItemIds: [],
                cascader: [],
                itemList: []
            }
        },
        created() {
            this.getItemList();
            this.getOptions();
            this.statisticalData()
        },
        methods: {
            getItemList() {
                getAllCategoeyItem('7508770076364288').then(response => {
                    if (response.httpCode === 200) {
                        this.itemList = response.data
                    } else {
                        this.$message.error('事项信息加载失败')
                    }
                })
            },
            getOptions() {
                getCategoryTreeByIds(true).then(response => {
                    if (response.httpCode === 200) {
                        this.cascader = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            handleChange(value) {
                console.log(value)
                this.listQuery.categoryIdChild = undefined;
                this.listQuery.categoryIdFather = undefined;
                if (value.length > 1) {
                    this.listQuery.categoryIdChild = value[value.length - 1];
                    console.log(this.listQuery.categoryIdChild)
                } else {
                    this.listQuery.categoryIdFather = value[0];
                    console.log(this.listQuery.categoryIdFather);
                }
            },
            formatStartDate() {
                this.listQuery.startDate = date(this.listQuery.startDate, 'YYYY-MM-DD HH:mm:ss')
            },
            formatEndDate() {
                this.listQuery.endDate = date(this.listQuery.endDate, 'YYYY-MM-DD HH:mm:ss')
            },
            statisticalData() {
                this.listQuery.itemIds = this.checkItemIds.join();
                getPolicyNumberByHours(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        const lineWaitData = response.data;
                        this.lineNum = [];
                        this.waitTime = [];
                        this.lineNum.push(
                            lineWaitData.count_hour_8,
                            lineWaitData.count_hour_9,
                            lineWaitData.count_hour_10,
                            lineWaitData.count_hour_11,
                            lineWaitData.count_hour_12,
                            lineWaitData.count_hour_13,
                            lineWaitData.count_hour_14,
                            lineWaitData.count_hour_15,
                            lineWaitData.count_hour_16,
                            lineWaitData.count_hour_17);
                        this.waitTime.push(
                            lineWaitData.sum_hour_8,
                            lineWaitData.sum_hour_9,
                            lineWaitData.sum_hour_10,
                            lineWaitData.sum_hour_11,
                            lineWaitData.sum_hour_12,
                            lineWaitData.sum_hour_13,
                            lineWaitData.sum_hour_14,
                            lineWaitData.sum_hour_15,
                            lineWaitData.sum_hour_16,
                            lineWaitData.sum_hour_17);
                        const e = echarts.init(document.getElementById('lineWaitTime'));
                        e.setOption({
                            legend: {
                                data: ['件数', '金额']
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
                                    data: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '个'
                                },
                                {
                                    type: 'value',
                                    name: 'RMB'
                                }
                            ],
                            series: [
                                {
                                    name: '件数',
                                    type: 'bar',
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
                                    barMaxWidth: '150',
                                    data: this.lineNum
                                },
                                {
                                    name: '金额',
                                    type: 'line',
                                    yAxisIndex: 1,
                                    data: this.waitTime
                                }
                            ]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                });
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .order-line {
        .card-container {
            .sum-msg {
                font-weight: bold;
                font-size: 24px;
                text-align: center;
                padding: 12px 0 12px 0;
            }
            .el-card {
                width: 300px;
                margin-left: 50%;
                .card-title {
                    font-weight: bold;
                    font-size: 20px;
                    text-align: center;
                    padding-bottom: 10px;
                    span {
                        font-size: 14px;
                    }
                }
                .card-value {
                    font-weight: bold;
                    font-size: 18px;
                    text-align: center;
                    padding-bottom: 10px;
                }
                .card-detail {
                    font-size: 16px;
                    text-align: center;
                }
            }
        }

        .chart-container {
            .className {
                width: 100%;
                height: 540px;
            }
        }

        .line-top5 {
            .title {
                font-weight: bold;
                font-size: 20px;
                text-align: center;
            }
        }

        .splitBar {
            height: 60px;
        }
    }
</style>