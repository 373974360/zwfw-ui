<template>
    <div class="login">
        <canvas id="canvas"></canvas>
        <div class="system">
            <div class="systemItem" v-if="hasPermission(0)">
                <wscn-icon-svg icon-class="baseSystem"/>
                <el-button class="pan-btn light-blue-btn" @click="go(0)">基础信息管理系统</el-button>
            </div>
            <div class="systemItem" v-if="hasPermission(1)">
                <wscn-icon-svg icon-class="hallSystem"/>
                <el-button class="pan-btn light-blue-btn" @click="go(1)">大厅综合管理系统</el-button>
            </div>
            <div class="systemItem" v-if="hasPermission(2)">
                <wscn-icon-svg icon-class="zwfwSystem"/>
                <el-button class="pan-btn light-blue-btn" @click="go(2)">政务服务管理系统</el-button>
            </div>
            <div class="systemItem" v-if="hasPermission(3)">
                <wscn-icon-svg icon-class="workSystem"/>
                <el-button class="pan-btn light-blue-btn" @click="go(3)">政务业务办理系统</el-button>
            </div>
            <div class="systemItem" v-if="hasPermission(4)">
                <wscn-icon-svg icon-class="dataShareSystem"/>
                <el-button class="pan-btn light-blue-btn" @click="go(4)">共享数据管理系统</el-button>
            </div>
        </div>
        <div style="float:right;z-index:2000;margin:20px;">
            <el-button @click="logout" class="small">退出登录</el-button>
        </div>


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
                currentDate: new Date(),
                systemList: ['baseSystem','hallSystem','zwfwSystem','workSystem','dataShareSystem']
            };
        },
        methods: {
            hasPermission(system) {
                if (this.permissions.length > 0) {
                    return this.permissions.some(permission => permission.indexOf(this.systemList[system]) >= 0);
                }
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    location.reload();// 为了重新实例化vue-router对象 避免bug
                });
            },
            go(system) {
                this.$router.push({path: this.systemList[system] + '/index'})
            }
        },
        computed: {
            ...mapGetters([
                'permissions',
            ])
        },
        mounted() {
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

    .system {
        width: 55%;
        margin: 0 auto;
        margin-top: 10%;
    }

    .systemItem {
        width: 25%;
        text-align: center;
        margin: 4% 4% 6%;
        float: left;
        display: inline-block;
    }

    .system .wscn-icon {
        width: 6em;
        height: 6em;
        margin-bottom: 1em;
    }

    .pan-btn {
        margin: 0;
        display: inline-block;
        width: 100%;
    }

    }
</style>
