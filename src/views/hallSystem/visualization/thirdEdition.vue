<template>
    <div class="app-container order-line-msg">

        <div class="top-center-title">
            <h1>第三版数据可视化</h1>
        </div>

        <div class="splitBar"></div>
        <!--窗口业务受理量-->
        <div class="top-center-title"><h3>百度地图</h3></div>
        <baidu-map @ready="mapready" class="map" :center="{lng: 117.269945, lat: 31.86713}" :zoom="14">
            <bml-heatmap ref="heatmapOverlay" :data="address" :max="100" :radius="20" :gradient="{1:'rgb(0, 110, 255)',0:'rgb(100, 0, 255)'}">
            </bml-heatmap>
        </baidu-map>
        <div id="r-result">
            <div id="result"></div>
        </div>
    </div>
</template>
<script>
    import {getAllDateDapingShow} from '../../../api/hallSystem/count/count';
    import {BmlHeatmap} from 'vue-baidu-map'
    import Heatmap from 'bmaplib.heatmap'

    export default {
        name: 'business-approve',
        data() {
            return {
                address: [],
                pointList: {},
                loaded: false,
                adds: []
            }
        },
        components: {
            BmlHeatmap
        },
        created() {


        },
        methods: {
            mapready(params) {
                this.BMap = params.BMap;
                this.map = params.map;
                this.getAllDateDapingShow();
            },
            getAllDateDapingShow() {
                getAllDateDapingShow().then(response => {
                    if (response.httpCode === 200) {
                        // 百度地图API功能
                        this.adds = [
                            "包河区金寨路1号（金寨路与望江西路交叉口）",
                            "庐阳区凤台路209号（凤台路与蒙城北路交叉口）",
                            "蜀山区金寨路217号(近安医附院公交车站)",
                            "蜀山区梅山路10号(近安徽饭店) ",
                            "蜀山区 长丰南路159号铜锣湾广场312室",
                            "合肥市寿春路93号钱柜星乐町KTV（逍遥津公园对面）",
                            "庐阳区长江中路177号",
                            "新站区胜利路89"
                        ];
                        // var map = this.map = new BMap.Map("l-map");
                        // map.centerAndZoom(new BMap.Point(117.269945, 31.86713), 13);
                        // map.enableScrollWheelZoom(true);
                        this.bdGEO();
                        this.loaded = true;

                        console.dir(this.BMap);
                        // let heatmapOverlay = this.heatmapOverlay = new Heatmap({
                        //     "radius": 20,
                        //     "gradient": {1: 'rgb(0, 110, 255)', 0: 'rgb(100, 0, 255)'}
                        // });
                        //
                        // this.map.addOverlay(heatmapOverlay);
                        this.$refs.heatmapOverlay.setDataSet({
                            max: 100,
                            data: this.address
                        });
                    }

                })
            },
            bdGEO() {
                for (let add of this.adds) {
                    this.bdGEO2(add)
                }
            },
            bdGEO2(add) {
                var _this = this;
                // console.dir(this.BMap)
                // console.dir(this.map)
                var myGeo = new this.BMap.Geocoder();
                // console.log(add)
                myGeo.getPoint(add, function (point) {
                    if (point) {
                        //document.getElementById("result").innerHTML += point.lng + "," + point.lat + "</br>";
                        console.log(point);
                        point.count = Math.random()*100;
                        _this.address.push(point);
                    }
                    console.log(_this.address);
                }, "合肥市");
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

    .map {
        width: 100%;
        height: 700px;
    }
</style>