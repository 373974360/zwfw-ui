<template xmlns="http://www.w3.org/1999/html">
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <!--<el-select class="filter-item" v-model="listQuery.flagTakeCert" placeholder="请选择状态">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>-->
            <el-select
                    v-model="listQuery.itemId"
                    value-key="id"
                    filterable
                    remote
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
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="createProcessOffline" icon="plus">
                添加
            </el-button>
        </div>

        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <!--<el-table-column align="center" label="办件号" width="100">-->
                <!--<template scope="scope">-->
                    <!--<span>{{scope.row.processNumber}}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="left" label="事项名称" min-width="300">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" placement="right" content="点击查看">
                        <div style="cursor:pointer;" @click="showProcessTakeInfo(scope.row)">
                            <div>{{scope.row.itemName}}</div>
                            <div>办件号: {{scope.row.processNumber}}</div>
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="left" label="申请人信息" min-width="260">
                <template scope="scope">
                    <span>
                        <span v-if="scope.row.companyName!=null">
                            公司：{{scope.row.companyName}}<br>
                        </span>
                        申请人：{{scope.row.memberRealname}}<br>联系电话：{{scope.row.memberPhonenumber}}<br>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办结时间" width="180">
                <template scope="scope">
                    <span>{{scope.row.finishItemTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="取件方式">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" placement="right" content="点击修改">
                        <el-button type="text" @click="changeTakeType(scope.row)">
                            <span>{{scope.row.takeTypeInfo.takeType | enums('TakeType')}}</span>
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="取件状态">
                <template scope="scope">
                    <span>{{scope.row.takeTypeInfo.flagTakeCert | enums('TakeStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="240">
                <template scope="scope">
                    <el-button v-if="scope.row.takeTypeInfo.flagTakeCert == 1 || scope.row.takeTypeInfo.flagTakeCert == 7"
                               type="primary" @click="completeTake(scope.row)">确认取件</el-button>
                    <el-button v-else-if="scope.row.takeTypeInfo.flagTakeCert == 3 && scope.row.takeTypeInfo.mailboxInfo.status == 1"
                               type="primary" @click="mailboxReserve(scope.row)">预约投递</el-button>
                    <el-tooltip v-else-if="scope.row.takeTypeInfo.flagTakeCert == 3 && scope.row.takeTypeInfo.mailboxInfo.status == 2"
                                class="item" effect="dark" placement="right" content="点击更新状态">
                        <el-button type="text" @click="mailboxInfoUpdate(scope.row)">预约中...</el-button>
                    </el-tooltip>
                    <el-button-group v-else-if="scope.row.takeTypeInfo.flagTakeCert == 3 && scope.row.takeTypeInfo.mailboxInfo.status == 3">
                        <el-button type="primary" @click="showReserveCode(scope.row)">获取<br>开箱码</el-button>
                        <el-button type="primary" @click="mailboxCancelReserve(scope.row)">取消<br>预约</el-button>
                        <el-button type="primary" @click="mailboxInfoUpdate(scope.row)">更新<br>状态</el-button>
                    </el-button-group>
                    <el-button v-else-if="scope.row.takeTypeInfo.flagTakeCert == 4" type="primary" @click="mailboxStatusUpdate(scope.row)">
                        更新状态
                    </el-button>
                    <el-button v-else-if="scope.row.takeTypeInfo.flagTakeCert == 6" type="primary"
                               @click="enterExpressInfo(scope.row)">录入邮寄信息</el-button>
                    <el-button v-else type="primary" @click="showProcessTakeInfo(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog title="修改取件信息" :visible.sync="takeTypeVisible" :close-on-click-modal="closeOnClickModal"
                   :before-close="resetTakeTypeForm">
            <el-form ref="takeTypeForm" :model="takeTypeInfo" :rules="takeTypeInfoRules"
                     label-width="100px" class="small-space" label-position="right"
                     style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                <el-form-item label="取件方式" prop="takeType">
                    <el-select v-model="takeTypeInfo.takeType" @change="changeTakeTypeInfo">
                        <el-option v-for="item in takeTypeList" :key="item"
                                   :value="item" :label="item | parseToInt | enums('TakeType')"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快件箱" prop="mailboxInfo.mailboxId" v-show="takeTypeInfo.takeType == 2"
                              :rules="takeTypeInfo.takeType === 2 ? takeTypeInfoRules.mailboxId : []">
                    <!--<el-radio-group v-model="takeTypeInfo.mailboxId">
                        <el-radio-button v-for="item in mailboxList" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
                    </el-radio-group>-->
                    <el-select v-model="takeTypeInfo.mailboxInfo.mailboxId"
                               @change="validateField('takeTypeForm', 'mailboxInfo.mailboxId')">
                        <el-option v-for="item in mailboxList" :key="item.id"
                                   :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="收件人姓名" prop="postInfo.name" v-show="takeTypeInfo.takeType == 3"
                              :rules="takeTypeInfo.takeType === 3 ? takeTypeInfoRules.postName : []">
                    <el-input v-model="takeTypeInfo.postInfo.name"
                              @blur="validateField('takeTypeForm', 'postInfo.name')"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="postInfo.mobilephone" v-show="takeTypeInfo.takeType == 3"
                              :rules="takeTypeInfo.takeType === 3 ? takeTypeInfoRules.postPhone : []">
                    <el-input v-model="takeTypeInfo.postInfo.mobilephone"
                              @blur="validateField('takeTypeForm', 'postInfo.mobilephone')"></el-input>
                </el-form-item>
                <el-form-item label="收件地址" prop="postInfo.address" v-show="takeTypeInfo.takeType == 3"
                              :rules="takeTypeInfo.takeType === 3 ? takeTypeInfoRules.postAddress : []">
                    <el-input v-model="takeTypeInfo.postInfo.address"
                              @blur="validateField('takeTypeForm', 'postInfo.address')"></el-input>
                </el-form-item>-->
                <el-form-item label="收件地址" prop="postInfo.addressee" v-show="takeTypeInfo.takeType == 3"
                              :rules="takeTypeInfo.takeType === 3 ? takeTypeInfoRules.postAddress : []">
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
                        </div>
                        <div class="card-body" v-show="cardItemVisible">
                            <div v-for="item in addresseeList" :key="item.id" class="card-item">
                                <el-radio v-model="takeTypeInfo.postInfo.addresseeId" :label="item.id">{{item.remark}}
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
                <el-button icon="circle-cross" type="danger" @click="resetTakeTypeForm">取 消</el-button>
                <el-button type="primary" icon="circle-check" @click="submitTakeTypeInfo" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>

        <!--快递邮寄 确定标记为已邮寄dialog-->
        <el-dialog title="邮寄信息" :visible.sync="expressInfoVisible" :close-on-click-modal="closeOnClickModal"
                   :before-close="resetExpressInfoForm">
            <el-form ref="expressInfoForm" :model="expressInfo" :rules="expressFormRules"
                     label-width="80px" class="small-space" label-position="left"
                     style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                <el-form-item label="快递公司" prop="expressCompany">
                    <el-select v-model="expressInfo.expressCompany" placeholder="请选择快递公司" style="width:100%">
                        <el-option
                                v-for="item in dics['kdgs']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="expressInfo.expressCompany"></el-input>-->
                </el-form-item>
                <el-form-item label="快递单号" prop="expressNumber">
                    <el-input v-model="expressInfo.expressNumber"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitTakeTypeExpress" type="primary" icon="circle-check" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="办件信息" :visible.sync="processOfflineVisible" :close-on-click-modal="closeOnClickModal"
                   :before-close="resetProcessOfflineForm">
            <el-form ref="processOfflineForm" :model="processOfflineInfo" :rules="processOfflineInfoRules"
                     label-width="100px" class="small-space" label-position="right"
                     style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                <el-form-item label="办件号" v-show="offlineReadonly">
                    <el-input v-model="processOfflineInfo.processNumber" :disabled="offlineReadonly"></el-input>
                </el-form-item>
                <el-form-item label="事项名称" v-if="offlineReadonly">
                    <el-input v-model="processOfflineInfo.itemName" :disabled="offlineReadonly"></el-input>
                </el-form-item>
                <el-form-item label="事项" prop="itemId" v-if="!offlineReadonly">
                    <el-select v-model="processOfflineInfo.itemId" value-key="id"
                               filterable
                               remote
                               placeholder="请输入事项名称"
                               @change="getItemTakeTypes"
                               :remote-method="searchItem1">
                        <el-option v-for="item in optionsNamess" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="开始办件时间">
                    <el-date-picker v-model="processOfflineInfo.startItemTime" type="datetime" placeholder=""
                                    :editable="false" @change="formatDateTime">
                    </el-date-picker>
                </el-form-item>-->
                <el-form-item label="办结时间" prop="finishItemTime">
                    <el-date-picker v-model="processOfflineInfo.finishItemTime" type="datetime" :editable="false"
                                    :disabled="offlineReadonly" @change="formatDateTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="取件方式" v-if="!offlineReadonly">
                    <el-select v-model="processOfflineInfo.takeTypeInfo.takeType">
                        <el-option v-for="item in takeTypeList" :key="item"
                                   :value="item" :label="item | parseToInt | enums('TakeType')"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="取件方式" v-if="offlineReadonly">
                    <span>&nbsp;&nbsp;<b>{{processOfflineInfo.takeTypeInfo.takeType | parseToInt | enums('TakeType')}}</b></span>
                </el-form-item>
                <el-form-item label="取件状态" v-if="offlineReadonly">
                    <span>&nbsp;&nbsp;<b>{{processOfflineInfo.takeTypeInfo.flagTakeCert | enums('TakeStatus')}}</b></span>
                </el-form-item>
                <el-form-item label="取件时间" v-show="offlineReadonly && [2,5,8].includes(processOfflineInfo.takeTypeInfo.flagTakeCert)">
                    <el-date-picker v-model="processOfflineInfo.takeTypeInfo.takeCertTime" type="datetime" :disabled="offlineReadonly"></el-date-picker>
                </el-form-item>
                <el-form-item label="快件箱" prop="takeTypeInfo.mailboxInfo.mailboxId"
                              v-show="processOfflineInfo.takeTypeInfo.takeType == 2"
                              :rules="mailboxRequired ? processOfflineInfoRules.mailboxId : []">
                    <el-select v-model="processOfflineInfo.takeTypeInfo.mailboxInfo.mailboxId" :disabled="offlineReadonly"
                               @change="validateField('processOfflineForm', 'takeTypeInfo.mailboxInfo.mailboxId')">
                        <el-option v-for="item in mailboxList" :key="item.id"
                                   :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="箱格序号" v-show="offlineReadonly && processOfflineInfo.takeTypeInfo.mailboxInfo.status > 2 && processOfflineInfo.takeTypeInfo.mailboxInfo.boxNo">
                    <el-input v-model="processOfflineInfo.takeTypeInfo.mailboxInfo.boxNo" :disabled="offlineReadonly"></el-input>
                </el-form-item>
                <el-form-item label="取件人手机号" prop="takeTypeInfo.mailboxInfo.consigneeMobile"
                              v-show="processOfflineInfo.takeTypeInfo.takeType == 2"
                              :rules="mailboxRequired ? processOfflineInfoRules.consigneeMobile : []">
                    <el-input v-model="processOfflineInfo.takeTypeInfo.mailboxInfo.consigneeMobile" :disabled="offlineReadonly"
                              @blur="validateField('processOfflineForm', 'takeTypeInfo.mailboxInfo.consigneeMobile')"></el-input>
                </el-form-item>
                <el-form-item label="开箱码" v-show="offlineReadonly && processOfflineInfo.takeTypeInfo.mailboxInfo.status > 2">
                    <el-input v-model="processOfflineInfo.takeTypeInfo.mailboxInfo.resvCode" :disabled="offlineReadonly"></el-input>
                </el-form-item>
                <el-form-item label="取件码" v-show="offlineReadonly && processOfflineInfo.takeTypeInfo.mailboxInfo.openCode">
                    <el-input v-model="processOfflineInfo.takeTypeInfo.mailboxInfo.openCode" :disabled="offlineReadonly"></el-input>
                </el-form-item>
                <el-form-item label="快递公司" v-show="offlineReadonly && processOfflineInfo.takeTypeInfo.postInfo.expressCompany">
                    <!--<el-input v-model="processOfflineInfo.takeTypeInfo.postInfo.expressCompany" :disabled="offlineReadonly"></el-input>-->
                    <el-select v-model="processOfflineInfo.takeTypeInfo.postInfo.expressCompany" :disabled="offlineReadonly">
                        <el-option v-for="item in dics['kdgs']" :key="item.code" :value="item.code">{{item.value}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递单号" v-show="offlineReadonly && processOfflineInfo.takeTypeInfo.postInfo.expressNumber">
                    <el-input v-model="processOfflineInfo.takeTypeInfo.postInfo.expressNumber" :disabled="offlineReadonly"></el-input>
                </el-form-item>
                <el-form-item label="收件人姓名" prop="takeTypeInfo.postInfo.name"
                              v-show="processOfflineInfo.takeTypeInfo.takeType == 3 && !offlineCardVisible"
                              :rules="postRequired ? processOfflineInfoRules.postName : []">
                    <el-input v-model="processOfflineInfo.takeTypeInfo.postInfo.name" :disabled="offlineReadonly"
                              @blur="validateField('processOfflineForm', 'takeTypeInfo.postInfo.name')"></el-input>
                </el-form-item>
                <el-form-item label="收件人手机号" prop="takeTypeInfo.postInfo.mobilephone"
                              v-show="processOfflineInfo.takeTypeInfo.takeType == 3 && !offlineCardVisible"
                              :rules="postRequired ? processOfflineInfoRules.postPhone : []">
                    <el-input v-model="processOfflineInfo.takeTypeInfo.postInfo.mobilephone" :disabled="offlineReadonly"
                              @blur="validateField('processOfflineForm', 'takeTypeInfo.postInfo.mobilephone')"></el-input>
                </el-form-item>
                <el-form-item label="收件地址" prop="takeTypeInfo.postInfo.address"
                              v-show="processOfflineInfo.takeTypeInfo.takeType == 3 && !offlineCardVisible"
                              :rules="postRequired ? processOfflineInfoRules.postAddress : []">
                    <el-input v-model="processOfflineInfo.takeTypeInfo.postInfo.address" :disabled="offlineReadonly"
                              @blur="validateField('processOfflineForm', 'takeTypeInfo.postInfo.address')"></el-input>
                </el-form-item>
                <el-form-item v-show="processOfflineInfo.takeTypeInfo.takeType == 3 && offlineCardVisible"
                              label="收件地址" prop="takeTypeInfo.postInfo.addresseeId">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix card-header">
                            <div class="card-item">
                                <p class="p1">
                                    {{offlineCardHeader.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{offlineCardHeader.phone}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span v-if="offlineCardHeader.defaultFlag">默认</span>
                                </p>
                                <p>{{offlineCardHeader.address}}</p>
                            </div>
                            <el-button v-if="!offlineReadonly" type="primary" @click="showOfflineCardItems">选择地址</el-button>
                            <el-button v-if="!offlineReadonly" type="text" @click="showAddresseeForm">添加地址</el-button>
                        </div>
                        <div class="card-body" v-show="offlineCardItemVisible">
                            <div v-for="item in offlineAddresseeList" :key="item.id" class="card-item">
                                <el-radio v-model="processOfflineInfo.takeTypeInfo.postInfo.addresseeId" :label="item.id">{{item.remark}}</el-radio>
                                <p class="p1">
                                    {{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.phone}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span v-if="item.defaultFlag">默认</span>
                                </p>
                                <p>{{item.address}}</p>
                            </div>
                            <div v-if="!offlineAddresseeList || offlineAddresseeList.length <= 0">没有任何收件地址信息</div>
                        </div>
                    </el-card>
                </el-form-item>
                <el-form-item label="申请人是否注册帐号" v-show="!offlineReadonly">
                    <el-radio-group v-model="processOfflineInfo.hasMemberId">
                        <el-radio :label="true">已注册</el-radio>
                        <el-radio :label="false">未注册</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="申请人帐号" prop="memberId" v-show="!offlineReadonly && processOfflineInfo.hasMemberId"
                              :rules="processOfflineInfo.hasMemberId ? processOfflineInfoRules.memberId : []">
                    <el-select v-model="processOfflineInfo.memberId"
                               clearable filterable remote
                               placeholder="请输入会员名称或证件号"
                               :remote-method="remoteMethod"
                               @change="handleChangeMember">
                        <el-option
                                v-for="item in optionsName"
                                :key="item.id"
                                :label="item.name + ' | ' + item.loginName"
                                :value="item.id + ''">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form ref="memberInfoForm" :model="memberInfo" :rules="memberInfoRules"
                      v-show="!processOfflineInfo.hasMemberId"
                      label-width="100px" class="small-space" label-position="right"
                      style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                <el-form-item label="用户类型">
                    <el-radio-group v-model="memberInfo.type">
                        <el-radio v-for="item in enums['MemberType']" :key="item.code" :label="item.code">{{item.value}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="姓名" prop="naturePerson.name" v-show="memberInfo.type == 1"
                              :rules="natureRequired ? memberInfoRules.name : []">
                    <el-input v-model="memberInfo.naturePerson.name"
                              @blur="validateField('memberInfoForm', 'naturePerson.name')"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="naturePerson.idcard" v-show="memberInfo.type == 1"
                              :rules="natureRequired ? memberInfoRules.idcard : []">
                    <el-input v-model="memberInfo.naturePerson.idcard"
                              @blur="validateField('memberInfoForm', 'naturePerson.idcard')"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="naturePerson.phone" v-show="memberInfo.type == 1"
                              :rules="natureRequired ? memberInfoRules.phone : []">
                    <el-input v-model="memberInfo.naturePerson.phone"
                              @blur="validateField('memberInfoForm', 'naturePerson.phone')"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" prop="legalPerson.companyName" v-show="memberInfo.type == 2"
                              :rules="legalRequired ? memberInfoRules.companyName : []">
                    <el-input v-model="memberInfo.legalPerson.companyName"
                              @blur="validateField('memberInfoForm', 'legalPerson.companyName')"></el-input>
                </el-form-item>
                <el-form-item label="统一社会信用代码" prop="legalPerson.companyCode" v-show="memberInfo.type == 2"
                              :rules="legalRequired ? memberInfoRules.companyCode : []">
                    <el-input v-model="memberInfo.legalPerson.companyCode"
                              @blur="validateField('memberInfoForm', 'legalPerson.companyCode')"></el-input>
                </el-form-item>
                <el-form-item label="法人姓名" prop="legalPerson.legalPerson" v-show="memberInfo.type == 2"
                              :rules="legalRequired ? memberInfoRules.legalPerson : []">
                    <el-input v-model="memberInfo.legalPerson.legalPerson"
                              @blur="validateField('memberInfoForm', 'legalPerson.legalPerson')"></el-input>
                </el-form-item>
                <el-form-item label="法人身份证号" prop="legalPerson.idcard" v-show="memberInfo.type == 2"
                              :rules="legalRequired ? memberInfoRules.legalPersonCard : []">
                    <el-input v-model="memberInfo.legalPerson.idcard"
                              @blur="validateField('memberInfoForm', 'legalPerson.idcard')"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="legalPerson.phone" v-show="memberInfo.type == 2"
                              :rules="legalRequired ? memberInfoRules.legalPersonPhone : []">
                    <el-input v-model="memberInfo.legalPerson.phone"
                              @blur="validateField('memberInfoForm', 'legalPerson.phone')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetProcessOfflineForm">取 消</el-button>
                <el-button v-if="!offlineReadonly" type="primary" icon="circle-check" @click="submitProcessOffline"
                           :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import {copyProperties, validateQueryStr, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {date} from '../../../../filters';
    import {isIdCardNo, validatMobiles, checkSocialCreditCode} from 'utils/validate'
    import {getAllByNameOrbasicCode, getDetailById} from '../../../../api/zwfwSystem/business/item';
    import {getAllMailbox} from 'api/hallSystem/window/mailbox'
    import {getByNameOrLoginName, getMemberById} from '../../../../api/hallSystem/member/member'
    import {idCardExist} from '../../../../api/hallSystem/member/naturePerson'
    import {creditCodeExist} from '../../../../api/hallSystem/member/legalPerson'
    import {getFinishList, addProcessOffline, saveExpressInfo, saveTakeType, complete, reserve, cancelReserve,
        getOrderStatus, getOrderDetail} from '../../../../api/hallSystem/window/delivery'
    import {getAllAddresseesByMemberId} from '../../../../api/hallSystem/member/memberAddressee';

    export default {
        name: 'table_demo',
        data() {
            const validateIdcard = (rule, value, callback) => {
                if (!isIdCardNo(value)) {
                    callback(new Error('身份证号格式不正确，请重新输入'));
                } else {
                    idCardExist(value).then(response => {
                        if (response.httpCode === 200) {
                            if (!response.data) {
                                callback();
                            } else {
                                callback(new Error('身份证号已存在'))
                            }
                        } else {
                            callback(new Error(response.msg))
                        }
                    })
                }
            };
            const validateMobiles = (rule, value, callback) => {
                if (!validatMobiles(value)) {
                    callback(new Error('手机号码格式不正确'));
                }
                callback();
            };
            const validateCompanyCode = (rule, value, callback) => {
                if (!checkSocialCreditCode(value)) {
                    callback(new Error('不是有效的统一社会信用代码，请重新输入'));
                } else {
                    creditCodeExist(value).then(response => {
                        if (response.httpCode === 200) {
                            if (!response.data) {
                                callback();
                            } else {
                                callback(new Error('统一社会信用代码已存在'))
                            }
                        } else {
                            callback(new Error(response.msg))
                        }
                    })
                }
            };
            return {
                list: null,
                itemList: [],
                optionsName: [],
                optionsNames: [],
                optionsNamess: [],
                mailboxList: [],
                takeTypeList: [],
                total: null,
                listLoading: true,
                dialogLoading: false,
                btnLoading: false,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    itemId: undefined,
                    memberId: undefined
                },
                takeTypeVisible: false,
                takeCodeVisible: false,
                expressInfoVisible: false,
                processOfflineVisible: false,
                offlineReadonly: false,
                offlineCardVisible: false,
                offlineCardItemVisible: false,
                offlineCardHeader: {
                    name: '',
                    phone: '',
                    address: '',
                    defaultFlag: false
                },
                offlineAddresseeList: [],
                processOfflineInfo: {
                    processNumber: undefined,
                    itemName: undefined,
                    itemId: '',
                    hasMemberId: true,
                    memberId: '',
                    startItemTime: '',
                    finishItemTime: '',
                    takeTypeInfo: {
                        takeType: '',
                        flagTakeCert: undefined,
                        takeCertTime: undefined,
                        mailboxInfo: {
                            mailboxId: '',
                            status: undefined,
                            consigneeMobile: '',
                            boxNo: undefined,
                            resvCode: undefined,
                            openCode: undefined
                        },
                        postInfo: {
                            name: '',
                            mobilephone: '',
                            address: '',
                            addresseeId: '',
                            expressCompany: undefined,
                            expressNumber: undefined
                        }
                    }
                },
                memberInfo: {
                    type: 1,
                    naturePerson: {
                        name: '',
                        idcard: '',
                        phone: ''
                    },
                    legalPerson: {
                        companyName: '',
                        companyCode: '',
                        legalPerson: '',
                        idcard: '',
                        phone: ''
                    }
                },
                processOfflineInfoRules: {
                    itemId: [
                        {required: true, message: '请选择事项', trigger: 'change'}
                    ],
                    finishItemTime: [
                        {required: true, message: '办结时间不能为空', trigger: 'change'}
                    ],
                    memberId: [
                        {required: true, message: '请选择申请人帐号', trigger: 'change'}
                    ],
                    mailboxId: [
                        {required: true, message: '请选择快件箱', trigger: 'change'}
                    ],
                    consigneeMobile: [
                        {required: true, message: '取件人手机号不能为空', trigger: 'blur'},
                        {validator: validateMobiles, trigger: 'blur'}
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
                memberInfoRules: {
                    name: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    idcard: [
                        {required: true, message: '身份证号不能为空', trigger: 'blur'},
                        {validator: validateIdcard, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'},
                        {validator: validateMobiles, trigger: 'blur'}
                    ],
                    companyName: [
                        {required: true, message: '公司名称不能为空', trigger: 'blur'}
                    ],
                    companyCode: [
                        {required: true, message: '统一社会信用代码不能为空', trigger: 'blur'},
                        {validator: validateCompanyCode, trigger: 'blur'}
                    ],
                    legalPerson: [
                        {required: true, message: '法人姓名不能为空', trigger: 'blur'}
                    ],
                    legalPersonCard: [
                        {required: true, message: '法人身份证号不能为空', trigger: 'blur'},
                        {validator: validateIdcard, trigger: 'blur'}
                    ],
                    legalPersonPhone: [
                        {required: true, message: '联系电话不能为空', trigger: 'blur'},
                        {validator: validateMobiles, trigger: 'blur'}
                    ]
                },
                takeTypeInfo: {
                    id: '',
                    processNumber: '',
                    memberId: '',
                    takeType: '',
                    mailboxInfo: {
                        id: '',
                        mailboxId: ''
                    },
                    postInfo: {
                        id: '',
                        addresseeId: ''
                    }
                },
                takeTypeInfoRules: {
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
                expressInfo: {
                    id: '',
                    processNumber: '',
                    expressCompany: '',
                    expressNumber: ''
                },
                expressFormRules: {
                    expressCompany: [
                        {required: true, message: '请输入快递公司', trigger: 'blur'}
                    ],
                    expressNumber: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'}
                    ]
                },
                cardHeader: {
                    name: '',
                    phone: '',
                    address: '',
                    defaultFlag: false
                },
                addresseeList: [],
                cardItemVisible: false
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'dics',
                'closeOnClickModal'
            ]),
            natureRequired() {
                return !this.processOfflineInfo.hasMemberId && this.memberInfo.type === 1;
            },
            legalRequired() {
                return !this.processOfflineInfo.hasMemberId && this.memberInfo.type === 2;
            },
            mailboxRequired() {
                return this.processOfflineInfo.takeTypeInfo.takeType == 2;
            },
            postRequired() {
                return this.processOfflineInfo.takeTypeInfo.takeType == 3 && !this.offlineCardVisible;
            }
        },
        created() {
            this.getList();
            this.getMailboxList();
        },
        watch: {
            'takeTypeInfo.postInfo.addresseeId'() {
                this.initCardHeader();
                this.cardItemVisible = false;
            },
            'processOfflineInfo.takeTypeInfo.postInfo.addresseeId'() {
                if (this.offlineCardVisible) {
                    this.initOfflineCardHeader();
                    this.offlineCardItemVisible = false;
                }
            },
            'processOfflineInfo.hasMemberId'(value) {
                if (value) {
                    this.initOfflineCardHeader();
                } else {
                    this.processOfflineInfo.takeTypeInfo.postInfo.addresseeId = undefined;
                    this.offlineCardVisible = false;
                    this.resetOfflineCardHeader();
                    this.offlineCardItemVisible = false;
                }
            },
            'processOfflineInfo.takeTypeInfo.takeType'() {
                this.initOfflineCardHeader();
                this.changeConsigneeMobile(this.processOfflineInfo.memberId);
            }
        },
        methods: {
            getList() {
                this.listLoading = true;
                getFinishList(this.listQuery).then(response => {
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
            getItemTakeTypes(id) {
                return new Promise((resolve, reject) => {
                    if (this.offlineReadonly) {
                        return reject();
                    }
                    getDetailById(id).then(response => {
                        if (response.httpCode == 200 && response.data) {
                            this.takeTypeList = response.data.takeTypes.split(',');
                            resolve();
                        } else {
                            this.$message.error('事项信息获取失败');
                            reject(response.msg);
                        }
                    })
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
            searchItem1(query) {
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
                            this.optionsNamess = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                    })
                } else {
                    this.optionsNamess = [];
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
            createProcessOffline() {
                this.offlineReadonly = false;
                this.processOfflineVisible = true;
            },
            showOfflineCardItems() {
                this.offlineCardItemVisible = !this.offlineCardItemVisible;
            },
            showAddresseeForm() {
                this.offlineCardVisible = false;
                this.processOfflineInfo.takeTypeInfo.postInfo.addresseeId = undefined;
                this.resetOfflineCardHeader();
                this.offlineCardItemVisible = false;
            },
            handleChangeMember(memberId) {
                this.changeConsigneeMobile(memberId);
                this.changeMemberAddressee(memberId);
            },
            changeConsigneeMobile(memberId) {
                if (this.offlineReadonly) {
                    return;
                }
                this.validateField('processOfflineForm', 'memberId');
                if (!memberId || this.processOfflineInfo.takeTypeInfo.takeType != 2) {
                    return;
                }
                getMemberById(memberId).then(response => {
                    if (response.httpCode === 200) {
                        let member = response.data;
                        this.$confirm('查询到用户手机号，是否更新取件人手机号？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            if (member.type === 1) {
                                this.processOfflineInfo.takeTypeInfo.mailboxInfo.consigneeMobile = member.naturePerson.phone;
                            } else {
                                this.processOfflineInfo.takeTypeInfo.mailboxInfo.consigneeMobile = member.legalPerson.phone;
                            }
                        }).catch(() => {
                            console.dir('取消');
                        });
                    }
                })
            },
            changeMemberAddressee(memberId) {
                getAllAddresseesByMemberId({memberId: memberId}).then(response => {
                    if (response.httpCode === 200) {
                        this.offlineAddresseeList = response.data;
                        this.initOfflineCardHeader();
                    } else {
                        this.$message.error('获取用户收件地址信息错误');
                    }
                })
            },
            initOfflineCardHeader() {
                if (!this.offlineAddresseeList || this.offlineAddresseeList.length <= 0
                    || this.processOfflineInfo.takeTypeInfo.takeType != 3) {
                    this.processOfflineInfo.takeTypeInfo.postInfo.addresseeId = undefined;
                    this.offlineCardVisible = false;
                    this.resetOfflineCardHeader();
                    this.offlineCardItemVisible = false;
                    return;
                }
                let addressee;
                if (this.processOfflineInfo.takeTypeInfo.postInfo.addresseeId) {
                    for (let item of this.offlineAddresseeList) {
                        if (item.id == this.processOfflineInfo.takeTypeInfo.postInfo.addresseeId) {
                            addressee = item;
                            break;
                        }
                    }
                } else {
                    for (let item of this.offlineAddresseeList) {
                        if (item.defaultFlag) {
                            addressee = item;
                            break;
                        }
                    }
                    if (!addressee) {
                        addressee = this.offlineAddresseeList[0];
                    }
                }
                this.processOfflineInfo.takeTypeInfo.postInfo.addresseeId = addressee.id;
                this.offlineCardVisible = true;
                copyProperties(this.offlineCardHeader, addressee);
            },
            submitProcessOffline() {
                this.$refs['processOfflineForm'].validate(valid => {
                    if (!valid) {
                        return false;
                    }
                    this.$refs['memberInfoForm'].validate(valid2 => {
                        if (!valid2) {
                            return false;
                        }
                        this.btnLoading = true;
                        this.dialogLoading = true;
                        addProcessOffline(this.processOfflineInfo, this.memberInfo).then(response => {
                            this.dialogLoading = false;
                            this.btnLoading = false;
                            if (response.httpCode === 200) {
                                this.resetProcessOfflineForm();
                                this.$message.success('添加成功');
                                this.getList();
                            } else {
                                this.$message.error('添加失败');
                            }
                        })
                    })
                })
            },
            showCardItems() {
                this.cardItemVisible = !this.cardItemVisible;
            },
            changeTakeType(row) {
                if (row.takeTypeInfo.flagTakeCert !== 1
                    && row.takeTypeInfo.flagTakeCert !== 3
                    && row.takeTypeInfo.flagTakeCert !== 6) {
                    this.$message.warning('当前状态不可修改取件方式');
                    return;
                }
                this.takeTypeInfo.id = row.takeTypeInfo.id;
                this.takeTypeInfo.processNumber = row.processNumber;
                this.takeTypeInfo.memberId = row.memberId;
                this.takeTypeInfo.takeType = row.takeTypeInfo.takeType;
                if (row.takeTypeInfo.mailboxInfo) {
                    this.takeTypeInfo.mailboxInfo = copyProperties(this.takeTypeInfo.mailboxInfo, row.takeTypeInfo.mailboxInfo);
                }
                if (row.takeTypeInfo.postInfo) {
                    this.takeTypeInfo.postInfo = copyProperties(this.takeTypeInfo.postInfo, row.takeTypeInfo.postInfo);
                }
                Promise.all([this.getItemTakeTypes(row.itemId), this.getMemberAddressees()]).then(() => {
                    this.takeTypeVisible = true;
                });
            },
            getMemberAddressees() {
                return new Promise((resolve, reject) => {
                    getAllAddresseesByMemberId({
                        memberId: this.takeTypeInfo.memberId
                    }).then(response => {
                        if (response.httpCode == 200) {
                            this.addresseeList = response.data;
                            this.initCardHeader();
                            resolve()
                        } else {
                            reject(response.msg);
                        }
                    })
                })
            },
            changeTakeTypeInfo() {
                this.initCardHeader();
            },
            initCardHeader() {
                if (!this.addresseeList || this.addresseeList.length <= 0 || this.takeTypeInfo.takeType != 3) {
                    this.takeTypeInfo.postInfo.addresseeId = undefined;
                    this.resetCardHeader();
                    this.cardItemVisible = false;
                    return;
                }
                let addressee;
                if (this.takeTypeInfo.postInfo.addresseeId) {
                    for (let item of this.addresseeList) {
                        if (item.id == this.takeTypeInfo.postInfo.addresseeId) {
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
                this.takeTypeInfo.postInfo.addresseeId = addressee.id;
                copyProperties(this.cardHeader, addressee);
            },
            submitTakeTypeInfo() {
                this.$refs['takeTypeForm'].validate(valid => {
                    if (valid) {
                        this.btnLoading = true;
                        this.dialogLoading = true;
                        saveTakeType(this.takeTypeInfo).then(response => {
                            this.dialogLoading = false;
                            this.btnLoading = false;
                            if (response.httpCode === 200) {
                                this.resetTakeTypeForm();
                                this.$message.success('修改成功');
                                this.getList();
                            } else {
                                this.$message.error('修改失败');
                            }
                        })
                    } else {
                        return false;
                    }
                })
            },
            enterExpressInfo(row) {
                this.expressInfo.id = row.takeTypeInfo.postInfo.id;
                this.expressInfo.processNumber = row.processNumber;
                this.expressInfoVisible = true;
            },
            submitTakeTypeExpress() {
                this.$refs['expressInfoForm'].validate(valid => {
                    if (valid) {
                        this.btnLoading = true;
                        this.dialogLoading = true;
                        saveExpressInfo(this.expressInfo).then(response => {
                            this.dialogLoading = false;
                            this.btnLoading = false;
                            if (response.httpCode === 200) {
                                this.resetExpressInfoForm();
                                this.$message.success('信息保存成功');
                                this.getList();
                            } else {
                                this.$message.error('操作失败')
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            completeTake(row) {
                this.$confirm('确定标记为客户已取件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    complete(row.takeTypeInfo.id).then(response => {
                        if (response.httpCode === 200) {
                            this.getList();
                        } else {
                            this.$message.error('操作失败')
                        }
                        this.listLoading = false;
                    })
                }).catch(() => {
                    console.dir('取消');
                });
            },
            mailboxReserve(row) {
                this.listLoading = true;
                reserve(row.processNumber).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('预约已提交，请耐心等待');
                        this.getList();
                    } else {
                        this.$message.error('预约提交失败，请重新预约')
                    }
                    this.listLoading = false;
                });
            },
            mailboxCancelReserve(row) {
                this.listLoading = true;
                cancelReserve(row.processNumber).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('取消成功');
                        this.getList();
                    } else {
                        this.$message.error('取消失败，请重试')
                    }
                    this.listLoading = false;
                })
            },
            mailboxInfoUpdate(row) {
                this.listLoading = true;
                getOrderDetail(row.processNumber).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('快件信息已更新');
                        this.getList();
                    } else {
                        this.$message.error('获取快件信息失败');
                    }
                    this.listLoading = false;
                }).catch(err => {
                    this.$message.error(err || '获取快件信息失败');
                });
            },
            mailboxStatusUpdate(row) {
                this.listLoading = true;
                getOrderStatus(row.processNumber).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('快件状态已更新');
                        this.getList();
                    } else {
                        this.$message.error('获取快件信息失败');
                    }
                    this.listLoading = false;
                })
            },
            showReserveCode(row) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '开箱码',
                    message: h('p', { style: 'text-align: center' }, [
                        h('b', { style: 'font-size: 24px' }, row.takeTypeInfo.mailboxInfo.resvCode)
                    ]),
                    confirmButtonText: '关闭'
                })
            },
            showProcessTakeInfo(row) {
                this.processOfflineInfo = copyProperties(this.processOfflineInfo, row);
                this.processOfflineInfo.hasMemberId = true;
                this.offlineReadonly = true;
                this.changeMemberAddressee(this.processOfflineInfo.memberId);
                this.processOfflineVisible = true;
            },
            validateField(form, field) {
                this.$refs[form].validateField(field)
            },
            formatDateTime() {
                this.processOfflineInfo.startItemTime = date(this.processOfflineInfo.startItemTime, 'YYYY-MM-DD HH:mm:ss')
                this.processOfflineInfo.finishItemTime = date(this.processOfflineInfo.finishItemTime, 'YYYY-MM-DD HH:mm:ss')
            },
            handlePageChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            resetExpressInfoForm() {
                this.expressInfoVisible = false;
                this.resetExpressInfoTemp();
                resetForm(this, 'expressInfoForm')
            },
            resetExpressInfoTemp() {
                this.expressInfo = {
                    id: '',
                    processNumber: '',
                    expressCompany: '',
                    expressNumber: ''
                }
            },
            resetTakeTypeForm() {
                this.takeTypeVisible = false;
                this.resetTakeTypeTemp();
                resetForm(this, 'takeTypeForm')
            },
            resetProcessOfflineForm() {
                this.processOfflineVisible = false;
                this.resetProcessOfflineTemp();
                resetForm(this, 'processOfflineForm');
                resetForm(this, 'memberInfoForm');
            },
            resetTakeTypeTemp() {
                this.takeTypeInfo = {
                    id: '',
                    processNumber: '',
                    takeType: '',
                    mailboxInfo: {
                        id: '',
                        mailboxId: ''
                    },
                    postInfo: {
                        id: '',
                        addresseeId: ''
                    }
                }
            },
            resetCardHeader() {
                this.cardHeader = {
                    name: '',
                    phone: '',
                    address: '',
                    defaultFlag: false
                }
            },
            resetProcessOfflineTemp() {
                this.processOfflineInfo = {
                    processNumber: undefined,
                    itemName: undefined,
                    itemId: '',
                    hasMemberId: true,
                    memberId: '',
                    startItemTime: '',
                    finishItemTime: '',
                    takeTypeInfo: {
                        takeType: '',
                        flagTakeCert: undefined,
                        takeCertTime: undefined,
                        mailboxInfo: {
                            mailboxId: '',
                            status: undefined,
                            consigneeMobile: '',
                            boxNo: undefined,
                            resvCode: undefined,
                            openCode: undefined
                        },
                        postInfo: {
                            name: '',
                            mobilephone: '',
                            address: '',
                            addresseeId: '',
                            expressCompany: undefined,
                            expressNumber: undefined
                        }
                    }
                };
                this.memberInfo = {
                    type: 1,
                    naturePerson: {
                        name: '',
                        idcard: '',
                        phone: ''
                    },
                    legalPerson: {
                        companyName: '',
                        companyCode: '',
                        legalPerson: '',
                        idcard: '',
                        phone: ''
                    }
                }
            },
            resetOfflineCardHeader() {
                this.offlineCardHeader = {
                    name: '',
                    phone: '',
                    address: '',
                    defaultFlag: false
                }
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
