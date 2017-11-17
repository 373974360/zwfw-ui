<template>
    <el-row style="padding:20px;">
        <el-col :span="12">
            <div class="grid-content">
                <el-table :data="windowWaitTopListAsc" v-loading.body="windowWaitTopListLoading" border fit
                          highlight-current-row
                >
                    <el-table-column align="center" label="窗口" width="200">
                        <template scope="scope">
                            <span>{{scope.row.windowName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="所属部门" width="200">
                        <template scope="scope">
                            <span>{{scope.row.deptName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="平均等待时间" width="200">
                        <template scope="scope">
                            <span>{{scope.row.avgtime * 1000 | duration}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="grid-content">
                <el-table :data="windowWaitTopListDesc" v-loading.body="windowWaitTopListLoading" border fit
                          highlight-current-row
                >
                    <el-table-column align="center" label="窗口" width="200">
                        <template scope="scope">
                            <span>{{scope.row.windowName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="所属部门" width="200">
                        <template scope="scope">
                            <span>{{scope.row.deptName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="平均等待时间" width="200">
                        <template scope="scope">
                            <span>{{scope.row.avgtime * 1000 | duration}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="grid-content">
                <el-table :data="itemWaitTopListAsc" v-loading.body="itemWaitTopListLoading" border fit
                          highlight-current-row
                >
                    <el-table-column align="center" label="事项" width="200">
                        <template scope="scope">
                            <div style="height:2em;overflow:hidden">{{scope.row.itemName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="所属部门" width="200">
                        <template scope="scope">
                            <div>{{scope.row.deptName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="平均等待时间" width="200">
                        <template scope="scope">
                            <span>{{scope.row.avgtime * 1000 | duration}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-col>

        <el-col :span="12">
            <div class="grid-content">
                <el-table :data="itemWaitTopListDesc" v-loading.body="itemWaitTopListLoading" border fit
                          highlight-current-row
                >
                    <el-table-column align="center" label="事项" width="200">
                        <template scope="scope">
                            <div style="height:2em;overflow:hidden">{{scope.row.itemName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="所属部门" width="200">
                        <template scope="scope">
                            <div>{{scope.row.deptName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="平均等待时间" width="200">
                        <template scope="scope">
                            <span>{{scope.row.avgtime * 1000 | duration}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-col>
    </el-row>

</template>
<script>
    import {
        dataPlotTopWaitWindow,
        dataPlotTopWaitItem
    } from 'api/hallSystem/count/count';

    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/pie');
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    require('echarts/lib/component/visualMap');
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import {getAllCategory} from 'api/zwfwSystem/business/category';
    import {getAllWindow} from 'api/hallSystem/lobby/window';
    import {plotByCategory, plotByWindow, plotByUser} from 'api/hallSystem/count/dataPlot';
    import {getAllUser} from 'api/baseSystem/org/user';

    export default {
        name: 'orderAndLine',
        data() {
            return {
                windowWaitTopListAsc: [],
                windowWaitTopListDesc: [],
                itemWaitTopListAsc: [],
                itemWaitTopListDesc: [],
                windowWaitTopListLoading: true,
                itemWaitTopListLoading: true,
            }
        },
        methods: {},

        mounted() {
            dataPlotTopWaitWindow({
                startTime: '2016-01-01 00:00:00',
                endTime: '2017-11-01 00:00:00',
                asc: true
            }).then(response => {
                this.windowWaitTopListLoading = false;
                if (response.httpCode === 200) {

                    this.windowWaitTopListAsc = response.data.asc;
                    this.windowWaitTopListDesc = response.data.desc;

                } else {
                    this.$message.error("加载失败");
                }
            });
            dataPlotTopWaitItem({
                startTime: '2016-01-01 00:00:00',
                endTime: '2017-11-01 00:00:00',
                asc: true
            }).then(response => {
                this.itemWaitTopListLoading = false;
                if (response.httpCode === 200) {

                    this.itemWaitTopListAsc = response.data.asc;
                    this.itemWaitTopListDesc = response.data.desc;

                } else {
                    this.$message.error("加载失败");
                }
            });
        }
    }
</script>
