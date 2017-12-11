<template>
    <el-row :gutter="20">
        <el-col :span="10">
            <div class="grid-content ">
                <div style="padding:10px">
                    <el-row v-show="!windowInfo.id" type="flex" justify="center">
                        <el-input v-model="loginCallerKey" placeholder="模拟叫号器操作，请先输入窗口编号登录">
                        </el-input>
                        <el-button type="primary" @click="loginToWindow" :disabled="!loginCallerKey">登录窗口</el-button>
                    </el-row>
                    <el-row v-show="windowInfo.id" type="flex" justify="center">
                        <el-input :value="'已经登录到' + windowInfo.callerKey + '窗口'" disabled
                                  placeholder="模拟叫号器操作，请先输入窗口编号登录"></el-input>
                        <el-button type="primary" @click="windowInfo= {}">重新登录</el-button>
                    </el-row>
                    <el-tabs v-model="leftTabName" type="card">
                        <el-tab-pane label="业务受理" name="workPanel">

                            <el-row type="flex" justify="center">
                                <el-input v-model="getNumberBy_hallNumber" placeholder="请输入呼叫号">
                                </el-input>
                                <el-button type="primary" :disabled="!getNumberBy_hallNumber"
                                           @click="queryNumberByCallNumber">按呼叫号查询
                                </el-button>
                                <el-button type="primary" @click="queryCurrentNumber">查询当前叫号</el-button>
                            </el-row>
                            <el-row type="flex" justify="center" style="margin-top:20px;">
                                <el-button :disabled="!itemNumber.id || itemNumber.status!=1" type="primary"
                                           @click="callNumber" title="设置当前号码为窗口已呼叫状态时点击">
                                    叫号
                                </el-button>
                                <el-button :disabled="!itemNumber.id || itemNumber.status!=2" type="primary"
                                           @click="welcomeNumber" title="申请人到达窗口时点击">
                                    欢迎
                                </el-button>
                                <el-button :disabled="!itemNumber.id || itemNumber.status!=2" type="danger"
                                           @click="skip" title="申请人未到达窗口，跳过此号码时点击">
                                    跳过号码
                                </el-button>
                            </el-row>
                            <div id="numberInfo" v-show="itemNumber.id" class="tableDiv">
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
                                    <tr v-if="member!=null && member.naturePerson!=null">
                                        <th>申报人:</th>
                                        <td>{{member.naturePerson.name}}</td>
                                    </tr>
                                    <tr v-if="member!=null && member.naturePerson!=null">
                                        <th>申报人联系电话:</th>
                                        <td>{{member.naturePerson.phone}}</td>
                                    </tr>
                                    <tr v-if="member!=null && member.legalPerson!=null">
                                        <th>申报人联系电话:</th>
                                        <td>{{member.legalPerson.phone}}</td>
                                    </tr>
                                    <tr v-if="member!=null && member.legalPerson!=null">
                                        <th>办事企业:</th>
                                        <td>{{member.legalPerson.companyName}}</td>
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

                            </div>

                        </el-tab-pane>
                        <el-tab-pane label="虚拟抽号机" name="virtualPanel">
                            <div>预审抽号：</div>
                            <el-row type="flex" justify="center">
                                <el-input v-model="getNumberBy_processNumber" placeholder="如根据预审号抽号，请输入预审号"></el-input>
                                <el-button type="primary" @click="takeNumberByProcessNumber"
                                           :disabled="!getNumberBy_processNumber">预审抽号
                                </el-button>
                            </el-row>
                            <div style="margin-top:50px;">用户快速注册：</div>
                            <el-row type="flex" justify="center">
                                <el-input v-model="memberCode" placeholder="输入企业统一信用代码或身份证号"></el-input>
                                <el-button type="primary" @click="checkMemberExist()">用户检测快速注册</el-button>
                            </el-row>
                            <el-row type="flex" justify="center">
                                <el-input v-model="memberRealname" placeholder="申请人姓名或企业名称">
                                </el-input>
                                <el-input v-model="memberPhone" placeholder="申请人当前可用手机号">
                                </el-input>
                            </el-row>
                            <el-row v-show="doFastReg" type="flex" justify="center">
                                <el-button type="primary" @click="sendFastRegPhoneCode"
                                           :disabled="!doFastReg">发送注册验证码
                                </el-button>
                                <el-input v-model="phoneCode" :disabled="!doFastReg" placeholder="输入手机收到的验证码">
                                </el-input>
                                <el-button type="primary" @click="fastRegMember"
                                           :disabled="!doFastReg">快速注册用户
                                </el-button>
                            </el-row>
                            <div style="margin-top:50px;">事项抽号：</div>
                            <el-row type="flex" justify="center">
                                <el-select
                                        v-model="selectedItem"
                                        filterable
                                        remote
                                        placeholder="请输入事项名称或基本编码后选择事项"
                                        :remote-method="queryItem"
                                        @change="changeItem" style="width:100%">
                                    <el-option
                                            v-for="item in optionsName"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>

                                <el-button type="primary" @click="takeNumberByItemCode"
                                           :disabled="!itemVo.id || !member.id">事项抽号
                                </el-button>
                            </el-row>

                            <div id="companyInfo" v-if="companyInfo.id" class="tableDiv">
                                <table>
                                    <tr>
                                        <th width="140">统一信用代码:</th>
                                        <td>{{companyInfo.ty_code}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">企业名称:</th>
                                        <td>{{companyInfo.qymc}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">法人:</th>
                                        <td>{{companyInfo.fr}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">联系电话:</th>
                                        <td>{{companyInfo.lxdh}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">企业类型:</th>
                                        <td>{{companyInfo.qllx}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">地址:</th>
                                        <td>{{companyInfo.jgzs}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">注册资金:</th>
                                        <td>{{companyInfo.zczj}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">成立日期:</th>
                                        <td>{{companyInfo.clrq}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">营业期限:</th>
                                        <td>{{companyInfo.yyqx}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">经营范围:</th>
                                        <td>{{companyInfo.jyfw}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">状态:</th>
                                        <td>{{companyInfo.djzt}}</td>
                                    </tr>
                                    <tr>
                                        <th width="140">所属街道:</th>
                                        <td>{{companyInfo.ssjd}}</td>
                                    </tr>
                                </table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-col>
        <el-col :span="14">
            <div class="grid-content ">
                <div style="padding:10px">
                    <el-tabs v-model="rightTabName" type="card" @tab-click="handleRightTabClick">
                        <el-tab-pane label="所需资料" name="materialListPanel">
                            <p v-if="itemNumber.status==6 || (companyInfo.id && itemVo.id && !itemNumber.id)">
                                勾选收取的材料：</p>
                            <el-table id="materiaTable"
                                      ref="itemMaterialVoList"
                                      :data="itemMaterialVoList"
                                      height="400"
                                      border
                                      style="width: 100%"

                                      @selection-change="handleMaterialSelectionChange"
                            >
                                <el-table-column
                                        type="index"
                                        width="50">
                                </el-table-column>
                                <el-table-column
                                        v-if="itemNumber.status==6"
                                        type="selection"
                                        prop="received"
                                        width="55">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="材料"
                                        width="300">
                                    <template scope="scope">
                                        {{scope.row.name}}
                                        <div v-if="scope.row.multipleFile">
                                            预审资料：
                                            <span v-for="(file,index) in scope.row.multipleFile">
                                            <span v-if="file.url!=null && file.url!=''">
                                            <a target="_blank"
                                               v-if="file.fileType == 'doc' || file.fileType == 'docx' || file.fileType == 'xls' || file.fileType == 'xlsx' || file.fileType == 'ppt'"
                                               :href="'https://view.officeapps.live.com/op/view.aspx?src=' + file.url ">[{{index + 1}}]</a>
                                            <a v-else :href="file.url"
                                               target="_blank">[{{index + 1}}]</a>
                                            </span>
                                            <span v-else>未上传</span>
                                         </span>
                                        </div>
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
                                <!--<el-table-column-->
                                <!--prop="paperDescription"-->
                                <!--label="纸质说明">-->
                                <!--</el-table-column>-->
                                <!--<el-table-column-->
                                <!--prop="notice"-->
                                <!--label="填报须知">-->
                                <!--</el-table-column>-->
                                <!--<el-table-column-->
                                <!--prop="acceptStandard"-->
                                <!--label="受理标准">-->
                                <!--</el-table-column>-->
                                <!--<el-table-column-->
                                <!--prop="electronicMaterial"-->
                                <!--label="需要预审">-->
                                <!--<template scope="scope">-->
                                <!--{{scope.row.electronicMaterial ? '是 ' : '否'}}-->
                                <!--</template>-->
                                <!--</el-table-column>-->
                            </el-table>

                        </el-tab-pane>
                        <el-tab-pane label="事项信息" name="itemInfoPanel">
                            <div id="itemInfo">
                                <table>
                                    <tr>
                                        <th width="150">办理事项</th>
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
                                <div v-if="itemVo.commonRequestion">
                                    <h3>常见问题:</h3>
                                    <pre class="panel-warning"
                                         style="white-space:pre-wrap">{{itemVo.commonRequestion}}</pre>
                                </div>
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
                        <!--<el-button type="primary" @click="print_wlzyd">打印物料转移单</el-button>-->
                    </div>

                    <div class="block full-width" style="margin-top:20px;"
                         v-if="itemNumber.status==6">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="填写备注"
                                v-model="remark">
                        </el-input>
                    </div>
                    <div v-if="itemNumber.status!=3" style="margin-top:20px;">
                        <el-button :disabled="!itemNumber.id || itemNumber.status!=6" type="primary" @click="pass">
                            确认收件
                        </el-button>
                        <el-button :disabled="!itemNumber.id || itemNumber.status!=6" type="primary" @click="reject">
                            不予受理
                        </el-button>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>

</template>

<script>
    import {
        takeNumberByProcessNumber,
        takeNumberByItemCode,
        queryNumberByCallNumber,
        queryCurrentNumber,
        loginToWindow,
        callNumber,
        welcomeNumber,
        submitWork,
        queryCompanyInfo,
        getItemInfo,
        submitNoPretrial,
        getCurrentUserLoginedWindow,
        sendFastRegPhoneCode,
        checkMemberExist,
        fastRegMember
    } from 'api/hallSystem/window/receive/windowAccept';
    import {getAllByNameOrbasicCode} from 'api/zwfwSystem/business/item';


    export default {
        name: 'compositeWindowWork',
        data() {
            return {
                getNumberBy_processNumber: '',
                getNumberBy_hallNumber: '',
                materialSelection: [],
                remark: '',
                itemNumber: {},
                itemVo: {},
                member: {
                    legalPerson: {},
                    naturePerson: {}
                },

                itemPretrialVo: {},
                rightTabName: 'materialListPanel',
                leftTabName: 'workPanel',
                itemMaterialVoList: [],
                window: {},
                itemWindowUserName: '',
                loginCallerKey: '',
                memberCode: '',
                memberRealname: '',
                memberPhone: '',
                phoneCode: '',
                companyInfo: {
                    id: '',
                    node_id: '',
                    ty_code: '',
                    zz_code: '',
                    gs_code: '',
                    qymc: '',
                    fr: '',
                    lxr: '',
                    lxdh: '',
                    qllx: '',
                    jgzs: '',
                    zczj: '',
                    clrq: '',
                    yyqx: '',
                    jyfw: '',
                    djjg: '',
                    hzrq: '',
                    djzt: '',
                    bak: '',
                    add_type: '',
                    add_time: '',
                    add_user: '',
                    up_time: '',
                    up_user: '',
                    ssjd: '',
                    vtype: ''
                },
                optionsName: [],
                selectedItem: {},
                windowInfo: {},
                doFastReg: false
            }
        },
//        beforeRouteEnter(to, from, next) {
//            getZwfwEnums().then(function () {
//                next();
//            })
//        },
        methods: {

            /**
             *
             * 提交非预审收件
             * */
            submitNoPretrial() {
                let _this = this;
                let checked_m = this.materialSelection.map(function (m) {
                    return m.id;
                });
                submitNoPretrial({
                    itemId: this.selectedItem,
                    memberCode: this.memberCode,
                    memberRealname: this.memberRealname,
                    memberPhone: this.memberPhone,
                    received: checked_m.join(','),
                    remark: this.remark
                }).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('提交成功');
                        let data = response.data;
                        if (data != null) {
                            _this.itemNumber = data.itemNumber;
                            _this.itemVo = data.itemVo;
                            _this.member = data.member;
                            _this.company = data.company;
                            _this.itemPretrialVo = data.itemPretrialVo;
                            _this.itemMaterialVoList = data.itemMaterialVoList;
                            _this.window = data.window;
                            _this.itemWindowUserName = data.itemWindowUserName;
                        } else {
                            this.$message.error('提交出错 ，' + response.msg);
                        }
                    } else {
                        this.$message.error('提交出错 ，' + response.msg);
                    }
                });
            },
            /**
             * 查询企业信息
             */
            queryCompanyInfo() {
                if (this.memberCode == '' || this.memberCode.length != 18) {
                    this.companyInfo = {};
                    return;
                }
                queryCompanyInfo({
                    memberCode: this.memberCode
                }).then(response => {
                    if (response.httpCode === 200) {
                        this.companyInfo = response.data;
                    } else {
                        this.companyInfo = {};
                    }
//                    console.log(response);
                })
            },

            queryItem(query) {
                const listQueryName = {
                    name: undefined,
                    basicCode: undefined
                }
                if (query !== '') {
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(query)) {
                        listQueryName.name = query;
                    } else {
                        listQueryName.basicCode = query
                    }
                    getAllByNameOrbasicCode(listQueryName).then(response => {
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
            changeItem(itemId) {
                getItemInfo({
                    id: itemId
                }).then(response => {
                    if (response.httpCode === 200) {
                        let data = response.data;
                        this.itemVo = data.itemVo;
                        this.itemMaterialVoList = data.itemMaterialVoList;
                    } else {
                        this.$message.error('网络超时');
                    }
                });
            },
            /**
             * 模拟当前用户登录到窗口
             */
            loginToWindow() {
                loginToWindow({
                    callerKey: this.loginCallerKey
                }).then(response => {
                    if (response.httpCode === 200) {
                        this.windowInfo = response.data;
                        this.$message.success('登录到窗口');
                    } else {
                        this.$message.error(response.msg);
                    }
                });
            },
            /**
             * 检测用户是否注册，如果注册，返回用户信息，如果没有注册显示出快速注册界面
             * */
            checkMemberExist() {
                checkMemberExist({
                    memberCode: this.memberCode
                }).then(response => {
                    if (response.httpCode === 200) {
                        if (response.data == null) {
                            //不存在
                            this.$message.warning("用户不存在，请注册");
                            this.doFastReg = true;
                        } else {
                            this.member = response.data;
                            this.$message.success("用户存在，请继续操作");
                            this.doFastReg = false;
                            if(!this.memberRealname) {
                                this.memberRealname = this.member.name;
                            }
                            if(!this.memberPhone) {
                                this.memberPhone = this.member.mobilephone;
                            }
                        }
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },

            sendFastRegPhoneCode() {
                sendFastRegPhoneCode({
                    phone: this.memberPhone
                }).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success("验证发送成功");
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            fastRegMember() {
                fastRegMember({
                    memberCode: this.memberCode,
                    memberPhone: this.memberPhone,
                    phoneCode: this.phoneCode,
                    memberRealname: this.memberRealname
                }).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success("用户注册成功");
                        this.doFastReg = false;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            /**
             * 抽号 - 根据预审号码
             */
            takeNumberByProcessNumber() {
                let _this = this;
                takeNumberByProcessNumber({
                    processNumber: this.getNumberBy_processNumber
                }).then(response => {
//                    console.log(data.data.callNumber);
                    if (response.httpCode === 200) {
                        _this.$message.success('抽到的号码是：' + response.data.callNumber);
                    } else {
                        _this.$message.error(response.msg);
                    }
                }).catch(e => {
                    console.log(e);
                });
            },
            /**
             * 抽号 - 根据事项编码
             */
            takeNumberByItemCode() {
                let _this = this;
                takeNumberByItemCode({
                    itemId: this.itemVo.id,
                    name: this.memberRealname,
                    phone: this.memberPhone,
                    iDNum:this.member.memberCode
                }).then(response => {
                    if (response.httpCode === 200) {
                        _this.$message.success('抽到的号码是：' + response.data.callNumber);
                    } else {
                        _this.$message.error(response.msg);
                    }
                });
            },

            /**
             * 查询 - 根据呼叫号查询今日此号码信息
             */
            queryNumberByCallNumber() {
                let _this = this;
                queryNumberByCallNumber({
                    hallNumber: this.getNumberBy_hallNumber
                }).then(response => {
                    if (response.httpCode === 200) {
                        if (response.data != null) {
                            let data = response.data;
                            _this.itemNumber = data.itemNumber;
                            _this.itemVo = data.itemVo;
                            _this.member = data.member;
                            _this.company = data.company;
                            _this.itemPretrialVo = data.itemPretrialVo;
                            _this.itemMaterialVoList = data.itemMaterialVoList;
                            _this.window = data.window;
                            _this.itemWindowUserName = data.itemWindowUserName;
                        } else {
                            _this.$message({
                                showClose: true,
                                message: '当前窗口没有正在办理的业务'
                            });
                        }
                    } else {
                        _this.$message.error(response.msg);
                    }
                });
            },
            /**
             *
             * 查询 - 当前此窗口正在办理的业务
             */
            queryCurrentNumber() {
                let _this = this;
                queryCurrentNumber({}).then(response => {
                    if (response.httpCode === 200) {
                        if (response.data != null) {
                            let data = response.data;
                            _this.itemNumber = data.itemNumber;
                            _this.itemVo = data.itemVo;
                            _this.member = data.member;
                            _this.company = data.company;
                            _this.itemPretrialVo = data.itemPretrialVo;
                            _this.itemMaterialVoList = data.itemMaterialVoList;
                            _this.window = data.window;
                            _this.itemWindowUserName = data.itemWindowUserName;
                        } else {
                            _this.$message({
                                showClose: true,
                                message: '当前窗口没有正在办理的业务'
                            });
                        }
                    } else {
                        _this.$message.error(response.msg);
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
                    }).then(response => {
                        if (response.httpCode === 200) {
                            let data = response.data;
                            if (data != null) {
                                _this.itemNumber = data.itemNumber;
                                _this.itemVo = data.itemVo;
                                _this.member = data.member;
                                _this.company = data.company;
                                _this.itemPretrialVo = data.itemPretrialVo;
                                _this.itemMaterialVoList = data.itemMaterialVoList;
                                _this.window = data.window;
                                _this.itemWindowUserName = data.itemWindowUserName;
                            }
                        } else {
                            _this.$message.error(response.msg);
                        }
                    });
                } else {
                    callNumber({}).then(response => {
                        if (response.httpCode === 200) {
                            let data = response.data;
                            if (data != null) {
                                _this.itemNumber = data.itemNumber;
                                _this.itemVo = data.itemVo;
                                _this.member = data.member;
                                _this.company = data.company;
                                _this.itemPretrialVo = data.itemPretrialVo;
                                _this.itemMaterialVoList = data.itemMaterialVoList;
                                _this.window = data.window;
                                _this.itemWindowUserName = data.itemWindowUserName;
                            } else {
                                _this.$message({
                                    showClose: true,
                                    message: '没有下一个号码了'
                                });
                            }
                        } else {
                            _this.$message.error(response.msg);
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
                }).then(response => {
                    if (response.httpCode === 200) {
                        let data = response.data;
                        if (data != null) {
                            _this.itemNumber = data.itemNumber;
                        }
                    } else {
                        _this.$message.error(response.msg);
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

                let msg = '';
                if (checked_m.length > 0) {
                    msg = '确认已经收件（' + checked_m.length + '项），是否确认并交由部门处理？'
                } else {
                    msg = '您没有勾选收件！！，是否确定直接提交部门处理？';
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
                    }).then(response => {
                        if (response.httpCode === 200) {
                            let data = response.data;
                            if (data != null) {
                                _this.itemNumber = data.itemNumber;
                                _this.itemVo = data.itemVo;
                                _this.member = data.member;
                                _this.company = data.company;
                                _this.itemPretrialVo = data.itemPretrialVo;
                                _this.itemMaterialVoList = data.itemMaterialVoList;
                                _this.window = data.window;
                                _this.itemWindowUserName = data.itemWindowUserName;
                            } else {
                                _this.$message({
                                    showClose: true,
                                    message: '没有下一个号码了'
                                });
                            }
                        } else {
                            _this.$message.error(response.msg);
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
                let _this = this;

                let _itemNumber = _this.itemNumber;

                let msg = '确定不予受理吗？';

                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    submitWork({
                        numberId: _itemNumber.id,
                        status: 4,
                        remark: this.remark
                    }).then(response => {
                        if (response.httpCode === 200) {
                            let data = response.data;
                            if (data != null) {
                                _this.itemNumber = data.itemNumber;
                                _this.itemVo = data.itemVo;
                                _this.member = data.member;
                                _this.company = data.company;
                                _this.itemPretrialVo = data.itemPretrialVo;
                                _this.itemMaterialVoList = data.itemMaterialVoList;
                                _this.window = data.window;
                                _this.itemWindowUserName = data.itemWindowUserName;
                            }
                        } else {
                            _this.$message.error(response.msg);
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

                let msg = '确定跳过吗？';

                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    submitWork({
                        numberId: _itemNumber.id,
                        status: 5,
                        remark: this.remark
                    }).then(response => {
                        if (response.httpCode === 200) {
                            let data = response.data;
                            if (data != null) {
                                _this.itemNumber = data.itemNumber;
                                _this.itemVo = data.itemVo;
                                _this.member = data.member;
                                _this.company = data.company;
                                _this.itemPretrialVo = data.itemPretrialVo;
                                _this.itemMaterialVoList = data.itemMaterialVoList;
                                _this.window = data.window;
                                _this.itemWindowUserName = data.itemWindowUserName;
                            }
                        } else {
                            _this.$message.error(response.msg);
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
                if (this.itemNumber != null) {
                    window.open('/api/hallSystem/hallCompositeWindow/downloadYwsld?numberId=' + this.itemNumber.id);
                }
            },
            print_wlzyd() {
                if (this.itemNumber != null) {
                    window.open('/api/hallSystem/hallCompositeWindow/downloadWlzyd?numberId=' + this.itemNumber.id);
                }
            },
            /**
             * TAB 页面切换的时候事件
             * @param tab
             * @param event
             */
            handleRightTabClick(tab, event) {
                console.log(tab, event);
            }
        },
        mounted() {
            getCurrentUserLoginedWindow().then(response => {
                if (response.httpCode == 200) {
                    if (response.data != null) {
                        console.log(response.data);
                        this.windowInfo = response.data;
                    } else {
                        //表示当前登录的ｗｅｂ用户没有登录到窗口
                    }
                } else {
                    this.$message.error('查询当前登录用户当前呼叫器登录的窗口错误');
                }
            });
        }
    }
</script>

<style>
    .tableDiv table {
        width: 100%;
        margin-top: 20px;
    }

    .tableDiv table th, .tableDiv table td {
        height: 30px;
        line-height: 30px;
        border: 1px solid #bfcbd9;
        padding: 6px;
        font-weight: normal;
    }

    .tableDiv table th {
        text-align: center;
        background-color: #eef1f6;
        font-size: 14px;
    }

    #itemInfo table {
        width: 100%;
    }

    #itemInfo table th, #itemInfo table td {
        height: 30px;
        line-height: 30px;
        border: 1px solid #bfcbd9;
        padding: 6px;
        font-size: 14px;
    }

    #itemInfo table td {
        text-indent: 2em;
    }

    #itemInfo table th {
        text-align: center;
        background-color: #eef1f6;
        font-weight: normal;
    }

    #materiaTable th {
        font-weight: normal;
    }

    #materiaTable th div {
        text-align: center;
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
