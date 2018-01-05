<template xmlns="http://www.w3.org/1999/html">
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select class="filter-item" v-model="listQuery.handType" clearable placeholder="请选择交件方式">
                <el-option v-for="item in enums['HandType']" :key="item.code" :value="item.code" :label="item.value"></el-option>
            </el-select>
            <el-select class="filter-item" v-model="listQuery.handStatus" clearable placeholder="请选择交件状态">
                <el-option v-for="item in enums['HandStatus']" :key="item.code" :value="item.code" :label="item.value"
                           v-if="[1,2].includes(item.code)?listQuery.handType=='1':([3,4,5].includes(item.code)?listQuery.handType=='2':([6,7,8].includes(item.code)?listQuery.handType=='3':false))"></el-option>
            </el-select>
            <el-input class="filter-item" style="width: 240px; height: 30px" v-model="listQuery.processNumber" placeholder="请输入办件号"></el-input>
            <el-select
                    v-model="listQuery.itemId"
                    value-key="id"
                    clearable filterable remote
                    placeholder="请输入事项名称"
                    :remote-method="searchItem"
                    style="width: 320px;">
                <el-option
                        v-for="item in optionsNames"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="listQuery.memberId" class="filter-item"
                       clearable filterable remote
                       placeholder="请输入会员名称或证件号"
                       :remote-method="remoteMethod">
                <el-option
                        v-for="item in optionsName"
                        :key="item.id"
                        :label="item.name + ' | ' + item.loginName"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                搜索
            </el-button>
        </div>

        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="left" label="事项名称" min-width="300">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" placement="right" content="点击查看">
                        <div style="cursor:pointer;" @click="showHandInfo(scope.row)">
                            <div>{{scope.row.itemName}}</div>
                            <div>办件号: {{scope.row.processNumber}}</div>
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="left" label="申请人信息" min-width="260">
                <template scope="scope">
                    <span>
                        <span v-if="scope.row.companyName">
                            公司：{{scope.row.companyName}}<br>
                        </span>
                        申请人：{{scope.row.memberName}}<br>联系电话：{{scope.row.memberPhone}}<br>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="审批时间" width="180">
                <template scope="scope">
                    <span>{{scope.row.auditTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="交件方式">
                <template scope="scope">
                    <span v-if="scope.row.handTypeInfo">{{scope.row.handTypeInfo.handType | enums('HandType')}}</span>
                    <span v-else>未设置</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="交件状态">
                <template scope="scope">
                    <span v-if="scope.row.handTypeInfo">{{scope.row.handTypeInfo.handStatus | enums('HandStatus')}}</span>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="240">
                <template scope="scope">
                    <el-button v-if="scope.row.handTypeInfo && scope.row.handTypeInfo.handStatus==4" type="primary"
                               @click="showOpenCode(scope.row.handTypeInfo)">查看取件码</el-button>
                    <el-button-group v-else-if="scope.row.handTypeInfo && scope.row.handTypeInfo.handStatus==7">
                        <el-button type="primary" @click="showExpressInfo(scope.row.handTypeInfo)">查看快递单号</el-button>
                        <!--<el-button type="primary" @click="checkTakePost(scope.row)">确认收件</el-button>-->
                    </el-button-group>
                    <el-button v-else type="primary" @click="showHandInfo(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog title="交件信息" :visible.sync="handTypeVisible" :close-on-click-modal="closeOnClickModal">
            <el-form ref="handTypeInfoForm" :model="currentRow"
                     label-width="100px" class="small-space" label-position="right"
                     style="width: 80%; margin-left:10%;">
                <el-form-item label="预审号">
                    <el-input v-model="currentRow.processNumber" disabled></el-input>
                </el-form-item>
                <el-form-item label="事项名称">
                    <el-input v-model="currentRow.itemName" disabled></el-input>
                </el-form-item>
                <el-form-item label="申请时间">
                    <el-date-picker v-model="currentRow.applyTime" type="datetime" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="审批时间">
                    <el-date-picker v-model="currentRow.auditTime" type="datetime" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="公司名称" v-if="currentRow.companyName">
                    <el-input v-model="currentRow.companyName" disabled></el-input>
                </el-form-item>
                <el-form-item label="申请人姓名">
                    <el-input v-model="currentRow.memberName" disabled></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="currentRow.memberPhone" disabled></el-input>
                </el-form-item>
                <template v-if="currentRow.handTypeInfo">
                    <el-form-item label="交件方式">
                        <span>&nbsp;&nbsp;<b>{{currentRow.handTypeInfo.handType | enums('HandType')}}</b></span>
                    </el-form-item>
                    <el-form-item label="交件状态">
                        <span>&nbsp;&nbsp;<b>{{currentRow.handTypeInfo.handStatus | enums('HandStatus')}}</b></span>
                    </el-form-item>
                    <el-form-item label="交件时间" v-if="currentRow.handTypeInfo.handTime">
                        <el-date-picker v-model="currentRow.handTypeInfo.handTime" type="datetime" disabled></el-date-picker>
                    </el-form-item>
                    <el-form-item label="快件箱" v-if="currentRow.handTypeInfo.handType==2">
                        <el-select v-model="currentRow.handTypeInfo.mailboxInfo.mailboxId" style="width: 100%" disabled>
                            <el-option v-for="item in mailboxList" :key="item.id"
                                       :value="item.id" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="箱格序号" v-if="currentRow.handTypeInfo.handStatus==4 && currentRow.handTypeInfo.mailboxInfo.boxNo">
                        <el-input v-model="currentRow.handTypeInfo.mailboxInfo.boxNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="取件码" v-if="currentRow.handTypeInfo.handStatus==4">
                        <el-input v-model="currentRow.handTypeInfo.mailboxInfo.openCode" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="收件手机号" v-if="currentRow.handTypeInfo.handType==2">
                        <el-input v-model="currentRow.handTypeInfo.mailboxInfo.consigneeMobile" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="快递公司" v-if="currentRow.handTypeInfo.handStatus==7">
                        <span>&nbsp;&nbsp;<b>{{currentRow.handTypeInfo.postInfo.expressCompany | dics('kdgs')}}</b></span>
                    </el-form-item>
                    <el-form-item label="快递单号" v-if="currentRow.handTypeInfo.handStatus==7">
                        <el-input v-model="currentRow.handTypeInfo.postInfo.expressNumber" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="收件地址" v-if="currentRow.handTypeInfo.handType==3">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix card-header">
                                <div class="card-item">
                                    <p class="p1">
                                        {{addresseeCard.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{addresseeCard.phone}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <!--<span v-if="addresseeCard.defaultFlag">默认</span>-->
                                    </p>
                                    <p>{{addresseeCard.address}}</p>
                                </div>
                            </div>
                            <div class="card-body" v-show="false"></div>
                        </el-card>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="handTypeVisible = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import {copyProperties, validateQueryStr} from 'utils';
    import {mapGetters} from 'vuex';
    import {date, dics} from '../../../../filters';
    import {getAllByNameOrbasicCode} from '../../../../api/zwfwSystem/business/item';
    import {getAllMailbox} from 'api/hallSystem/window/mailbox'
    import {getAllAddressees} from 'api/hallSystem/window/addressee';
    import {getByNameOrLoginName} from '../../../../api/hallSystem/member/member'
    import {getToReceiveList} from '../../../../api/hallSystem/window/receive/windowCert'

    export default {
        name: 'table_demo',
        data() {
            return {
                list: [],
                optionsName: [],
                optionsNames: [],
                mailboxList: [],
                addresseeList: [],
                total: null,
                listLoading: true,
                currentRow: {},
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    itemId: undefined,
                    memberId: undefined,
                    processNumber: undefined,
                    handType: undefined,
                    handStatus: undefined
                },
                handTypeVisible: false,
                addresseeCard: {
                    name: '',
                    phone: '',
                    address: ''
                }
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'dics',
                'closeOnClickModal'
            ])
        },
        created() {
            this.getList();
            this.getMailboxList();
            this.getAddresseeList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getToReceiveList(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.list = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getMailboxList() {
                const query = {}
                getAllMailbox(query).then(response => {
                    if (response.httpCode === 200) {
                        this.mailboxList = response.data
                    } else {
                        this.$message.error('数据加载失败')
                    }
                });
            },
            getAddresseeList() {
                getAllAddressees().then(response => {
                    if (response.httpCode === 200) {
                        this.addresseeList = response.data;
                    } else {
                        this.$message.error('加载收件地址信息失败');
                    }
                })
            },
            searchItem(query) {
                const listQueryName = {
                    name: undefined
                }
                if (query !== '') {
                    let valid = validateQueryStr(query);
                    if (valid) {
                        this.$message.error(`输入中包含非法字符 ${valid}`)
                        return
                    }
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(query)) {
                        listQueryName.name = query;
                    }
                    getAllByNameOrbasicCode(listQueryName).then(response => {
                        if (response.httpCode === 200) {
                            this.optionsNames = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                    })
                } else {
                    this.optionsNames = [];
                }
            },
            remoteMethod(query) {
                if (query !== '') {
                    let valid = validateQueryStr(query);
                    if (valid) {
                        this.$message.error(`输入中包含非法字符 ${valid}`)
                        return
                    }
                    getByNameOrLoginName(query).then(response => {
                        if (response.httpCode === 200) {
                            this.optionsName = response.data;
                        } else {
                            this.$message.error('数据加载失败')
                        }
                    })
                } else {
                    this.optionsName = [];
                }
            },
            showHandInfo(row) {
                this.currentRow = row;
                if (row.handTypeInfo && row.handTypeInfo.handType == 3) {
                    let addresseeId = row.handTypeInfo.postInfo.addresseeId;
                    for (let item of this.addresseeList) {
                        if (item.id == addresseeId) {
                            copyProperties(this.addresseeCard, item);
                            break;
                        }
                    }
                }
                this.handTypeVisible = true;
            },
            showOpenCode(handTypeInfo) {
                if (!handTypeInfo.mailboxInfo || !handTypeInfo.mailboxInfo.openCode) {
                    this.$message.error('未查询到取件码信息，请刷新页面后重试');
                    return;
                }
                const h = this.$createElement;
                this.$msgbox({
                    title: '取件码',
                    message: h('p', { style: 'text-align: center' }, [
                        h('b', { style: 'font-size: 24px' }, handTypeInfo.mailboxInfo.openCode)
                    ]),
                    confirmButtonText: '关闭'
                })
            },
            showExpressInfo(handTypeInfo) {
                if (!handTypeInfo.postInfo) {
                    this.$message.error('未查询到快递信息，请刷新页面后重试');
                    return;
                }
                let company = dics(handTypeInfo.postInfo.expressCompany, 'kdgs');
                const h = this.$createElement;
                this.$msgbox({
                    title: '快递信息',
                    message: h('p', { style: 'text-align: center' }, [
                        h('b', { style: 'font-size: 24px' }, company + ' : ' + handTypeInfo.postInfo.expressNumber)
                    ]),
                    confirmButtonText: '关闭'
                })
            },
            handlePageChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    .item {
        margin-top: 10px;
        text-align: center;
    }

    .card-header {
        .card-item {
            border: none;
            margin: 0;
            width: 80%;
            float: left;
        }
        .el-button {
            float: right;
        }
    }

    .card-item {
        padding: 8px;
        margin: 8px 0;
        font-size: 14px;
        border: 1px solid #d0d0d0;
        height: 80px;
        .el-radio {
            height: 64px;
            line-height: 64px;
            text-align: center;
            width: 10%;
            float: left;
        }
        p {
            margin: 0;
            height: 32px;
            line-height: 32px;
            width: 88%;
            float: left;
        }
        .p1 {
            font-size: 16px;
            font-weight: bold;
            span {
                padding: 3px 6px;
                color: #dd1100;
                font-size: 14px;
                font-weight: normal;
                border: 1px solid #dd1100;
                border-radius: 3px;
            }
        }
    }

    .clearfix:before, .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
        .el-card__body {
            padding: 0;
        }
        .card-body {
            padding: 12px;
        }
    }
</style>
<style>
    .el-input.is-disabled .el-input__inner {
        color: #1f2d3d;
    }

    .el-textarea.is-disabled .el-textarea__inner {
        color: #1f2d3d;
    }

    .el-select > .el-input {
        margin-bottom: -7px;
    }
</style>
