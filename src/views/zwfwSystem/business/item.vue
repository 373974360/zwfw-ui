<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getItemList" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.name"></el-input>
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
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="事项名称" prop="name">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click="handleItemUpdate(scope.row)">{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="基本编码" prop="basicCode">
                <template scope="scope">
                    <span>{{scope.row.basicCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="事项类型" prop="type">
                <template scope="scope">
                    <span>{{scope.row.type | dics('sslx')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办件类型" prop="processType">
                <template scope="scope">
                    <el-tag :type="scope.row.processType | dics('bjlx')">
                        {{scope.row.processType | dics('bjlx')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="承诺办结时间" prop="promiseEndTime">
                <template scope="scope">
                    <span>{{scope.row.promiseEndTime}} 工作日</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="法定办结时限" prop="legalEndTime">
                <template scope="scope">
                    <span>{{scope.row.legalEndTime}} 工作日</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办理形式" prop="handleType">
                <template scope="scope">
                    <el-tag :type="scope.row.handleType | dics('blxs')">
                        {{scope.row.handleType | dics('blxs')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
                    <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
                        {{scope.row.enable | enums('Enable')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-badge :value="scope.row.itemMaterialCount" class="item">
                        <el-button class="filter-item" style="margin-left: 10px;" @click="handleMaterialList(scope.row)"
                                   type="primary" size="small">
                            办件材料
                        </el-button>
                    </el-badge>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!pageLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogItemFormVisible" @open="initEditor"
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
                            v-model="deptCascader"
                            @change="handleDeptChange"
                            style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="基本编码" prop="basicCode">
                    <el-input v-model="zwfwItem.basicCode"></el-input>
                </el-form-item>
                <el-form-item label="实施编码" prop="implCode">
                    <el-input v-model="zwfwItem.implCode"></el-input>
                </el-form-item>
                <el-form-item label="设定依据" prop="setBasis">
                    <el-input v-model="zwfwItem.setBasis" type="textarea" :rows="3"></el-input>
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
                    <el-input v-model="zwfwItem.promiseEndTime"></el-input>
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
                    <el-input v-model="zwfwItem.unionAgency"></el-input>
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
                    <el-input v-model="zwfwItem.askPhone"></el-input>
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
                <el-form-item label="是否支持物流快递" prop="postable">
                    <el-switch
                            v-model="zwfwItem.postable"
                            on-color="#13ce66"
                            off-color="#ff4949"
                            :on-value="true"
                            :off-value="false">
                    </el-switch>
                </el-form-item>
                <el-form-item label="版本生效时间" prop="versionAvailableTime">
                    <el-date-picker v-model="zwfwItem.versionAvailableTime" type="datetime"
                                    placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="监督部门" prop="superviseDepartmentId">
                    <el-cascader
                            expand-trigger="hover" :show-all-levels="true"
                            :change-on-select="true"
                            :options="deptTrees"
                            v-model="updateModel"
                            @change="handleChanges"
                            style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="监督电话" prop="supervisePhone">
                    <el-input v-model="zwfwItem.supervisePhone"></el-input>
                </el-form-item>
                <el-form-item label="实施机构" prop="implAgency">
                    <el-input v-model="zwfwItem.implAgency"></el-input>
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
                <el-form-item label="预审天数" prop="pretrialDays">
                    <el-input v-model="zwfwItem.pretrialDays"></el-input>
                </el-form-item>
                <el-form-item label="预审人员">
                    <el-select style="width:100%" v-model="zwfwItem.pretrialUserIdsArray" remote
                               :remote-method="queryUser"
                               multiple filterable placeholder="请选择">
                        <el-option
                                v-for="u in allUserList"
                                :key="u.id"
                                :label="u.name + ' (工号：' + u.empNo +')'"
                                :value="u.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示状态" prop="showStatus">
                    <el-select>
                        <el-option v-for="item in enums['ShowStatus']" :key="item.code"
                                   :value="item.code" :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="中介服务" prop="mediumService">
                    <el-input v-model="zwfwItem.mediumService"></el-input>
                </el-form-item>
                <el-form-item label="常见问题" prop="commonRequestion">
                    <el-input v-model="zwfwItem.commonRequestion"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="zwfwItem.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
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


        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogMaterialFormVisible" size="large"
                   :close-on-click-modal="closeOnClickModal" :before-close="closeZwfwMaterialForm">
            <div class="filter-container">
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleMaterialDelete" type="danger"
                           icon="delete">
                    删除
                </el-button>
            </div>
            <el-table ref="zwfwItemMaterialForm" :data="zwfwItemMaterialList" v-loading.body="dialogTableLoading"
                      border fit
                      highlight-current-row
                      style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column align="center" label="序号" width="200">
                    <template scope="scope">
                        <span>{{scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="left" label="材料名称">
                    <template scope="scope">
                        <el-tooltip content="点击编辑" placement="right" effect="dark">
                            <span class="link-type" @click="handleMaterialUpdate(scope.row)">{{scope.row.name}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="type" align="center" label="材料类型" width="200">
                    <template scope="scope">
                        <span>{{scope.row.type | dics('cllx')}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-once prop="source" align="center" label="来源渠道" width="300">
                    <template scope="scope">
                        <span>{{scope.row.source | dics('sxsqclly')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="electronicMaterial" align="center" label="是否需要电子材料" width="200">
                    <template scope="scope">
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
                    <el-select
                            v-model="zwfwItemMaterial.name"
                            filterable
                            remote
                            placeholder="请输入材料名称"
                            :remote-method="searchMaterial"
                            @change="changeMaterial"
                            :disabled="changeMaterialName" style="width:100%">

                        <el-option
                                v-for="item in optionsName"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="纸质材料说明:" prop="paperDescription" v-show="changeMaterialInfo">
                    <!--<span>{{zwfwItemMaterial.paperDescription}}</span>-->
                    <el-input v-model="zwfwItemMaterial.paperDescription" placeholder="数量和规格"></el-input>
                </el-form-item>
                <table>
                    <tr>
                        <td>
                            <el-form-item label="材料类型:" :inline="true" v-show="changeMaterialInfo">
                                <span>{{zwfwItemMaterial.type | dics('cllx')}}</span>
                                <!--<el-input v-model="zwfwItemMaterial.type"></el-input>-->
                            </el-form-item>
                        </td>
                        <td width="100"></td>
                        <td>
                            <el-form-item label="是否需要电子材料:" :inline="true" prop="electronicMaterial"
                                          v-show="changeMaterialInfo">
                                <span v-if="zwfwItemMaterial.electronicMaterial">{{zwfwItemMaterial.electronicMaterial | enums('YesNo')}}</span>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                <el-form-item label="受理标准:" prop="acceptStandard" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.acceptStandard}}</span>
                </el-form-item>
                <el-form-item label="来源渠道:" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.source | dics('sxsqclly')}}</span>
                </el-form-item>
                <el-form-item label="材料样本:" prop="example" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.example}}</span>
                </el-form-item>
                <el-form-item label="电子表单:" prop="eform" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.eform}}</span>
                </el-form-item>
                <el-form-item label="填报须知:" prop="notice" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.notice}}</span>
                </el-form-item>
                <el-form-item label="备注:" prop="remark" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.remark}}</span>
                </el-form-item>
            </el-form>
            <div style="text-align: center" slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="closeZwfwMaterialForm">取 消</el-button>
                <el-button type="primary" icon="circle-check"
                           @click="relateMaterial">确 定
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
        getPretrialUserListByItemId
    } from 'api/zwfwSystem/business/item';
    import {
        createZwfwItemMaterial,
        getAllItemMaterial,
        deleteZwfwItemMaterial
    } from 'api/zwfwSystem/business/itemMaterial';
    import {getAllMaterial, updateZwfwMaterial} from 'api/zwfwSystem/business/material';
    import {getAllUser} from 'api/baseSystem/org/user';
    import {getDeptCascader} from 'api/baseSystem/org/dept';
    import {quillEditor} from 'vue-quill-editor'

    export default {
        name: 'zwfwItem_table',
        components: {
            quillEditor
        },
        data() {
            return {
                changeMaterialName: false,
                changeMaterialInfo: false,
                zwfwItemList: [],
                zwfwItemMaterialList: [],
                ItemMaterial: [],
                optionsName: [],
                list: [],
                total: null,
                pageLoading: true,
                dialogFormLoading: false,
                dialogTableLoading: false,
                changeTable: false,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined
                },
                activeName: 'first',
                zwfwItem: {
                    id: undefined,
                    departmentId: [],
                    superviseDepartmentId: [],
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
                    unionAgency: '',
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
                    versionAvailableTime: '',
                    supervisePhone: '',
                    pretrialDays: '',
                    implAgency: '',
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
                    departmentTreePositions: ''
                },
                zwfwItemMaterial: {
                    id: undefined,
                    electronicMaterial: true,
                    eform: '',
                    name: '',
                    paperDescription: '',
                    acceptStandard: '',
                    remark: '',
                    source: '',
                    type: '',
                    example: '',
                    notice: ''
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
                        {required: true, message: '请输入预审天数'}
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
                    ]
                },
                zwfwItemMaterialRules: {
                    name: [
                        {required: true, message: '请输入材料名称'}
                    ]
                },
                allUserList: [],
                deptTree: [],
                deptTrees: [],
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
                editor: {}
            }
        },
        computed: {
            deptCascader() {
                if (this.zwfwItem.departmentId) {
                    // 找到对应的部门
                    if (this.zwfwItem.departmentTreePosition) {
                        const arr = this.zwfwItem.departmentTreePosition.split('&');
                        return arr
                    }
                    return [];
                }
            },
            updateModel() {
                if (this.zwfwItem.superviseDepartmentId) {
                    //找到对应的部门
//                    console.log(this.zwfwItem.departmentTreePosition);
                    if (this.zwfwItem.departmentTreePositions) {
                        const arr = this.zwfwItem.departmentTreePositions.split('&');
                        return arr
                    }
                    return [];
                }
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
        },
        methods: {
            initEditor() {
                this.$nextTick(() => {
                    this.$refs.conditionEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerCondition);
                    this.$refs.workflowEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerWorkflow);
                    this.$refs.standardEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerStandard);
                    this.$refs.basisEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerBasis);
                })
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
                });
            },
            getDeptTree() {
                getDeptCascader().then(response => {
                    if (response.httpCode === 200) {
                        this.deptTree = response.data;
                        this.deptTrees = response.data;
                    } else {
                        this.$message.error('加载部门信息失败');
                    }
                });
            },
            handleItemCreate() {
                this.resetItemTemp();
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
                this.decodeEditorHtml();
                this.dialogStatus = 'update';
                this.dialogItemFormVisible = true;
                // 查询事项信息中没有返回事项预审人员，需要主动查询
                this.getPretrialUserList();
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
                        this.zwfwItem.pretrialUserIds = this.zwfwItem.pretrialUserIdsArray.join(',');
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
                        })
                    } else {
                        return false;
                    }
                });
            },
            doItemUpdate() {
                this.$refs['zwfwItemForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormLoading = true;
                        this.zwfwItem.pretrialUserIds = this.zwfwItem.pretrialUserIdsArray.join(',');
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
                        });
                    } else {
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
            queryUser(keywords) {
                // todo 预审人员是否根据所选部门筛选
                getAllUser({
                    name: keywords
                }).then(response => {
                    if (response.httpCode === 200) {
                        this.allUserList = response.data;
                    } else {
                        this.$message.error('加载用户列表失败');
                    }
                });
            },
            getPretrialUserList() {
                getPretrialUserListByItemId(this.zwfwItem.id).then(response => {
                    if (response.httpCode === 200) {
                        this.allUserList = response.data;
                        this.zwfwItem.pretrialUserIdsArray = response.data.map(function(o) {
                            return o.id;
                        });
                    } else {
                        this.$message.error('查询预审用户失败');
                    }
                });
            },
            handleDeptChange(value) {
                if (value.length > 0) {
                    this.zwfwItem.departmentId = parseInt(value[value.length - 1]);
                    this.zwfwItem.departmentTreePosition = value.join('&');
                } else {
                    this.zwfwItem.departmentId = 0;
                    this.zwfwItem.departmentTreePosition = [];
                }
            },
            handleChanges(value) {
                if (value.length > 0) {
                    this.zwfwItem.superviseDepartmentId = parseInt(value[value.length - 1]);
                    this.zwfwItem.departmentTreePositions = value.join('&');
                } else {
                    this.zwfwItem.superviseDepartmentId = 0;
                    this.zwfwItem.departmentTreePositions = [];
                }
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
            searchMaterial(query) {
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
                        } else {
                            this.$message.error(response.msg || '材料查找失败');
                        }
                    })
                } else {
                    this.optionsName = [];
                }
            },
            changeMaterial(value) {
                for (const obj of this.optionsName) {
                    if (obj.id === value) {
                        this.currentRow = obj
                        this.zwfwItemMaterial = copyProperties(this.zwfwItemMaterial, obj)
                        this.changeMaterialInfo = true;
                        return;
                    }
                }
            },
            handleMaterialUpdate(row) {
                this.currentRow = row;
                this.resetMaterialTemp();
                this.zwfwItemMaterial = copyProperties(this.zwfwItemMaterial, row);
                this.changeMaterialName = true;
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
            relateMaterial() {
                this.$refs['zwfwMaterialForm'].validate(valid => {
                    if (valid) {
                        if (!this.changeMaterialName) {
                            this.doMaterialAdd();
                        } else {
                            this.doMaterialUpdate();
                        }
                    } else {
                        return false;
                    }
                });
            },
            doMaterialAdd() {
                for (let obj of this.zwfwItemMaterialList) {
                    if (obj.id === this.zwfwItemMaterial.id) {
                        this.$message.warning('资料已存在');
                        this.resetZwfwMaterialForm();
                        return false;
                    }
                }
                const query = {
                    itemId: this.itemId,
                    materialId: this.zwfwItemMaterial.id,
                    paperDescription: this.zwfwItemMaterial.paperDescription
                }
                this.dialogFormLoading = true;
                createZwfwItemMaterial(query).then(response => {
                    this.dialogFormLoading = false;
                    if (response.httpCode === 200) {
                        this.getItemMaterialList();
                        this.resetZwfwMaterialForm();
                        this.$message.success('关联成功');
                    } else {
                        this.$message.error('关联失败');
                    }
                })
            },
            doMaterialUpdate() {
                const zwfwMaterialList = {
                    id: this.zwfwItemMaterial.id,
                    electronicMaterial: this.zwfwItemMaterial.electronicMaterial,
                    eform: this.zwfwItemMaterial.eform,
                    name: this.zwfwItemMaterial.name,
                    paperDescription: this.zwfwItemMaterial.paperDescription,
                    acceptStandard: this.zwfwItemMaterial.acceptStandard,
                    remark: this.zwfwItemMaterial.remark,
                    source: this.zwfwItemMaterial.source,
                    type: this.zwfwItemMaterial.type,
                    example: this.zwfwItemMaterial.example,
                    notice: this.zwfwItemMaterial.notice
                }
                this.dialogFormLoading = true;
                updateZwfwMaterial(zwfwMaterialList).then(response => {
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
                this.zwfwItem.acceptCondition = encodeURIComponent(encodeURIComponent(this.acceptConditionHtml));
                this.zwfwItem.workflowDescription = encodeURIComponent(encodeURIComponent(this.workflowDescriptionHtml));
                this.zwfwItem.chargeStandard = encodeURIComponent(encodeURIComponent(this.chargeStandardHtml));
                this.zwfwItem.chargeBasis = encodeURIComponent(encodeURIComponent(this.chargeBasisHtml));
            },
            decodeEditorHtml() {
                this.acceptConditionHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.acceptCondition));
                this.workflowDescriptionHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.workflowDescription));
                this.chargeStandardHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.chargeStandard));
                this.chargeBasisHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.chargeBasis));
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
            resetZwfwMaterialForm() {
                this.changeMaterialName = false;
                this.changeMaterialInfo = false;
                this.resetMaterialTemp();
                resetForm(this, 'zwfwMaterialForm');
            },
            resetItemTemp() {
                this.zwfwItem = {
                    id: undefined,
                    departmentId: undefined,
                    superviseDepartmentId: undefined,
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
                    unionAgency: '',
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
                    versionAvailableTime: '',
                    supervisePhone: '',
                    implAgency: '',
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
                    pretrialUserIdsArray: [],
                    departmentTreePosition: '',
                    departmentTreePositions: ''
                };
                this.acceptConditionHtml = '';
                this.workflowDescriptionHtml = '';
                this.chargeStandardHtml = '';
                this.chargeBasisHtml = ''
            },
            resetMaterialTemp() {
                this.zwfwItemMaterial = {
                    id: undefined,
                    electronicMaterial: true,
                    eform: '',
                    name: '',
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
<style rel="stylesheet/scss" lang="scss">
    .item {
        margin-top: 10px;
        text-align: center;
    }

    .quill-editor {
        height: 218px;
        margin-bottom: 8px;
        .ql-toolbar {
            line-height: 24px;
        }
        .ql-container {
            height: 180px;
        }
    }
</style>
