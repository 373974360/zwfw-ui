<template>
    <el-row :gutter="20">
        <!--{{1 | enums('CompanyStatus')}}-->
        <el-col :span="8">
            <div class="grid-content ">
                <div style="padding:10px">
                    <el-input v-model="getNumberBy_pretrialNumber" placeholder="输入预审抽号">
                        <el-button slot="append" type="primary">已预审抽号</el-button>
                    </el-input>

                    <div style="margin: 20px 0;"></div>

                    <el-input v-model="getNumberBy_itemCode" placeholder="输入事项编码">
                        <el-button slot="append" type="primary">未预审抽号</el-button>
                    </el-input>

                    <div style="margin: 20px 0;"></div>

                    <el-input v-model="getNumberBy_hallNumber" placeholder="输入呼叫号查看办理事项">
                        <el-button slot="append" type="primary">按呼叫号查询</el-button>
                    </el-input>

                    <div style="margin: 20px 0;"></div>
                    <el-button type="primary" @click="queryNumber">查询当前业务</el-button>


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
                            <tr v-show="memberVo!=null">
                                <th>申报人:</th>
                                <td>{{memberVo.name}}</td>
                            </tr>
                            <tr v-show="memberVo!=null">
                                <th>申报人联系电话:</th>
                                <td>{{memberVo.mobilephone}}</td>
                            </tr>
                            <tr v-show="companyVo!=null">
                                <th>办事企业:</th>
                                <td>{{companyVo.name}}</td>
                            </tr>
                            <tr v-if="itemPretrialVo!=null">
                                <th>预审号码:</th>
                                <td>{{itemPretrialVo.id}}</td>
                            </tr>
                            <tr v-else>
                                <th>预审状态:</th>
                                <td>没有提交预审</td>
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
                                    <strong v-if="windowVo!=null" class="font-size:5rem">{{windowVo.name}}</strong>
                                    <strong v-if="windowVo==null" class="font-size:5rem">无</strong>
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
                                <textarea class="form-control full-width" placeholder="备注"
                                          v-model="remark" data-toggle="tooltip" data-placement="auto"
                                          title="用于记录不予受理的原因"></textarea>
                        </div>
                        <div v-if="itemNumber.status==1">
                            <button class="btn btn-success" type="button"
                                    v-bind:disabled="itemNumber.applyFinishTime!=null"
                                    v-on:click.self="call"
                                    data-toggle="tooltip" data-placement="auto" title="仅限测试使用">
                                模拟叫号
                            </button>
                        </div>
                        <div class="form-group m-md" v-if="itemNumber.status==2">
                            <button class="btn btn-success" type="button"
                                    v-bind:disabled="itemNumber.applyFinishTime!=null"
                                    v-on:click.self="welcome"
                                    data-toggle="tooltip" data-placement="auto" title="仅限测试使用">
                                模拟欢迎
                            </button>
                            <button class="btn btn-warning" type="button"
                                    v-bind:disabled="itemNumber.applyFinishTime!=null"
                                    v-on:click.self="skip"
                                    data-toggle="tooltip" data-placement="auto" title="申请人未到达窗口时跳过">
                                跳过
                            </button>
                        </div>
                        <div class="m-md" v-if="itemNumber.status==6">
                            <button class="btn btn-success" type="button"
                                    v-bind:disabled="itemNumber.applyFinishTime!=null"
                                    v-on:click.self="pass" data-toggle="tooltip" data-placement="auto"
                                    title="核验资料无误时点击此处">
                                收件并转交部门
                            </button>
                            <button class="btn btn-danger" type="button"
                                    v-bind:disabled="itemNumber.applyFinishTime!=null"
                                    v-on:click.self="reject">
                                不予受理
                            </button>
                        </div>
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
                                    :data="itemMaterialVoList"
                                    height="400"
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        type="index"
                                        width="50">
                                </el-table-column>
                                <el-table-column v-if="false"
                                                 type="selection"
                                                 width="55">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="材料"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="份数">
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="材料形式">
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="链接">
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
                                        <th>办理主体</th>
                                        <td>{{itemVo.departmentName}}</td>
                                    </tr>
                                    <tr>
                                        <th>事项审批涉及的部门</th>
                                        <td>{{itemVo.departmentNames}}</td>
                                    </tr>
                                    <tr>
                                        <th>办件类型</th>
                                        <td>{{itemVo.type | enums('ItemType')}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>承诺时限</th>
                                        <td>{{itemVo.promiseDay}} 个工作日</td>
                                    </tr>
                                    <tr>
                                        <th>法定时限</th>
                                        <td>{{itemVo.legalDay}} 个工作日</td>
                                    </tr>
                                    <tr>
                                        <th>核准数量</th>
                                        <td>{{itemVo.authorizedQuantity == 0 ? '无数量限制' : itemVo.authorizedQuantity}}
                                        </td>
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
                                        <th>批准证件</th>
                                        <td>{{itemVo.approvalDocumentName}}</td>
                                    </tr>
                                    <tr>
                                        <th>联系电话</th>
                                        <td>{{itemVo.tellphone}}</td>
                                    </tr>
                                    <tr>
                                        <th>监督电话</th>
                                        <td>{{itemVo.superviseTellphone}}</td>
                                    </tr>
                                    <tr>
                                        <th>办理条件</th>
                                        <td>
                                            <ol>
                                                <li v-for="c in itemConditionVoList">
                                                    {{c.content}}
                                                </li>
                                            </ol>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="办理步骤" name="itemStep">

                            <div id="itemStepInfo">
                                <table>
                                    <tr>
                                        <th>序号</th>
                                        <th>步骤</th>
                                        <th>说明</th>
                                        <th>操作者</th>
                                    </tr>
                                    <tr v-for="c in approveStepList">
                                        <td>{{$index + 1}}</td>
                                        <td>{{c.name}}</td>
                                        <td>{{c.desc}}</td>
                                        <td>{{c.role}}</td>
                                    </tr>
                                </table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-col>
    </el-row>

</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {getZwfwEnums} from 'api/zwfw/zwfwCommon';


    export default {
        name: 'compositeWindowWork',
        data() {
            return {
                getNumberBy_pretrialNumber: '',
                getNumberBy_itemCode: '',
                getNumberBy_hallNumber: '',
                itemNumber: {},
                itemVo: {},
                memberVo: {},
                companyVo: {},
                itemPretrialVo: {},
                tabName: 'materialListPanel',
                itemMaterialVoList: [],
                approveStepList: [],
                itemConditionVoList: [],
                windowVo: {},
                itemWindowUserName: '',
                testStatus: '1'

            }
        },
        methods: {
            /**
             * 查询号码
             */
            queryNumber() {

            },
            /**
             * 提交收件结果
             */
            submitWork() {

            },
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
        margin-top: 20px;
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
