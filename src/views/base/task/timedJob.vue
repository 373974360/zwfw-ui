<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="姓名"
                      v-model="listQuery.name"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleTrigger" type="success"
                       icon="caret-right" :disabled="triggerAble">
                触发
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDisable" type="warning"
                       icon="information" :disabled="invalidAble">
                禁用
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleEnable" type="primary"
                       icon="information" :disabled="enable">
                启用
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleShutdown" type="danger" icon="circle-cross"
                       :disabled="terminationAble">
                终止
            </el-button>
        </div>

        <el-table ref="taskTable" :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="jobName" align="center" label="作业名称">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.jobName}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="shardingTotalCount" align="center" label="作业分片总数">
                <template scope="scope">
                    <span>{{scope.row.shardingTotalCount}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="cron" align="center" label="Cron表达式">
                <template scope="scope">
                    <span>{{scope.row.cron}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="description" align="center" label="作业描述信息">
                <template scope="scope">
                    <span>{{scope.row.description}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" class-name="status-col" label="状态">
                <template scope="scope">
                    <el-tag :type="scope.row.status | taskStatusFilter">
                        {{scope.row.status | dicts('job-status')}}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :inline="true" id="checkboxTable" ref="taskFrom" class="small-space" :model="task"
                     label-position="right"
                     label-width="135px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="taskRules1">
                <el-form-item label="作业名称" prop="jobName" >
                    <el-input v-model="task.jobName" :disabled="true"/>
                </el-form-item>
                <el-form-item label="作业类型" prop="jobType">
                    <el-input v-model="task.jobType" :disabled="true"/>
                </el-form-item>
                <el-form-item label="作业实现类" prop="jobClass" class="fullLine">
                    <el-input v-model="task.jobClass" :disabled="true"/>
                </el-form-item>
                <el-form-item label="Cron表达式" prop="cron">
                    <el-input v-model="task.cron"/>
                </el-form-item>
                <el-form-item label="作业分片总数" prop="shardingTotalCount">
                    <el-input-number v-model="task.shardingTotalCount"/>
                </el-form-item>
                <el-form-item label="自定义参数" prop="jobParameter">
                    <el-input v-model="task.jobParameter"/>
                </el-form-item>
                <el-form-item label="容忍本机与注册中心的时间误差秒数" prop="maxTimeDiffSeconds">
                    <el-input-number v-model="task.maxTimeDiffSeconds" width="500"/>
                </el-form-item>
                <el-form-item label="监听作业端口" prop="monitorPort">
                    <el-input-number v-model="task.monitorPort"/>
                </el-form-item>
                <el-form-item label="作业服务器状态修复周期" prop="reconcileIntervalMinutes">
                    <el-input-number v-model="task.reconcileIntervalMinutes"/>
                </el-form-item>
                <el-form-item label="分片序列号/参数对照表" prop="shardingItemParameters">
                    <el-input v-model="task.shardingItemParameters"/>
                </el-form-item>
                <el-form-item label="监控作业执行时状态" prop="monitorExecution">
                    <el-checkbox v-model="task.monitorExecution"></el-checkbox>
                </el-form-item>
                <el-form-item label="支持自动失效转移" prop="failover">
                    <el-checkbox v-model="task.failover"></el-checkbox>
                </el-form-item>
                <el-form-item label="支持错过重执行" prop="misfire">
                    <el-checkbox v-model="task.misfire"></el-checkbox>
                </el-form-item>
                <el-form-item label="作业分片策略实现类全路径" prop="jobShardingStrategyClass" class="fullLine">
                    <el-input v-model="task.jobShardingStrategyClass"/>
                </el-form-item>
                <el-form-item label="定制异常处理类全路径" prop="digest" class="fullLine">
                    <el-input v-model="task.jobProperties.job_exception_handler"/>
                </el-form-item>
                <el-form-item label="定制线程池全路径" prop="digest" class="fullLine">
                    <el-input v-model="task.jobProperties.executor_service_handler"/>
                </el-form-item>
                <el-form-item label="作业描述信息" prop="description">
                    <el-input v-model="task.description"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogFormVisible = false">取 消</el-button>
                <!--<el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>-->
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import {
        getTaskList,
        getTaskInfo,
        triggerTask,
        enableTask,
        disableTask,
        shutdownTask
    } from 'api/base/task/timeJob';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined
                },
                task: {
                    jobName: '',
                    jobType: '',
                    jobClass: '',
                    cron: '',
                    shardingTotalCount: 0,
                    shardingItemParameters: '',
                    jobParameter: '',
                    monitorExecution: false,
                    streamingProcess: false,
                    maxTimeDiffSeconds: 0,
                    monitorPort: -1,
                    failover: false,
                    misfire: false,
                    jobShardingStrategyClass: '',
                    description: '',
                    jobProperties: '',
                    scriptCommandLine: '',
                    reconcileIntervalMinutes: 0,
                    instanceCount: 0,
                    status: 'success'
                },
                taskRules1: {
                    cron: [
                        {required: true, message: '请输入Cron表达式', trigger: 'blur'}
                    ]
                },
                triggerAble: true,
                terminationAble: true,
                enable: true,
                invalidAble: true,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums'
            ])
        },
        created() {
            this.getList();
        },
        methods: {
            handleSelectionChange(rows) {
                this.selectedRows = rows;
                if (this.selectedRows.length == 1) {
                    switch (this.selectedRows[0].status){
                        case 'OK':
                            this.triggerAble = false;
                            this.invalidAble = false;
                            this.terminationAble = false;
                            this.enable = true;
                            this.statusTags = 'success';
                            break;
                        case 'CRASHED':
                            this.invalidAble = true;
                            this.triggerAble = true;
                            this.terminationAble = true;
                            this.enable = true;
                            this.statusTags = 'warning';
                            break;
                        case 'DISABLED':
                            this.invalidAble = true;
                            this.triggerAble = true;
                            this.terminationAble = false;
                            this.enable = false;
                            this.statusTags = 'error';
                            break;
                        case 'SHARDING_FLAG':
                            this.invalidAble = true;
                            this.triggerAble = true;
                            this.terminationAble = true;
                            this.enable = true;
                            this.statusTags = 'warning';
                            break;
                    }
                } else {
                    this.triggerAble = true;
                    this.terminationAble = true;
                    this.invalidAble = true;
                }
            },
            toggleSelection(row) {
                this.$refs.taskTable.toggleRowSelection(row);
            },
            getList() {
                this.listLoading = true;
                getTaskList(this.listQuery).then(response => {
                    this.list = response.data;
                    this.listLoading = false;
                })
            },
            handleTrigger() {
                this.listLoading = true;
                let jobName = this.selectedRows[0].jobName;
                triggerTask(jobName).then(response => {
                    if (response.data) {
                        this.$message.success('触发成功');
                        this.getList();
                    } else {
                        this.$message.error('触发失败');
                        this.getList();
                    }
                    this.listLoading = false;
                })
            },
            handleEnable() {
                this.listLoading = true;
                let jobName = this.selectedRows[0].jobName;
                enableTask(jobName).then(response => {
                    if (response.data) {
                        this.$message.success('启用成功');
                        this.getList();
                    } else {
                        this.$message.error('启用失败');
                        this.getList();
                    }
                    this.listLoading = false;
                })
            },
            handleDisable() {
                this.listLoading = true;
                let jobName = this.selectedRows[0].jobName;
                disableTask(jobName).then(response => {
                    if (response.data) {
                        this.$message.success('禁用成功');
                        this.getList();
                    } else {
                        this.$message.error('禁用失败');
                        this.getList();
                    }
                    this.listLoading = false;
                })
            },
            handleShutdown() {
                this.$confirm('此操作将终止该任务, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let jobName = this.selectedRows[0].jobName;
                    shutdownTask(jobName).then(response => {
                        if (response.data) {
                            this.$message.success('终止成功');
                            this.getList();
                        } else {
                            this.$message.error('终止失败');
                            this.getList();
                        }
                        this.listLoading = false;
                    })
                }).catch(() => {
                    console.dir('取消');
                });
            },
            handleUpdate(row) {
                this.listLoading = true;
                getTaskInfo(row.jobName).then(response => {
                    this.currentRow = response.data;
                    this.resetTemp();
                    this.task = copyProperties(this.task, this.currentRow);
                    this.dialogStatus = 'update';
                    this.listLoading = false;
                    this.dialogFormVisible = true;
                })
            },
            update() {
                this.$refs['taskFrom'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        this.task.sysDeptVo = {};
                        updateTask(this.task).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            resetTemp() {
                this.task = {
                    jobName: '',
                    jobType: '',
                    jobClass: '',
                    cron: '',
                    shardingTotalCount: 0,
                    shardingItemParameters: '',
                    jobParameter: '',
                    monitorExecution: false,
                    streamingProcess: false,
                    maxTimeDiffSeconds: 0,
                    monitorPort: -1,
                    failover: false,
                    misfire: false,
                    jobShardingStrategyClass: '',
                    description: '',
                    jobProperties: '',
                    scriptCommandLine: '',
                    reconcileIntervalMinutes: 0,
                    instanceCount: 0,
                    status: ''
                };
            }
        }
    }
</script>
<style scoped>
    .el-input-number{width:215px;}
    .el-form-item__content{width:215px;}
    .fullLine{width:100%;}
    .fullLine .el-form-item__content{width:79.4%;}
</style>
