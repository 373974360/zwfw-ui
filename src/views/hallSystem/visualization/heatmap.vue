<template>
    <div class="container">
        <div class="left-title">
            <div>系统用户分布数据</div>
        </div>
        <div id="heatmap"></div>
    </div>
</template>
<script>

    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/heatmap');
    require('echarts/extension/bmap/bmap');
    import {getAllDateDapingShow, updateAddressToLngLat} from '../../../api/hallSystem/count/count';

    export default {
        name: 'heatmap',
        data() {
            return {
                address: []
            }
        },
        created() {
            this.getAllDateDapingShow();
            // 仅请求一次即可
            this.getAddress();
        },
        methods: {
            getAddress() {
                updateAddressToLngLat().then(response => {
                    if (response.httpCode == 200) {
                        return;
                    }
                })
            },
            getAllDateDapingShow() {
                getAllDateDapingShow().then(response => {
                    if (response.httpCode === 200) {
                        this.address = [];
                        this.address.push(response.data.coordElevaVos);
                        console.log(this.address)
                        var points = [].concat.apply([], this.address.map(function (track) {
                            return track.map(function (seg) {
                                return seg.coord.concat([1]);
                            });
                        }));
                        const e = echarts.init(document.getElementById('heatmap'));
                        e.setOption({
                            animation: false,
                            bmap: {
                                center: [109.071688, 34.372438],
                                zoom: 14,
                                roam: true,
                                mapStyle: {
                                    styleJson: [
                                        // 陆地
                                        {
                                            "featureType": "land",
                                            "elementType": "all",
                                            "stylers": {
                                                "color": "#073763"
                                            }
                                        },
                                        // 水系
                                        {
                                            "featureType": "water",
                                            "elementType": "all",
                                            "stylers": {
                                                "color": "#073763",
                                                "lightness": -54
                                            }
                                        },
                                        // 国道与高速
                                        {
                                            "featureType": "highway",
                                            "elementType": "all",
                                            "stylers": {
                                                "color": "#45818e"
                                            }
                                        },
                                        // 边界线
                                        {
                                            "featureType": "boundary",
                                            "elementType": "all",
                                            "stylers": {
                                                "color": "#ffffff",
                                                "lightness": -62,
                                                "visibility": "on"
                                            }
                                        },
                                        // 行政标注
                                        {
                                            "featureType": "label",
                                            "elementType": "labels.text.fill",
                                            "stylers": {
                                                "color": "#ffffff",
                                                "visibility": "on"
                                            }
                                        },
                                        {
                                            "featureType": "label",
                                            "elementType": "labels.text.stroke",
                                            "stylers": {
                                                "color": "#444444",
                                                "visibility": "on"
                                            }
                                        }
                                    ]
                                }
                            },
                            visualMap: {
                                show: false,
                                top: 'top',
                                min: 0,
                                max: 4,
                                seriesIndex: 0,
                                calculable: true,
                                inRange: {
                                    color: ['red']
                                }
                            },
                            series: [{
                                type: 'heatmap',
                                coordinateSystem: 'bmap',
                                data: points,
                                pointSize: 12,
                                blurSize: 5
                            }],
                            itemStyle: {
                                normal: {
                                    borderWidth: .5,//区域边框宽度
                                    borderColor: 'black',//区域边框颜色
                                    areaColor: "black",//区域颜色
                                },
                                emphasis: {
                                    borderWidth: .5,
                                    borderColor: 'black',
                                    areaColor: "black",
                                }
                            }
                        });
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .left-title {
        width: 10%;
        float: left

    }

    .left-title > div {
        width: 74px;
        margin: 250px auto;
        line-height: 70px;
        font-size: 50px;
    }

    #heatmap {
        width: 90%;
        float: left;
        height: 1000px;
    }

    .container {
        width: 100%;
    }
</style>