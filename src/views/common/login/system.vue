<template>
    <div class="login">
        <canvas id="canvas"></canvas>
        <div class="system">
            <div class="systemItem" v-if="hasPermission('baseSystem:admin')">
                <wscn-icon-svg icon-class="baseSystem"/>
                <router-link class="pan-btn light-blue-btn" to="/baseSystem/index">基础信息管理系统</router-link>
            </div>
            <div class="systemItem" v-if="hasPermission('hallSystem:admin')">
                <wscn-icon-svg icon-class="hallSystem"/>
                <router-link class="pan-btn light-blue-btn" to="/hallSystem/index">大厅综合管理系统</router-link>
            </div>
            <div class="systemItem" v-if="hasPermission('zwfwSystem:admin')">
                <wscn-icon-svg icon-class="zwfwSystem"/>
                <router-link class="pan-btn light-blue-btn" to="/zwfwSystem/index">政务服务管理系统</router-link>
            </div>
            <div class="systemItem" v-if="hasPermission('workSystem:admin')">
                <wscn-icon-svg icon-class="workSystem"/>
                <router-link class="pan-btn light-blue-btn" to="/workSystem/index">政务业务办理系统</router-link>
            </div>
            <div class="systemItem" v-if="hasPermission('dataShareSystem:admin')">
                <wscn-icon-svg icon-class="dataShareSystem"/>
                <router-link class="pan-btn light-blue-btn" to="/dataShareSystem/index">共享数据管理系统</router-link>
            </div>
        </div>
        <div style="float:right;z-index:2000;margin:20px;"><el-button  @click="logout" class="small">退出登录</el-button></div>


    </div>
</template>

<script>
    import doCanvas from 'utils/canvas';
    import {mapGetters} from 'vuex';
    import ElButton from "element-ui/packages/button/src/button";

    export default {
        components: {ElButton},
        name: 'login',
        data() {
            return {
                currentDate: new Date()
            };
        },
        methods: {
            hasPermission(system){
                if(this.permissions.length > 0){
                    return this.permissions.some(permission => permission.indexOf(system) >= 0);
                }
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    location.reload();// 为了重新实例化vue-router对象 避免bug
                });
            }
        },
        computed: {
            ...mapGetters([
                'permissions',
            ])
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
        .system .wscn-icon{
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
