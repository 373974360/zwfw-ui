<template>
    <div class="login">
        <canvas id="canvas"></canvas>
        <div class="system">
            <div class="systemItem">
                <wscn-icon-svg icon-class="baseSystem"/>
                <router-link class="pan-btn light-blue-btn" to="/baseSystem">基础信息管理系统</router-link>
            </div>
            <div class="systemItem">
                <wscn-icon-svg icon-class="hallSystem"/>
                <router-link class="pan-btn light-blue-btn" to="/hallSystem">大厅综合管理系统</router-link>
            </div>
            <div class="systemItem">
                <wscn-icon-svg icon-class="zwfwSystem"/>
                <router-link class="pan-btn light-blue-btn" to="/zwfwSystem">政务服务管理系统</router-link>
            </div>
            <div class="systemItem">
                <wscn-icon-svg icon-class="workSystem"/>
                <router-link class="pan-btn light-blue-btn" to="/workSystem">政务业务办理系统</router-link>
            </div>
            <div class="systemItem">
                <wscn-icon-svg icon-class="dataShareSystem"/>
                <router-link class="pan-btn light-blue-btn" to="/dataShareSystem">共享数据管理系统</router-link>
            </div>
        </div>

    </div>
</template>

<script>
    import doCanvas from 'utils/canvas';

    export default {
        name: 'login',
        data() {
            return {
                currentDate: new Date()
            };
        },
        methods: {

        },
        mounted() {
            doCanvas();
            const _this = this;
            window.onresize = function () {
                if(_this.canvas){
                    doCanvas();
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import 'src/styles/mixin.scss';

    canvas {
        position: fixed;
    }

    .login {
        position: fixed;
        display: flex;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #2d3a4b;
        .system{
            width: 55%;
            margin: 0 auto;
            margin-top: 10%;
        }
        .systemItem{
            width: 25%;
            text-align: center;
            margin: 4% 4% 6%;
            float: left;
            display: inline-block;
        }
        .wscn-icon{
            width: 6em;
            height:6em;
            margin-bottom: 1em;
        }
        .pan-btn{
            margin: 0;
            display: inline-block;
            width: 70%;
        }
    }
</style>
