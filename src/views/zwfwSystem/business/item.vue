<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.name"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>

        <el-table ref="zwfwItemTable" :data="zwfwItemList" v-loading.body="listLoading" border fit highlight-current-row
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
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
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

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetZwfwItemForm">
            <el-form ref="zwfwItemForm" class="small-space" :model="zwfwItem" label-position="right"
                     label-width="134px"
                     style='width: 80%; ' v-loading="dialogLoading" :rules="zwfwItemRules">
                <el-form-item label="事项名称" prop="name">
                    <el-input v-model="zwfwItem.name"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="departmentId">
                    <!--<el-select v-model="zwfwItem.departmentId" placeholder="所属部门" style="width:100%">-->
                    <!--<el-option-->
                    <!--v-for="dept in deptList"-->
                    <!--:key="dept.id"-->
                    <!--:label="dept.name"-->
                    <!--:value="dept.id">-->
                    <!--</el-option>-->
                    <!--</el-select>-->

                    <el-cascader
                            expand-trigger="hover" :show-all-levels="true"
                            :change-on-select="true"
                            :options="deptTree"
                            v-model="cascaderModel"
                            @change="handleChange">
                    </el-cascader>

                </el-form-item>
                <el-form-item label="基本编码" prop="basicCode">
                    <el-input v-model="zwfwItem.basicCode"></el-input>
                </el-form-item>
                <el-form-item label="实施编码" prop="implCode">
                    <el-input v-model="zwfwItem.implCode"></el-input>
                </el-form-item>
                <el-form-item label="设定依据" prop="setBasis">
                    <el-input v-model="zwfwItem.setBasis" type="textarea"></el-input>
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
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结果样本" prop="resultExample">
                    <el-upload name="uploadFile" accept="uploadAccepts"
                               ref="upload"
                               :action="uploadAction" :file-list="uploadAvatarsResult"
                               :on-success="handleAvatarResultSuccess"
                               :before-upload="beforeAvatarUpload"
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
                <el-form-item label="收费标准" prop="chargeStandard">
                    <el-input v-model="zwfwItem.chargeStandard" type="textarea"></el-input>
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
                <el-form-item label="监督电话" prop="supervisePhone">
                    <el-input v-model="zwfwItem.supervisePhone"></el-input>
                </el-form-item>
                <el-form-item label="实施机构" prop="implAgency">
                    <el-input v-model="zwfwItem.implAgency"></el-input>
                </el-form-item>
                <el-form-item label="受理条件" prop="acceptCondition">
                    <!--<el-input v-model="zwfwItem.acceptCondition" type="textarea"></el-input>-->
                    <quill-editor v-model="acceptConditionHtml"
                                  @change="acceptConditionChange($event)"
                                  ref="acceptConditionEditor"
                                  :options="acceptConditionEditorOption" >
                    </quill-editor>
                </el-form-item>
                <el-form-item label="收费依据" prop="chargeBasis">
                    <!--<el-input v-model="zwfwItem.chargeBasis" type="textarea"></el-input>-->
                    <quill-editor v-model="chargeBasisHtml"
                                  @change="chargeBasisChange($event)"
                                  ref="acceptConditionEditor"
                                  :options="acceptConditionEditorOption" >
                    </quill-editor>
                </el-form-item>
                <el-form-item label="内部流程描述" prop="workflowDescription">
                    <!--<el-input v-model="zwfwItem.workflowDescription" type="textarea"></el-input>-->
                    <quill-editor v-model="workflowDescriptionHtml"
                                  @change="workflowDescriptionChange($event)"
                                  ref="acceptConditionEditor"
                                  :options="acceptConditionEditorOption" >
                    </quill-editor>
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
                <el-button icon="circle-cross" type="danger" @click="resetZwfwItemForm">取 消
                </el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">
                    确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">
                    确 定
                </el-button>
            </div>
        </el-dialog>


        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible1" size="large"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetZwfwMaterialForm">
            <div class="filter-container">
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleDeleteOne" type="danger"
                           icon="delete">
                    删除
                </el-button>
            </div>
            <el-table ref="zwfwItemMaterialForm" :data="zwfwItemMaterialList" v-loading.body="listLoading1"
                      border fit
                      highlight-current-row
                      style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column align="center" label="序号" width="150">
                    <template scope="scope">
                        <span>{{scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="left" label="材料名称" width="400">
                    <template scope="scope">
                        <el-tooltip content="点击编辑" placement="right" effect="dark">
                            <span class="link-type" @click='handleUpdateClick(scope.row)'>{{scope.row.name}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="type" align="center" label="材料类型" width="100">
                    <template scope="scope">
                        <span>{{scope.row.type | dics('cllx')}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-once prop="source" align="center" label="来源渠道">
                    <template scope="scope">
                        <span>{{scope.row.source | dics('sxsqclly')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="electronicMaterial" align="center" label="是否需要电子材料">
                    <template scope="scope">
                        <span>{{scope.row.electronicMaterial | enums('YesNo')}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-form ref="zwfwMaterialForm" class="small-space" :model="zwfwItemMaterial"
                     label-position="right"
                     label-width="134px"
                     style='width: 80%; margin-left:10%; margin-top: 5%;'
                     :rules="zwfwItemMaterialRules">
                <el-form-item label="材料名称" prop="name">
                    <el-select
                            v-model="zwfwItemMaterial.name"
                            filterable
                            remote
                            placeholder="请输入材料名称"
                            :remote-method="remoteMethod"
                            @change="changeMaterial"
                            :disabled="changeMaterialName" style="width:100%">

                        <el-option
                                v-for="item in optionsName"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
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
                                <span v-if="electronicMaterial!=null">{{zwfwItemMaterial.electronicMaterial | enums('YesNo')}}</span>
                                <!--<el-switch-->
                                <!--v-model="zwfwItemMaterial.electronicMaterial"-->
                                <!--on-color="#13ce66"-->
                                <!--off-color="#ff4949"-->
                                <!--:on-value="true"-->
                                <!--:off-value="false">-->
                                <!--</el-switch>-->
                            </el-form-item>
                        </td>
                    </tr>
                </table>

                <el-form-item label="受理标准:" prop="acceptStandard" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.acceptStandard}}</span>
                    <!--<el-input v-model="zwfwItemMaterial.acceptStandard"></el-input>-->
                </el-form-item>
                <el-form-item label="来源渠道:" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.source | dics('sxsqclly')}}</span>
                    <!--<el-input v-model="zwfwItemMaterial.source"></el-input>-->
                </el-form-item>
                <el-form-item label="材料样本:" prop="example" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.example}}</span>
                    <!--<el-upload name="uploadFile"  accept="uploadAccepts"-->
                    <!--:action="uploadAction" :file-list="uploadAvatarsExample"-->
                    <!--:on-success="handleAvatarExampleSuccess"-->
                    <!--:before-upload="beforeAvatarUpload"-->
                    <!--:on-remove="handleRemoveExample">-->
                    <!--<el-button size="small" type="primary">点击上传</el-button>-->
                    <!--</el-upload>-->
                </el-form-item>
                <el-form-item label="电子表单:" prop="eform" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.eform == 1 ? '支持' : '不支持'}}</span>
                    <!--<el-upload name="uploadFile"  accept="uploadAccepts"-->
                    <!--:action="uploadAction" :file-list="uploadAvatarsEform"-->
                    <!--:on-success="handleAvatarEformSuccess"-->
                    <!--:before-upload="beforeAvatarUpload"-->
                    <!--:on-remove="handleRemoveEform">-->
                    <!--<el-button size="small" type="primary">点击上传</el-button>-->
                    <!--</el-upload>-->
                </el-form-item>
                <el-form-item label="填报须知:" prop="notice" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.notice}}</span>
                    <!--<el-input v-model="zwfwItemMaterial.notice"></el-input>-->
                </el-form-item>
                <el-form-item label="备注:" prop="remark" v-show="changeMaterialInfo">
                    <span>{{zwfwItemMaterial.remark}}</span>
                    <!--<el-input v-model="zwfwItemMaterial.remark"></el-input>-->
                </el-form-item>
            </el-form>
            <div style="text-align: center" slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetZwfwMaterialForm">取 消</el-button>
                <el-button type="primary" icon="circle-check"
                           @click="createMaterial">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {
        getZwfwItemList, createZwfwItem, updateZwfwItem, delZwfwItems,
        getPretrialUserListByItemId,
        updatePretrialUserList
    } from 'api/zwfwSystem/business/item';
    import {
        createZwfwItemMaterial,
        getAllItemMaterial,
        deleteZwfwItemMaterial
    } from 'api/zwfwSystem/business/itemMaterial';
    import {getAllMaterial, updateZwfwMaterial} from 'api/zwfwSystem/business/material';
    import {getAllUser} from 'api/baseSystem/org/user';
    import {getDeptCascader} from 'api/baseSystem/org/dept';
    import { quillEditor } from 'vue-quill-editor'



    export default {
        name: 'zwfwItem_table',
        components:{
            quillEditor
        },
        data() {
            return {
                changeMaterialName: false,
                changeMaterialInfo: false,
                electronicMaterial: null,
                zwfwItemList: [],
                zwfwItemMaterialList: [],
                ItemMaterial: [],
                optionsName: [],
                list: [],
                total: null,
                listLoading: true,
                listLoading1: true,
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
                    commonRequestion: '',
                    implCode: '',
                    updateType: '',
                    pretrialUserIds: [],
                    departmentTreePosition: ''
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
                dialogFormVisible: false,
                dialogFormVisible1: false,
                dialogStatus: '',
                dialogLoading: false,
                uploadAction: '/api/common/upload',
                uploadAvatarsExample: [],
                uploadAvatarsEform: [],
                uploadAvatarsResult: [],
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
                    ]
                },
                zwfwItemMaterialRules: {
                    name: [
                        {required: true, message: '请输入材料名称'}
                    ]
                },
                uploadAccepts: '.gif,.jpg,.jpeg,.bmp,.png,.xls,.xlsx,.doc,.docx,.zip,.rar,.pdf',
                allUserList: [],
                deptTree: [],
                acceptConditionEditorOption: {
                    modules: {
                        toolbar: [
                            [{ header: [] }],
                            ['bold', 'italic', 'underline', 'link'],
                            [{ color: [] }, { background: [] }],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['clean']
                        ]
                    },
                    theme: 'snow'
                },
                acceptConditionHtml:'',
                chargeBasisHtml:'',
                workflowDescriptionHtml:''
            }
        },

        created() {
            this.getList();
            //用于加载根据部门分组的用户列表，用来在设置预审用户时使用
            this.allUserList = [];
            this.deptTree = [];
            getDeptCascader().then(response => {
                if (response.httpCode === 200) {
                    this.deptTree = response.data;
                } else {
                    console.log('加载部门信息失败');
                }
            });

        },
        mounted() {

        },
        computed: {
            cascaderModel: function () {
                if (this.zwfwItem.departmentId) {
                    //找到对应的部门
//                    console.log(this.zwfwItem.departmentTreePosition);
                    if (this.zwfwItem.departmentTreePosition) {
                        const arr = this.zwfwItem.departmentTreePosition.split('&');
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
        methods: {
            acceptConditionChange({editor,html,text}) {
//                console.log(html);
//                console.log(text);
                this.zwfwItem.acceptCondition = encodeURIComponent(encodeURIComponent(html));
            },
            chargeBasisChange({editor,html,text}) {
//                console.log(html);
//                console.log(text);
                this.zwfwItem.chargeBasis = encodeURIComponent(encodeURIComponent(html));
            },
            workflowDescriptionChange({editor,html,text}) {
//                console.log(html);
//                console.log(text);
                this.zwfwItem.workflowDescription = encodeURIComponent(encodeURIComponent(html));
            },
            queryUser(keywords) {
//                console.log(keywords);
                getAllUser({
                    name: keywords
                }).then(response => {
                    if (response.httpCode === 200) {
                        this.allUserList = response.data;
                    } else {
                        this.$message.error("加载用户列表失败");
                    }
                });
            },
            handleChange(value) {
//                console.log(value);
                if (value.length > 0) {
                    this.zwfwItem.departmentId = parseInt(value[value.length - 1]);
                    this.zwfwItem.departmentTreePosition = value.join('&');
                } else {
                    this.zwfwItem.departmentId = 0;
                    this.zwfwItem.departmentTreePosition = [];
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
            getList() {
                this.listLoading = true;
                getZwfwItemList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.zwfwItemList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg || '事项列表查询失败');
                    }
                    this.listLoading = false;
                });
            },
            handleFilter() {
                this.getList();
            },
            handleMaterialList(item) {
                this.currentItem = item;
                this.itemId = item.id;
                this.resetTemp1();
                this.dialogStatus = 'associateMaterial';
                this.dialogFormVisible1 = true;
                this.getItemMaterialListByItemId();
            },
            getItemMaterialListByItemId() {
                this.listLoading1 = true;
                getAllItemMaterial(this.currentItem.id).then(response => {
                    if (response.httpCode === 200) {
                        this.zwfwItemMaterialList = response.data;
                    } else {
                        this.$message.error(response.msg || '加载材料列表失败');
                    }
                    this.listLoading1 = false;
                })
            },
            handleAvatarEformSuccess(res, file, fileList) {
                fileList.length = 0;
                fileList.push(file);
                this.zwfwItemMaterial.eform = res.url;
            },
            handleRemoveEform() {
                this.zwfwItemMaterial.eform = '';
            },
            handleAvatarExampleSuccess(res, file, fileList) {
                fileList.length = 0;
                fileList.push(file);
                this.zwfwItemMaterial.example = res.url;
            },
            handleRemoveExample() {
                this.zwfwItemMaterial.example = '';
            },
            handleAvatarResultSuccess(res, file, fileList) {
                fileList.length = 0;
                fileList.push(file);
                this.zwfwItem.resultExample = res.url;
            },
            handleRemoveResult() {
                this.zwfwItem.resultExample = '';
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传模板大小不能超过 2MB!');
                }
                return isLt2M;
            },
            remoteMethod(query) {
                if (query !== '') {
                    const listQueryName = {
                        name: query
                    }
                    this.electronicMaterial = '';
                    getAllMaterial(listQueryName).then(response => {
                        if (response.httpCode === 200) {
                            this.optionsName = response.data;
                        } else {
                            console.log(reponse.msg || '材料查找失败');
                        }
                    })
                } else {
                    this.optionsName = [];
                }
            },
            changeMaterial(value) {
                for (const obj of this.optionsName) {
                    if (obj.name == value) {
                        this.zwfwItemMaterial = Object.assign({}, obj);
                        this.changeMaterialInfo = true;
                    }
                }
            },
            handleUpdateClick(row) {
                this.currentRow = row;
                this.resetTemp1();
                this.zwfwItemMaterial = copyProperties(this.zwfwItemMaterial, row);
                if (this.zwfwItemMaterial.eform == '') {
                    this.handleRemoveEform();
                } else {
                    this.uploadAvatarsEform = [];
                    this.uploadAvatarsEform.push({url: this.zwfwItemMaterial.eform});
                }
                if (this.zwfwItemMaterial.example == '') {
                    this.handleRemoveExample();
                } else {
                    this.uploadAvatarsExample = [];
                    this.uploadAvatarsExample.push({url: this.zwfwItemMaterial.example});
                }
                this.changeMaterialName = true;
                this.changeMaterialInfo = true;
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.name = null;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.zwfwItemTable.toggleRowSelection(row);
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.zwfwItem = copyProperties(this.zwfwItem, row);
                if (this.zwfwItem.resultExample == '') {
                    this.handleRemoveResult();
                } else {
                    this.uploadAvatarsResult = [];
                    this.uploadAvatarsResult.push({url: this.zwfwItem.resultExample, name: '结果样本'});
                }
                this.acceptConditionHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.acceptCondition));
                this.chargeBasisHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.chargeBasis));
                this.workflowDescriptionHtml = decodeURIComponent(decodeURIComponent(this.zwfwItem.workflowDescription));
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
                //查询事项绑定的预审用户
                getPretrialUserListByItemId(this.zwfwItem.id).then(response => {
                    if (response.httpCode === 200) {
                        this.allUserList = response.data;
                        this.zwfwItem.pretrialUserIdsArray = response.data.map(function (o) {
                            return o.id;
                        });
                    } else {
                        this.$message.error("查询预审用户失败");
                    }
                });
            },
            handleDelete(row) {
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let selectCounts = this.selectedRows.length;
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delZwfwItems(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.total -= selectCounts;
                                for (const deleteRow of this.selectedRows) {
                                    const index = this.zwfwItemList.indexOf(deleteRow);
                                    this.zwfwItemList.splice(index, 1);
                                }
                                this.$message.success('删除成功');
                            } else {
                                this.$message.error(response.msg || '删除失败');
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            handleDeleteOne() {
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const length = this.selectedRows.length;
                        const ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        deleteZwfwItemMaterial(this.itemId, ids).then(response => {
                            if (response.httpCode === 200) {
                                this.currentItem.itemMaterialCount -= length;
                                this.$message.success('删除成功');
//                            for (const deleteRow of this.selectedRows) {
//                                const index = this.zwfwItemMaterialList.indexOf(deleteRow);
//                                this.zwfwItemMaterialList.splice(index, 1);
//                            }
                            } else {
                                this.$message.error(response.msg || '删除失败');
                            }
                            this.dialogFormVisible1 = false;
                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            create() {
                this.$refs['zwfwItemForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwItem(this.zwfwItem).then(response => {
                            if (response.httpCode === 200) {
                                this.zwfwItemList.unshift(response.data);
                                this.total += 1;
                                this.$message.success('创建成功');
                                this.getList();
                            } else {
                                this.$message.error(response.msg || '创建失败');
                            }
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            createMaterial() {
                this.$refs['zwfwMaterialForm'].validate((valid) => {
                    if (valid) {
                        if (this.changeMaterialName != true) {
                            for (let obj of this.zwfwItemMaterialList) {
                                if (obj.id == this.zwfwItemMaterial.id) {
                                    this.$message.warning('资料已存在');
                                    this.resetTemp1();
                                    resetForm(this, 'zwfwMaterialForm');
                                    this.changeMaterialInfo = false;
                                    return false;
                                }
                            }
                            const query = {
                                itemId: this.itemId,
                                materialId: this.zwfwItemMaterial.id,
                                paperDescription: this.zwfwItemMaterial.paperDescription,

                            }
                            this.listLoading1 = true;
                            createZwfwItemMaterial(query).then(response => {
                                if (response.httpCode === 200) {
                                    this.zwfwItemMaterialList.unshift(this.zwfwItemMaterial);
                                    this.$message.success('创建成功');
                                    this.uploadAvatarsExample = [];
                                    this.uploadAvatarsEform = [];
                                    this.resetZwfwMaterialForm();
                                    this.currentItem.itemMaterialCount += 1;
                                } else {
                                    this.$message.error('添加失败');
                                }
                                this.listLoading1 = false;

                            })
                        } else {
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
                            this.listLoading1 = true;
                            updateZwfwMaterial(zwfwMaterialList).then(response => {
                                this.listLoading1 = false;
                                if (response.httpCode == 200) {
                                    copyProperties(this.currentRow, response.data);
                                    this.$message.success('更新成功');
                                    this.dialogFormVisible1 = true;
                                    this.uploadAvatarsExample = [];
                                    this.uploadAvatarsEform = [];
                                    this.resetZwfwMaterialForm();
                                } else {
                                    this.$message.error("修改失败");
                                }
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['zwfwItemForm'].validate((valid) => {
                    if (valid) {
                        this.listLoading = true;
                        this.dialogFormVisible = false;
                        this.zwfwItem.pretrialUserIds = this.zwfwItem.pretrialUserIdsArray.join(',');
                        updateZwfwItem(this.zwfwItem).then(response => {
                            if (response.httpCode == 200) {
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
                                this.getList();
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            resetTemp1() {
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
            resetTemp() {
                this.zwfwItem = {
                    id: undefined,
                    departmentId: undefined,
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
                    commonRequestion: '',
                    implCode: '',
                    updateType: '',
                    pretrialDays: '',
                    pretrialUserIdsArray: [],
                    departmentTreePosition: ''
                };
                this.acceptCondition = '';
                this.chargeBasis = '';
                this.workflowDescription = '';
            },
            resetZwfwItemForm() {
                this.dialogFormVisible = false;
                this.uploadAvatarsResult = [];
                this.resetTemp();
                resetForm(this, 'zwfwItemForm');
            },
            resetZwfwMaterialForm() {
                this.dialogFormVisible1 = false;
                this.changeMaterialName = false;
                this.changeMaterialInfo = false;
                this.electronicMaterial = null;
                this.resetTemp1();
                resetForm(this, 'zwfwMaterialForm');
            }
        }
    }
</script>
<style>
    .item {
        margin-top: 10px;
        text-align: center;
    }
</style>
