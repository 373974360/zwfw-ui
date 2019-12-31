<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select v-model="listQuery.levelCode" clearable placeholder="请选择评价等级" class="filter-item">
                <el-option
                    v-for="item in loadEnum('EvaluationLevelEnum')"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code">
                </el-option>
            </el-select>
            <el-select v-model="listQuery.channel" clearable placeholder="请选择评价渠道" class="filter-item">
                <el-option
                    v-for="item in loadEnum('EvaluationChannelEnum')"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code">
                </el-option>
            </el-select>
            <el-select v-model="listQuery.subMatter" clearable placeholder="请选择事项主题" class="filter-item">
                <el-option
                    v-for="item in loadEnum('ServiceObjectEnum')"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code">
                </el-option>
            </el-select>
            <el-input clearable placeholder="请输入事项编码" v-model="listQuery.itemCode" style="width: 187px" class="filter-item"></el-input>
            <el-input clearable placeholder="请输入事项名称" v-model="listQuery.itemName" style="width: 187px" class="filter-item"></el-input>
            <el-input clearable placeholder=请输入用户姓名" v-model="listQuery.userName" style="width: 187px" class="filter-item"></el-input>
            <el-date-picker
                class="filter-item"
                style="width: 384px"
                v-model="submitTimeRange"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                align="right"
                start-placeholder="评价时间开始"
                end-placeholder="评价时间结束"
                :default-time="['00:00:00', '23:59:59']"
                @change="submitTimeRangeChange">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="searchReloadList" class="filter-item">查询</el-button>
            <el-button icon="el-icon-delete" @click="resetSearch" class="filter-item">清空</el-button>
        </div>
        <el-table :data="detailList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange">
            <el-table-column align="center" label="事项名称" prop="itemName"/>
            <el-table-column align="center" label="受理部门" prop="proDepartment"/>
            <el-table-column align="center" label="整体满意度" prop="levelCode">
                <template slot-scope="scope">
                    <el-rate
                        disabled
                        v-model="scope.row.levelCode | levelParseInt"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                        show-text
                        :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                    </el-rate>
                </template>
            </el-table-column>
            <el-table-column align="center" label="评价人姓名" prop="userName"/>
            <el-table-column align="center" label="评价时间" prop="submitTime"/>
            <el-table-column prop="enable" class-name="status-col" label="操作" align="center" width="100">
                <template slot-scope="scope">
                    <el-button type="primary" @click.stop.safe="showDetails(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                       :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!--详情-->
        <el-dialog title="评价详情" :visible.sync="dialogVisibleDetails" width="60%"
                   :close-on-click-modal="closeOnClickModal" @close="closeDetailDialogDetails">
            <table class="mailTable">
                <tr>
                    <td class="column">事项编码</td>
                    <td>{{detail.itemCode}}</td>
                    <td class="column">事项名称</td>
                    <td>{{detail.itemName}}</td>
                </tr>
                <tr>
                    <td class="column">办件编号</td>
                    <td>{{detail.processNumber}}</td>
                    <td class="column">受理部门</td>
                    <td>{{detail.proDepartment}}</td>
                </tr>
<!--                    <tr>
                    <td class="column">经办人</td>
                    <td>{{detail.proManager}}</td>
                    <td class="column">审核状态</td>
                    <td>{{detail.status | enums('EvaluationStatusEnum')}}</td>
                </tr>-->
<!--                    <tr>
                    <td class="column">是否匿名</td>
                    <td>{{detail.anonymityFlag | enums('EvaluationAnonymityEnum')}}</td>
                    <td class="column">是否公开</td>
                    <td>{{detail.publicFlag | enums('EvaluationPublicEnum')}}</td>
                </tr>-->
                <tr>
                    <td class="column">办件来源</td>
                    <td>{{detail.proSource | enums('EvaluationProSourceEnum')}}</td>
                    <td class="column">评价渠道</td>
                    <td>{{detail.channel | enums('EvaluationChannelEnum')}}</td>
                </tr>
                <tr>
                    <td class="column">评价人姓名</td><td>{{detail.userName}}</td>
                    <td class="column">联系号码</td><td>{{detail.userTel}}</td>
                </tr>
                <tr>
                    <td class="column">整体满意度</td>
                    <td>
                        <!--<el-rate
                            disabled
                            v-model="detail.levelCode | levelParseInt"
                            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                            show-text
                            :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                        </el-rate>-->
                        {{detail.levelCode | enums('EvaluationLevelEnum')}}
                    </td>
                    <td class="column">评价时间</td><td>{{detail.submitTime}}</td>
                </tr>
                <tr v-if="detail.content">
                    <td class="column">评价详情</td>
                    <td class="reform" colspan="3">
                        <ul>
                            <li v-for="c in detail.content.split('&')">
                                {{c}}
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr v-if="detail.words">
                    <td class="column">文字评价</td>
                    <td class="reform" colspan="3">{{detail.words | convertBlank}}</td>
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
    import {getStore} from '@/util/store';
    import {
        getDetailList,
        queryEvaluateRecordList
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
                    levelCode: undefined,
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
                },
                selectedRows: [],
                dialogTitle: undefined,
                submitLoading: false,
                departmentList: [],
                submitTimeRange: [],
                levelParseInt: {},
                dialogVisibleDetails: false,
                recordsList: [],
                revisitRecordList: [],
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
                this.listQuery.levelCode = undefined;
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
                getDetailList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.detailList = response.data.records;
                    this.total = response.data.total;
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
                }
            },
            loadEnum(name) {
                return this.$store.state.app.enums[name];
            },
            submitTimeRangeChange(submitTimeRange) {
                if (submitTimeRange && submitTimeRange.length > 0) {
                    this.listQuery.evaluationTimeStart = submitTimeRange[0];
                    this.listQuery.evaluationTimeEnd = submitTimeRange[1];
                } else {
                    this.listQuery.evaluationTimeStart = undefined;
                    this.listQuery.evaluationTimeEnd = undefined;
                }
            },
            showDetails(row){
                this.detail = copyProperties(this.detail, row);
                this.queryRecordList(this.detail.id);
                this.dialogVisibleDetails = true;
            },
            queryRecordList(detailId) {
                queryEvaluateRecordList(detailId).then(response => {
                    this.recordsList = response.data.recordsList;
                    this.revisitRecordList = response.data.revisitRecordList;
                })
            },
            closeDetailDialogDetails() {
                this.dialogVisibleDetails = false;
                this.resetDetail();
            },
        }
    }
</script>

<style scoped>
    @import "../../../assets/css/evaluateReform.css";
</style>
