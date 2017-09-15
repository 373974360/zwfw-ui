<template>
<div class="ibox">

    <div class="block">
        <span class="demonstration">请选择起止时限</span>
        <el-date-picker
                v-model="value4"
                type="datetimerange"
                :picker-options="pickerOptions2"
                placeholder="选择时间范围"
                align="right">
        </el-date-picker>
    </div>
    <div class="search">
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    fixed
                    prop="date"
                    label="事项名称"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="province"
                    label="联系电话"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="city"
                    label="地址"
                    width="320">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="完成时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="zip"
                    label="状态"
                    width="200">
            </el-table-column>

        </el-table>


    </div>


</div>
</template>

<script>
    export default {
        data() {
            return {
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
                value4: ''
            };
        }
    };

</script>
<style>
    .ibox{
        margin: 50px 50px;
        width: 80%;
    }
.block{
    margin: 50px 550px;
}
.search{

    margin-left: 100px;
    width: 100%;
}

</style>
