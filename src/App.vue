<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default{
      name: 'APP'
    }
</script>
<style rel="stylesheet/scss" lang="scss"  >
    #app{overflow-x: hidden;}
    td.el-table-column--selection .cell,th.el-table-column--selection .cell{
        text-overflow: clip;
        text-align: center;

        .el-checkbox{
            margin: 0px;
        }
    }
</style>
