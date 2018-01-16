<template>
    <div>
        <el-row :gutter="0">
            <el-col :span="10">
                <div class="grid-content " v-loading.body="queryLoading">
                    <div style="padding:10px">
                        <el-tabs v-model="leftTabName" type="card">
                            <el-tab-pane label="当前窗口业务受理" name="virtualPanelLianhu">
                                <el-row :gutter="10">
                                    <el-col :span="10">
                                        <el-tooltip content="查询当前登录用户正在受理事项的状态，通常与窗口叫号器同步" placement="right"
                                                    effect="light">
                                            <el-button type="primary" @click="queryCurrentNumber"
                                                       :disabled="queryLoading">
                                                查询当前窗口正在呼叫的业务
                                            </el-button>
                                        </el-tooltip>
                                    </el-col>
                                    <el-col :span="7" :offset="3">
                                        <el-input v-model="getNumberBy_hallNumber" placeholder="输入排队号查询">
                                        </el-input>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button type="primary" :disabled="!getNumberBy_hallNumber"
                                                   @click="queryNumberByCallNumber">查询
                                        </el-button>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="25">
                                        <el-collapse v-model="showInputForm" style="margin-top:10px;">
                                            <el-collapse-item :title="'窗口办理事项受理'" name="1">
                                                <el-tabs v-model="memberType" @tab-click="queryItem()">
                                                    <el-tab-pane label="自然人" name="1">

                                                        <el-row :gutter="10">
                                                            <el-col :span="12">
                                                                <el-cascader v-model="categoryCascaderModel"
                                                                             @change="handleCategoryChange"
                                                                             :options="categoryCascader"
                                                                             class="filter-item"
                                                                             :show-all-levels="true" clearable
                                                                             filterable
                                                                             expand-trigger="hover"
                                                                             :change-on-select="true"
                                                                             placeholder="选择事项分类" style="width:100%">
                                                                </el-cascader>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-select
                                                                        v-model="selectedItem"
                                                                        placeholder="选择分类下的事项"
                                                                        filterable
                                                                        @change="changeItem" style="width:100%">
                                                                    <el-option
                                                                            v-for="item in optionsName"
                                                                            :key="item.id"
                                                                            :label="item.name+' ' + item.basicCode"
                                                                            :value="item.id">
                                                                    </el-option>
                                                                </el-select>
                                                            </el-col>
                                                        </el-row>

                                                        <el-row :gutter="10">
                                                            <el-col :span="19">
                                                                <el-input v-model="memberCode" placeholder="自然人身份证号码">
                                                                    <template slot="prepend">身份证号：</template>
                                                                </el-input>
                                                            </el-col>
                                                            <el-col :span="5">
                                                                <el-tooltip content="查询注册状态，如果未注册，成功受理后会自动注册"
                                                                            placement="bottom"
                                                                            effect="light">
                                                                    <el-button type="primary"
                                                                               @click="checkNatureMemberExist()"
                                                                               :disabled="!memberCode">注册查询
                                                                    </el-button>
                                                                </el-tooltip>
                                                            </el-col>
                                                        </el-row>
                                                        <el-row :gutter="10">
                                                            <el-col :span="11">
                                                                <el-tooltip content="如果已注册点击查找用户会自动填入，如果未注册请人工填写自然人姓名"
                                                                            placement="bottom"
                                                                            effect="light">
                                                                    <el-input v-model="memberRealname"
                                                                              placeholder="自然人姓名">
                                                                        <template slot="prepend">姓名：</template>
                                                                    </el-input>
                                                                </el-tooltip>
                                                            </el-col>
                                                            <el-col :span="13">
                                                                <el-input v-model="memberPhone" placeholder="手机号">
                                                                    <template slot="prepend">手机号：</template>
                                                                </el-input>
                                                            </el-col>
                                                        </el-row>
                                                    </el-tab-pane>
                                                    <el-tab-pane label="法人" name="2">
                                                        <el-row :gutter="10">
                                                            <el-col :span="12">
                                                                <el-cascader v-model="categoryCascaderModel"
                                                                             @change="handleCategoryChange"
                                                                             :options="categoryCascader"
                                                                             class="filter-item"
                                                                             :show-all-levels="true" clearable
                                                                             filterable
                                                                             expand-trigger="hover"
                                                                             :change-on-select="true"
                                                                             placeholder="选择事项分类" style="width:100%">
                                                                </el-cascader>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-tooltip class="item" effect="light"
                                                                            content="注意：事项选择会根据自然人、法人进行筛选"
                                                                            placement="top-start">
                                                                    <el-select
                                                                            v-model="selectedItem"
                                                                            placeholder="选择分类下的事项"
                                                                            filterable
                                                                            @change="changeItem" style="width:100%">
                                                                        <el-option
                                                                                v-for="item in optionsName"
                                                                                :key="item.id"
                                                                                :label="item.name+' ' + item.basicCode"
                                                                                :value="item.id">
                                                                        </el-option>
                                                                    </el-select>
                                                                </el-tooltip>
                                                            </el-col>
                                                        </el-row>
                                                        <el-row :gutter="10">
                                                            <el-col :span="12">
                                                                <el-input v-model="companyCode" placeholder="社会统一信用代码" @keyup.native="toUpperCase">
                                                                </el-input>
                                                            </el-col>
                                                            <el-col :span="6">
                                                                <el-tooltip content="从工商数据中查询，如果能查到自动填充到输入框"
                                                                            placement="bottom"
                                                                            effect="light">
                                                                    <el-button type="primary"
                                                                               @click="queryCompanyInfo"
                                                                               :disabled="!companyCode">工商库查询
                                                                    </el-button>
                                                                </el-tooltip>
                                                            </el-col>
                                                            <el-col :span="6">
                                                                <el-tooltip
                                                                        content="查询注册状态，如果能查到自动填充到输入框，如果未注册，成功受理后会自动注册用户，登录名为法人身份证号码"
                                                                        placement="bottom"
                                                                        effect="light">
                                                                    <el-button type="primary"
                                                                               @click="checkLegalMemberExist()"
                                                                               :disabled="!companyCode">注册查询
                                                                    </el-button>
                                                                </el-tooltip>
                                                            </el-col>
                                                        </el-row>
                                                        <el-row>
                                                            <el-col :span="25">
                                                                <el-input v-model="companyName" placeholder="企业名称">
                                                                </el-input>
                                                            </el-col>
                                                            <!--<el-col :span="5">
                                                                <el-button type="primary" @click="sendFastRegPhoneCode"
                                                                           :disabled="!doFastReg">发送验证码
                                                                </el-button>
                                                            </el-col>-->
                                                        </el-row>
                                                        <el-row :gutter="10">
                                                            <el-col :span="8">
                                                                <el-input v-model="memberRealname"
                                                                          placeholder="法人姓名">
                                                                    <!--<template slot="prepend">法人姓名：</template>-->
                                                                </el-input>
                                                            </el-col>
                                                            <el-col :span="10">
                                                                <el-input v-model="memberCode" placeholder="法人身份证号">
                                                                    <!--<template slot="prepend">身份证号：</template>-->
                                                                </el-input>
                                                            </el-col>
                                                            <el-col :span="6">
                                                                <el-input v-model="memberPhone" placeholder="手机号">
                                                                    <!--<template slot="prepend">手机号：</template>-->
                                                                </el-input>
                                                            </el-col>
                                                        </el-row>


                                                        <!--<el-row :gutter="10" v-show="doFastReg">
                                                                                        <el-col :span="17">
                                                                                            <el-input v-model="phoneCode" :disabled="!doFastReg" placeholder="输入手机收到的验证码"></el-input>
                                                                                        </el-col>
                                                                                        <el-col :span="4">
                                                                                            <el-button type="primary" @click="fastRegMember"
                                                                                                       :disabled="!doFastReg">快速注册
                                                                                            </el-button>
                                                                                        </el-col>
                                                                                    </el-row>-->
                                                    </el-tab-pane>
                                                </el-tabs>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="快递/快件箱收件">
                                <el-row :gutter="10">
                                    <el-col :span="10">
                                        <el-tooltip content="已知预审号时直接进行收件操作" placement="top"
                                                    effect="light">
                                            <el-input v-model="getNumberBy_processNumber" placeholder="输入预审号">
                                            </el-input>
                                        </el-tooltip>
                                    </el-col>
                                    <el-col :span="7">

                                        <el-button type="primary" @click="handlingNumberByProcessNumber"
                                                   :disabled="!getNumberBy_processNumber">已预审收件办理
                                        </el-button>

                                    </el-col>
                                    <el-col :span="7">

                                        <el-button type="primary" @click="showPendingHandBoxSelectionDialog">快件箱事项受理
                                        </el-button>

                                    </el-col>
                                </el-row>

                                <el-row :gutter="10">
                                    <el-col :span="17">
                                        <el-tooltip content="邮寄交件时，通过快递单号进行收件操作" placement="bottom"
                                                    effect="light">
                                            <el-input v-model="getNumberBy_expressNumber" placeholder="输入快递单号">
                                            </el-input>
                                        </el-tooltip>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button type="primary" @click="handlingNumberByExpressNumber"
                                                   :disabled="!getNumberBy_expressNumber">快递收件办理
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="虚拟抽号机/叫号器" name="virtualPanel">
                                <el-row v-if="windowInfo==null || windowInfo.id==null" :gutter="10">
                                    <el-col :span="17">
                                        <el-select v-model="loginCallerKey" placeholder="未登录到窗口">
                                            <el-option
                                                    v-for="item in windowList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.callerKey">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-tooltip class="item" effect="dark" content="请勿登录到其他人员正在使用的窗口"
                                                    placement="top-start">
                                            <el-button type="primary" @click="loginToWindow"
                                                       :disabled="!loginCallerKey">
                                                登录窗口
                                            </el-button>
                                        </el-tooltip>
                                    </el-col>
                                </el-row>
                                <el-row v-if="windowInfo!=null && windowInfo.id!=null" :gutter="10">
                                    <el-col :span="19">
                                        <el-input :value="'已经登录到' + windowInfo.callerKey + '窗口'" disabled
                                                  placeholder="模拟叫号器操作，请先输入窗口编号登录"></el-input>
                                    </el-col>
                                    <el-col :span="3">
                                        <el-button type="primary" @click="windowInfo= {}">重新登录</el-button>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="7">
                                        <el-radio-group v-model="memberType" @change="queryItem()">
                                            <el-radio-button label="1">自然人</el-radio-button>
                                            <el-radio-button label="2">法人</el-radio-button>
                                        </el-radio-group>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input v-model="memberCode" placeholder="身份证号码">
                                        </el-input>
                                    </el-col>
                                    <el-col :span="5">
                                        <el-input v-model="memberRealname" placeholder="姓名">
                                        </el-input>
                                    </el-col>
                                    <el-col :span="5">
                                        <el-input v-model="memberPhone" placeholder="手机号">
                                        </el-input>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="8">
                                        <el-cascader v-model="categoryCascaderModel"
                                                     @change="handleCategoryChange"
                                                     :options="categoryCascader"
                                                     class="filter-item"
                                                     :show-all-levels="true" clearable filterable
                                                     expand-trigger="hover"
                                                     :change-on-select="true" placeholder="选择事项分类">
                                        </el-cascader>
                                    </el-col>
                                    <el-col :span='11'>
                                        <el-tooltip class="item" effect="light" content=" 注意：事项选择会根据自然人、法人进行筛选"
                                                    placement="top-start">
                                            <el-select
                                                    v-model="selectedItem"
                                                    placeholder="选择分类下的事项"
                                                    filterable
                                                    @change="changeItem" style="width:100%">
                                                <el-option
                                                        v-for="item in optionsName"
                                                        :key="item.id"
                                                        :label="item.name+' ' + item.basicCode"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-tooltip>
                                    </el-col>
                                    <el-col :span="3">
                                        <el-button type="primary" @click="takeNumberByItemCode"
                                                   :disabled="!itemVo || !itemVo.id || !member ||  !member.id">事项抽号
                                        </el-button>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="19">
                                        <el-input v-model="getNumberBy_processNumber" placeholder="如根据预审号抽号，请输入预审号">
                                        </el-input>
                                    </el-col>
                                    <el-col :span="3">
                                        <el-button type="primary" @click="takeNumberByProcessNumber"
                                                   :disabled="!getNumberBy_processNumber">预审抽号
                                        </el-button>
                                    </el-col>
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
                            </el-tab-pane>
                        </el-tabs>


                        <el-tabs v-model="numberTab" type="card" style="margin-top:10px;">
                            <el-tab-pane label="受理信息" name="number">
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
                                            <th>姓名:</th>
                                            <td>{{member.naturePerson.name}}</td>
                                        </tr>
                                        <tr v-if="member!=null && member.naturePerson!=null">
                                            <th>联系电话:</th>
                                            <td>{{member.naturePerson.phone}}</td>
                                        </tr>
                                        <tr v-if="member!=null && member.legalPerson!=null">
                                            <th>企业法人:</th>
                                            <td>{{member.legalPerson.legalPerson}}</td>
                                        </tr>
                                        <tr v-if="member!=null && member.legalPerson!=null">
                                            <th>联系电话:</th>
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
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="工商信息" name="company">
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
                                <div v-else>
                                    <div style="text-align:center">未从工商信息库查询到信息</div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>


                    </div>
                </div>
            </el-col>
            <el-col :span="14">
                <div class="grid-content " v-loading.body="queryLoading">
                    <div style="padding:10px">
                        <el-tabs v-model="rightTabName" type="card" @tab-click="handleRightTabClick">
                            <el-tab-pane label="所需资料" name="materialListPanel">
                                <p v-if="itemNumber.status==6 || (itemVo.id && !itemNumber.id)">
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
                                            v-if="itemNumber.status==6 || (itemVo.id && !itemNumber.id)"
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
                            <el-button type="primary" @click="print_wlzyd">打印物料转移单</el-button>

                            <el-button type="primary" @click="resetForm">
                                清空
                            </el-button>
                        </div>

                        <div v-if="itemNumber.status==4" style="margin-top:20px;">
                            <el-button type="primary" @click="print_ycxgzd">打印一次性告知单</el-button>
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
                            <!--根据事项的交件方式显示，此选择框是为了防止用户选择其他交件方式后，人工直接来大厅办理，收件后数据不一致-->
                            <!--<el-select v-model="itemHandTypeVo.handType" placeholder="确定交件方式" :disabled="!itemVo.id"
                                       @change="handleChangeHandType">
                                <el-option v-for="item in itemHandTypeList" :key="item" :value="item"
                                           :label="item | parseToInt | enums('HandType')">
                                </el-option>
                            </el-select>-->
                            <el-input v-model="handTypeText" placeholder="请选择交件方式" :disabled="!itemVo.id"
                                      readonly style="width: 180px" icon="edit"
                                      @focus="handleChangeHandType"></el-input>
                            <!--<el-select v-model="itemTakeTypeVo.takeType" placeholder="请选择取件方式" v-if="!takeTypeVo"
                                       @change="handleChangeTakeType">
                                <el-option v-for="item in itemTakeTypeList" :key="item" :value="item"
                                           :label="item | parseToInt | enums('TakeType')">
                                </el-option>
                            </el-select>-->
                            <el-input v-model="takeTypeText" placeholder="请选择取件方式"
                                      v-if="itemVo.id && !takeTypeVo"
                                      readonly style="width: 180px" icon="edit"
                                      @focus="handleChangeTakeType"></el-input>
                            <!--抽了号，但是号不是正在处理的不能点击确认收件；或者不关心是否抽号和抽号状态，没有手机号或姓名或身份证号或统一社会信用代码的按钮不可点击（莲湖直接收件）-->
                            <el-button
                                    :disabled="(itemNumber.id &&  itemNumber.status!=6) || !memberPhone || !memberRealname ||!memberCode || submiting || !itemVo || !itemVo.id"
                                    type="primary"
                                    :loading="submiting" @click="pass">
                                确认收件
                            </el-button>
                            <!--抽了号，但是号不是正在处理的不能点击确认收件；此处对于莲湖不在系统抽号直接提交的模式来说，一直会显示为禁用-->
                            <!--TODO 按理说拒收也应该是要提交并保存一条抽号受理记录-->
                            <el-button :disabled="!itemNumber.id || itemNumber.status!=6" type="primary"
                                       @click="reject">
                                不予受理
                            </el-button>

                        </div>

                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="修改交件信息" :visible.sync="handTypeVisible" :close-on-click-modal="closeOnClickModal"
                   :show-close="false">
            <el-form ref="handTypeForm" :model="itemHandTypeVo" :rules="handTypeInfoRules"
                     label-width="100px" class="small-space" label-position="right"
                     style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                <el-form-item label="交件方式" prop="handType">
                    <el-select v-model="itemHandTypeVo.handType">
                        <el-option v-for="item in itemHandTypeList" :key="item"
                                   :value="item" :label="item | parseToInt | enums('HandType')"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快件箱" prop="mailboxInfo.mailboxId" v-show="itemHandTypeVo.handType == 2"
                              :rules="itemHandTypeVo.handType == 2 ? handTypeInfoRules.mailboxId : []">
                    <el-select v-model="itemHandTypeVo.mailboxInfo.mailboxId" style="width:100%"
                               @change="validateField('handTypeForm', 'mailboxInfo.mailboxId')">
                        <el-option v-for="item in mailboxList" :key="item.id"
                                   :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递公司" prop="postInfo.expressCompany" v-show="itemHandTypeVo.handType == 3"
                              :rules="itemHandTypeVo.handType == 3 ? handTypeInfoRules.expressCompany : []">
                    <el-select v-model="itemHandTypeVo.postInfo.expressCompany" style="width:100%"
                               @change="validateField('handTypeForm', 'postInfo.expressCompany')">
                        <el-option v-for="item in dics['kdgs']" :key="item.code" :value="item.code" :label="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递单号" prop="postInfo.expressNumber" v-show="itemHandTypeVo.handType == 3"
                              :rules="itemHandTypeVo.handType == 3 ? handTypeInfoRules.expressNumber : []">
                    <el-input v-model="itemHandTypeVo.postInfo.expressNumber" placeholder="请输入快递单号"
                              @blur="validateField('handTypeForm', 'postInfo.expressNumber')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetItemHandTypeVo">重 置</el-button>
                <el-button type="primary" icon="circle-check" @click="saveHandType">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改取件信息" :visible.sync="takeTypeVisible" :close-on-click-modal="closeOnClickModal"
                   :show-close="false">
            <el-form ref="takeTypeForm" :model="itemTakeTypeVo" :rules="takeTypeInfoRules"
                     label-width="100px" class="small-space" label-position="right"
                     style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                <el-form-item label="取件方式" prop="takeType">
                    <el-select v-model="itemTakeTypeVo.takeType" @change="initCardHeader">
                        <el-option v-for="item in itemTakeTypeList" :key="item"
                                   :value="item" :label="item | parseToInt | enums('TakeType')"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快件箱" prop="mailboxInfo.mailboxId" v-show="itemTakeTypeVo.takeType == 2"
                              :rules="itemTakeTypeVo.takeType == 2 ? takeTypeInfoRules.mailboxId : []">
                    <el-select v-model="itemTakeTypeVo.mailboxInfo.mailboxId" style="width:100%"
                               @change="validateField('takeTypeForm', 'mailboxInfo.mailboxId')">
                        <el-option v-for="item in mailboxList" :key="item.id"
                                   :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收件人姓名" prop="postInfo.name" v-if="itemTakeTypeVo.takeType == 3 && !cardVisible"
                              :rules="itemTakeTypeVo.takeType == 3 ? takeTypeInfoRules.postName : []">
                    <el-input v-model="itemTakeTypeVo.postInfo.name"
                              @blur="validateField('takeTypeForm', 'postInfo.name')"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="postInfo.mobilephone"
                              v-if="itemTakeTypeVo.takeType == 3 && !cardVisible"
                              :rules="itemTakeTypeVo.takeType == 3 ? takeTypeInfoRules.postPhone : []">
                    <el-input v-model="itemTakeTypeVo.postInfo.mobilephone"
                              @blur="validateField('takeTypeForm', 'postInfo.mobilephone')"></el-input>
                </el-form-item>
                <el-form-item label="收件地址" prop="postInfo.address" v-if="itemTakeTypeVo.takeType == 3 && !cardVisible"
                              :rules="itemTakeTypeVo.takeType == 3 ? takeTypeInfoRules.postAddress : []">
                    <el-input v-model="itemTakeTypeVo.postInfo.address"
                              @blur="validateField('takeTypeForm', 'postInfo.address')"></el-input>
                </el-form-item>
                <el-form-item label="收件地址" prop="postInfo.addresseeId"
                              v-if="itemTakeTypeVo.takeType == 3 && cardVisible">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix card-header">
                            <div class="card-item">
                                <p class="p1">
                                    {{cardHeader.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{cardHeader.phone}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span v-if="cardHeader.defaultFlag">默认</span>
                                </p>
                                <p>{{cardHeader.address}}</p>
                            </div>
                            <el-button type="primary" @click="showCardItems">选择地址</el-button>
                            <el-button type="text" @click="showTakeTypeAddresseeForm">添加地址</el-button>
                        </div>
                        <div class="card-body" v-show="cardItemVisible">
                            <div v-for="item in addresseeList" :key="item.id" class="card-item">
                                <el-radio v-model="itemTakeTypeVo.postInfo.addresseeId" :label="item.id">{{item.remark}}
                                </el-radio>
                                <p class="p1">
                                    {{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.phone}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span v-if="item.defaultFlag">默认</span>
                                </p>
                                <p>{{item.address}}</p>
                            </div>
                            <div v-if="!addresseeList || addresseeList.length <= 0">没有任何收件地址信息</div>
                        </div>
                    </el-card>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetItemTakeTypeVo">重 置</el-button>
                <el-button type="primary" icon="circle-check" @click="saveTakeType">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="收件箱办件受理" :visible.sync="displayPendingFromBoxDialog" size="large">
            <el-table :data="pendingFromBoxList" v-loading="pendingFromBoxListLoading"

                      element-loading-text="拼命加载中" highlight-current-row
                      @current-change="handlePendingFromBoxCurrentChange" style="width: 100%">
                <!--<el-table-column property="memberId" label="注册用户"></el-table-column>-->
                <el-table-column property="pretrialNumber" label="办件号"></el-table-column>
                <!--<el-table-column property="handType" label="交件方式">-->
                    <!---->
                <!--</el-table-column>-->
                <el-table-column property="handTime" label="取出时间"></el-table-column>
                <el-table-column property="memberType" label="用户类型">
                    <template scope="scope">
                        {{scope.row.memberType | enums('MemberType')}}
                    </template>
                </el-table-column>
                <el-table-column property="companyName" label="企业名称"></el-table-column>
                <el-table-column property="companyCode" label="社会统一信用代码"></el-table-column>
                <el-table-column property="personIdCard" label="办理对象身份证号"></el-table-column>
                <el-table-column property="memberName" label="姓名/法人姓名"></el-table-column>
                <el-table-column property="phone" label="手机号码"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import {
        takeNumberByProcessNumber,
        handlingNumberByProcessNumber,
        takeNumberByItemCode,
        handlingNumberByExpressNumber,
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
        checkLegalMemberExist,
        checkNatureMemberExist,
        fastRegMember,
        queryPendingFromBoxList
    } from 'api/hallSystem/window/receive/windowAccept';
    import {getAllByNameOrbasicCode} from 'api/zwfwSystem/business/item';
    import {getCategoryCascader} from 'api/zwfwSystem/business/category';
    import {getAllMailbox} from 'api/hallSystem/window/mailbox';
    import {getAllAddresseesByMemberId} from 'api/hallSystem/member/memberAddressee';
    import {validatMobiles} from 'utils/validate'
    import {mapGetters} from 'vuex';
    import {enums, parseToInt} from '../../../../filters';
    import {copyProperties} from 'utils';


    export default {
        name: 'compositeWindowWork',
        data() {
            const validateMobiles = (rule, value, callback) => {
                if (!validatMobiles(value)) {
                    callback(new Error('手机号码格式不正确'));
                }
                callback();
            };
            return {
                getNumberBy_processNumber: '',
                getNumberBy_hallNumber: '',
                getNumberBy_expressNumber: '',
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
                leftTabName: 'virtualPanelLianhu',
                numberTab: 'number',
                itemMaterialVoList: [],
                window: {},
                itemWindowUserName: '',
                loginCallerKey: '',
                memberCode: '',
                memberRealname: '',
                memberPhone: '',
                companyName: '',
                companyCode: '',
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
                selectedItem: null,
                windowInfo: {},
                doFastReg: false,
                // categoryId: 7344364064835072,
                categoryCascader: [],
                itemCategory: null,
                categoryCascaderModel: [],
                showInputForm: '1',
                memberType: '2',
                itemHandTypeList: [],
                itemTakeTypeList: [],
                mailboxList: [],
                addresseeList: [],
                handTypeVisible: false,
                takeTypeVisible: false,
                dialogLoading: false,
                cardVisible: false,
                cardItemVisible: false,
                cardHeader: {
                    name: undefined,
                    phone: undefined,
                    address: undefined,
                    defaultFlag: false
                },
                itemHandTypeVo: {
                    id: undefined,
                    handType: undefined,
                    mailboxInfo: {
                        id: undefined,
                        mailboxId: undefined
                    },
                    postInfo: {
                        id: undefined,
                        addresseeId: undefined,
                        expressCompany: undefined,
                        expressNumber: undefined
                    }
                },
                itemTakeTypeVo: {
                    id: undefined,
                    takeType: undefined,
                    mailboxInfo: {
                        id: undefined,
                        mailboxId: undefined
                    },
                    postInfo: {
                        id: undefined,
                        addresseeId: undefined,
                        name: undefined,
                        mobilephone: undefined,
                        address: undefined
                    }
                },
                handTypeInfoRules: {
                    handType: [
                        {required: true, message: '请选择交件方式', trigger: 'change'}
                    ],
                    mailboxId: [
                        {required: true, message: '请选择快件箱', trigger: 'change'}
                    ],
                    expressCompany: [
                        {required: true, message: '请选择快递公司', trigger: 'change'}
                    ],
                    expressNumber: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'}
                    ]
                },
                takeTypeInfoRules: {
                    takeType: [
                        {required: true, message: '请选择取件方式', trigger: 'change'}
                    ],
                    mailboxId: [
                        {required: true, message: '请选择快件箱', trigger: 'change'}
                    ],
                    postName: [
                        {required: true, message: '收件人姓名不能为空', trigger: 'blur'}
                    ],
                    postPhone: [
                        {required: true, message: '收件人手机号不能为空', trigger: 'blur'},
                        {validator: validateMobiles, trigger: 'blur'}
                    ],
                    postAddress: [
                        {required: true, message: '收件地址不能为空', trigger: 'blur'}
                    ]
                },
                takeTypeVo: null,
                handTypeVo: null,
                submiting: false,
                queryLoading: false,
                windowList: [],
                /*弹出从快件箱交件中选择*/
                displayPendingFromBoxDialog: false,
                pendingFromBoxList: [],
                pendingFromBoxListLoading: false
            }
        },
        watch: {
            'itemTakeTypeVo.postInfo.addresseeId'() {
                if (this.cardVisible) {
                    this.initCardHeader();
                    this.cardItemVisible = false;
                }
            }
        },
        computed: {
            ...mapGetters([
                'enums',
                'dics',
                'closeOnClickModal'
            ]),
            handTypeText() {
                return enums(parseToInt(this.itemHandTypeVo.handType), 'HandType');
            },
            takeTypeText() {
                return enums(parseToInt(this.itemTakeTypeVo.takeType), 'TakeType');
            }
        },
//        beforeRouteEnter(to, from, next) {
//            getZwfwEnums().then(function () {
//                next();
//            })
//        },
        methods: {
            queryPendingFromBoxList() {
                this.pendingFromBoxList = [];
                this.pendingFromBoxListLoading = true;
                queryPendingFromBoxList({}).then(response => {
                    this.pendingFromBoxListLoading = false;
                    if (response.httpCode === 200) {
                        this.pendingFromBoxList = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e => {
                    this.pendingFromBoxListLoading = false;
                    this.$message.error("加载超时");
                });
            },
            handlePendingFromBoxCurrentChange(currentRow){
                if(currentRow) {
                    this.getNumberBy_processNumber = currentRow.pretrialNumber;
                    this.handlingNumberByProcessNumber();
                }
            },
            getCategoryCascader() {
                getCategoryCascader().then(response => {
                    if (response.httpCode === 200) {
                        this.categoryCascader = response.data;
                    } else {
                        this.$message.error(response.msg);
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
            getMemberAddressees() {
                getAllAddresseesByMemberId({
                    memberId: this.member.id
                }).then(response => {
                    if (response.httpCode == 200) {
                        this.addresseeList = response.data;
                        this.initCardHeader();
                    } else {
                        this.$message.error('数据加载失败');
                    }
                })
            },
            initCardHeader() {
                if (!this.addresseeList || this.addresseeList.length <= 0 || this.itemTakeTypeVo.takeType != 3) {
                    return;
                }
                let addressee;
                if (this.itemTakeTypeVo.postInfo.addresseeId) {
                    for (let item of this.addresseeList) {
                        if (item.id == this.itemTakeTypeVo.postInfo.addresseeId) {
                            addressee = item;
                            break;
                        }
                    }
                } else {
                    for (let item of this.addresseeList) {
                        if (item.defaultFlag) {
                            addressee = item;
                            break;
                        }
                    }
                    if (!addressee) {
                        addressee = this.addresseeList[0];
                    }
                }
                this.itemTakeTypeVo.postInfo.addresseeId = addressee.id;
                copyProperties(this.cardHeader, addressee);
                this.cardVisible = true;
            },
            handleChangeHandType() {
                this.handTypeVisible = true;
            },
            handleChangeTakeType() {
                this.takeTypeVisible = true;
            },
            showCardItems() {
                this.cardItemVisible = !this.cardItemVisible;
            },
            showTakeTypeAddresseeForm() {
                this.cardVisible = false;
                this.cardItemVisible = false;
                this.itemTakeTypeVo.postInfo.addresseeId = undefined;
            },
            saveHandType() {
                this.$refs['handTypeForm'].validate(valid => {
                    if (valid) {
                        this.handTypeVisible = false;
                    }
                })
            },
            saveTakeType() {
                this.$refs['takeTypeForm'].validate(valid => {
                    if (valid) {
                        this.takeTypeVisible = false;
                    }
                })
            },

            /**
             * 显示选择快件箱已取未办的列表
             */
            showPendingHandBoxSelectionDialog() {
                this.displayPendingFromBoxDialog = true;
                this.queryPendingFromBoxList();
            },
            toUpperCase(){
                this.companyCode = this.companyCode.toUpperCase();
            },
            /**
             * 查询企业信息
             */
            queryCompanyInfo() {
                this.companyInfo = {};
                if (this.companyCode == '' || this.companyCode.length != 18) {
                    this.companyInfo = {};
                    this.$message.warning("社会统一信用代码不正确，跳过查询工商企业信息库");
                    return;
                }
                queryCompanyInfo({
                    companyCode: this.companyCode
                }).then(response => {
                    if (response.httpCode === 200) {
                        let c = response.data;
                        if (c) {
                            this.numberTab = 'company';
                            this.companyInfo = c;
                            this.memberPhone = c.lxdh;
                            this.memberRealname = c.fr;
                            this.companyName = c.qymc;
                            this.companyCode = c.ty_code;
                            this.memberCode = c.fr_id ? c.fr_id : '';
                        } else {
                            this.$message.warning("企业信息中没有搜索到【" + this.companyCode + "】企业信息");
                        }
                    } else {
                        this.$message.error("企业信息查询失败");
                        this.companyInfo = {};
                    }
                })
            },

            /**
             * 查询事项列表
             * */
            queryItem(query) {
                if (!this.itemCategory) {
                    return;
                }
                this.selectedItem = null;
                const listQueryName = {
                    name: undefined,
                    basicCode: undefined,
                    itemCategories: this.itemCategory,
                    serviceObject: this.memberType == '1' ?
                        'fwdx_ziranren,fwdx_common' : 'fwdx_faren,fwdx_common'
                };
                // this.selectedItem= null;
                if (query !== '') {
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(query)) {
                        listQueryName.name = query;
                    } else {
                        listQueryName.basicCode = query
                    }
                } else {
                    this.optionsName = [];
                }
                getAllByNameOrbasicCode(listQueryName).then(response => {
                    if (response.httpCode === 200) {
                        this.optionsName = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                });
            },
            /**
             *
             *  选中事项变化时
             * */
            changeItem(itemId) {
                if (!itemId || itemId == this.itemVo.id || this.loading) {
                    return;
                }
                //清空事项信息
                this.itemVo = {};
                //清空所需材料列表信息
                this.itemMaterialVoList = [];
                // alert(itemId)
                this.loading = true;
                getItemInfo({
                    id: itemId
                }).then(response => {
                    this.loading = false;
                    if (response.httpCode === 200) {
                        let data = response.data;
                        this.itemVo = data.itemVo;
                        this.itemHandTypeList = data.itemVo.handTypes.split(',');
                        this.itemTakeTypeList = data.itemVo.takeTypes.split(',');
                        this.itemMaterialVoList = data.itemMaterialVoList;
                    } else {
                        this.$message.error('网络超时');
                    }
                }).catch(e => {
                    this.loading = false;
                });
            },
            //事项分类变化时触发
            handleCategoryChange(value) {
                if (value.length > 0) {
                    this.itemCategory = value[value.length - 1];
                    this.queryItem(); // 重新根据新的分类查询事项列表
                }
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
             * 检测自然人用户是否注册，如果注册，返回用户信息，如果没有注册显示出快速注册界面
             * */
            checkNatureMemberExist() {
                checkNatureMemberExist({
                    memberCode: this.memberCode
                }).then(response => {
                    if (response.httpCode === 200) {
                        if (response.data == null) {
                            //不存在
                            this.$message.warning("未注册");
                            this.doFastReg = true;
                            this.memberRealname = '';
                            this.memberPhone = '';
                        } else {
                            this.member = response.data;
                            this.$message.success("已注册");
                            this.doFastReg = false;
                            if (!this.memberRealname) {
                                this.memberRealname = this.member.name;
                            }
                            if (!this.memberPhone) {
                                this.memberPhone = this.member.mobilephone;
                            }
                        }
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            /**
             * 检测法人用户是否注册，如果注册，返回用户信息，如果没有注册显示出快速注册界面
             * */
            checkLegalMemberExist() {
                checkLegalMemberExist({
                    companyCode: this.companyCode
                }).then(response => {
                    if (response.httpCode === 200) {
                        if (response.data == null) {
                            //不存在
                            this.$message.warning("未注册");
                            this.doFastReg = true;
                            this.memberRealname = '';
                            this.memberPhone = '';
                        } else {
                            this.member = response.data;
                            this.$message.success("已注册");
                            this.doFastReg = false;
                            if (!this.memberRealname) {
                                this.memberRealname = this.member.name;
                            }
                            if (!this.memberPhone) {
                                this.memberPhone = this.member.mobilephone;
                            }
                        }
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            /**
             * 清除
             * */
            resetForm() {
                this.itemVo = {};
                this.itemNumber = {};
                this.companyInfo = {};
                this.memberPhone = '';
                this.memberRealname = '';
                this.memberCode = '';
                this.itemMaterialVoList = [];
                // this.selectedItem = null;
                this.getNumberBy_processNumber = '';
                // this.getNumberBy_hallNumber = '';
                this.getNumberBy_expressNumber = '';
            },

            sendFastRegPhoneCode() {
                this.queryLoading = true;
                sendFastRegPhoneCode({
                    phone: this.memberPhone
                }).then(response => {
                    this.queryLoading = false;
                    if (response.httpCode === 200) {
                        this.$message.success("验证发送成功");
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e => {
                    console.log(e);
                    this.queryLoading = false;
                })
            },
            fastRegMember() {
                this.queryLoading = true;
                fastRegMember({
                    memberCode: this.memberCode,
                    memberPhone: this.memberPhone,
                    phoneCode: this.phoneCode,
                    memberRealname: this.memberRealname
                }).then(response => {
                    this.queryLoading = false;
                    if (response.httpCode === 200) {
                        this.$message.success("用户注册成功");
                        this.doFastReg = false;
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e => {
                    console.log(e);
                    this.queryLoading = false;
                })
            },
            /**
             * 抽号 - 根据预审号码
             */
            takeNumberByProcessNumber() {
                let _this = this;
                this.queryLoading = true;
                takeNumberByProcessNumber({
                    processNumber: this.getNumberBy_processNumber
                }).then(response => {
                    this.queryLoading = false;
                    if (response.httpCode === 200) {
                        _this.$message.success('抽到的号码是：' + response.data.callNumber);
                        //执行查询
                        _this.getNumberBy_hallNumber = response.data.callNumber;
                        _this.queryNumberByCallNumber();
                    } else {
                        _this.$message.error(response.msg);
                    }
                }).catch(e => {
                    console.log(e);
                    this.queryLoading = false;
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
                    iDNum: this.member.memberCode
                }).then(response => {
                    if (response.httpCode === 200) {
                        _this.showInputForm = 1;
                        _this.$message.success('抽到的号码是：' + response.data.callNumber);
                        //执行查询
                        _this.getNumberBy_hallNumber = response.data.callNumber;
                        _this.queryNumberByCallNumber();
                    } else {
                        _this.$message.error(response.msg);
                    }
                }).catch(e => {
                    this.queryLoading = false;
                });
                ;
            },

            /**
             * 抽号并开始受理 - 根据寄件快递单号
             */
            handlingNumberByExpressNumber() {
                let _this = this;
                this.queryLoading = true;
                handlingNumberByExpressNumber({
                    expressCompany: null,
                    expressNumber: this.getNumberBy_expressNumber
                }).then(response => {
                    this.queryLoading = false;
                    if (response.httpCode === 200) {
                        if (response.data != null) {
                            //执行查询
                            _this.getNumberBy_hallNumber = response.data.callNumber;
                            _this.queryNumberByCallNumber();
                        }
                    } else {
                        _this.$message.error(response.msg);
                    }
                }).catch(e => {
                    this.queryLoading = false;
                });
            },

            /**
             * 抽号并开始受理 - 根据寄件快递单号
             */
            handlingNumberByProcessNumber() {
                let _this = this;
                this.queryLoading = true;
                handlingNumberByProcessNumber({
                    processNumber: this.getNumberBy_processNumber
                }).then(response => {
                    this.queryLoading = false;
                    if (response.httpCode === 200) {
                        if (response.data != null) {
                            //执行查询
                            _this.getNumberBy_hallNumber = response.data.callNumber;
                            _this.queryNumberByCallNumber();
                        }
                    } else {
                        _this.$message.error(response.msg);
                    }
                }).catch(e => {
                    this.queryLoading = false;
                })
            },

            /**
             * 查询 - 根据呼叫号查询今日此号码信息
             */
            queryNumberByCallNumber() {
                let _this = this;
                this.resetForm();
                this.queryLoading = true;
                setTimeout(function () {
                    queryNumberByCallNumber({
                        hallNumber: this.getNumberBy_hallNumber
                    }).then(response => {
                        _this.queryLoading = false;
                        if (response.httpCode === 200) {
                            if (response.data != null) {
                                _this.refreshNumber(response.data);
                            } else {
                                _this.$message({
                                    showClose: true,
                                    message: '当前窗口没有正在办理的业务'
                                });
                            }
                        } else {
                            _this.$message.error(response.msg);
                        }
                    }).catch(e => {
                        _this.queryLoading = false;
                    });
                }, 1000);
            },
            refreshNumber(data) {
                let _this = this;
                _this.numberTab = 'number';
                _this.itemNumber = data.itemNumber;
                _this.itemVo = data.itemVo;
                this.itemHandTypeList = data.itemVo.handTypes.split(',');
                this.itemTakeTypeList = data.itemVo.takeTypes.split(',');
                this.itemHandTypeVo.postInfo.addresseeId = data.itemVo.addresseeId;
                _this.member = data.member;
                // _this.company = data.company;
                _this.itemPretrialVo = data.itemPretrialVo;
                _this.itemMaterialVoList = data.itemMaterialVoList;
                _this.window = data.window;
                _this.itemWindowUserName = data.itemWindowUserName;
                if (data.itemNumber) {
                    _this.showInputForm = data.itemNumber.flagPretrial ? 0 : 1;
                }

                //   取件方式
                if (data.takeTypeVo) {
                    _this.takeTypeVo = data.takeTypeVo;
                    copyProperties(_this.itemTakeTypeVo, data.takeTypeVo);
                    this.itemTakeTypeVo.takeType += '';
                }
                // 寄件方式
                if (data.handTypeVo) {
                    _this.handTypeVo = data.handTypeVo;
                    copyProperties(_this.itemHandTypeVo, data.handTypeVo);
                    this.itemHandTypeVo.handType += '';
                }
                if (data.member) {
                    _this.memberPhone = data.member.mobilephone;
                    _this.memberRealname = data.member.name;
                    _this.memberCode = data.member.memberCode;
                    _this.memberType = data.member.type + '';
                    if (data.member.legalPerson) {
                        _this.companyCode = data.member.legalPerson.companyCode;
                        _this.companyName = data.member.legalPerson.companyName;
                        _this.queryCompanyInfo();
                    }
                    _this.getMemberAddressees();
                }
            },
            /**
             *
             * 查询 - 当前此窗口正在办理的业务
             */
            queryCurrentNumber() {
                let _this = this;
                this.showInputForm = 1;
                this.resetForm();
                this.queryLoading = true;
                queryCurrentNumber({}).then(response => {
                    this.queryLoading = false;
                    if (response.httpCode === 200) {
                        if (response.data != null) {
                            _this.refreshNumber(response.data);
                        } else {
                            _this.$message({
                                showClose: true,
                                message: '当前窗口没有正在办理的业务'
                            });
                        }
                    } else {
                        _this.$message.error(response.msg);
                    }
                }).catch(e => {
                    this.queryLoading = false;
                })
            },
            /**
             *
             * 叫号 - 将当前查看的号码修改为已经呼叫的状态
             */
            callNumber() {
                let _this = this;
                if (_this.itemNumber != null) {
                    this.submiting = true;
                    callNumber({
                        numberId: _this.itemNumber.id
                    }).then(response => {
                        this.submiting = false;
                        if (response.httpCode === 200) {
                            let data = response.data;
                            if (data != null) {
                                _this.refreshNumber(response.data);
                            }
                        } else {
                            _this.$message.error(response.msg);
                        }
                    }).catch(e => {
                        this.submiting = false;
                    });
                } else {
                    this.submiting = true;
                    callNumber({}).then(response => {
                        this.submiting = false;
                        if (response.httpCode === 200) {
                            let data = response.data;
                            if (data != null) {
                                _this.refreshNumber(response.data);

                            } else {
                                _this.$message({
                                    showClose: true,
                                    message: '没有下一个号码了'
                                });
                            }
                        } else {
                            _this.$message.error(response.msg);
                        }
                    }).catch(e => {
                        this.submiting = false;
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
                if (!this.itemHandTypeVo.handType) {
                    this.$message.warning('请选择交件方式');
                    return;
                }
                if (!this.itemTakeTypeVo.takeType) {
                    this.$message.warning('请选择取件方式');
                    return;
                }
                //判断如果是无预审收件，则验证无预审表单各项目是否填写完整
                if (this.memberType == 1) { //自然人
                    //判断姓名，手机号，身份证号是否填写
                    if (this.memberRealname == '') {
                        this.$message.warning('姓名没有填写，不能提交');
                        return;
                    }
                    if (this.memberCode == '') {
                        this.$message.warning('身份证没有填写，不能提交');
                        return;
                    }
                    if (this.memberPhone == '') {
                        this.$message.warning('手机号没有填写，不能提交');
                        return;
                    }
                } else {  //法人
                    //判断法人姓名，法人身份证号，手机号，统一社会信用代码是否填写
                    if (this.memberRealname == '') {
                        this.$message.warning('姓名没有填写，不能提交');
                        return;
                    }
                    if (this.memberCode == '') {
                        this.$message.warning('身份证没有填写，不能提交');
                        return;
                    }
                    if (this.memberPhone == '') {
                        this.$message.warning('手机号没有填写，不能提交');
                        return;
                    }
                    if (this.companyCode == '') {
                        this.$message.warning('社会统一信用代码没有填写，不能提交');
                        return;
                    }
                    if (this.companyName == '') {
                        this.$message.warning('企业名称没有填写，不能提交');
                        return;
                    }
                }
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
                    if (!this.itemNumber.id) {
                        this.submiting = true;
                        submitNoPretrial({
                            memberType: this.memberType,
                            itemId: this.itemVo.id,
                            //身份证号
                            memberCode: this.memberCode,
                            //姓名
                            memberRealname: this.memberRealname,
                            memberPhone: this.memberPhone,
                            companyCode: this.companyCode,
                            companyName: this.companyName,
                            received: checked_m.join(','),
                            remark: this.remark,
                            itemHandTypeVo: this.itemHandTypeVo,
                            itemTakeTypeVo: this.itemTakeTypeVo
                        }).then(response => {
                            submiting = false;
                            if (response.httpCode === 200) {
                                this.$message.success('提交成功');
                                let data = response.data;
                                if (data != null) {
                                    _this.refreshNumber(response.data);
                                } else {
                                    this.$message.error('提交出错 ，' + response.msg);
                                }
                            } else {
                                this.$message.error('提交出错 ，' + response.msg);
                            }
                        }).catch(e => {
                            this.submiting = false;
                        });
                    } else {
                        this.submiting = true;
                        submitWork({
                            numberId: _itemNumber.id,
                            status: 3,  //受理
                            remark: this.remark,
                            received: checked_m.join(','),
                            itemHandType: this.itemHandType,
                            itemHandTypeVo: this.itemHandTypeVo,
                            itemTakeTypeVo: this.takeTypeVo && this.takeTypeVo.takeType ? {} : this.itemTakeTypeVo
                        }).then(response => {
                            this.submiting = false;
                            if (response.httpCode === 200) {
                                let data = response.data;
                                if (data != null) {
                                    _this.refreshNumber(response.data);
                                } else {
                                    _this.$message({
                                        showClose: true,
                                        message: '没有下一个号码了'
                                    });
                                }
                            } else {
                                _this.$message.error(response.msg);
                            }
                        }).catch(e => {
                            this.submiting = false;
                        });
                    }

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
                    this.submiting = true;
                    submitWork({
                        numberId: _itemNumber.id,
                        status: 4,  //不予受理
                        remark: this.remark
                    }).then(response => {
                        this.submiting = false;
                        if (response.httpCode === 200) {
                            let data = response.data;
                            if (data != null) {
                                _this.refreshNumber(response.data);
                            }
                        } else {
                            _this.$message.error(response.msg);
                        }
                    }).catch(e => {
                        this.submiting = false;
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
                let _this = this;

                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.submiting = true;
                    submitWork({
                        numberId: _itemNumber.id,
                        status: 5, //跳过
                        remark: this.remark
                    }).then(response => {
                        this.submiting = false;
                        if (response.httpCode === 200) {
                            let data = response.data;
                            if (data != null) {
                                _this.refreshNumber(response.data);
                            }
                        } else {
                            _this.$message.error(response.msg);
                        }
                    }).catch(e => {
                        this.submiting = false;
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
            resetItemHandTypeVo() {
                this.itemHandTypeVo = {
                    id: undefined,
                    handType: undefined,
                    mailboxInfo: {
                        id: undefined,
                        mailboxId: undefined
                    },
                    postInfo: {
                        id: undefined,
                        addresseeId: undefined,
                        expressCompany: undefined,
                        expressNumber: undefined
                    }
                };
                this.itemHandTypeVo.postInfo.addresseeId = this.itemVo.addresseeId;
                copyProperties(this.itemHandTypeVo, this.handTypeVo);
                if (this.itemHandTypeVo.handType) {
                    this.itemHandTypeVo.handType += '';
                }
            },
            resetItemTakeTypeVo() {
                this.itemTakeTypeVo = {
                    id: undefined,
                    takeType: undefined,
                    mailboxInfo: {
                        id: undefined,
                        mailboxId: undefined
                    },
                    postInfo: {
                        id: undefined,
                        addresseeId: undefined,
                        name: undefined,
                        mobilephone: undefined,
                        address: undefined
                    }
                };
                copyProperties(this.itemTakeTypeVo, this.takeTypeVo);
                if (this.itemTakeTypeVo.takeType) {
                    this.itemTakeTypeVo.takeType += '';
                }
            },
            validateField(form, field) {
                this.$refs[form].validateField(field)
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
                        this.windowList = response.data.windowList;
                        this.windowInfo = response.data.current;
                    } else {
                        //表示当前登录的ｗｅｂ用户没有登录到窗口
                    }
                } else {
                    this.$message.error('查询当前登录用户当前呼叫器登录的窗口错误');
                }
            });
            this.getCategoryCascader();
            this.getMailboxList();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .tableDiv table {
        width: 100%;
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

    #itemStepInfo img {
        max-width: 100%;
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
