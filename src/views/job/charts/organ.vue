<template>
    <div class="app-container calendar-list-container">
        <table>
            <tr>
                <td><chart :options="gsxzOptions" ref="pie" auto-resize></chart></td>
                <td><chart :options="hyflOptions" ref="pie" auto-resize></chart></td>
            </tr>
            <tr>
                <td><chart :options="xueliOptions" ref="pie" auto-resize></chart></td>
                <td><chart :options="znflOptions" ref="pie" auto-resize></chart></td>
            </tr>
            <tr>
                <td><chart :options="zprsOptions" ref="pie" auto-resize></chart></td>
            </tr>
        </table>
    </div>
</template>
<style>
    table td{padding:20px;}
</style>
<script>
    import {getCharts} from 'api/job/charts/organ';
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
                gsxzData: null,
                gsxzTitle: null,
                gsxzOptions: null,
                xueliData: null,
                xueliTitle: null,
                xueliOptions: null,
                hyflData: null,
                hyflOptions: null,
                znflData: null,
                znflOptions: null,
                zprsData: null,
                zprsOptions: null
            };
        },
        mounted() {
            this.getChart();
        },
        methods: {
            getChart() {
                getCharts().then(response => {
                    this.gsxzData = response.data.gsxz.data;
                    this.gsxzTitle = response.data.gsxz.titleStr;
                    this.xueliData = response.data.xueli.data;
                    this.xueliTitle = response.data.xueli.titleStr;
                    this.hyflData = response.data.hyfl;
                    this.znflData = response.data.znfl;
                    this.zprsData = response.data.zprs;
                    this.initGsxzChart();
                    this.initHyflChart();
                    this.initZnflChart();
                    this.initZprsChart();
                    this.initXueliChart();
                })
            },
            initGsxzChart() {
                this.gsxzOptions = {
                    title: {
                        text: '按公司性质统计公司数量',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: [this.gsxzTitle]
                    },
                    series: [{
                        name: '数量/占比',
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '60%'],
                        data: this.gsxzData,
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
                    title: {
                        text: '按行业分类统计公司数量',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [{
                        name: '数量/占比',
                        type: 'pie',
                        radius: '70%',
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
            initZprsChart() {
                this.zprsOptions = {
                    title: {
                        text: '按按职位分类统计提供岗位数量',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [{
                        name: '数量/占比',
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '60%'],
                        data: this.zprsData,
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
                    title: {
                        text: '按职位分类统计',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [{
                        name: '数量/占比',
                        type: 'pie',
                        radius: '70%',
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
            initXueliChart() {
                this.xueliOptions = {
                    title: {
                        text: '按要求学历统计',
                        x: 'center'
                    },
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
                        name: '数量/占比',
                        type: 'pie',
                        radius: '70%',
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
            }
        }
    }
</script>