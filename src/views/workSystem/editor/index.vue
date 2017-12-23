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
                        <router-link class="pan-btn green-btn" to="/pretrial/pending">快速预审</router-link>
                    </el-col>
                </el-row>
                <el-row :gutter="8">
                    <el-col>
                        <router-link class="pan-btn tiffany-btn" to="/process/workPending">快速审批</router-link>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row></el-row>
        <el-row :gutter="50">
            <el-col :span="12">
                <el-card class="box-card">
                    <el-badge class="item" :value="preTrialTotal">
                        <el-button style="float: right;" type="primary" @click="go('/pretrial/pending')">待预审件</el-button>
                    </el-badge>
                    <div v-for="pretrial in pretrialList" :key="pretrial.id" class="text">
                        {{pretrial.companyName}}
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <el-badge class="item" :value="workTotal">
                        <el-button style="float: right;" type="primary" @click="go('/process/workPending')">待审批件</el-button>
                    </el-badge>
                    <div v-for="work in workList" :key="work.id" class="text">
                        {{work.companyName}}
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import PanThumb from 'components/PanThumb';
    import {getZwfwItemPretrialList} from 'api/hallSystem/window/pretrial/itemPretrial';
    import {getZwfwDeptWorkPendingList} from 'api/workSystem/process/workPending';

    export default {
        name: 'dashboard-editor',
        components: {PanThumb},
        data() {
            return {
                listQuery: {
                    inStatus: 'PENDING',
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    my: true
                },
                pretrialList: null,
                preTrialTotal: 0,
                workList: null,
                workTotal: 0,
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
            getPretrialList() {
                this.loading = true;
                getZwfwItemPretrialList(this.listQuery).then(response => {
                    this.loading = false;
                    if (response.httpCode === 200) {
                        this.pretrialList = response.data.list;
                        this.preTrialTotal = response.data.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getWorkList() {
                this.loading = true;
                getZwfwDeptWorkPendingList(this.listQuery).then(response => {
                    this.loading = false;
                    if (response.httpCode === 200) {
                        this.workList = response.data.list;
                        this.workTotal = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            go(path){
                this.$router.push({path: path})
            }
        },
        mounted() {
            this.getPretrialList();
            this.getWorkList();
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

        .pan-btn {
            padding: 10px 35px;
        }
        .el-card {
            .item{float: right;}
            .text{font-size: 14px;color: #2aabd2;}
        }
        .box-card{min-height: 240px;}
    }
</style>
