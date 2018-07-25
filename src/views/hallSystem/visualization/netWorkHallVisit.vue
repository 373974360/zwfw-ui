<template>
    <div class="app-container order-line-msg">
        <div class="top-center-title">
            <h1>网厅访问数据可视化</h1>
        </div>
        <div class="card-container-msg">
            <el-row>
                <el-col :span="13">
                    <el-card>
                        <div class="card-title-msg">今日页面浏览量</div>
                        <div class="card-value-msg">{{baidutongji.todayPVCount}}</div>

                    </el-card>
                </el-col>
                <el-col :span="0">
                    <el-card>
                        <div class="card-title-msg">今日网站访客量</div>
                        <div class="card-value-msg">{{baidutongji.todayUVCount}}</div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="card-container-msg">
            <el-row>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title-msg">注册企业数</div>
                        <div class="card-value-msg">{{registerCount.registerCompanyTotal}}</div>

                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title-msg">实名认证企业数</div>
                        <div class="card-value-msg">{{registerCount.realNameIdentifyTotal}}</div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>
                        <div class="card-title-msg">注册个人数</div>
                        <div class="card-value-msg">{{registerCount.registerPersonTotal}}</div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="splitBar"></div>
        <div class="top-center-title"><h3>实名认证企业量</h3></div>
        <div class="className" ref="realVerifyCountHandle"></div>
        <div class="splitBar"></div>
        <div class="top-center-title"><h3>企业注册量</h3></div>
        <div class="className" ref="companyCountHandle"></div>
        <div class="splitBar"></div>
        <div class="top-center-title"><h3>个人注册量</h3></div>
        <div class="className" ref="personCountHandle"></div>

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

    import {getBaiDuTongJiAndCount} from '../../../api/hallSystem/count/count';
    export default {
        name: 'network-hall-visit',
        data() {
            return {
                companyCountChart: null,
                personCountChart: null,
                realVerifyCountChart: null,
                baidutongji: {
                    todayPVCount: '',
                    todayUVCount: ''
                },
                registerCount: {
                    realNameIdentifyTotal: '',
                    registerCompanyTotal: '',
                    registerPersonTotal: ''

                }
            }
        },
        created() {
            this.getBaiDuTongJiAndCount();
        },
        methods: {
            getBaiDuTongJiAndCount() {
                getBaiDuTongJiAndCount().then(result => {
                    if (result.httpCode == 200) {
                        this.baidutongji = result.data.baidutongji;
                        this.registerCount = result.data.registerCount;
                        if (!$.isEmptyObject(result.data.CompanyData)) {
                            let companyData = result.data.CompanyData;
                            let companyDate = [];
                            let companyCount = [];
                            for (let data of companyData) {
                                companyDate.push(data.date);
                                companyCount.push(data.count);
                            }
                            companyDate.reverse();
                            if (this.companyCountChart == null) {
                                this.companyCountChart = echarts.init(this.$refs.companyCountHandle)
                            }
                            const e = this.companyCountChart;
                            e.setOption({
                                title: {
                                    x: 'center',
                                    y: 'top',
                                    textAlign: 'center',
                                    text: '企业注册量',
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                                color: ['#3398DB'],
                                tooltip: {
                                    trigger: 'axis'
                                },
                                xAxis: [
                                    {
                                        type: 'category',
                                        data: companyDate,
                                        axisLabel: {
                                            show: true,
                                            textStyle: {
                                                color: '#fff'
                                            }
                                        },
                                        splitLine: {
                                            show: false
                                        }
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'value',
                                        name: '单位：人',
                                        axisLabel: {
                                            formatter: '{value}',
                                            textStyle: {
                                                color: '#fff'
                                            }
                                        }
                                    }
                                ],
                                series: [
                                    {
                                        name: '企业注册量',
                                        type: 'bar',
                                        data: companyCount
                                    }
                                ]
                            })
                        }
                        if (!$.isEmptyObject(result.data.PersonData)) {
                            let personData = result.data.PersonData;
                            let personDate = [];
                            let personCount = [];
                            for (let data of personData) {
                                personDate.push(data.date);
                                personCount.push(data.count);
                            }
                            personDate.reverse();
                            if (this.personCountChart == null) {
                                this.personCountChart = echarts.init(this.$refs.personCountHandle)
                            }
                            const e = this.personCountChart;
                            e.setOption({
                                title: {
                                    x: 'center',
                                    y: 'top',
                                    textAlign: 'center',
                                    text: '个人注册量',
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                                color: ['#3398DB'],
                                tooltip: {
                                    trigger: 'axis'
                                },
                                xAxis: [
                                    {
                                        type: 'category',
                                        data: personDate,
                                        axisLabel: {
                                            show: true,
                                            textStyle: {
                                                color: '#fff'
                                            }
                                        },
                                        splitLine: {
                                            show: false
                                        }
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'value',
                                        name: '单位：人',
                                        axisLabel: {
                                            formatter: '{value}',
                                            textStyle: {
                                                color: '#fff'
                                            }
                                        }
                                    }
                                ],
                                series: [
                                    {
                                        name: '个人注册量',
                                        type: 'bar',
                                        data: personCount
                                    }
                                ]
                            })
                        }
                        if (!$.isEmptyObject(result.data.RealVerifyData)) {
                            let realVerifyData = result.data.RealVerifyData;
                            let realVerifyDate = [];
                            let realVerifyCount = [];
                            for (let data of realVerifyData) {
                                realVerifyDate.push(data.date);
                                realVerifyCount.push(data.count);
                            }
                            realVerifyDate.reverse();
                            if (this.realVerifyCountChart == null) {
                                this.realVerifyCountChart = echarts.init(this.$refs.realVerifyCountHandle)
                            }
                            const e = this.realVerifyCountChart;
                            e.setOption({
                                title: {
                                    x: 'center',
                                    y: 'top',
                                    textAlign: 'center',
                                    text: '实名认证量',
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                                color: ['#3398DB'],
                                tooltip: {
                                    trigger: 'axis'
                                },
                                xAxis: [
                                    {
                                        type: 'category',
                                        data: realVerifyDate,
                                        axisLabel: {
                                            show: true,
                                            textStyle: {
                                                color: '#fff'
                                            }
                                        },
                                        splitLine: {
                                            show: false
                                        }
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'value',
                                        name: '单位：人',
                                        axisLabel: {
                                            formatter: '{value}',
                                            textStyle: {
                                                color: '#fff'
                                            }
                                        }
                                    }
                                ],
                                series: [
                                    {
                                        name: '实名认证量',
                                        type: 'bar',
                                        data: realVerifyCount
                                    }
                                ]
                            })
                        }
                    }
                })
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    .order-line-msg {
        .card-container-msg {
            padding-top: 35px;
            .el-card {
                width: 300px;
                margin-left: 50%;
                .card-title-msg {
                    font-weight: bold;
                    font-size: 20px;
                    text-align: center;
                    padding-bottom: 10px;
                    padding-top: 19%;
                    span {
                        font-size: 14px;
                    }
                }
                .card-value-msg {
                    font-weight: bold;
                    font-size: 18px;
                    text-align: center;
                    padding-bottom: 10px;
                }
                .card-detail-msg {
                    font-size: 16px;
                    text-align: center;
                }
            }
            .el-card__body > div {
                top: 50%;
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
        .top-center-title {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
        }
        .el-card__body {
            width: 287px;
            height: 238px;
        }
        .el-col-8 {
            width: 27.33333%;
        }
        .el-col-12 {
            width: 95%;
        }
    }

    .className {
        width: 100%;
        height: 540px
    }
</style>