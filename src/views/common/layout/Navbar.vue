<template>
    <el-menu class="navbar" mode="horizontal">
        <Hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></Hamburger>
        <levelbar></levelbar>
        <ErrLog v-if="log.length>0" class="errLog-container" :logsList="log"></ErrLog>

        <el-dropdown class="avatar-container1" trigger="click">
            <div class="avatar-wrapper" @click="dataNumberCount">
                抽号信息
                <i class="el-icon-caret-bottom"/>
            </div>
            <el-dropdown-menu class="user-dropdown11" slot="dropdown">
                <el-dropdown-item>
                    当前抽号等待人数：{{ waitItem.total }}
                </el-dropdown-item>
                <el-dropdown-item>
                    当前所叫号：{{ inItem.itemId }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
                <i class="el-icon-caret-bottom"/>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <router-link  class='inlineBlock' to="/">
                    <el-dropdown-item>
                        首页
                    </el-dropdown-item>
                </router-link>
                <router-link  class='inlineBlock' to="/admin/profile">
                    <el-dropdown-item>
                        设置
                    </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </el-menu>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Levelbar from './Levelbar';
    import Hamburger from 'components/Hamburger';
    import ErrLog from 'components/ErrLog';
    import errLogStore from 'store/errLog';
    import { getDataNumberCount } from '../../../api/hallSystem/count/count'

    export default {
      components: {
        Levelbar,
        Hamburger,
        ErrLog
      },
      data() {
        return {
          log: errLogStore.state.errLog,
          waitItem: {
            total: 0
          },
          inItem: {
            itemId: ''
          }
        }
      },
      computed: {
        ...mapGetters([
          'sidebar',
          'name',
          'avatar'
        ])
      },
      methods: {
        toggleSideBar() {
          this.$store.dispatch('ToggleSideBar')
        },
        logout() {
          this.$store.dispatch('LogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        },
        dataNumberCount() {
            getDataNumberCount().then(response=>{
                if(response.data.waitItem!=null && response.data.waitItem.length>0){
                    this.waitItem.total = response.data.waitItem[0].total;
                }
                if(response.data.inItem!=null && response.data.inItem.length>0){
                    this.inItem.itemId = response.data.inItem[0].itemId;
                }
            });
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .user-dropdown11 {
        left: 83%;
        width: 280px;
    }
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top:5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
        .avatar-container1 {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 150px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top:5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>



