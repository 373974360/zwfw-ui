<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select v-model="listQuery.channel" clearable placeholder="请选择评价渠道" class="filter-item" style="width: 200px">
                <el-option
                        v-for="item in loadEnum('EvaluationChannelEnum')"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code">
                </el-option>
            </el-select>
            <el-select v-model="listQuery.subMatter" clearable placeholder="请选择事项主题" class="filter-item" style="width: 200px">
                <el-option
                        v-for="item in loadEnum('ServiceObjectEnum')"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code">
                </el-option>
            </el-select>
            <el-input clearable placeholder="请输入事项编码" v-model="listQuery.itemCode" style="width: 200px" class="filter-item"></el-input>
            <el-input clearable placeholder="请输入事项名称" v-model="listQuery.itemName" style="width: 200px" class="filter-item"></el-input>
            <el-input clearable placeholder="请输入用户姓名" v-model="listQuery.userName" style="width: 200px" class="filter-item"></el-input>
            <el-date-picker
                    class="filter-item"
                    style="width: 320px"
                    v-model="submitTimeRange"
                    type="datetimerange"
                    align="right"
                    placeholder="选择时间范围"
                    @change="submitTimeRangeChange">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="searchReloadList" class="filter-item">查询</el-button>
            <el-button icon="el-icon-delete" @click="resetSearch" class="filter-item">清空</el-button>
        </div>

        <el-table :data="detailList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange">
            <el-table-column align="center" label="办件编号" prop="processNumber">
                <template slot-scope="scope">
                    <span class="link-type" @click='showDetails(scope.row)'>{{scope.row.processNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="事项名称" prop="itemName"/>
            <el-table-column align="center" label="受理部门" prop="proDepartment"/>
            <el-table-column align="center" label="整体满意度" prop="levelCode">
                <template slot-scope="scope">
                    <!--<el-rate
                        disabled
                        v-model="scope.row.levelCode | levelParseInt"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                        show-text
                        :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                    </el-rate>-->
                    {{scope.row.levelCode | enums('EvaluationLevelEnum')}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="评价时间" prop="submitTime"/>
            <el-table-column prop="reformStatus" label="状态" align="center" width="120">
                <template slot-scope="scope">
                    <el-tag v-if="[0, 12].includes(scope.row.reformStatus)">待整改</el-tag>
                    <el-tag v-if="scope.row.reformStatus === 10">无效差评审核</el-tag>
                    <el-tag v-if="scope.row.reformStatus === 220">无法整改审核</el-tag>
                    <el-tag v-if="[20, 222].includes(scope.row.reformStatus)">整改中</el-tag>
                    <el-tag v-if="scope.row.reformStatus === 11" type="info">无效差评</el-tag>
                    <el-tag v-if="scope.row.reformStatus === 21" type="success">整改完成</el-tag>
                    <el-tag v-if="scope.row.reformStatus === 221" type="info">无法整改</el-tag>
                    <el-tag v-if="checkOverdue(scope.row)" type="danger">整改超期</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.reformStatus === 10" type="primary" @click="btnPoorInvalidAudit(scope.row)">审核</el-button>
                    <el-button v-if="scope.row.reformStatus === 220" type="primary" @click="btnUnchangedAudit(scope.row)">审核</el-button>
                    <el-button v-if="![10, 220].includes(scope.row.reformStatus)" type="primary" @click.stop.safe="showDetails(scope.row)">详情</el-button>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" width="160">
                <template slot-scope="scope">
                    <el-button title="抽查回访记录" type="primary" @click="btnRevisit(scope.row)">抽查回访记录</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                       :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <el-dialog title="评价整改回复" :visible.sync="dialogVisible" width="80%"
                   :close-on-click-modal="closeOnClickModal" @close="closeDetailDialog">
            <table class="mailTable">
                <tr>
                    <td class="column">事项编码</td><td>{{detail.itemCode}}</td>
                    <td class="column">事项名称</td><td>{{detail.itemName}}</td>
                </tr>
                <tr>
                    <td class="column">办件编号</td><td>{{detail.processNumber}}</td>
                    <td class="column">受理部门</td><td>{{detail.proDepartment}}</td>
                </tr>
                <!--<tr>
                    <td class="column">经办人</td><td>{{detail.proManager}}</td>
                    <td class="column">审核状态</td><td>{{detail.status | enums('EvaluationStatusEnum')}}</td>
                </tr>-->
                <tr>
                    <td class="column">办件来源</td><td>{{detail.proSource | enums('EvaluationProSourceEnum')}}</td>
                    <td class="column">评价渠道</td><td>{{detail.channel | enums('EvaluationChannelEnum')}}</td>
                </tr>
                <tr>
                    <!--<td class="column">评价人姓名</td><td>{{(detail.anonymityFlag == 1 || !detail.userName) ? '匿名用户' : detail.userName}}</td>-->
                    <td class="column">评价人姓名</td><td>{{detail.userName}}</td>
                    <td class="column">联系号码</td><td>{{detail.userTel}}</td>
                </tr>
                <tr>
                    <td class="column">整体满意度</td><td>{{detail.levelCode | enums('EvaluationLevelEnum')}}</td>
                    <td class="column">评价时间</td><td>{{detail.submitTime}}</td>
                </tr>
                <tr v-if="detail.content">
                    <td class="column">评价详情</td>
                    <td class="reform" colspan="3">
                        <ul>
                            <li v-for="c in detail.content.split('&')" :key="c">
                                {{c}}
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr v-if="detail.words">
                    <td class="column">文字评价</td>
<!--                    <td class="reform" colspan="3">{{detail.words | convertBlank}}</td>-->
                    <td class="reform" colspan="3">{{detail.words}}</td>
                </tr>
                <tr v-if="recordsList && recordsList.length > 0">
                    <td class="column">操作记录</td>
                    <td colspan="3">
                        <div class="inline-tb-container">
                            <el-table :data="recordsList">
                                <el-table-column align="center" label="操作状态" prop="status" width="160">
                                    <template slot-scope="scope">
                                        {{scope.row.status | enums('EvaluationReformStatusEnum')}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作说明" prop="content" min-width="260"/>
                                <el-table-column align="center" label="整改/延期时间" prop="finishTime" width="160">
                                    <template slot-scope="scope">
                                        {{scope.row.finishTime | date('YYYY-MM-DD')}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作时间" prop="operateTime" width="180">
                                    <template slot-scope="scope">
                                        {{scope.row.operateTime | date('YYYY-MM-DD HH:mm:ss')}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </td>
                </tr>
                <tr v-if="revisitRecordList && revisitRecordList.length > 0">
                    <td class="column">回访记录</td>
                    <td colspan="3">
                        <div class="inline-tb-container">
                            <el-table :data="revisitRecordList">
                                <el-table-column align="center" label="回访内容" prop="content" min-width="260"/>
                                <el-table-column align="center" label="回访时间" prop="operateTime" width="180">
                                    <template slot-scope="scope">
                                        {{scope.row.operateTime | date('YYYY-MM-DD HH:mm:ss')}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </td>
                </tr>
            </table>
            <el-form ref="detailDialogForm" class="small-space" :model="detail" label-position="right"
                     label-width="110px" :rules="detailRules">
                <template v-if="opType !== 999">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="auditLabel" prop="auditStatus">
                                <el-radio-group v-model="detail.auditStatus">
                                    <el-radio :label="1" >同意</el-radio>
                                    <el-radio :label="0" >不同意</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="说明" prop="reformContent">
                                <el-input type="textarea" v-model="detail.reformContent" :maxlength="300"
                                          show-word-limit :autosize="{minRows: 3}"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <template v-else>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="回访内容" prop="reformContent">
                                <el-input type="textarea" v-model="detail.reformContent" :maxlength="300"
                                          show-word-limit :autosize="{minRows: 3}"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="opType === 10" type="primary" @click="doPoorInvalidAudit">确认</el-button>
                <el-button v-if="opType === 220" type="primary" @click="doUnchangedAudit">确认</el-button>
                <el-button v-if="opType === 999" type="primary" @click="doRevisit">确认</el-button>
                <el-button @click="closeDetailDialog">取消</el-button>
            </span>
        </el-dialog>

        <!--详情-->
        <el-dialog title="评价详情" :visible.sync="dialogVisibleDetails" width="80%"
                   :close-on-click-modal="closeOnClickModal" @close="closeDetailDialogDetails">
            <table class="mailTable">
                <tr>
                    <td class="column">事项编码</td><td>{{detail.itemCode}}</td>
                    <td class="column">事项名称</td><td>{{detail.itemName}}</td>
                </tr>
                <tr>
                    <td class="column">办件编号</td><td>{{detail.processNumber}}</td>
                    <td class="column">受理部门</td><td>{{detail.proDepartment}}</td>
                </tr>
                <!--<tr>
                    <td class="column">经办人</td><td>{{detail.proManager}}</td>
                    <td class="column">审核状态</td><td>{{detail.status | enums('EvaluationStatusEnum')}}</td>
                </tr>-->
                <tr>
                    <td class="column">办件来源</td><td>{{detail.proSource | enums('EvaluationProSourceEnum')}}</td>
                    <td class="column">评价渠道</td><td>{{detail.channel | enums('EvaluationChannelEnum')}}</td>
                </tr>
                <tr>
                    <!--<td class="column">评价人姓名</td><td>{{(detail.anonymityFlag == 1 || !detail.userName) ? '匿名用户' : detail.userName}}</td>-->
                    <td class="column">评价人姓名</td><td>{{detail.userName}}</td>
                    <td class="column">联系号码</td><td>{{detail.userTel}}</td>
                </tr>
                <tr>
                    <td class="column">整体满意度</td><td>{{detail.levelCode | enums('EvaluationLevelEnum')}}</td>
                    <td class="column">评价时间</td><td>{{detail.submitTime}}</td>
                </tr>
                <tr v-if="detail.content">
                    <td class="column">评价详情</td>
                    <td class="reform" colspan="3">
                        <ul>
                            <li v-for="c in detail.content.split('&')" :key="c">
                                {{c}}
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr v-if="detail.words">
                    <td class="column">文字评价</td>
<!--                    <td class="reform" colspan="3">{{detail.words | convertBlank}}</td>-->
                    <td class="reform" colspan="3">{{detail.words}}</td>
                </tr>
                <tr v-if="recordsList && recordsList.length > 0">
                    <td class="column">操作记录</td>
                    <td colspan="3">
                        <div class="inline-tb-container">
                            <el-table :data="recordsList">
                                <el-table-column align="center" label="操作状态" prop="status" width="160">
                                    <template slot-scope="scope">
                                        {{scope.row.status | enums('EvaluationReformStatusEnum')}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作说明" prop="content" min-width="260"/>
                                <el-table-column align="center" label="整改/延期时间" prop="finishTime" width="160">
                                    <template slot-scope="scope">
                                        {{scope.row.finishTime | date('YYYY-MM-DD')}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作时间" prop="operateTime" width="180">
                                    <template slot-scope="scope">
                                        {{scope.row.operateTime | date('YYYY-MM-DD HH:mm:ss')}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </td>
                </tr>
                <tr v-if="revisitRecordList && revisitRecordList.length > 0">
                    <td class="column">回访记录</td>
                    <td colspan="3">
                        <div class="inline-tb-container">
                            <el-table :data="revisitRecordList">
                                <el-table-column align="center" label="回访内容" prop="content" min-width="260"/>
                                <el-table-column align="center" label="回访时间" prop="operateTime" width="180">
                                    <template slot-scope="scope">
                                        {{scope.row.operateTime | date('YYYY-MM-DD HH:mm:ss')}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {copyProperties} from 'utils';
    import {
        getReplyDetailList,
        poorInvalidAudit,
        unchangedAudit,
        queryEvaluateRecordList,
        reformRevisit,
    } from '../../../api/hallSystem/evaluate/detail';

    export default {
        name: 'detail',
        filters: {
            levelParseInt: function (value) {
                return parseInt(value);
            }
        },
        data() {
            return {
                levelParseInt: {},
                detailList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    size: this.$store.state.app.rows,
                    channel: undefined,
                    itemCode: undefined,
                    itemName: undefined,
                    subMatter: undefined,
                    proDepartment: undefined,
                    userName: undefined,
                    anonymityFlag: undefined,
                    publicFlag: undefined,
                    evaluationTimeStart: undefined,
                    evaluationTimeEnd: undefined,
                },
                detail: {
                    id: undefined,
                    organizationalCode: undefined,
                    itemCode: undefined,
                    processItemCode: undefined,
                    itemName: undefined,
                    subMatter: undefined,
                    processNumber: undefined,
                    proSource: undefined,
                    proStatus: undefined,
                    proDepartment: undefined,
                    proManager: undefined,
                    channel: undefined,
                    userId: undefined,
                    userName: undefined,
                    userProp: undefined,
                    userTel: undefined,
                    anonymityFlag: undefined,
                    levelCode: undefined,
                    contentCode: undefined,
                    words: undefined,
                    submitTime: undefined,
                    number: undefined,
                    status: undefined,
                    publicFlag: undefined,
                    reformContent: undefined,
                    reformDate: undefined,
                    poorFlag: undefined,
                    reformStatus: undefined,
                    delayFlag: undefined,
                    delayDate: undefined,
                    delayStatus: undefined,
                    auditStatus: undefined,
                    content: ''
                },
                detailRules: {
                    auditStatus: [
                        {required: true, message: '请选择是否同意'}
                    ],
                    reformContent: [
                        {required: true, message: '请输入内容'},
                        {min: 1, max: 300, message: '最多输入300个字符', trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                submitLoading: false,
                departmentList: [],
                submitTimeRange: [],
                dialogVisibleDetails: false,
                recordsList: [],
                auditLabel: '',
                opType: 0,
                revisitRecordList: []
            }
        },
        computed: {
            ...mapGetters([
                'enums',
                'closeOnClickModal',
            ]),
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.channel = undefined;
                this.listQuery.itemCode = undefined;
                this.listQuery.itemName = undefined;
                this.listQuery.subMatter = undefined;
                this.listQuery.proDepartment = undefined;
                this.listQuery.userName = undefined;
                this.listQuery.anonymityFlag = undefined;
                this.listQuery.publicFlag = undefined;
                this.listQuery.evaluationTimeStart = undefined;
                this.listQuery.evaluationTimeEnd = undefined;
                this.submitTimeRange = [];
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.detailList = undefined;
                this.total = undefined;
                getReplyDetailList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.detailList = response.data.records;
                    this.total = response.data.total;
                })
            },
            queryRecordList(detailId) {
                queryEvaluateRecordList(detailId).then(response => {
                    this.recordsList = response.data.recordsList;
                    this.revisitRecordList = response.data.revisitRecordList;
                })
            },
            handleSizeChange(val){
                this.listQuery.size = val;
                this.reloadList();
            },
            handleCurrentChange(val){
                this.listQuery.page = val;
                this.reloadList();
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },
            resetDetail(){
                this.detail = {
                    id: undefined,
                    organizationalCode: undefined,
                    itemCode: undefined,
                    processItemCode: undefined,
                    itemName: undefined,
                    subMatter: undefined,
                    processNumber: undefined,
                    proSource: undefined,
                    proStatus: undefined,
                    proDepartment: undefined,
                    proManager: undefined,
                    channel: undefined,
                    userId: undefined,
                    userName: undefined,
                    userProp: undefined,
                    userTel: undefined,
                    anonymityFlag: undefined,
                    levelCode: undefined,
                    contentCode: undefined,
                    words: undefined,
                    submitTime: undefined,
                    number: undefined,
                    status: undefined,
                    publicFlag: undefined,
                    reformContent: undefined,
                    reformDate: undefined,
                    poorFlag: undefined,
                    reformStatus: undefined,
                    delayFlag: undefined,
                    delayDate: undefined,
                    delayStatus: undefined,
                    content: ''
                }
            },
            closeDetailDialog() {
                this.dialogVisible = false;
                this.resetDetail();
                this.$refs['detailDialogForm'].resetFields();
            },
            loadEnum(name) {
                return this.$store.state.app.enums[name];
            },
            submitTimeRangeChange(submitTimeRange) {
                if (submitTimeRange && submitTimeRange.length > 0) {
                    const timeRange = submitTimeRange.split(' - ');
                    this.listQuery.evaluationTimeStart = timeRange[0];
                    this.listQuery.evaluationTimeEnd = timeRange[1];
                } else {
                    this.listQuery.evaluationTimeStart = undefined;
                    this.listQuery.evaluationTimeEnd = undefined;
                }
            },
            btnPoorInvalidAudit(row) {
                this.detail = copyProperties(this.detail, row);
                this.detail.reformContent = '';
                this.queryRecordList(this.detail.id);
                this.auditLabel = '差评无效审核';
                this.opType = 10;
                this.dialogVisible = true;
            },
            btnUnchangedAudit(row) {
                this.detail = copyProperties(this.detail, row);
                this.detail.reformContent = '';
                this.queryRecordList(this.detail.id);
                this.auditLabel = '无法整改审核';
                this.opType = 220;
                this.dialogVisible = true;
            },
            doPoorInvalidAudit() {
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        poorInvalidAudit(this.detail).then(() => {
                            this.$message.success('提交成功');
                            this.closeDetailDialog();
                            this.submitLoading = false;
                            this.reloadList();
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUnchangedAudit() {
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        unchangedAudit(this.detail).then(() => {
                            this.$message.success('提交成功');
                            this.closeDetailDialog();
                            this.submitLoading = false;
                            this.reloadList();
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            checkOverdue(row) {
                if (![0,12,20,222].includes(row.reformStatus)) {
                    return false;
                }
                if (row.delayStatus === 1) {
                    return new Date(row.delayDate).getTime() < Date.now() - 3600 * 1000 * 24;
                }
                if (row.reformDate) {
                    return new Date(row.reformDate).getTime() < Date.now() - 3600 * 1000 * 24;
                }
                return new Date(row.submitTime).getTime() < Date.now() - 3600 * 1000 * 24 * 16;
            },
            showDetails(row){
                this.detail = copyProperties(this.detail, row);
                this.queryRecordList(this.detail.id);
                this.dialogVisibleDetails = true;
            },
            closeDetailDialogDetails() {
                this.dialogVisibleDetails = false;
                this.resetDetail();
            },
            btnRevisit(row) {
                this.resetDetail();
                this.detail = copyProperties(this.detail, row);
                this.detail.reformContent = '';
                this.opType = 999;
                this.queryRecordList(this.detail.id);
                this.dialogVisible = true;
            },
            doRevisit() {
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        reformRevisit(this.detail).then(() => {
                            this.$message.success('提交成功');
                            this.closeDetailDialog();
                            this.submitLoading = false;
                            this.reloadList();
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>
    @import "../../../assets/css/evaluateReform.css";
</style>

