<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 180px;" class="filter-item" placeholder="请求方法"
                      v-model="listQuery.notes">
            </el-input>
            <el-select v-model="listQuery.userIds" class="filter-item" multiple filterable placeholder="请求用户">
                <el-option :key="item.id" v-for="item in userList" :label="item.name" :value="item.id"/>
            </el-select>
            <el-date-picker style="top: -5px;" v-model="listQuery.selectDateTime" type="datetimerange"
                            placeholder="选择时间范围" format="yyyy-MM-dd HH:mm:ss" @change="changeDate">
            </el-date-picker>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索用户" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="序号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="请求方法" min-width="140">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="查看详细" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.notes}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="请求URL" min-width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.requestUrl}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="请求IP">
                <template slot-scope="scope">
                    <span>{{scope.row.ip}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="请求用户" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="请求时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="耗时" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.timeBetween}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModal">
            <el-form ref="logForm1" class="small-space" :model="sysLog" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading">
                <el-form-item label="ID">
                    <el-input :value="sysLog.id" :disabled="true"/>
                </el-form-item>
                <el-form-item label="请求方法">
                    <el-input :value="sysLog.notes" :disabled="true"/>
                </el-form-item>
                <el-form-item label="执行类">
                    <el-input :value="sysLog.method" :disabled="true"/>
                </el-form-item>
                <el-form-item label="请求URL">
                    <el-input :value="sysLog.requestUrl" :disabled="true"/>
                </el-form-item>
                <el-form-item label="请求参数">
                    <el-input type="textarea" :rows="4" :value="sysLog.params" :disabled="true"/>
                </el-form-item>
                <el-form-item label="请求IP">
                    <el-input :value="sysLog.ip" :disabled="true"/>
                </el-form-item>
                <el-form-item label="请求用户">
                    <el-input :value="sysLog.userName" :disabled="true"/>
                </el-form-item>
                <el-form-item label="请求时间">
                    <el-input :value="sysLog.createTime | date('YYYY-MM-DD HH:mm:ss')" :disabled="true"/>
                </el-form-item>
                <el-form-item label="耗时">
                    <el-input :value="sysLog.timeBetween" :disabled="true"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogFormVisible = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import {getLogList} from 'api/baseSystem/setting/log';
    import {getAllUser} from 'api/baseSystem/org/user';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    userIds: undefined,
                    notes: undefined,
                    selectDateTime: undefined
                },
                sysLog: {
                    id: '',
                    notes: '',
                    method: '',
                    userId: '',
                    requestUrl: '',
                    params: '',
                    time: '',
                    ip: '',
                    userName: '',
                    createTime: '',
                    timeBetween: '',
                    remark: ''
                },
                userList: [],
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: 'view',
                dialogLoading: false
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        created() {
            this.getList();
            this.getUserList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getLogList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.list = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listLoading = false;
                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.deptId = null;
                this.listQuery.userName = null;
                this.getList();
            },
            handlePageChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            getUserList() {
                getAllUser().then(response => {
                    if (response.httpCode === 200) {
                        this.userList = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            handleUpdate(row) {
                this.resetTemp();
                this.sysLog = copyProperties(this.sysLog, row);
                this.sysLog.password = '';
                this.dialogFormVisible = true;
            },
            resetTemp() {
                this.sysLog = {
                    id: '',
                    notes: '',
                    method: '',
                    userId: '',
                    requestUrl: '',
                    params: '',
                    time: '',
                    ip: '',
                    createTime: '',
                    userName: '',
                    timeBetween: '',
                    remark: ''
                }
            },
            changeDate() {
                if (this.listQuery.selectDateTime[0] == null) {
                    this.listQuery.selectDateTime = [];
                } else {
                    this.listQuery.selectDateTime[0] = moment(this.listQuery.selectDateTime[0]).format("YYYY-MM-DD HH:mm:ss");
                    this.listQuery.selectDateTime[1] = moment(this.listQuery.selectDateTime[1]).format("YYYY-MM-DD HH:mm:ss");
                }
            }
        }
    }
</script>
<style>
    .el-input.is-disabled .el-input__inner {
        color: #1f2d3d;
    }

    .el-textarea.is-disabled .el-textarea__inner {
        color: #1f2d3d;
    }
</style>