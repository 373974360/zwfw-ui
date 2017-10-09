<template>
    <el-row :gutter="20">
        <el-col :span="8">
            <div class="grid-content ">
                <div style="padding:10px">
                    <el-input v-model="getNumberBy_pretrialNumber" placeholder="输入预审抽号">
                        <el-button slot="append" type="primary" @click="takeNumberByPretrialNumber">已预审抽号</el-button>
                    </el-input>

                    <div style="margin: 20px 0;"></div>

                    <el-input v-model="getNumberBy_itemCode" placeholder="输入事项编码">
                        <el-button slot="append" type="primary" @click="takeNumberByItemCode">未预审抽号</el-button>
                    </el-input>

                    <div style="margin: 20px 0;"></div>
                    <el-input v-model="devMockWindowKey" placeholder="输入窗口key">
                        <el-button slot="append" type="primary" @click="loginToWindow">登录到窗口</el-button>
                    </el-input>
                    <el-input v-model="getNumberBy_hallNumber" placeholder="输入呼叫号查看办理事项">
                        <el-button slot="append" type="primary" @click="queryNumberByCallNumber">按呼叫号查询</el-button>
                    </el-input>

                    <div style="margin: 20px 0;"></div>

                    <el-button-group>
                        <el-button v-if="itemNumber == null || itemNumber.status==1" type="primary" @click="callNumber">
                            叫号
                        </el-button>
                        <el-button type="primary" @click="queryCurrentNumber">查询当前业务</el-button>
                        <el-button v-if="itemNumber.status==2" type="primary"
                                   v-bind:disabled="itemNumber.applyFinishTime!=null"
                                   @click="welcomeNumber" title="仅限测试使用">
                            模拟欢迎
                        </el-button>
                        <el-button v-if="itemNumber.status==2" type="primary"
                                   v-bind:disabled="itemNumber.applyFinishTime!=null"
                                   @click="skip" title="申请人未到达窗口时跳过">
                            跳过
                        </el-button>
                    </el-button-group>


                    <div id="numberInfo" v-show="itemNumber!=null">
                        <table>
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
                            <tr v-show="member!=null">
                                <th>申报人:</th>
                                <td>{{member.name}}</td>
                            </tr>
                            <tr v-show="member!=null">
                                <th>申报人联系电话:</th>
                                <td>{{member.mobilephone}}</td>
                            </tr>
                            <tr v-show="company!=null">
                                <th>办事企业:</th>
                                <td>{{company.name}}</td>
                            </tr>
                            <tr v-if="itemPretrialVo!=null">
                                <th>预审号码:</th>
                                <td>{{itemPretrialVo.number}}</td>
                            </tr>
                            <tr v-else>
                                <th>预审状态:</th>
                                <td>没有提交预审</td>
                            </tr>
                            <tr v-if="itemPretrialVo!=null">
                                <th>预审状态:</th>
                                <td>{{itemPretrialVo.status | zwfwEnumData('PretrialStatus')}}
                                </td>
                            </tr>
                            <tr>
                                <th>排号状态:</th>
                                <td style="color:red">{{itemNumber.status | zwfwEnumData('ItemNumberStatus')}}
                                </td>
                            </tr>
                            <tr v-if="itemNumber.status!=6">
                                <th>备注:</th>
                                <td>{{itemNumber.remark}}</td>
                            </tr>
                            <tr width="140">
                                <th>受理窗口:</th>
                                <td style="color:red">
                                    <strong v-if="window!=null" class="font-size:5rem">{{window.name}}</strong>
                                    <strong v-if="window==null" class="font-size:5rem">无</strong>
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
                        <div class="block full-width" v-if="itemNumber.status==6">

                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="用于记录不予受理的原因"
                                    v-model="remark">
                            </el-input>
                        </div>
                        <div style="margin: 20px 0;"></div>
                        <el-button-group>

                            <el-button v-if="itemNumber.status==6" type="primary"
                                       v-bind:disabled="itemNumber.applyFinishTime!=null"
                                       @click="pass"
                                       title="核验资料无误时点击此处">
                                收件并转交部门
                            </el-button>
                            <el-button v-if="itemNumber.status==6" type="primary"
                                       v-bind:disabled="itemNumber.applyFinishTime!=null"
                                       @click="reject">
                                不予受理
                            </el-button>

                        </el-button-group>
                    </div>
                </div>


            </div>
        </el-col>
        <el-col :span="16">
            <div class="grid-content ">
                <div style="padding:10px">
                    <el-tabs v-model="tabName" type="card" @tab-click="handleTabClick">
                        <el-tab-pane label="所需资料" name="materialListPanel">
                            <el-table
                                    ref="itemMaterialVoList"
                                    :data="itemMaterialVoList"
                                    height="400"
                                    border
                                    style="width: 100%"

                                    @selection-change="handleMaterialSelectionChange"
                            >
                                <el-table-column
                                        fixed
                                        type="index"
                                        width="50">
                                </el-table-column>
                                <el-table-column
                                        fixed
                                        v-if="itemNumber.status==6"
                                        type="selection"
                                        prop="received"
                                        width="55">
                                </el-table-column>
                                <el-table-column
                                        fixed
                                        prop="name"
                                        label="材料"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="type"
                                        label="类型">
                                </el-table-column>
                                <el-table-column
                                        prop="example"
                                        label="样本">
                                    <template scope="scope">
                                        <a v-if="scope.row.example" :href="scope.row.example" target="_blank">点击下载</a>
                                        <span v-else>无</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="source"
                                        label="来源">
                                    <template scope="scope">
                                        {{scope.row.source | dicts('sxsqclly')}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="paperDescription"
                                        label="纸质说明">
                                </el-table-column>
                                <el-table-column
                                        prop="notice"
                                        label="填报须知">
                                </el-table-column>
                                <el-table-column
                                        prop="acceptStandard"
                                        label="受理标准">
                                </el-table-column>
                                <el-table-column
                                        prop="electronicMaterial"
                                        label="需要预审">
                                    <template scope="scope">
                                        {{scope.row.electronicMaterial ? '是 ' : '否'}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="multipleFile"
                                        label="已上传">
                                    <template scope="scope">
                                        <span v-for="(file,index) in scope.row.multipleFile">
                                            <span v-if="file.url!=null && file.url!=''">
                                            <a target="_blank"
                                               v-if="file.fileType == 'doc' || file.fileType == 'docx' || file.fileType == 'xls' || file.fileType == 'xlsx' || file.fileType == 'ppt'"
                                               :href="'https://view.officeapps.live.com/op/view.aspx?src=' + win.cxt + file.url ">[{{index + 1}}]</a>
                                            <a v-else :href="file.url"
                                               target="_blank">[{{index + 1}}]</a>
                                            </span>
                                            <span v-else>未上传</span>
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>

                        </el-tab-pane>
                        <el-tab-pane label="事项信息" name="itemInfoPanel">
                            <div id="itemInfo">
                                <table>
                                    <tr>
                                        <th>办理事项</th>
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
                                        <td>{{itemVo.processType | dicts('bjlx')}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>承诺时限</th>
                                        <td>{{itemVo.promiseEndTime}} 个工作日</td>
                                    </tr>
                                    <tr>
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
                                        <td>{{itemVo.chargeStandard}}</td>
                                    </tr>
                                    <tr>
                                        <th>收费依据</th>
                                        <td>{{itemVo.chargeBasis}}</td>
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
                                            <div style="white-space:pre-wrap">{{itemVo.acceptCondition}}</div>
                                        </td>
                                    </tr>
                                </table>
                                <h3>常见问题:</h3>
                                <pre class="panel-warning" style="white-space:pre-wrap">{{itemVo.commonRequestion}}</pre>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="内部办理流程描述" name="itemStep">
                            <div id="itemStepInfo" style="white-space:pre-wrap">{{itemVo.workflowDescription}}</div>
                        </el-tab-pane>
                    </el-tabs>

                    <!-- 打印按钮-->
                    <div v-if="itemNumber.status==3" style="margin-top:20px;">
                        <el-button type="primary" @click="print_ywsld">打印业务受理单</el-button>
                        <el-button type="primary" @click="print_wlzyd">打印物料转移单</el-button>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>

</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {getZwfwEnums} from 'api/zwfw/zwfwCommon';
    import {
        takeNumberByPretrialNumber,
        takeNumberByItemCode,
        queryNumberByCallNumber,
        queryCurrentNumber,
        loginToWindow,
        callNumber,
        welcomeNumber,
        submitWork
    } from 'api/zwfw/zwfwCompositeWindow'


    export default {
        name: 'compositeWindowWork',
        data() {
            return {
                getNumberBy_pretrialNumber: 'TEST002',
                getNumberBy_itemCode: 'ZJYW000001',
                getNumberBy_hallNumber: '',
                materialSelection: [],
                remark: '',
                itemNumber: {},
                itemVo: {},
                member: {},
                company: {},
                itemPretrialVo: {},
                tabName: 'materialListPanel',
                itemMaterialVoList: [],
                approveStepList: [],
                itemConditionVoList: [],
                window: {},
                itemWindowUserName: '',
                testStatus: '1',
                devMockWindowKey: ''

            }
        },
//        beforeRouteEnter(to, from, next) {
//            getZwfwEnums().then(function () {
//                next();
//            })
//        },
        methods: {
            /**
             * 模拟当前用户登录到窗口
             */
            loginToWindow() {
                var _this = this;
                loginToWindow({
                    windowKey: this.devMockWindowKey
                }).then(function (data) {
//                    console.log(data.data.callNumber);
                    _this.$message.success("登录到窗口");

                });
            },
            /**
             * 抽号 - 根据预审号码
             */
            takeNumberByPretrialNumber() {
                var _this = this;
                takeNumberByPretrialNumber({
                    pretrialNumber: this.getNumberBy_pretrialNumber
                }).then(function (data) {
//                    console.log(data.data.callNumber);
                    _this.$message.success("抽到的号码是：" + data.data.callNumber);

                });
            },
            /**
             * 抽号 - 根据事项编码
             */
            takeNumberByItemCode() {
                takeNumberByItemCode({
                    itemCode: this.getNumberBy_itemCode
                }).then(function (data) {
                    _this.$message.success("抽到的号码是：" + data.data.callNumber);
                });
            },

            /**
             * 查询 - 根据呼叫号查询今日此号码信息
             */
            queryNumberByCallNumber() {
                let _this = this;
                queryNumberByCallNumber({
                    hallNumber: this.getNumberBy_hallNumber
                }).then(function (resp) {
                    if (resp.httpCode === 200) {
                        if (resp.data != null) {
                            let data = resp.data;
                            _this.itemNumber = data.itemNumber;
                            _this.itemVo = data.itemVo;
                            _this.member = data.member;
                            _this.company = data.company;
                            _this.itemPretrialVo = data.itemPretrialVo;
                            _this.itemMaterialVoList = data.itemMaterialVoList;
                            _this.approveStepList = data.approveStepList;
                            _this.itemConditionVoList = data.itemConditionVoList;
                            _this.window = data.window;
                            _this.itemWindowUserName = data.itemWindowUserName;
                        } else {
                            _this.$message({
                                showClose: true,
                                message: '当前窗口没有正在办理的业务'
                            });
                        }
                    }
                });
            },
            /**
             *
             * 查询 - 当前此窗口正在办理的业务
             */
            queryCurrentNumber() {
                let _this = this;
                queryCurrentNumber({}).then(function (resp) {
                    if (resp.httpCode === 200) {
                        if (resp.data != null) {
                            let data = resp.data;
                            _this.itemNumber = data.itemNumber;
                            _this.itemVo = data.itemVo;
                            _this.member = data.member;
                            _this.company = data.company;
                            _this.itemPretrialVo = data.itemPretrialVo;
                            _this.itemMaterialVoList = data.itemMaterialVoList;
                            _this.approveStepList = data.approveStepList;
                            _this.itemConditionVoList = data.itemConditionVoList;
                            _this.window = data.window;
                            _this.itemWindowUserName = data.itemWindowUserName;
                        } else {
                            _this.$message({
                                showClose: true,
                                message: '当前窗口没有正在办理的业务'
                            });
                        }
                    }
                })
            },
            /**
             *
             * 叫号 - 将当前查看的号码修改为已经呼叫的状态
             */
            callNumber() {
                let _this = this;

                if (_this.itemNumber != null) {
                    callNumber({
                        numberId: _this.itemNumber.id
                    }).then(function (resp) {
                        let data = resp.data;
                        if (data != null) {
                            _this.itemNumber = data.itemNumber;
                            _this.itemVo = data.itemVo;
                            _this.member = data.member;
                            _this.company = data.company;
                            _this.itemPretrialVo = data.itemPretrialVo;
                            _this.itemMaterialVoList = data.itemMaterialVoList;
                            _this.approveStepList = data.approveStepList;
                            _this.itemConditionVoList = data.itemConditionVoList;
                            _this.window = data.window;
                            _this.itemWindowUserName = data.itemWindowUserName;
                        }
                    });
                } else {
                    callNumber({}).then(function (resp) {
                        let data = resp.data;
                        if (data != null) {
                            _this.itemNumber = data.itemNumber;
                            _this.itemVo = data.itemVo;
                            _this.member = data.member;
                            _this.company = data.company;
                            _this.itemPretrialVo = data.itemPretrialVo;
                            _this.itemMaterialVoList = data.itemMaterialVoList;
                            _this.approveStepList = data.approveStepList;
                            _this.itemConditionVoList = data.itemConditionVoList;
                            _this.window = data.window;
                            _this.itemWindowUserName = data.itemWindowUserName;
                        } else {
                            _this.$message({
                                showClose: true,
                                message: '没有下一个号码了'
                            });
                        }
                    });
                }

            },
            /**
             * 模拟欢迎
             *
             * */
            welcomeNumber() {
                let _this = this;
                welcomeNumber({
                    numberId: _this.itemNumber.id
                }).then(function (resp) {
                    let data = resp.data;
                    if (data != null) {
                        _this.itemNumber = data.itemNumber;
                    }
                });
            },
            /**
             * 通过
             */
            pass() {
                let _this = this;
                let checked_m = this.materialSelection.map(function (m) {
                    return m.id;
                });
                let _itemNumber = _this.itemNumber;

                let msg = "";
                if (checked_m.length > 0) {
                    msg = "确认已经收件（" + checked_m.length + "项），是否确认并交由部门处理？"
                } else {
                    msg = "您没有勾选收件！！，是否确定直接提交部门处理？";
                }

                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    submitWork({
                        numberId: _itemNumber.id,
                        status: 3,
                        remark: this.remark,
                        received: checked_m.join(',')

                    }).then(function (resp) {
                        let data = resp.data;
                        if (data != null) {
                            _this.itemNumber = data.itemNumber;
                            _this.itemVo = data.itemVo;
                            _this.member = data.member;
                            _this.company = data.company;
                            _this.itemPretrialVo = data.itemPretrialVo;
                            _this.itemMaterialVoList = data.itemMaterialVoList;
                            _this.approveStepList = data.approveStepList;
                            _this.itemConditionVoList = data.itemConditionVoList;
                            _this.window = data.window;
                            _this.itemWindowUserName = data.itemWindowUserName;
                        } else {
                            _this.$message({
                                showClose: true,
                                message: '没有下一个号码了'
                            });
                        }

                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交'
                    });
                });
            },

            /**
             * 不予受理
             * */
            reject() {

//                console.log("不予受理。。。");
                let _this = this;

                let _itemNumber = _this.itemNumber;

                let msg = "确定不予受理吗？";

                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    submitWork({
                        numberId: _itemNumber.id,
                        status: 4,
                        remark: this.remark
                    }).then(function (resp) {
                        let data = resp.data;
                        if (data != null) {
                            _this.itemNumber = data.itemNumber;
                            _this.itemVo = data.itemVo;
                            _this.member = data.member;
                            _this.company = data.company;
                            _this.itemPretrialVo = data.itemPretrialVo;
                            _this.itemMaterialVoList = data.itemMaterialVoList;
                            _this.approveStepList = data.approveStepList;
                            _this.itemConditionVoList = data.itemConditionVoList;
                            _this.window = data.window;
                            _this.itemWindowUserName = data.itemWindowUserName;
                        }

                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交'
                    });
                });

            },
            /**
             * 跳过处理
             *
             * */
            skip() {
                let _itemNumber = _this.itemNumber;

                let msg = "确定跳过吗？";

                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    submitWork({
                        numberId: _itemNumber.id,
                        status: 5,
                        remark: this.remark
                    }).then(function (resp) {
                        let data = resp.data;
                        if (data != null) {
                            _this.itemNumber = data.itemNumber;
                            _this.itemVo = data.itemVo;
                            _this.member = data.member;
                            _this.company = data.company;
                            _this.itemPretrialVo = data.itemPretrialVo;
                            _this.itemMaterialVoList = data.itemMaterialVoList;
                            _this.approveStepList = data.approveStepList;
                            _this.itemConditionVoList = data.itemConditionVoList;
                            _this.window = data.window;
                            _this.itemWindowUserName = data.itemWindowUserName;
                        }

                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交'
                    });
                });
            },
            handleMaterialSelectionChange(val) {
                this.materialSelection = val;
            },
            print_ywsld() {
                if(this.itemNumber!=null) {
                    window.open('/static/zwfw/print/ywsld.html?id='+this.itemNumber.id);
                }
            },
            print_wlzyd() {
                if(this.itemNumber!=null) {
                    window.open('/static/zwfw/print/wlzyd.html?id='+this.itemNumber.id);
                }
            },
            /**
             * TAB 页面切换的时候事件
             * @param tab
             * @param event
             */
            handleTabClick(tab, event) {
                console.log(tab, event);
            }
        },
        mounted() {

        }
    }
</script>

<style>
    #numberInfo table {
        width: 100%;
        margin-top: 20px;
    }

    #numberInfo table th, #numberInfo table td {
        height: 30px;
        line-height: 30px;
        border: 1px solid #bfcbd9;
        padding: 6px;
    }

    #numberInfo table th {
        text-align: left;
        background-color: #eef1f6;
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
