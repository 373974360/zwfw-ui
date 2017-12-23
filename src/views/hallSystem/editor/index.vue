<template>
    <div class="dashboard-editor-container" v-loading="loading">
        <el-row :gutter="8">
            <el-col :span="5">
                <PanThumb :image="avatar"></PanThumb>
            </el-col>
            <el-col :span="6">
                <el-row :gutter="8"></el-row>
                <el-row :gutter="8">
                    <el-col :span="6">
                        <el-tag type="primary">姓名：</el-tag>
                    </el-col>
                    <el-col :span="12">
                        <el-tag type="success">{{name}}</el-tag>
                    </el-col>
                </el-row>
                <el-row :gutter="8">
                    <el-col :span="6">
                        <el-tag type="primary">部门：</el-tag>
                    </el-col>
                    <el-col :span="12">
                        <el-tag type="success">{{deptName}}</el-tag>
                    </el-col>
                </el-row>
                <el-row :gutter="8">
                    <el-col :span="6">
                        <el-tag type="primary">工号：</el-tag>
                    </el-col>
                    <el-col :span="12">
                        <el-tag type="success">{{empNo}}</el-tag>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="6">
                <el-row :gutter="8"></el-row>
                <el-row :gutter="8">
                    <el-col>
                        <router-link class="pan-btn green-btn" to="/receive/windowAccept">快速收件</router-link>
                    </el-col>
                </el-row>
                <el-row :gutter="8">
                    <el-col>
                        <router-link class="pan-btn tiffany-btn" to="/receive/record">收件记录</router-link>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <div class="sum-msg">今日累计抽号排队数：{{todayCount.total}}人次</div>
        <el-row :gutter="50">
            <el-col :span="12">
                <el-card>
                    <div class="card-title">当前等待人数<span>（人）</span></div>
                    <div class="card-value">{{currentWait.total}}</div>
                    <div class="card-detail">同比：{{currentWait.yoy}}%</div>
                    <div class="card-detail">环比：{{currentWait.mom}}%</div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <div class="card-title">平均等待时长<span>（分钟）</span></div>
                    <div class="card-value">{{avgWaitTime.total}}</div>
                    <div class="card-detail">同比：{{avgWaitTime.yoy}}%</div>
                    <div class="card-detail">环比：{{avgWaitTime.mom}}%</div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import PanThumb from 'components/PanThumb';
    import {dataPlotQueueCount} from '../../../api/hallSystem/count/count';

    export default {
        name: 'dashboard-editor',
        components: {PanThumb},
        data() {
            return {
                chart: null,
                list: [],
                todayCount: '',
                currentWait: '',
                avgWaitTime: '',
                loading: true
            }
        },
        computed: {
            ...mapGetters([
                'name',
                'avatar',
                'deptName',
                'empNo',
                'introduction',
                'permissions'
            ])
        },
        methods: {
            plotQueueCount() {
                dataPlotQueueCount().then(response => {
                    this.loading = false;
                    if (response.httpCode === 200) {
                        this.todayCount = response.data.todayCount;
                        this.currentWait = response.data.currentWait;
                        this.avgWaitTime = response.data.avgWaitTime;
                    } else {
                        this.$message.error('数据加载失败');
                    }
                })
            },
        },
        mounted() {
            this.plotQueueCount();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .dashboard-editor-container {
        padding: 30px 50px;
        .el-tag {
            font-size: 14px;
        }
        .el-col {
            line-height: 28px;
        }
        .sum-msg {
            font-weight: bold;
            font-size: 24px;
            text-align: center;
            padding: 15px 0 25px 0;
        }
        .pan-btn{
            padding: 10px 35px;
        }
        .el-card {
            .card-title {
                font-weight: bold;
                font-size: 20px;
                text-align: center;
                padding-bottom: 10px;
                span {
                    font-size: 14px;
                }
            }
            .card-value {
                font-weight: bold;
                font-size: 18px;
                text-align: center;
                padding-bottom: 10px;
            }
            .card-detail {
                font-size: 16px;
                text-align: center;
            }
        }
    }
</style>
