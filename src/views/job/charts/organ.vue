<template>
    <div class="app-container calendar-list-container">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="按性别统计" name="activeSex">
                <chart :options="sexOptions" ref="pie" auto-resize></chart>
            </el-tab-pane>
            <el-tab-pane label="按年龄段统计" name="activeAge">
                <chart :options="ageOptions" ref="pie" auto-resize></chart>
            </el-tab-pane>
            <el-tab-pane label="按文化程度统计" name="activeXueli">
                <chart :options="xueliOptions" ref="pie" auto-resize></chart>
            </el-tab-pane>
            <el-tab-pane label="按专业统计" name="activeZhuanye">
                <chart :options="hyflOptions" ref="pie" auto-resize></chart>
            </el-tab-pane>
            <el-tab-pane label="按薪酬要求统计" name="activeXzfw">
                <chart :options="xzfwOptions" ref="pie" auto-resize></chart>
            </el-tab-pane>
            <el-tab-pane label="需求职位" name="activeZhiwei">
                <chart :options="znflOptions" ref="pie" auto-resize></chart>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import {getCharts} from 'api/job/charts/personal';
    import ECharts from 'vue-echarts/components/ECharts.vue'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/polar'
    import 'echarts/lib/component/geo'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/visualMap'
    export default {
        components: {
            chart: ECharts
        },
        name: 'barPercent',
        data() {
            return {
                activeName: 'activeSex',
                sexData: null,
                sexOptions: null,
                ageData: null,
                ageOptions: null,
                znflData: null,
                znflOptions: null,
                hyflData: null,
                hyflOptions: null,
                xueliData: null,
                xueliTitle: null,
                xueliOptions: null,
                xzfwData: null,
                xzfwTitle: null,
                xzfwOptions: null
            };
        },
        mounted() {
            this.getChart();
        },
        methods: {
            getChart() {
                getCharts().then(response => {
                    this.sexData = response.data.sex;
                    this.xueliData = response.data.xueli.data;
                    this.xueliTitle = response.data.xueli.titleStr;
                    this.xzfwData = response.data.xzfw.data;
                    this.xzfwTitle = response.data.xzfw.titleStr;
                    this.znflData = response.data.znfl;
                    this.hyflData = response.data.hyfl;
                    this.ageData = response.data.age;
                    this.initSexChart();
                    this.initXueliChart();
                    this.initXzfwChart();
                    this.initZnflChart();
                    this.initHyflChart();
                    this.initAgeChart();
                })
            },
            initSexChart() {
                this.sexOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['男', '女']
                    },
                    series: [{
                        name: '人数/占比',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: this.sexData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                }
            },
            initAgeChart() {
                this.ageOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [{
                        name: '人数/占比',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: this.ageData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                }
            },
            initZnflChart() {
                this.znflOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [{
                        name: '人数/占比',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: this.znflData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                }
            },
            initHyflChart() {
                this.hyflOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [{
                        name: '人数/占比',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: this.hyflData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                }
            },
            initXueliChart() {
                this.xueliOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: [this.xueliTitle]
                    },
                    series: [{
                        name: '人数/占比',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: this.xueliData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                }
            },
            initXzfwChart() {
                this.xzfwOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: [this.xzfwTitle]
                    },
                    series: [{
                        name: '人数/占比',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: this.xzfwData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                }
            }
        }
    }
</script>