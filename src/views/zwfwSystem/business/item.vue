<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getItemList" style="width: 230px;" class="filter-item"
                      placeholder="输入事项名称/基本编码"
                      v-model="listQuery.name"></el-input>
            <el-cascader :options="cascader" class="filter-item" @change="handleChange"
                         :show-all-levels="true" clearable filterable expand-trigger="hover"
                         :change-on-select="true" style="width: 180px" placeholder="所属部门">
            </el-cascader>
            <el-select class="filter-item" v-model="listQuery.processType" clearable placeholder="请选择办件类型">
                <el-option v-for="item in dics['bjlx']" :key="item.code" :value="item.code"
                           :label="item.value"></el-option>
            </el-select>
            <el-select class="filter-item" v-model="listQuery.handleType" clearable placeholder="请选择办理形式">
                <el-option v-for="item in dics['blxs']" :key="item.code" :value="item.code"
                           :label="item.value"></el-option>
            </el-select>
            <el-select class="filter-item" v-model="listQuery.enable" clearable placeholder="事项状态">
                <el-option label="全部" value="2"></el-option>
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select class="filter-item" v-model="listQuery.orderable" clearable placeholder="预约筛选">
                <el-option label="预约和不可预约" value=""></el-option>
                <el-option label="支持预约" value="true"></el-option>
                <el-option label="不可预约" value="false"></el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getItemList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleItemCreate" type="primary"
                       icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleItemDelete" type="danger"
                       icon="delete">
                删除
            </el-button>
        </div>

        <el-table ref="zwfwItemTable" :data="zwfwItemList" v-loading.body="pageLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection"
                  row-class-name="elRow">
            <el-table-column type="selection"/>
            <!--<el-table-column align="center" label="序号" width="70">-->
            <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.id}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="left" label="事项名称" prop="name">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="'点击编辑：' +scope.row.id " placement="right-start">
                        <span class="link-type" @click="handleItemUpdate(scope.row)">{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="基本编码" prop="basicCode" width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.basicCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="事项类型" prop="type" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.type | dics('sslx')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办件类型" prop="processType" width="100">
                <template slot-scope="scope">
                    {{scope.row.processType | dics('bjlx')}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="承诺时限" prop="promiseEndTime" width="110">
                <template slot-scope="scope">
                    <span>{{scope.row.promiseEndTime}} 工作日</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="法定时限" prop="legalEndTime" width="110">
                <template slot-scope="scope">
                    <span>{{scope.row.legalEndTime}} 工作日</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办理形式" prop="handleType" width="100">
                <template slot-scope="scope">
                    {{scope.row.handleType | dics('blxs')}}
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态" width="80">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
                        {{scope.row.enable | enums('Enable')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200" class-name="action">
                <template slot-scope="scope">
                    <el-badge :value="scope.row.itemMaterialCount" class="item">
                        <el-button class="filter-item" style="" @click="handleMaterialList(scope.row)"
                                   type="primary" size="small">
                            办件材料
                        </el-button>
                    </el-badge>
                    <el-button class="filter-item" style="" @click="handleItemConfig(scope.row)"
                               type="primary" size="small">
                        预约配置
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!pageLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="zwfwItem.id?('编辑事项，ID:' + zwfwItem.id):'添加事项'" :visible.sync="dialogItemFormVisible"
                   @open="initEditor"
                   :close-on-click-modal="closeOnClickModal" :before-close="closeZwfwItemForm">
            <el-form ref="zwfwItemForm" class="small-space" :model="zwfwItem" label-position="right"
                     label-width="134px"
                     style="width: 80%; margin-left: 10%" v-loading="dialogFormLoading" :rules="zwfwItemRules">
                <el-form-item label="事项名称" prop="name">
                    <el-input v-model="zwfwItem.name"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="departmentId">
                    <el-cascader
                            expand-trigger="hover" :show-all-levels="true"
                            :change-on-select="true"
                            :options="deptTree"
                            v-model="belongDeptCascader"
                            @change="handleBelongDeptChange"
                            style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="基本编码" prop="basicCode">
                    <el-input v-model="zwfwItem.basicCode"></el-input>
                </el-form-item>
                <el-form-item label="实施编码" prop="implCode">
                    <el-input v-model="zwfwItem.implCode"></el-input>
                </el-form-item>
                <table>
                    <tr>
                        <td>
                            <el-form-item label="是否支持预约办理" prop="orderable">
                                <el-switch
                                        v-model="zwfwItem.orderable"
                                        on-color="#13ce66"
                                        off-color="#ff4949"
                                        :on-value="true"
                                        :off-value="false">
                                </el-switch>
                            </el-form-item>
                        </td>
                        <td width="100"></td>
                        <td>
                            <el-form-item label="是否收费" prop="chargeable">
                                <el-switch
                                        v-model="zwfwItem.chargeable"
                                        on-color="#13ce66"
                                        off-color="#ff4949"
                                        :on-value="true"
                                        :off-value="false">
                                </el-switch>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                <el-form-item label="实施主体性质" prop="implObjectType">
                    <el-radio-group v-model="zwfwItem.implObjectType">
                        <el-radio v-for="item in dics['ssztxz']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否支持网上支付" prop="payOnlineAble">
                    <el-switch
                            v-model="zwfwItem.payOnlineAble"
                            on-color="#13ce66"
                            off-color="#ff4949"
                            :on-value="true"
                            :off-value="false">
                    </el-switch>
                </el-form-item>
                <el-form-item label="承诺办结时间" prop="promiseEndTime">
                    <el-input v-model="zwfwItem.promiseEndTime" placeholder="请填写承诺的工作日，最小单位为0.5天"></el-input>
                </el-form-item>
                <el-form-item label="运行系统" prop="runSystem">
                    <el-radio-group v-model="zwfwItem.runSystem">
                        <el-radio v-for="item in dics['yxxt']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="事项类型" prop="type">
                    <el-select v-model="zwfwItem.type" placeholder="请选择事项类型" style="width:100%">
                        <el-option
                                v-for="item in dics['sslx']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结果样本" prop="resultExample">
                    <el-upload name="uploadFile" :accept="fileAccepts"
                               ref="upload"
                               :action="uploadAction" :file-list="resultExampleFileList"
                               :on-success="handleResultUploadSuccess"
                               :before-upload="beforeResultUpload"
                               :on-remove="handleRemoveResult"
                               :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                        </el-button>
                        <el-button style="margin-left: 10px;" size="small" type="info" @click="showResultExample">查看图片
                        </el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="行使层级" prop="handleLevel">
                    <el-radio-group v-model="zwfwItem.handleLevel">
                        <el-radio v-for="item in dics['xscj']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="联办机构" prop="unionAgency">
                    <el-cascader
                            expand-trigger="hover" :show-all-levels="true"
                            :change-on-select="true"
                            :options="deptTree"
                            v-model="unionAgencyDeptCascader"
                            @change="handleUnionAgencyChange"
                            style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="监督部门" prop="superviseDepartmentId">
                    <el-cascader
                            expand-trigger="hover" :show-all-levels="true"
                            :change-on-select="true"
                            :options="deptTree"
                            v-model="superviseDeptCascader"
                            @change="handleSuperviseChange"
                            style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="监督电话" prop="supervisePhone">
                    <el-input v-model="zwfwItem.supervisePhone"></el-input>

                </el-form-item>
                <el-form-item label="实施机构" prop="implAgency">
                    <el-cascader
                            expand-trigger="hover" :show-all-levels="true"
                            :change-on-select="true"
                            :options="deptTree"
                            v-model="implAgencyDeptCascader"
                            @change="handleImplAgencyChange"
                            style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="服务对象" prop="serviceObject">
                    <el-radio-group v-model="zwfwItem.serviceObject">
                        <el-radio v-for="item in dics['fwdx']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="办理地点" prop="handlePlace">
                    <el-input v-model="zwfwItem.handlePlace"></el-input>
                </el-form-item>
                <el-form-item label="工作时间" prop="handlePlace">
                    <el-input v-model="zwfwItem.handleTime"></el-input>
                </el-form-item>
                <el-form-item label="行使内容" prop="handleContent">
                    <el-input v-model="zwfwItem.handleContent"></el-input>
                </el-form-item>
                <el-form-item label="数量限制" prop="numberLimit">
                    <el-input v-model="zwfwItem.numberLimit"></el-input>
                </el-form-item>
                <el-form-item label="通办范围" prop="handleScope">
                    <el-radio-group v-model="zwfwItem.handleScope">
                        <el-radio v-for="item in dics['tbfw']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="咨询电话" prop="askPhone">
                    <el-input type="textarea" v-model="zwfwItem.askPhone"></el-input>
                </el-form-item>
                <el-form-item label="办件类型" prop="processType">
                    <el-radio-group v-model="zwfwItem.processType">
                        <el-radio v-for="item in dics['bjlx']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="法定办结时限" prop="legalEndTime">
                    <el-input v-model="zwfwItem.legalEndTime"></el-input>
                </el-form-item>
                <!--<el-form-item label="是否支持物流快递" prop="postable">
                    <el-switch
                            v-model="zwfwItem.postable"
                            on-color="#13ce66"
                            off-color="#ff4949"
                            :on-value="true"
                            :off-value="false">
                    </el-switch>
                </el-form-item>-->
                <el-form-item label="办理形式" prop="handleType">
                    <el-radio-group v-model="zwfwItem.handleType">
                        <el-radio v-for="item in dics['blxs']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="交件方式" prop="handTypes">
                    <el-checkbox-group v-model="zwfwItem.handTypes" @change="handleHandTypesChange">
                        <template v-for="item in enums['HandType']">
                            <el-checkbox
                                    :disabled="(zwfwItem.handleType=='blxs_ckbl' && (item.code==2 || item.code==3)) ? true : false"
                                    :key="item.code" :label="item.code + ''">
                                {{item.value}}
                            </el-checkbox>
                        </template>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="zwfwItem.handTypes.includes('2')" label="收件人员" prop="handUserId">
                    <el-select v-model="zwfwItem.handUserId" remote :remote-method="queryHandUserId" filterable
                               placeholder="请选择" style="width: 100%" :multiple="false" clearable>
                        <el-option v-for="u in userListHand" :key="u.id" :label="u.name + ' (工号：' + u.empNo +')'"
                                   :value="u.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="zwfwItem.handTypes.includes('3')" label="收件地址" prop="addresseeId">
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
                                <el-radio v-model="zwfwItem.addresseeId" :label="item.id">{{item.remark}}</el-radio>
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
                <el-form-item label="取件方式" prop="takeTypes">
                    <el-checkbox-group v-model="zwfwItem.takeTypes">
                        <el-checkbox v-for="item in enums['TakeType']"
                                     :key="item.code" :label="item.code + ''">
                            {{item.value}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <!--:disabled="(zwfwItem.handleType=='blxs_ckbl' && (item.code==2 || item.code==3)) ? true : false"-->
                <el-form-item label="版本生效时间" prop="versionAvailableTime">
                    <el-date-picker v-model="zwfwItem.versionAvailableTime" type="datetime"
                                    placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="设定依据" prop="setBasis">
                    <!--<el-input v-model="zwfwItem.setBasis" type="textarea" :rows="3"></el-input>-->
                    <quill-editor ref="setBasisEditor" v-model="setBasisHtml"
                                  :options="quillEditorOption" @focus="onEditorFocus($event)">
                    </quill-editor>
                    <el-upload name="uploadFile" v-show="false" :show-file-list="false"
                               :action="uploadAction" :accept="imageAccepts"
                               :on-success="handleEditorUploadSuccess" :on-error="handleEditorUploadError">
                        <el-button id="setBasis_btn"></el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="受理条件" prop="acceptCondition">
                    <!--<el-input v-model="zwfwItem.acceptCondition" type="textarea"></el-input>-->
                    <quill-editor ref="conditionEditor" v-model="acceptConditionHtml"
                                  :options="quillEditorOption" @focus="onEditorFocus($event)">
                    </quill-editor>
                    <el-upload name="uploadFile" v-show="false" :show-file-list="false"
                               :action="uploadAction" :accept="imageAccepts"
                               :on-success="handleEditorUploadSuccess" :on-error="handleEditorUploadError">
                        <el-button id="condition_btn"></el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="内部流程描述" prop="workflowDescription">
                    <!--<el-input v-model="zwfwItem.workflowDescription" type="textarea"></el-input>-->
                    <quill-editor ref="workflowEditor" v-model="workflowDescriptionHtml"
                                  :options="quillEditorOption" @focus="onEditorFocus($event)">
                    </quill-editor>
                    <el-upload name="uploadFile" v-show="false" :show-file-list="false"
                               :action="uploadAction" :accept="imageAccepts"
                               :on-success="handleEditorUploadSuccess" :on-error="handleEditorUploadError">
                        <el-button id="workflow_btn"></el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="收费标准" prop="chargeStandard">
                    <!--<el-input v-model="zwfwItem.chargeStandard" type="textarea"></el-input>-->
                    <quill-editor ref="standardEditor" v-model="chargeStandardHtml"
                                  :options="quillEditorOption" @focus="onEditorFocus($event)">
                    </quill-editor>
                    <el-upload name="uploadFile" v-show="false" :show-file-list="false"
                               :action="uploadAction" :accept="imageAccepts"
                               :on-success="handleEditorUploadSuccess" :on-error="handleEditorUploadError">
                        <el-button id="standard_btn"></el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="收费依据" prop="chargeBasis">
                    <!--<el-input v-model="zwfwItem.chargeBasis" type="textarea"></el-input>-->
                    <quill-editor ref="basisEditor" v-model="chargeBasisHtml"
                                  :options="quillEditorOption" @focus="onEditorFocus($event)">
                    </quill-editor>
                    <el-upload name="uploadFile" v-show="false" :show-file-list="false"
                               :action="uploadAction" :accept="imageAccepts"
                               :on-success="handleEditorUploadSuccess" :on-error="handleEditorUploadError">
                        <el-button id="basis_btn"></el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="权限划分" prop="authorityDivision">
                    <el-input v-model="zwfwItem.authorityDivision"></el-input>
                </el-form-item>
                <el-form-item label="版本号" prop="version">
                    <el-input v-model="zwfwItem.version"></el-input>
                </el-form-item>
                <el-form-item label="结果名称" prop="resultName">
                    <el-input v-model="zwfwItem.resultName"></el-input>
                </el-form-item>
                <el-form-item label="预审天数" prop="pretrialDays">
                    <el-input v-model="zwfwItem.pretrialDays"></el-input>
                </el-form-item>
                <el-form-item label="预审人员">
                    <el-select style="width:100%" v-model="zwfwItem.pretrialUserIds" remote
                               :remote-method="queryPretrialUserId"
                               multiple filterable placeholder="请选择">
                        <el-option
                                v-for="u in userListPretrial"
                                :key="u.id"
                                :label="u.name + ' (工号：' + u.empNo +')'"
                                :value="u.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="中介服务" prop="mediumService">
                    <el-input v-model="zwfwItem.mediumService"></el-input>
                </el-form-item>
                <el-form-item label="常见问题" prop="commonRequestion">
                    <el-input v-model="zwfwItem.commonRequestion"></el-input>
                </el-form-item>
                <el-form-item label="显示方式" prop="showStatus">
                    <el-radio-group v-model="zwfwItem.showStatus">
                        <el-radio v-for="item in enums['ShowStatus']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="业务状态" prop="enable">
                    <el-radio-group v-model="zwfwItem.enable">
                        <el-radio :label="1">
                            <span style="font-weight:normal;">启用</span>
                        </el-radio>
                        <el-radio :label="0">
                            <span style="font-weight:normal;">禁用</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="注意事项" prop="remark">
                    <!--<el-input v-model="zwfwItem.remark"></el-input>-->
                    <quill-editor ref="noticeTextEditor" v-model="noticeTextHtml"
                                  :options="quillEditorOption" @focus="onEditorFocus($event)">
                    </quill-editor>
                    <el-upload name="uploadFile" v-show="false" :show-file-list="false"
                               :action="uploadAction" :accept="imageAccepts"
                               :on-success="handleEditorUploadSuccess" :on-error="handleEditorUploadError">
                        <el-button id="notice_text_btn"></el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="margin-top:30px; text-align: center;">
                <el-button icon="circle-cross" type="danger" @click="closeZwfwItemForm">取 消
                </el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="doItemCreate">
                    确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="doItemUpdate">
                    确 定
                </el-button>
            </div>
        </el-dialog>


        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogMaterialFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="closeZwfwMaterialForm">
            <el-row>
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleMaterialDelete" type="danger"
                           icon="delete">
                    删除
                </el-button>
            </el-row>
            <el-table ref="zwfwItemMaterialForm" :data="zwfwItemMaterialList" v-loading.body="dialogTableLoading"
                      border fit
                      highlight-current-row
                      style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"/>
                <!--<el-table-column align="center" label="序号" width="70">-->
                <!--<template slot-scope="scope">-->
                <!--<span>{{scope.row.id}}</span>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="sortNo" align="center" label="排序" width="70">
                </el-table-column>
                <el-table-column prop="name" align="left" label="材料名称">
                    <template slot-scope="scope">
                        <el-tooltip content="点击编辑" placement="right" effect="dark">
                            <span class="link-type" @click="handleMaterialUpdate(scope.row)">{{scope.row.name}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="type" align="center" label="材料类型" width="130">
                    <template slot-scope="scope">
                        <span>{{scope.row.type | dics('cllx')}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-once prop="source" align="center" label="来源渠道" width="130">
                    <template slot-scope="scope">
                        <span>{{scope.row.source | dics('sxsqclly')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="electronicMaterial" align="center" label="预审材料" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.electronicMaterial | enums('YesNo')}}</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-form ref="zwfwMaterialForm" class="small-space" :model="zwfwItemMaterial"
                     label-position="right" v-loading="dialogFormLoading"
                     label-width="134px"
                     style="width: 80%; margin-left:10%; margin-top: 5%;"
                     :rules="zwfwItemMaterialRules">
                <el-form-item label="材料名称" prop="name">
                    <el-autocomplete
                            v-model="zwfwItemMaterial.name"
                            :fetch-suggestions="searchMaterial"
                            placeholder="请输入材料名称"
                            @select="changeMaterial" style="width:100%"
                            :props="{label:'name',value:'name'}"
                    ></el-autocomplete>

                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="zwfwItemMaterial.sortNo" :min="1" :max="10000"/>
                </el-form-item>
                <el-form-item label="材料类型" prop="type">
                    <el-select v-model="zwfwItemMaterial.type" placeholder="请选择材料类型">
                        <el-option
                                v-for="item in dics['cllx']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否需要电子材料" prop="electronicMaterial">
                    <el-switch
                            v-model="zwfwItemMaterial.electronicMaterial"
                            on-color="#13ce66"
                            off-color="#ff4949"
                            :on-value="true"
                            :off-value="false">
                    </el-switch>
                </el-form-item>
                <el-form-item label="纸质材料说明:" prop="paperDescription">
                    <el-input v-model="zwfwItemMaterial.paperDescription" placeholder="数量和规格"></el-input>
                </el-form-item>
                <el-form-item label="受理标准" prop="acceptStandard">
                    <el-input v-model="zwfwItemMaterial.acceptStandard"></el-input>
                </el-form-item>
                <el-form-item label="来源渠道" prop="source">
                    <el-select v-model="zwfwItemMaterial.source" placeholder="请选择来源渠道" style="width:100%">
                        <el-option
                                v-for="item in dics['sxsqclly']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="材料样本" prop="example">
                    <el-upload name="uploadFile"
                               ref="uploadExample"
                               :accept="fileAccepts"
                               :action="uploadAction"
                               :show-file-list="false"
                               :with-credentials="true"
                               :headers="uploadHeaders"
                               :before-upload="beforeAvatarUpload"
                               :on-change="changeAvatarExampleFile">
                        <el-input slot="trigger" v-model="zwfwItemMaterial.example" placeholder="选择文件" readonly
                                  style="width: 320px"></el-input>
                        <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
                        <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadExample">
                            上传到服务器
                        </el-button>-->
                        <!--<el-button style="margin-left: 10px;" size="small" type="info" @click="showMaterialExample">
                            点击下载
                        </el-button>-->
                        <a :href="zwfwItemMaterial.example" :download="downloadExample"
                           :class="{disabled: !zwfwItemMaterial.example}">
                            <el-button style="margin-left: 10px;" size="small" type="info"
                                       :disabled="!zwfwItemMaterial.example">点击下载
                            </el-button>
                        </a>
                    </el-upload>
                </el-form-item>
                <el-form-item label="电子表单" prop="eform">
                    <el-upload name="uploadFile"
                               ref="uploadEform"
                               :accept="fileAccepts"
                               :action="uploadAction"
                               :show-file-list="false"
                               :with-credentials="true"
                               :headers="uploadHeaders"
                               :before-upload="beforeAvatarUpload"
                               :on-change="changeAvatarEformFile">
                        <el-input slot="trigger" v-model="zwfwItemMaterial.eform" placeholder="选择文件" readonly
                                  style="width: 320px"></el-input>
                        <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
                        <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadEform">
                            上传到服务器
                        </el-button>-->
                        <!--<el-button style="margin-left: 10px;" size="small" type="info" @click="showEformFile">
                            点击下载
                        </el-button>-->
                        <a :href="zwfwItemMaterial.eform" :download="downloadEform"
                           :class="{disabled: !zwfwItemMaterial.eform}">
                            <el-button style="margin-left: 10px;" size="small" type="info"
                                       :disabled="!zwfwItemMaterial.eform">点击下载
                            </el-button>
                        </a>
                    </el-upload>
                </el-form-item>
                <el-form-item label="填报须知" prop="notice">
                    <el-input v-model="zwfwItemMaterial.notice"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="zwfwItemMaterial.remark"></el-input>
                </el-form-item>

            </el-form>
            <div style="text-align: center" slot="footer" class="dialog-footer">
                <el-button type="primary" icon="circle-check"
                           @click="doMaterialUpdate">更新材料
                </el-button>
                <el-button type="success" icon="circle-check"
                           @click="relateMaterial">关联材料
                </el-button>
                <el-button type="warning" icon="circle-check"
                           @click="doUpdateAndRelate">更新并关联
                </el-button>
                <el-button icon="circle-cross" type="danger" @click="closeZwfwMaterialForm">取 消</el-button>
            </div>
        </el-dialog>

        <!--事项预约配置-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogItemConfigFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="closeZwfwItemConfigForm">
            <el-form ref="zwfwItemConfigForm" class="small-space" :model="zwfwItemConfig"
                     label-position="right" v-loading="dialogFormLoading"
                     label-width="134px"
                     style="width: 80%; margin-left:10%; margin-top: 5%;"
                     :rules="zwfwItemConfigFormRules">
                <el-form-item label="是否支持预约" prop="ispreorder">
                    <el-radio-group v-model="zwfwItemConfig.ispreorder">
                        <el-radio :label="true">
                            <span style="font-weight:normal;">是</span>
                        </el-radio>
                        <el-radio :label="false">
                            <span style="font-weight:normal;">否</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-if="zwfwItemConfig.ispreorder">
                    <el-form-item label="预约时间" prop="preorderTimeArray">
                        <el-checkbox-group v-model="zwfwItemConfig.preorderTimeArray">
                            <el-checkbox v-for="item in zwfwItemConfig.opentime" :key="item"
                                         :label="item"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="每个时段预约人数" prop="preordernum">
                        <el-input-number v-model="zwfwItemConfig.preordernum" :min="1" label="预约人数"></el-input-number>
                    </el-form-item>
                </div>
            </el-form>
            <div style="text-align: center" slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="closeZwfwItemConfigForm">取 消</el-button>
                <el-button type="primary" icon="circle-check"
                           @click="submitItemConfig">确 定
                </el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import {copyProperties, resetForm, validateQueryStr} from 'utils';
    import {mapGetters} from 'vuex';
    import {
        getZwfwItemList, createZwfwItem, updateZwfwItem, delZwfwItems,
        getPretrialUserListByItemId,
        getItemConfig, setItemConfig
    } from 'api/zwfwSystem/business/item';
    import {
        createZwfwItemMaterial,
        getAllItemMaterial,
        deleteZwfwItemMaterial,
        doUpdateAndRelate
    } from 'api/zwfwSystem/business/itemMaterial';
    import {getAllMaterial, updateZwfwMaterial} from 'api/zwfwSystem/business/material';
    import {getAllUser} from '../../../api/baseSystem/org/user';
    import {getDeptCascader} from 'api/baseSystem/org/dept';
    import {getAllAddressees, getAddresseeById} from 'api/hallSystem/window/addressee';
    import {quillEditor} from 'vue-quill-editor'

    export default {
        name: 'zwfwItem_table',
        components: {
            quillEditor
        },
        data() {
            const handTakeTypesValidate = (rule, value, callback) => {
                if (!value || value.length <= 0) {
                    callback(new Error(rule.message))
                }
                callback();
            };
            const handUserIdValidate = (rule, value, callback) => {
                if (this.zwfwItem.handTypes.includes('2') && !value) {
                    callback(new Error('请选择收件人员'));
                }
                callback();
            };
            const addresseeIdValidate = (rule, value, callback) => {
                if (this.zwfwItem.handTypes.includes('3') && !value) {
                    callback(new Error('请选择收件地址'));
                }
                callback();
            };
            const promiseEndTimeValidate = (rule, value, callback) => {
                if (!/^[1-9]\d{0,2}(\.5)?$|^0\.5$|^0$/.test(this.zwfwItem.promiseEndTime)) {
                    callback(new Error('请填写承诺的工作日，最小单位为0.5天,最多三位整数'));
                }
                callback();
            };
            const pretrialDaysValidate = (rule, value, callback) => {
                if (!/^[1-9]\d{0,2}(\.5)?$|^0\.5$|^0$/.test(this.zwfwItem.pretrialDays) ) {
                    callback(new Error('请填写预审的工作日，最小单位为0.5天,最多三位整数'));
                }
                callback();
            };
            const legalEndTimeValidate = (rule, value, callback) => {
                if (!/^[1-9]\d{0,2}(\.5)?$|^0\.5$|^0$/.test(this.zwfwItem.legalEndTime)) {
                    callback(new Error('请填写法定办结的工作日，最小单位为0.5天,最多三位整数'));
                }
                callback();
            };
            return {
                options: [{
                    value: '1',
                    label: '启用'
                }, {
                    value: '0',
                    label: '禁用'
                }],
                changeMaterialInfo: false,
                zwfwItemList: [],
                zwfwItemMaterialList: [],
                ItemMaterial: [],
                optionsName: [],
                addresseeList: [],
                list: [],
                total: null,
                pageLoading: true,
                dialogFormLoading: false,
                dialogTableLoading: false,
                changeTable: false,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                    departmentId: undefined,
                    processType: undefined,
                    handleType: undefined,
                    enable: '1',
                    orderable: ''
                },
                activeName: 'first',
                zwfwItem: {
                    id: undefined,
                    departmentId: [],
                    superviseDepartmentId: [],
                    unionAgency: [],
                    implAgency: [],
                    setBasis: '',
                    chargeable: true,
                    orderable: true,
                    implObjectType: 'ssztxz_swtzz',
                    payOnlineAble: true,
                    basicCode: '',
                    promiseEndTime: '',
                    remark: '',
                    runSystem: 'yxxt_guojiaji',
                    type: '',
                    resultExample: '',
                    handleLevel: 'xscj_guojiaji',
                    serviceObject: 'fwdx_ziranren',
                    handlePlace: '',
                    handleTime: '',
                    handleContent: '',
                    applyMaterial: '',
                    numberLimit: '',
                    handleScope: 'tbfw_quanguo',
                    askPhone: '',
                    handleWorkflow: '',
                    chargeStandard: '',
                    processType: 'bjlx_cnj',
                    legalEndTime: '',
                    postable: true,
                    handTypes: ['1'],
                    takeTypes: ['1'],
                    handUserId: undefined,
                    addresseeId: '',
                    versionAvailableTime: '',
                    supervisePhone: '',
                    pretrialDays: '',
                    acceptCondition: '',
                    chargeBasis: '',
                    workflowDescription: '',
                    authorityDivision: '',
                    version: '',
                    resultName: '',
                    handleType: 'blxs_ckbl',
                    name: '',
                    mediumService: '',
                    showStatus: '',
                    commonRequestion: '',
                    implCode: '',
                    updateType: '',
                    pretrialUserIds: [],
                    departmentTreePosition: '',
                    superviseTreePosition: '',
                    implAgencyTreePosition: '',
                    unionAgencyTreePosition: '',
                    enable: ''
                },
                zwfwItemMaterial: {
                    id: undefined,
                    itemId: undefined,
                    electronicMaterial: false,
                    eform: '',
                    name: '',
                    sortNo: '',
                    paperDescription: '',
                    acceptStandard: '',
                    remark: '',
                    source: '',
                    type: '',
                    example: '',
                    notice: ''
                },
                isMaterialExist: false,
                zwfwItemConfig: {
                    ispreorder: true,
                    preorderTimeArray: [],
                    preordernum: '',
                    opentime: [],
                    itemId: ''
                },
                applyMaterials: '',
                itemId: '',
                currentItem: [],
                materialList: [],
                getMaterialIds: [],
                currentRow: null,
                listMaterial: null,
                selectedRows: [],
                dialogItemFormVisible: false,
                dialogMaterialFormVisible: false,
                dialogItemConfigFormVisible: false,
                dialogStatus: '',
                uploadAction: this.$store.state.app.uploadUrl,
                fileAccepts: this.$store.state.app.fileAccepts,
                imageAccepts: this.$store.state.app.imageAccepts,
                resultExampleFileList: [],
                zwfwItemRules: {
                    name: [
                        {required: true, message: '请输入事项名称'}
                    ],
                    basicCode: [
                        {required: true, message: '请输入基本编码'}
//                        {min: 10, max: 10, message: '基本编码长度是10位'}
                    ],
                    implCode: [
                        {required: true, message: '请输入实施编码'}
//                        {min: 24, max: 24, message: '实施编码长度是24位'}
                    ],
                    type: [
                        {required: true, message: '请输入事项类型'}
                    ],
                    pretrialDays: [
                        {required: true, validator: pretrialDaysValidate, trigger: 'blur'}
                    ],
                    askPhone: [
                        {required: true, message: '请输入咨询电话'}
                    ],
                    supervisePhone: [
                        {required: true, message: '请输入监督电话'}
                    ],
                    superviseDepartmentId: [
                        {required: true, message: '请选择监督部门'}
                    ],
                    departmentId: [
                        {required: true, message: '请选择所属部门'}
                    ],
                    handTypes: [
                        {validator: handTakeTypesValidate, message: '请选择交件方式', trigger: 'blur'}
                    ],
                    takeTypes: [
                        {validator: handTakeTypesValidate, message: '请选择取件方式', trigger: 'blur'}
                    ],
                    handUserId: [
                        {validator: handUserIdValidate, trigger: 'blur'}
                    ],
                    addresseeId: [
                        {validator: addresseeIdValidate, trigger: 'blur'}
                    ],
                    promiseEndTime: [
                        {required: true, validator: promiseEndTimeValidate, trigger: 'blur'}
                    ],
                    legalEndTime: [
                        {required: true, validator: legalEndTimeValidate, trigger: 'blur'}
                    ]
                },
                zwfwItemMaterialRules: {
                    name: [
                        {required: true, message: '请输入材料名称'}
                    ],
                    source: [
                        {required: true, message: '请输入来源渠道'}
                    ],
                    type: [
                        {required: true, message: '请输入材料类型'}
                    ]
                },
                zwfwItemConfigFormRules: {
                    preorderTimeArray: [
                        {required: true, message: '请选择预约时间', trigger: 'blur'}
                    ]
                },
                userListPretrial: [],
                userListHand: [],
                deptTree: [],
                quillEditorOption: {
                    modules: {
                        toolbar: [
                            [{header: []}],
                            ['bold', 'italic', 'underline'],
                            [{color: []}, {background: []}],
                            [{list: 'ordered'}, {list: 'bullet'}],
                            ['clean'],
                            ['link', 'image']
                        ]
                    },
                    theme: 'snow'
                },
                acceptConditionHtml: '',
                workflowDescriptionHtml: '',
                chargeStandardHtml: '',
                chargeBasisHtml: '',
                noticeTextHtml: '',
                setBasisHtml: '',
                editor: {},
                cardHeader: {
                    name: '',
                    phone: '',
                    address: '',
                    defaultFlag: false
                },
                cardItemVisible: false,
                cascader: []
            }
        },
        computed: {
            belongDeptCascader() {
                if (this.zwfwItem.departmentId) {
                    if (this.zwfwItem.departmentTreePosition) {
                        const arr = this.zwfwItem.departmentTreePosition.split('&');
                        return arr
                    }
                    return [];
                }
            },
            superviseDeptCascader() {
                if (this.zwfwItem.superviseDepartmentId) {
                    if (this.zwfwItem.superviseTreePosition) {
                        const arr = this.zwfwItem.superviseTreePosition.split('&');
                        return arr
                    }
                    return [];
                }
            },
            unionAgencyDeptCascader() {
                if (this.zwfwItem.unionAgency) {
                    if (this.zwfwItem.unionAgencyTreePosition) {
                        const arr = this.zwfwItem.unionAgencyTreePosition.split('&');
                        return arr
                    }
                    return [];
                }
            },
            implAgencyDeptCascader() {
                if (this.zwfwItem.implAgency) {
                    if (this.zwfwItem.implAgencyTreePosition) {
                        const arr = this.zwfwItem.implAgencyTreePosition.split('&');
                        return arr
                    }
                    return [];
                }
            },
            uploadHeaders() {
                return {'User-Authorization': this.$store.getters.token}
            },
            downloadEform() {
                return this.zwfwItemMaterial.name + this.zwfwItemMaterial.eform.substring(this.zwfwItemMaterial.eform.lastIndexOf('.'))
            },
            downloadExample() {
                return this.zwfwItemMaterial.name + this.zwfwItemMaterial.example.substring(this.zwfwItemMaterial.example.lastIndexOf('.'))
            },
            ...mapGetters([
                'textMap',
                'enums',
                'dics',
                'closeOnClickModal'
            ])
        },
        created() {
            this.getItemList();
            this.getDeptTree();
            this.getAddresseeList();
        },
        watch: {
            'zwfwItem.addresseeId'() {
                if (this.cardItemVisible) {
                    this.initCardHeader();
                    this.cardItemVisible = false;
                }
            },
            'zwfwItem.handleType'(value) {
                if (value == 'blxs_ckbl') {
                    this.zwfwItem.handTypes = ['1'];
                }
            }

        },
        methods: {
            preorderChange(value) {
                console.log(value);
            },
            initEditor() {
                this.$nextTick(() => {
                    this.$refs.conditionEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerCondition);
                    this.$refs.workflowEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerWorkflow);
                    this.$refs.standardEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerStandard);
                    this.$refs.basisEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerBasis);
                    this.$refs.setBasisEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerSetBasis);
                    this.$refs.noticeTextEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerNoticeText);
                })
            },
            imgHandlerSetBasis(image) {
                if (image) {
                    let fileUploader = document.getElementById('setBasis_btn');
                    fileUploader.click()
                }
            },
            imgHandlerNoticeText(image) {
                if (image) {
                    let fileUploader = document.getElementById('notice_text_btn');
                    fileUploader.click()
                }
            },
            imgHandlerCondition(image) {
                if (image) {
                    let fileUploader = document.getElementById('condition_btn');
                    fileUploader.click()
                }
            },
            imgHandlerWorkflow(image) {
                if (image) {
                    let fileUploader = document.getElementById('workflow_btn');
                    fileUploader.click()
                }
            },
            imgHandlerStandard(image) {
                if (image) {
                    let fileUploader = document.getElementById('standard_btn');
                    fileUploader.click()
                }
            },
            imgHandlerBasis(image) {
                if (image) {
                    let fileUploader = document.getElementById('basis_btn');
                    fileUploader.click()
                }
            },
            getItemList() {
                this.pageLoading = true;
                getZwfwItemList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.zwfwItemList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg || '事项列表查询失败');
                    }
                    this.pageLoading = false;
                }).catch(e => {
                    this.pageLoading = false;
                    this.$message.error('事项列表查询失败');
                    console.error(e);
                });
            },
            getDeptTree() {
                getDeptCascader().then(response => {
                    if (response.httpCode === 200) {
                        this.deptTree = response.data;
                        this.cascader = response.data;
                    } else {
                        this.$message.error('加载部门信息失败');
                    }
                });
            },
            handleChange(value) {
                this.listQuery.departmentId = null;
                if (value.length > 0) {
                    this.listQuery.departmentId = value[value.length - 1];
                } else {
                    this.getItemList();
                }
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
            handleHandTypesChange() {
                this.initCardHeader();
                if (!this.zwfwItem.handTypes.includes('2')) {
                    this.zwfwItem.handUserId = undefined;
                }
            },
            initCardHeader() {
                if (!this.addresseeList || this.addresseeList.length <= 0) {
                    return;
                }
                if (!this.zwfwItem.handTypes.includes('3')) {
                    this.zwfwItem.addresseeId = undefined;
                    this.cardItemVisible = false;
                    return;
                }
                let addressee;
                if (this.zwfwItem.addresseeId) {
                    for (let item of this.addresseeList) {
                        if (item.id === this.zwfwItem.addresseeId) {
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
                this.zwfwItem.addresseeId = addressee.id;
                copyProperties(this.cardHeader, addressee);
            },
            getSetdAddressee() {
                if (this.zwfwItem.handTypes.indexOf('3') && this.zwfwItem.addresseeId) {
                    getAddresseeById(this.zwfwItem.addresseeId).then(response => {
                        if (response.httpCode == 200) {
                            copyProperties(this.cardHeader, response.data);
                        }
                    });
                }
            },
            handleItemCreate() {
                this.resetItemTemp();
                this.initCardHeader();
                this.dialogStatus = 'create';
                this.dialogItemFormVisible = true;
            },
            handleItemUpdate(row) {
                this.currentRow = row;
                this.resetItemTemp();
                this.zwfwItem = copyProperties(this.zwfwItem, row);
                if (this.zwfwItem.resultExample) {
                    this.resultExampleFileList.push({url: this.zwfwItem.resultExample, name: '结果样本'});
                }
                if (this.zwfwItem.handTypes) {
                    if (typeof this.zwfwItem.handTypes == 'string') {
                        this.zwfwItem.handTypes = this.zwfwItem.handTypes.split(',');
                    }
                } else {
                    this.zwfwItem.handTypes = []
                }
                if (this.zwfwItem.takeTypes) {
                    if (typeof this.zwfwItem.takeTypes == 'string') {
                        this.zwfwItem.takeTypes = this.zwfwItem.takeTypes.split(',');
                    }
                } else {
                    this.zwfwItem.takeTypes = []
                }
                this.getSetdAddressee();
                this.decodeEditorHtml();
                this.dialogStatus = 'update';
                this.dialogItemFormVisible = true;
                // 查询事项信息中没有返回事项预审人员，需要主动查询
                this.getPretrialUserList();
                this.getHandleNameById();
            },
            handleItemDelete() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doItemDelete();
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            doItemCreate() {
                this.$refs['zwfwItemForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormLoading = true;
                        this.zwfwItem.handTypes = this.zwfwItem.handTypes.join();
                        this.zwfwItem.takeTypes = this.zwfwItem.takeTypes.join();
                        this.zwfwItem.pretrialUserIds = this.zwfwItem.pretrialUserIds.join(',');
                        this.encodeEditorHtml();
                        createZwfwItem(this.zwfwItem).then(response => {
                            this.dialogFormLoading = false;
                            if (response.httpCode === 200) {
                                this.closeZwfwItemForm()
                                this.$message.success('创建成功');
                                this.getItemList();
                            } else {
                                this.$message.error(response.msg || '创建失败');
                            }
                        }).catch(e => {
                            console.log(e);
                            this.$message.error('创建失败');
                        });
                    } else {
                        this.$message.error('请检查表单各项是否填写正确或遗漏');
                        return false;
                    }
                });
            },
            doItemUpdate() {
                this.$refs['zwfwItemForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormLoading = true;
                        this.zwfwItem.handTypes = this.zwfwItem.handTypes.join();
                        this.zwfwItem.takeTypes = this.zwfwItem.takeTypes.join();
                        this.zwfwItem.pretrialUserIds = this.zwfwItem.pretrialUserIds.join(',');
                        this.encodeEditorHtml();
                        updateZwfwItem(this.zwfwItem).then(response => {
                            this.dialogFormLoading = false;
                            if (response.httpCode === 200) {
                                this.closeZwfwItemForm();
                                this.$message.success('更新成功');
                                this.getItemList();
                            } else {
                                this.$message.error(response.msg || '更新失败');
                            }
                        }).catch(e => {
                            console.log(e);
                            this.$message.error('更新失败');
                        });
                        ;
                    } else {
                        this.$message.error('请检查表单各项是否填写完整正确或遗漏');
                        return false;
                    }
                });
            },
            doItemDelete() {
                this.pageLoading = true;
                let ids = [];
                for (const deleteRow of this.selectedRows) {
                    ids.push(deleteRow.id);
                }
                delZwfwItems(ids.join()).then(response => {
                    if (response.httpCode === 200) {
                        this.getItemList();
                        this.$message.success('删除成功');
                    } else {
                        this.$message.error(response.msg || '删除失败');
                    }
                    this.pageLoading = false;
                })
            },
            queryPretrialUserId(keywords) {
                if (keywords && keywords.length > 0) {
                    getAllUser({
                        name: keywords
                    }).then(response => {
                        if (response.httpCode === 200) {
                            this.userListPretrial = response.data;
                        } else {
                            this.$message.error('加载用户列表失败');
                        }
                    });
                }
            },
            queryHandUserId(keywords) {
                // todo 预审人员是否根据所选部门筛选
                getAllUser({
                    name: keywords
                }).then(response => {
                    if (response.httpCode === 200) {
                        this.userListHand = response.data;
                    } else {
                        this.$message.error('加载用户列表失败');
                    }
                });
            },
            getHandleNameById() {
                getAllUser({
                    id: this.zwfwItem.handUserId
                }).then(response => {
                    if (response.httpCode === 200) {
                        this.userListHand = response.data;
                    } else {
                        this.$message.error('加载用户列表失败');
                    }
                })
            },
            getPretrialUserList() {
                getPretrialUserListByItemId(this.zwfwItem.id).then(response => {
                    if (response.httpCode === 200) {
                        this.userListPretrial = response.data;
                        this.zwfwItem.pretrialUserIds = response.data.map(function (o) {
                            return o.id;
                        });
                    } else {
                        this.$message.error('查询预审用户失败');
                    }
                });
            },
            handleBelongDeptChange(value) {
                if (value.length > 0) {
                    this.zwfwItem.departmentId = parseInt(value[value.length - 1]);
                    this.zwfwItem.departmentTreePosition = value.join('&');
                } else {
                    this.zwfwItem.departmentId = 0;
                    this.zwfwItem.departmentTreePosition = [];
                }
            },
            handleSuperviseChange(value) {
                if (value.length > 0) {
                    this.zwfwItem.superviseDepartmentId = parseInt(value[value.length - 1]);
                    this.zwfwItem.superviseTreePosition = value.join('&');
                } else {
                    this.zwfwItem.superviseDepartmentId = 0;
                    this.zwfwItem.superviseTreePosition = [];
                }
            },
            handleUnionAgencyChange(value) {
                if (value.length > 0) {
                    this.zwfwItem.unionAgency = parseInt(value[value.length - 1]);
                    this.zwfwItem.unionAgencyTreePosition = value.join('&');
                } else {
                    this.zwfwItem.unionAgency = 0;
                    this.zwfwItem.unionAgencyTreePosition = [];
                }
            },
            handleImplAgencyChange(value) {
                if (value.length > 0) {
                    this.zwfwItem.implAgency = parseInt(value[value.length - 1]);
                    this.zwfwItem.implAgencyTreePosition = value.join('&');
                } else {
                    this.zwfwItem.implAgency = 0;
                    this.zwfwItem.implAgencyTreePosition = [];
                }
            },
            showCardItems() {
                this.cardItemVisible = !this.cardItemVisible;
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            showResultExample() {
                if (this.zwfwItem.resultExample) {
                    window.open(this.zwfwItem.resultExample);
                }
            },
            handleResultUploadSuccess(res, file, fileList) {
                fileList.length = 0;
                fileList.push(file);
                this.zwfwItem.resultExample = res.url;
            },
            beforeResultUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传模板大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleRemoveResult() {
                this.zwfwItem.resultExample = '';
            },
            handleMaterialList(item) {
                this.currentItem = item;
                this.itemId = item.id;
                this.dialogStatus = 'associateMaterial';
                this.getItemMaterialList();
                this.resetMaterialTemp();
                this.dialogMaterialFormVisible = true;
            },
            getItemMaterialList() {
                this.dialogTableLoading = true;
                getAllItemMaterial(this.currentItem.id).then(response => {
                    if (response.httpCode === 200) {
                        this.zwfwItemMaterialList = response.data;
                    } else {
                        this.$message.error(response.msg || '加载材料列表失败');
                    }
                    this.dialogTableLoading = false;
                })
            },
            handleMaterialListSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.name = null;
                this.getItemList();
            },
            handleMaterialListCurrentChange(val) {
                this.listQuery.page = val;
                this.getItemList();
            },
            //事项预约配置编辑
            handleItemConfig(item) {
                this.currentItem = item;
                this.itemId = item.id;
                this.dialogStatus = 'itemConfigUpdate';
                this.getItemConfig();
                this.resetMaterialTemp();
                this.dialogItemConfigFormVisible = true;
            },

            getItemConfig() {
                getItemConfig(this.currentItem.id).then(response => {
                    if (response.httpCode === 200) {
                        this.zwfwItemConfig = response.data;
                        this.zwfwItemConfig.itemId = this.currentItem.id;
                    } else {
                        this.$message.error(response.msg || '加载事项预约配置失败');
                    }
                })
            },
            submitItemConfig() {
                if (this.zwfwItemConfig.ispreorder) {
                    if (this.zwfwItemConfig.preorderTimeArray == null || this.zwfwItemConfig.preorderTimeArray.length == 0) {
                        this.$message.warning("请勾选预约时间");
                        return false;
                    }
                }
                this.zwfwItemConfig.preorderTime = this.zwfwItemConfig.preorderTimeArray.join(",");
                this.zwfwItemConfig.preorderTimeArray1 = this.zwfwItemConfig.preorderTimeArray;
                this.zwfwItemConfig.opentime1 = this.zwfwItemConfig.opentime;
                this.zwfwItemConfig.preorderTimeArray = "";
                this.zwfwItemConfig.opentime = "";
                this.zwfwItemConfig.itemVo = "";
                setItemConfig(this.zwfwItemConfig).then(response => {
                    if (response.httpCode === 200) {
                        this.closeZwfwItemConfigForm();
                        this.$message.success('事项预约配置成功');
                    } else {
                        this.$message.error(response.msg || '事项预约配置失败');
                        this.zwfwItemConfig.preorderTimeArray = this.zwfwItemConfig.preorderTimeArray1;
                        this.zwfwItemConfig.opentime = this.zwfwItemConfig.opentime1;
                    }
                }).catch(e => {
                    console.dir(e);
                    this.$message.error('事项预约配置失败');
                    this.zwfwItemConfig.preorderTimeArray = this.zwfwItemConfig.preorderTimeArray1;
                    this.zwfwItemConfig.opentime = this.zwfwItemConfig.opentime1;
                });
            },

            searchMaterial(query, cb) {
                if (query !== '') {
                    let valid = validateQueryStr(query);
                    if (valid) {
                        this.$message.error(`输入中包含非法字符 ${valid}`)
                        return
                    }
                    const listQueryName = {
                        name: query
                    }
                    getAllMaterial(listQueryName).then(response => {
                        if (response.httpCode === 200) {
                            this.optionsName = response.data;
                            cb(this.optionsName);
                        } else {
                            this.$message.error(response.msg || '材料查找失败');
                        }
                    })
                } else {
                    this.optionsName = [];
                }


            },
            changeMaterial(value) {
                this.currentRow = value
                this.zwfwItemMaterial = copyProperties(this.zwfwItemMaterial, value)
                this.changeMaterialInfo = true;
                return;
            },
            handleMaterialUpdate(row) {
                this.currentRow = row;
                this.resetMaterialTemp();
                this.zwfwItemMaterial = copyProperties(this.zwfwItemMaterial, row);
                this.changeMaterialInfo = true;
            },
            handleMaterialDelete() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doMaterialDelete();
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            isExist() {
                this.isMaterialExist = false;
                for (let obj of this.zwfwItemMaterialList) {
                    if (obj.id === this.zwfwItemMaterial.id) {
                        this.resetZwfwMaterialForm();
                        this.isMaterialExist = true;
                    }
                }
            },
            relateMaterial() {
                this.isExist();
                if (this.isMaterialExist) {
                    this.$message.warning('资料已存在');
                }
                this.$refs['zwfwMaterialForm'].validate(valid => {
                    if (valid) {
                        const query = {
                            itemId: this.itemId,
                            materialId: this.zwfwItemMaterial.id,
                            paperDescription: this.zwfwItemMaterial.paperDescription,
                            sortNo: this.zwfwItemMaterial.sortNo
                        }
                        this.dialogFormLoading = true;
                        createZwfwItemMaterial(query).then(response => {
                            this.dialogFormLoading = false;
                            if (response.httpCode === 200) {
                                this.getItemMaterialList();
                                this.resetZwfwMaterialForm();
                                this.$message.success('关联成功');
                                this.currentItem.itemMaterialCount += 1;
                            } else {
                                this.$message.error('关联失败');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doMaterialUpdate() {
                this.dialogFormLoading = true;
                this.zwfwItemMaterial.itemId = this.itemId;
                updateZwfwMaterial(this.zwfwItemMaterial).then(response => {
                    this.dialogFormLoading = false;
                    if (response.httpCode === 200) {
                        this.getItemMaterialList();
                        this.resetZwfwMaterialForm();
                        this.$message.success('更新成功');
                    } else {
                        this.$message.error('更新失败');
                    }
                })
            },
            doUpdateAndRelate() {
                this.isExist();
                if (this.isMaterialExist) {
                    this.$message.warning('资料已存在');
                }
                this.$refs['zwfwMaterialForm'].validate(valid => {
                    if (valid) {
                        this.zwfwItemMaterial.itemId = this.itemId;
                        doUpdateAndRelate(this.zwfwItemMaterial).then(response => {
                            this.dialogFormLoading = false;
                            if (response.httpCode === 200) {
                                this.getItemMaterialList();
                                this.resetZwfwMaterialForm();
                                this.$message.success('更新并关联成功');
                            } else {
                                this.$message.error('更新并关联失败');
                            }
                        })
                    } else {
                        return false;
                    }
                });

            },
            doMaterialDelete() {
                const length = this.selectedRows.length;
                const ids = [];
                for (const deleteRow of this.selectedRows) {
                    ids.push(deleteRow.id);
                }
                deleteZwfwItemMaterial(this.itemId, ids).then(response => {
                    if (response.httpCode === 200) {
                        for (const deleteRow of this.selectedRows) {
                            const index = this.zwfwItemMaterialList.indexOf(deleteRow);
                            this.zwfwItemMaterialList.splice(index, 1);
                        }
                        this.currentItem.itemMaterialCount -= length;
                        this.$message.success('删除成功');
                    } else {
                        this.$message.error(response.msg || '删除失败');
                    }
                })
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isLt2M) {
                    this.$message.error('上传模板大小不能超过 10MB!');
                }
                return isLt2M;
            },
            changeAvatarExampleFile(file, fileList) {
                this.zwfwItemMaterial.example = file.name;
                if (file.response) {
                    this.zwfwItemMaterial.example = file.response.url;
                }
            },
            changeAvatarEformFile(file, fileList) {
                this.zwfwItemMaterial.eform = file.name;
                if (file.response) {
                    this.zwfwItemMaterial.eform = file.response.url;
                }
            },
            onEditorFocus(editor) {
                this.editor = editor
            },
            handleEditorUploadSuccess(res, file, fileList) {
                if (res.state === 'SUCCESS') {
                    let length = this.editor.getSelection(true).index;
                    this.editor.insertEmbed(length, 'image', res.url);
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handleEditorUploadError(err, file, fileList) {
                this.$message.error('网络不稳定，上传失败');
            },
            encodeEditorHtml() {
                // if(this.acceptConditionHtml) {
                //     this.acceptConditionHtml = this.acceptConditionHtml.replace(/%/g, '％');
                // }
                // if(this.workflowDescriptionHtml) {
                //     this.workflowDescriptionHtml = this.workflowDescriptionHtml.replace(/%/g, '％');
                // }
                // if(this.chargeStandardHtml) {
                //     this.chargeStandardHtml = this.chargeStandardHtml.replace(/%/g, '％');
                // }
                // if(this.chargeBasisHtml) {
                //     this.chargeBasisHtml = this.chargeBasisHtml.replace(/%/g, '％');
                // }
                // if(this.setBasisHtml) {
                //     this.setBasisHtml = this.setBasisHtml.replace(/%/g, '％');
                // }
                // if(this.noticeTextHtml) {
                //     this.noticeTextHtml = this.noticeTextHtml.replace(/%/g, '％');
                // }
                this.zwfwItem.acceptCondition = encodeURIComponent(encodeURIComponent(this.acceptConditionHtml));
                this.zwfwItem.workflowDescription = encodeURIComponent(encodeURIComponent(this.workflowDescriptionHtml));
                this.zwfwItem.chargeStandard = encodeURIComponent(encodeURIComponent(this.chargeStandardHtml));
                this.zwfwItem.chargeBasis = encodeURIComponent(encodeURIComponent(this.chargeBasisHtml));
                this.zwfwItem.setBasis = encodeURIComponent(encodeURIComponent(this.setBasisHtml));
                this.zwfwItem.remark = encodeURIComponent(encodeURIComponent(this.noticeTextHtml));
            },
            decodeEditorHtml() {
                // 返回来的数据是不用 decode 的，而且在内容包含%字符时，decode 会报错
                // this.acceptConditionHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.acceptCondition));
                this.acceptConditionHtml = this.zwfwItem.acceptCondition;
                // this.workflowDescriptionHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.workflowDescription));
                this.workflowDescriptionHtml = this.zwfwItem.workflowDescription;
                // this.chargeStandardHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.chargeStandard));
                this.chargeStandardHtml = this.zwfwItem.chargeStandard;
                // this.chargeBasisHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.chargeBasis));
                this.chargeBasisHtml = this.zwfwItem.chargeBasis;
                // this.setBasisHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.setBasis));
                this.setBasisHtml = this.zwfwItem.setBasis;
                // this.noticeTextHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.remark));
                this.noticeTextHtml = this.zwfwItem.remark;
            },
            closeZwfwItemForm() {
                this.dialogItemFormVisible = false;
                this.resultExampleFileList = [];
                this.resetItemTemp();
                resetForm(this, 'zwfwItemForm');
            },
            closeZwfwMaterialForm() {
                this.dialogMaterialFormVisible = false;
                this.resetZwfwMaterialForm();
            },
            closeZwfwItemConfigForm() {
                this.dialogItemConfigFormVisible = false;
                // this.resetZwfwMaterialForm();
            },

            resetZwfwMaterialForm() {
                this.changeMaterialInfo = false;
                this.resetMaterialTemp();
                resetForm(this, 'zwfwMaterialForm');
            },
            resetItemTemp() {
                this.zwfwItem = {
                    id: undefined,
                    departmentId: [],
                    superviseDepartmentId: [],
                    unionAgency: [],
                    implAgency: [],
                    setBasis: '',
                    chargeable: true,
                    orderable: true,
                    implObjectType: 'ssztxz_swtzz',
                    payOnlineAble: true,
                    basicCode: '',
                    promiseEndTime: '',
                    remark: '',
                    runSystem: 'yxxt_guojiaji',
                    type: '',
                    resultExample: '',
                    handleLevel: 'xscj_guojiaji',
                    serviceObject: 'fwdx_ziranren',
                    handlePlace: '',
                    handleTime: '',
                    handleContent: '',
                    applyMaterial: '',
                    numberLimit: '',
                    handleScope: 'tbfw_quanguo',
                    askPhone: '',
                    handleWorkflow: '',
                    chargeStandard: '',
                    processType: 'bjlx_cnj',
                    legalEndTime: '',
                    postable: true,
                    handTypes: ['1'],
                    takeTypes: ['1'],
                    handUserId: undefined,
                    addresseeId: '',
                    versionAvailableTime: '',
                    supervisePhone: '',
                    acceptCondition: '',
                    chargeBasis: '',
                    workflowDescription: '',
                    authorityDivision: '',
                    version: '',
                    resultName: '',
                    handleType: 'blxs_ckbl',
                    name: '',
                    mediumService: '',
                    showStatus: '',
                    commonRequestion: '',
                    implCode: '',
                    updateType: '',
                    pretrialDays: '',
                    pretrialUserIds: [],
                    departmentTreePosition: '',
                    superviseTreePosition: '',
                    implAgencyTreePosition: '',
                    unionAgencyTreePosition: '',
                    enable: ''
                };
                this.setBasisHtml = '';
                this.acceptConditionHtml = '';
                this.workflowDescriptionHtml = '';
                this.chargeStandardHtml = '';
                this.chargeBasisHtml = ''
            },
            resetMaterialTemp() {
                this.zwfwItemMaterial = {
                    id: undefined,
                    electronicMaterial: false,
                    eform: '',
                    name: '',
                    sortNo: '',
                    paperDescription: '',
                    acceptStandard: '',
                    remark: '',
                    source: '',
                    type: '',
                    example: '',
                    notice: ''
                };
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.name = null;
                this.getItemList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getItemList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.zwfwItemTable.toggleRowSelection(row);
            }
        }
    }
</script>
<style>
    .el-checkbox {
        margin-left: 0px;
        margin-right: 15px;
    }

    .el-checkbox + .el-checkbox {
        margin-left: 0px;
    }

    .item {
        /*margin-top: 12px;*/
        margin-right: 10px;
    }

    .quill-editor {
        /*height: 218px;*/
        margin-bottom: 8px;
    }

    .quill-editor .ql-toolbar {
        line-height: 24px;
    }

    .ql-container {
        max-height: 180px;
        overflow: scroll
    }

    .ql-toolbar.ql-snow .ql-formats {
        margin-right: 0px;
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .el-table .el-table-column--selection .cell {
        text-overflow: clip;
    }

    .el-table th.action .cell {
        line-height: 50px;
    }

    .elRow {
        height: 50px;
    }

    tbody .action .cell {
        height: 50px;
        padding-top: 10px;
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
