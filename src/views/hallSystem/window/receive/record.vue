<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-date-picker v-model="listQuery.selectDateTime" type="datetimerange"
                            placeholder="选择时间范围" format="yyyy-MM-dd HH:mm:ss" @change="changeDate">
            </el-date-picker>
            <el-input class="filter-item" style="width: 240px; height: 30px" v-model="listQuery.processNumber" placeholder="按办件号搜索"></el-input>
            <el-select
                    v-model="listQuery.itemId"
                    value-key="id"
                    clearable filterable remote
                    placeholder="按事项名称搜索"
                    :remote-method="searchItem"
                    style="width: 320px;">
                <el-option
                        v-for="item in itemList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <br>
            <el-select v-model="listQuery.memberId" class="filter-item"
                       clearable filterable remote
                       placeholder="按申请人名称或证件号搜索"
                       :remote-method="searchMember"
                       style="width: 320px">
                <el-option
                        v-for="item in memberList"
                        :key="item.id"
                        :label="item.name + ' | ' + item.loginName"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-input class="filter-item" style="width: 240px; height: 30px" v-model="listQuery.mobilephone" placeholder="按联系电话搜索"></el-input>
            <el-checkbox-group v-model="numberStatus" style="display: inline-block; margin: 0 20px">
                <el-checkbox :label="3">成功受理</el-checkbox>
                <el-checkbox :label="4">不予受理</el-checkbox>
            </el-checkbox-group>
            <br>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="编号" width="140">
                <template scope="scope">
                    {{scope.row.id}} <br>
                    【{{scope.row.orderNo}}】
                </template>
            </el-table-column>
            <el-table-column align="center" label="事项名称" width="400">
                <template scope="scope">
                    <span>{{scope.row.itemName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="申请人">
                <template scope="scope">
                    <span>{{scope.row.companyName || scope.row.memberName}}</span>
                    <br>
                    {{scope.row.mobilephone}}
                </template>
            </el-table-column>
            <!--<el-table-column align="center" label="联系电话">-->
            <!--<template scope="scope">-->
            <!--<span>{{scope.row.mobilephone}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column align="center" label="公司" width="250">-->
            <!--<template scope="scope">-->
            <!--<span>{{scope.row.companyName}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="办件号">
                <template scope="scope">
                    <span>{{scope.row.processNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="日期" width="200">
                <template scope="scope">
                    <span>{{scope.row.welcomeTime | date('YYYY-MM-DD')}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column align="center" label="完成时间" width="200">-->
            <!--<template scope="scope">-->
            <!--<span>{{scope.row.applyFinishTime | date('YYYY-MM-DD HH:mm:ss')}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="状态">
                <template scope="scope">
                    <span>{{scope.row.status | enums('ItemNumberStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button class="filter-item" @click="handleDetailList(scope.row)" type="primary"> 查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog size="large" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" v-loading="dialogLoading" element-loading-text="拼命加载中">
            <el-row :gutter="20">
                <el-col :span="8">
                    <table class="table table-bordered table-responsive">
                        <tr>
                            <th width="140">呼叫号:</th>
                            <td><strong class="font-size:5rem">{{itemNumber.orderNo}}</strong></td>
                        </tr>
                        <tr>
                            <th>办理事项:</th>
                            <td style="color:red">{{itemVo.name}}</td>
                        </tr>
                        <!--<tr>-->
                        <!--<th width="140">所需服务:</th>-->
                        <!--<td style="color:red"><strong class="font-size:5rem">{{itemNumber.type | enum-->
                        <!--'ItemWindowSupport'}}</strong></td>-->
                        <!--</tr>-->
                        <tr v-if="member!=null && member.naturePerson!=null">
                            <th>姓名:</th>
                            <td>{{member.naturePerson.name}}</td>
                        </tr>
                        <tr v-if="itemNumber!=null && itemNumber.personName!=null">
                            <th>办事员:</th>
                            <td>{{itemNumber.personName}}</td>
                        </tr>
                        <tr v-if="itemNumber!=null && itemNumber.personPhone!=null">
                            <th>办事员电话:</th>
                            <td>{{itemNumber.personPhone}}</td>
                        </tr>
                        <tr v-if="member!=null && member.naturePerson!=null">
                            <th>自然人手机号:</th>
                            <td>{{member.naturePerson.phone}}</td>
                        </tr>
                        <tr v-if="member!=null && member.legalPerson!=null">
                            <th>企业法人:</th>
                            <td>{{member.legalPerson.legalPerson}}</td>
                        </tr>
                        <tr v-if="member!=null && member.legalPerson!=null">
                            <th>法人电话:</th>
                            <td>{{member.legalPerson.phone}}</td>
                        </tr>
                        <tr v-if="member!=null && member.legalPerson!=null">
                            <th>企业名称:</th>
                            <td>{{member.legalPerson.companyName}}</td>
                        </tr>
                        <tr v-if="member!=null && member.legalPerson!=null">
                            <th>社会统一信用代码:</th>
                            <td>{{member.legalPerson.companyCode}}</td>
                        </tr>
                        <tr v-if="itemPretrialVo!=null">
                            <th>预审号码:</th>
                            <td>{{itemPretrialVo.processNumber}}</td>
                        </tr>
                        <tr v-else>
                            <th>预审状态:</th>
                            <td>无预审</td>
                        </tr>
                        <tr v-if="itemPretrialVo!=null">
                            <th>预审状态:</th>
                            <td>{{itemPretrialVo.status | enums('PretrialStatus')}}
                            </td>
                        </tr>
                        <tr>
                            <th>取件方式:</th>
                            <td>
                                <span v-if="takeTypeVo!=null">{{takeTypeVo.takeType | enums('TakeType')}}</span>
                                <span v-else style="color:red">未设置</span>
                            </td>
                        </tr>
                        <tr>
                            <th>交件方式:</th>
                            <td>
                                <span v-if="handTypeVo!=null">{{handTypeVo.handType | enums('HandType')}}</span>
                                <span v-else style="color:red">未设置</span>
                            </td>
                        </tr>
                        <tr>
                            <th>排号状态:</th>
                            <td style="color:red">{{itemNumber.status | enums('ItemNumberStatus')}}
                            </td>
                        </tr>
                        <tr v-if="itemNumber.status!=6">
                            <th>备注:</th>
                            <td>{{itemNumber.remark}}</td>
                        </tr>
                        <tr width="140">
                            <th>受理窗口:</th>
                            <td style="color:red">
                                <strong v-if="window!=null"
                                        class="font-size:5rem">{{window.name}}</strong>
                                <strong v-if="window==null" class="font-size:5rem">非窗口</strong>
                            </td>
                        </tr>
                        <tr v-show="itemWindowUserName">
                            <th>工作人员:</th>
                            <td>{{itemWindowUserName}}</td>
                        </tr>
                        <tr>
                            <th width="140">领号时间:</th>
                            <td>{{itemNumber.takeTime | date('YYYY-MM-DD HH:mm') }}
                            </td>
                        </tr>
                        <tr v-show="itemNumber.callTime">
                            <th width="140">呼叫时间:</th>
                            <td>{{itemNumber.callTime | date('YYYY-MM-DD HH:mm') }}
                            </td>
                        </tr>
                        <tr v-show="itemNumber.welcomeTime">
                            <th>欢迎时间:</th>
                            <td>{{itemNumber.welcomeTime | date('YYYY-MM-DD HH:mm') }}
                            </td>
                        </tr>
                        <tr v-show="itemNumber.applyFinishTime">
                            <th>窗口完成处理时间:</th>
                            <td>{{itemNumber.applyFinishTime | date('YYYY-MM-DD HH:mm') }}
                            </td>
                        </tr>
                    </table>
                </el-col>
                <el-col :span="16">
                    <el-tabs v-model="tabName" type="card">
                        <el-tab-pane label="所需资料" name="materialListPanel">
                            <el-table
                                    :data="itemMaterialVoList"
                                    height="400"
                                    border
                                    style="width: 100%"
                            >
                                <el-table-column
                                        type="index"
                                        width="50">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="材料"
                                        width="300">
                                    <template scope="scope">
                                        {{scope.row.name}}
                                        <div v-if="scope.row.multipleFile" style="color:blue">
                                            预审资料：
                                            <span v-for="(file,index) in scope.row.multipleFile">
                                            <span v-if="file.url!=null && file.url!=''">
                                            <a v-if="!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.url)"
                                               :href="file.url" :download="file.fileName"
                                               target="_blank">[{{index + 1}}]</a>
                                            <a v-else :href="file.url" target="_blank" :title="file.fileName">[{{index + 1}}]</a>
                                            </span>
                                            <span v-else>未上传</span>
                                         </span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="received"
                                        label="已收件">
                                    <template scope="scope">
                                        <i v-if="scope.row.received==1" style="color:green"
                                           class="el-icon-circle-check"></i>
                                        <i v-else class="el-icon-circle-cross" style="color:red"></i>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="type"
                                        label="类型">
                                    <template scope="scope">
                                        {{scope.row.type | dics('cllx')}}
                                    </template>
                                </el-table-column>
                                <!--<el-table-column-->
                                <!--prop="example"-->
                                <!--label="样本">-->
                                <!--<template scope="scope">-->
                                <!--<a v-if="scope.row.example" :href="scope.row.example" target="_blank">点击下载</a>-->
                                <!--<span v-else>无</span>-->
                                <!--</template>-->
                                <!--</el-table-column>-->
                                <el-table-column
                                        prop="source"
                                        label="来源">
                                    <template scope="scope">
                                        {{scope.row.source | dics('sxsqclly')}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="paperDescription"
                                        label="纸质说明">
                                </el-table-column>
                                <!--<el-table-column-->
                                <!--prop="notice"-->
                                <!--label="填报须知">-->
                                <!--</el-table-column>-->
                                <!--<el-table-column-->
                                <!--prop="acceptStandard"-->
                                <!--label="受理标准">-->
                                <!--</el-table-column>-->
                                <el-table-column
                                        prop="electronicMaterial"
                                        label="需要预审">
                                    <template scope="scope">
                                        <i v-if="scope.row.electronicMaterial" style="color:green"
                                           class="el-icon-circle-check"></i>
                                        <i v-else class="el-icon-circle-cross" style="color:red"></i>
                                    </template>
                                </el-table-column>


                            </el-table>

                        </el-tab-pane>
                        <el-tab-pane label="事项信息" name="itemInfoPanel">
                            <div id="itemInfo">
                                <table>
                                    <tr>
                                        <th width="200">办理事项</th>
                                        <td>{{itemVo.name}}</td>
                                    </tr>
                                    <tr>
                                        <th>实施机构</th>
                                        <td>{{itemVo.implAgency}}</td>
                                    </tr>
                                    <tr>
                                        <th>联办机构</th>
                                        <td>{{itemVo.unionAgency}}</td>
                                    </tr>
                                    <tr>
                                        <th>办件类型</th>
                                        <td>{{itemVo.processType | dics('bjlx')}}
                                        </td>
                                    </tr>
                                    <tr v-if="itemVo.promiseEndTime!=0">
                                        <th>承诺时限</th>
                                        <td>{{itemVo.promiseEndTime}} 个工作日</td>
                                    </tr>
                                    <tr v-if="itemVo.legalEndTime!=0">
                                        <th>法定时限</th>
                                        <td>{{itemVo.legalEndTime}} 个工作日</td>
                                    </tr>
                                    <tr>
                                        <th>核准数量</th>
                                        <td>{{itemVo.numberLimit == 0 ? '无数量限制' : itemVo.numberLimit}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>是否收费</th>
                                        <td>{{itemVo.chargeable ? '是' : '否'}}</td>
                                    </tr>
                                    <tr>
                                        <th>收费标准</th>
                                        <td v-html="itemVo.chargeStandard"></td>
                                    </tr>
                                    <tr>
                                        <th>收费依据</th>
                                        <td v-html="itemVo.chargeBasis"></td>
                                    </tr>
                                    <tr>
                                        <th>结果名称</th>
                                        <td>{{itemVo.resultName}}</td>
                                    </tr>
                                    <tr>
                                        <th>联系电话</th>
                                        <td>{{itemVo.askPhone}}</td>
                                    </tr>
                                    <tr>
                                        <th>监督电话</th>
                                        <td>{{itemVo.supervisePhone}}</td>
                                    </tr>
                                    <tr>
                                        <th>办理条件</th>
                                        <td>
                                            <div style="white-space:pre-wrap" v-html="itemVo.acceptCondition"></div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="内部办理流程描述" name="itemStep">
                            <div id="itemStepInfo" style="white-space:pre-wrap"
                                 v-html="itemVo.workflowDescription"></div>
                        </el-tab-pane>
                    </el-tabs>


                    <!-- 打印按钮-->
                    <div v-if="itemNumber.status==3" style="margin-top:20px;">
                        <el-button type="primary" @click="print_ywsld">打印业务受理单</el-button>
                        <el-button type="primary" @click="print_wlzyd">打印物料转移单</el-button>
                    </div>
                    <div v-if="itemNumber.status==4" style="margin-top:20px;">
                        <el-button type="primary" @click="print_ycxgzd">打印一次性告知单</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>


<script>
    import {getZwfwApiHost} from 'utils/fetch';
    import {getZwfwItemNumberList, getDatilByItemNumberId} from 'api/hallSystem/window/receive/itemNumber';
    import {getAllByNameOrbasicCode} from '../../../../api/zwfwSystem/business/item';
    import {getByNameOrLoginName} from '../../../../api/hallSystem/member/member'
    import {copyProperties, validateQueryStr} from 'utils';
    import {mapGetters} from 'vuex';
    import moment from 'moment';

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                itemList: [],
                memberList: [],
                numberStatus: [3],
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    selectDateTime: undefined,
                    processNumber: undefined,
                    itemId: undefined,
                    memberId: undefined,
                    mobilephone: undefined,
                    inStatus: undefined
                },
                tabName: 'materialListPanel',
                itemNumber: [],
                itemWindowUserName: '',
                window: [],
                itemPretrialVo: [],
                member: {
                    legalPerson: {},
                    naturePerson: {}
                },
                itemVo: {},
                selectedRows: [],
                itemMaterialVoList: [],
                rightTabName: 'materialListPanel',
                dialogFormVisible: false,
                dialogStatus: 'view',
                dialogLoading: false,
                takeTypeVo: null,
                handTypeVo: null
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
        },
        methods: {
            getList() {
                this.listLoading = true;
                this.listQuery.inStatus = this.numberStatus.join();
                getZwfwItemNumberList(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.list = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error('数据加载失败')
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
                            this.itemList = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                    })
                } else {
                    this.itemList = [];
                }
            },
            searchMember(query) {
                if (query !== '') {
                    let valid = validateQueryStr(query);
                    if (valid) {
                        this.$message.error(`输入中包含非法字符 ${valid}`)
                        return
                    }
                    getByNameOrLoginName(query).then(response => {
                        if (response.httpCode === 200) {
                            this.memberList = response.data;
                        } else {
                            this.$message.error('数据加载失败')
                        }
                    })
                } else {
                    this.memberList = [];
                }
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
            handleDetailList(row) {
                this.resetTemp();
                this.rightTabName = 'materialListPanel';
                this.itemNumber = copyProperties(this.itemNumber, row);
                this.dialogFormVisible = true;
                this.itemNumberId = row.id;
                this.getDetailList();
            },
            print_ywsld() {
                if (this.itemNumber != null) {
                    window.open('/admin/print/ywsld.html?numberId=' + this.itemNumber.id);
                    // window.open('/api/hallSystem/hallCompositeWindow/downloadYwsld?numberId=' + this.itemNumber.id);
                }
            },
            print_wlzyd() {
                if (this.itemNumber != null) {
                    window.open('/admin/print/wlzyd.html?numberId=' + this.itemNumber.id);
                    // window.open('/api/hallSystem/hallCompositeWindow/downloadWlzyd?numberId=' + this.itemNumber.id);
                }
            },
            print_ycxgzd() {
                if (this.itemNumber != null) {
                    window.open('/admin/print/ycxgzd.html?numberId=' + this.itemNumber.id);
                    // window.open('/api/hallSystem/hallCompositeWindow/downloadYcxgzd?numberId=' + this.itemNumber.id);
                }
            },
            getDetailList() {
                this.dialogLoading = true;

                getDatilByItemNumberId(this.itemNumberId).then(response => {
                    this.dialogLoading = false;
                    if (response.httpCode === 200) {
                        if (response.data) {
                            this.itemNumber = response.data.itemNumber;
                            this.member = response.data.member;
                            this.approveStepList = response.data.approveStepList;
                            this.itemVo = response.data.itemVo;
                            this.itemConditionVoList = response.data.itemConditionVoList;
                            this.itemMaterialVoList = response.data.itemMaterialVoList;
                            this.itemPretrialMaterialVoList = response.data.itemPretrialMaterialVoList;
                            this.itemPretrialVo = response.data.itemPretrialVo;
                            this.window = response.data.window;
                            this.itemWindowUserName = response.data.itemWindowUserName;
                        }
                    } else {
                        this.$message.error('数据加载失败')
                    }
                }).catch(e => {
                    this.dialogLoading = false;
                });
            },
            resetTemp() {
                this.itemNumber = {
                    id: '',
                    orderNo: '',
                    applyFinishTime: '',
                    welcomeTime: '',
                    callTime: '',
                    takeTime: '',
                    status: '',
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

    .table-bordered {
        border: 1px solid #EBEBEB;
    }

    .table-responsive {
        min-height: .01%;
        overflow-x: auto;
    }

    .table {
        width: 100%;
        max-width: 100%;
        margin-bottom: 20px;
        background-color: transparent;
        border-spacing: 0;
        border-collapse: collapse;
    }

    .table > tr > td, .table > tr > th {
        border-top: 1px solid #e7eaec;
        line-height: 1.42857;
        padding: 8px;
        vertical-align: middle;
    }

    .table-bordered > tr > td, .table-bordered > tr > th {
        border: 1px solid #e7e7e7;
    }

    .table-inline {
        width: 49%;
    }

    .table-show {
        display: -webkit-box;
    }

    #itemInfo table {
        width: 100%;
    }

    #itemInfo table th, #itemInfo table td {
        height: 30px;
        line-height: 30px;
        border: 1px solid #bfcbd9;
        padding: 6px;
    }

    #itemInfo table th {
        text-align: left;
        background-color: #eef1f6;

    }

    #itemStepInfo table {
        width: 100%;
        margin-top: 20px;
    }

    #itemStepInfo table th, #itemInfo table td {
        height: 30px;
        line-height: 30px;
        border: 1px solid #bfcbd9;
        padding: 6px;
    }

    #itemStepInfo table th {
        text-align: left;
        background-color: #eef1f6;

    }

</style>
