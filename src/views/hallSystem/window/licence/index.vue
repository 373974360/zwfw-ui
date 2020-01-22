<template xmlns="http://www.w3.org/1999/html">
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input class="filter-item" style="width: 240px; height: 30px" v-model="listQuery.certificateNo"
                      placeholder="请输入法人证件号码"></el-input>
            <el-input class="filter-item" style="width: 240px; height: 30px" v-model="listQuery.operatorIdcard"
                      placeholder="请输入经办人证件号码"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate" icon="plus">
                添加
            </el-button>
        </div>

        <el-table :data="licenceEnterList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="left" label="事项名称">
                <template slot-scope="scope">
                    <div>{{scope.row.approveName}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="持有者类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.holderType == 'enterprises'">法人</span>
                    <span v-if="scope.row.holderType == 'natural'">自然人</span>
                    <span v-if="scope.row.holderType == 'organization'">团体组织</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="持有者名称">
                <template slot-scope="scope">
                    <span>{{scope.row.holderName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="持有者证件类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.certificateType == 10">身份证</span>
                    <span v-if="scope.row.certificateType == 50">统一社会信用代码</span>
                    <span v-if="scope.row.certificateType == 51">营业执照</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="持有者证件号码">
                <template slot-scope="scope">
                    <span>{{scope.row.certificateNo}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="经办人姓名">
                <template slot-scope="scope">
                    <span>{{scope.row.operatorName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="经办人联系方式">
                <template slot-scope="scope">
                    <span>{{scope.row.operatorPhone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="证照模板名称">
                <template slot-scope="scope">
                    <div>{{scope.row.licenseTypeName}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button type="primary" @click="doAddRelease(scope.row)">新增发布</el-button>
                    <el-button type="primary" @click="doUpdateRelease(scope.row)">更新发布</el-button>
                    <el-button type="primary" @click="preview(scope.row)">预览</el-button>
                    <el-button v-if="scope.row.approveCode == 'be755d835f3e4050b2d0c3ea61651188'" type="primary" @click="bqbzMaterial(scope.row)">补齐补正资料单</el-button>
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
                   :close-on-click-modal="closeOnClickModal" :before-close="resetLicenceEnterForm" width="70%"
                   fullscreen="true">
            <el-form ref="licenceEnterForm" class="small-space" :model="licenceEnter" label-position="right"
                     label-width="140px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="licenceEnterRules">
                <el-form-item label="事项名称" prop="approveCode">
                    <el-select v-model="licenceEnter.approveCode" placeholder="请选择" @change="getLicenceTypeInfo()">
                        <el-option v-for="item in itemList" :key="item.approveCode" :value="item.approveCode"
                                   :label="item.approveName" :disabled="updateLicenceDisabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证照模板" v-if="zzmbShow">
                    <el-radio-group v-model="radio" @change="onRadioChange">
                        <el-radio v-for="data in licenceEnter.licenceType"
                                  :key="data.id"
                                  :label="data.id"
                                  :value="data.holderType" style="margin-left: 0px;">
                            <span style="font-weight:normal;white-space: pre-wrap;line-height: 25px;">持有者类型：{{data.holderType}}<br/>证照模板编码:{{data.licenceTypeCode}}<br/>证照模板名称:{{data.licenceTypeName}}<br/>证照颁发机构代码:{{data.deptOrganizeCode}}<br/>证照颁发机构:{{data.deptName}}</span><br/>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="补齐补正资料" prop="material" v-if="checkShow">
                    <template>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="material" @change="handleMaterialChange">
                            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-form-item>
                <el-form-item label="证照模板编码" prop="licenseTypeCode" v-if="!updateShow">
                    <el-input v-model="licenceEnter.licenseTypeCode" :disabled="updateLicenceDisabled"></el-input>
                </el-form-item>
                <el-form-item label="证照模板名称" prop="licenseTypeName" v-if="!updateShow">
                    <el-input v-model="licenceEnter.licenseTypeName" :disabled="updateLicenceDisabled"></el-input>
                </el-form-item>
                <el-form-item label="证照颁发机构代码" prop="deptOrganizeCode" v-if="!updateShow">
                    <el-input v-model="licenceEnter.deptOrganizeCode" :disabled="updateLicenceDisabled"></el-input>
                </el-form-item>
                <el-form-item label="持证者类型" prop="companyCode" v-if="!updateShow">
                    <el-select v-model="licenceEnter.holderType" placeholder="请选择" :disabled="updateLicenceDisabled">
                        <el-option v-for="item in holderTypeList" :key="item.code" :value="item.code"
                                   :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="照面项序号" prop="sequence" v-if="getLicenceTypeShow">
                    <el-input v-model="licenceEnter.sequence"></el-input>
                </el-form-item>
                <el-form-item label="照面编号取值" prop="value" v-if="getLicenceTypeShow">
                    <el-input v-model="licenceEnter.value"></el-input>
                </el-form-item>
                <el-form-item label="持有者名称" prop="holderName" v-if="getLicenceTypeShow">
                    <el-input v-model="licenceEnter.holderName"></el-input>
                </el-form-item>
                <el-form-item label="持有者证件类型" prop="certificateType" v-if="getLicenceTypeShow">
                    <el-select v-model="licenceEnter.certificateType" placeholder="请选择">
                        <el-option v-for="item in certificateTypeList" :key="item.code" :value="item.code"
                                   :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="持有者证件号码" prop="certificateNo" v-if="getLicenceTypeShow">
                    <el-input v-model="licenceEnter.certificateNo"></el-input>
                </el-form-item>
                <el-form-item label="经办人姓名" prop="operatorName" v-if="getLicenceTypeShow">
                    <el-input v-model="licenceEnter.operatorName"></el-input>
                </el-form-item>
                <el-form-item label="经办人联系方式" prop="operatorPhone" v-if="getLicenceTypeShow">
                    <el-input v-model="licenceEnter.operatorPhone"></el-input>
                </el-form-item>
                <el-form-item label="经办人身份证号" prop="operatorIdcard" v-if="getLicenceTypeShow">
                    <el-input v-model="licenceEnter.operatorIdcard"></el-input>
                </el-form-item>
                <el-form-item label="正本打印份数限制" prop="printNum" v-if="getLicenceTypeShow">
                    <el-input-number v-model="licenceEnter.printNum" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="副本打印份数限制" prop="copyNum" v-if="getLicenceTypeShow">
                    <el-input-number v-model="licenceEnter.copyNum" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="副本一次性打印份数" prop="copyPage" v-if="getLicenceTypeShow">
                    <el-input-number v-model="licenceEnter.copyPage" :min="0"></el-input-number>
                </el-form-item>

                <div v-for="list in surfaceDta1" v-if="getLicenceTypeShow">
                    <el-form-item v-if="list.dataType == 'string'" :label="list.fieldDesc">
                        <el-input v-model.trim="licenceEnter.surfaceData[list.fieldName]"></el-input>
                    </el-form-item>
                    <el-form-item v-if="list.dataType == 'date'" :label="list.fieldDesc">
                        <input type="date" v-model.trim="licenceEnter.surfaceData[list.fieldName]">
                    </el-form-item>
                    <el-form-item v-if="list.dataType == 'datetime'" :label="list.fieldDesc">
                        <input type="datetime" v-model.trim="licenceEnter.surfaceData[list.fieldName]">
                    </el-form-item>
                    <el-form-item v-if="list.dataType == 'selected'" :label="list.fieldDesc">
                        <div v-for="list1 in list.fixedValue.split(',')">
                            <el-radio v-model="licenceEnter.surfaceData[list.fieldName]" :label="list1"
                                      :value="list1"></el-radio>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="list.dataType == 'picture'" :label="list.fieldDesc">
                        <el-input v-model.trim="licenceEnter.surfaceData[list.fieldName]" v-show="picture"></el-input>
                        <el-upload name="uploadFile"
                                   ref="uploadExample"
                                   :accept="acceptTypes"
                                   :action="uploadAction"
                                   :on-success="handleAvatarSuccess"
                                   :on-error="handlerAvatarError"
                                   :before-upload="beforeAvatarUpload"
                                   :show-file-list="false"
                                   :on-remove="handleRemove">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </div>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetLicenceEnterForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" :loading="btnLoading"
                           @click="doCreate">确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" :loading="btnLoading" @Keyup.enter="doUpdate"
                           @click="doUpdate">确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>


<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import {isIdCardNo, validatMobiles} from 'utils/validate'
    import {
        getLicenceList,
        getLicenceTypeByItemCode,
        getPaginateSurfaceByType,
        createLicenceEnter,
        getLicenseInfoAndPicture,
        release
    } from '../../../../api/hallSystem/window/licence';
    const cityOptions = ['卫生检测报告', '使用集中空调通风系统还应当提供集中空调通风系统卫生检测或评价报告', '从业人员（包括临时工）的花名册', '从业人员（包括临时工）的健康合格证明', '公共场所卫生管理制度'];
    export default {
        name: 'table_demo',
        data() {
            const validateIdcard = (rule, value, callback) => {
                if (!isIdCardNo(value)) {
                    callback(new Error('身份证号格式不正确，请重新输入'));
                }
                callback();
            };
            const validateMobiles = (rule, value, callback) => {
                if (!validatMobiles(value)) {
                    callback(new Error('手机号码格式不正确'));
                }
                callback();
            };
            return {
                checkShow: false,
                checkAll: true,
                material: ['卫生检测报告', '使用集中空调通风系统还应当提供集中空调通风系统卫生检测或评价报告'],
                cities: cityOptions,
                isIndeterminate: true,
                zzmbShow: false,
                updateLicenceDisabled: false,
                updateShow: false,
                radio: undefined,
                picture: false,
                // 事项信息
                itemList: [
                    {
                        approveId: '63125f2967d94e42aa2392b8be791d00',
                        approveCode: '1fd36318d26840358c5ac6df82f78457',
                        approveName: '食品经营许可延续'
                    },
                    {
                        approveId: '278ada92370a4236800e327bea6c7b7d',
                        approveCode: '9cb380c221744386b97935a4fa57eb83',
                        approveName: '食品经营许可补办'
                    },
                    {
                        approveId: '3663286dff2c4604ad10bfe729e69e0c',
                        approveCode: '86e4fa6f1b4341e9a08260881b91ed71',
                        approveName: '食品经营许可变更'
                    },
                    {
                        approveId: 'd8be861bb98e4338909479d86272bf30',
                        approveCode: '2a2ab2a0e0db444aa97d73243495233c',
                        approveName: '食品经营许可新办'
                    },
                    {
                        approveId: 'eab6024b5a204318b698fd25545a88ee',
                        approveCode: '1c3ff04de68a45feb8e83099567fdeec',
                        approveName: '药品经营许可证核发'
                    },
                    {
                        approveId: '11f63bbcc04e4597986c16d1c120a70b',
                        approveCode: 'f8495008911048aeafe04c084543a6d6',
                        approveName: '《药品经营许可证》换发'
                    },
                    {
                        approveId: 'adc69f9d29e147fcb9f090414d28451f',
                        approveCode: '36cfbe4f753c4c7a9667742cbce3ee54',
                        approveName: '《药品经营许可证》变更'
                    },
                    {
                        approveId: '8D4E920CBD16485FE053C90A12AC5013',
                        approveCode: 'be755d835f3e4050b2d0c3ea61651188',
                        approveName: ' 公共场所卫生许可'
                    },
                    {
                        approveId: '8D4E920CBD2F485FE053C90A12AC5013',
                        approveCode: '8e6db501f5f64d39b1141aab3583123a',
                        approveName: '公共场所卫生许可变更'
                    },
                    {
                        approveId: '8D4E920CBD06485FE053C90A12AC5013',
                        approveCode: '69bdd165ae304f7b8e15bbd5e5973615',
                        approveName: '公共场所卫生许可延续'
                    },
                    {
                        approveId: '8D4FE277570A7D69E053C90A12AC7297',
                        approveCode: '35f6f0291da64598ab33d1bfaf5ec393',
                        approveName: '县级供水单位卫生许可'
                    },
                    {
                        approveId: '8D4F2C294D8CE3DFE053CA0A12AC9F7A',
                        approveCode: '94ff7c6c4cfb41f7a68b175549427b9a',
                        approveName: '特种设备作业人员资格认定'
                    },
                    {
                        approveId: '8D5F765C0CB106B5E053C90A12AC58C9',
                        approveCode: '171b88a8b08b4bf79f5d37eb6fcd836b',
                        approveName: '有限公司设立登记'
                    },
                    {
                        approveId: '8D5F765C0BED06B5E053C90A12AC58C9',
                        approveCode: 'bdf21036d56a490ea6759255f66ae35c',
                        approveName: '股份有限公司设立登记'
                    }
                ],
                // 持有者类型
                holderTypeList: [
                    {
                        code: 'enterprises',
                        value: '法人'
                    },
                    {
                        code: 'natural',
                        value: '自然人'
                    },
                    {
                        code: 'organization',
                        value: '团体组织'
                    }
                ],
                // 持有者证件类型
                certificateTypeList: [
                    // {
                    //     code: '50',
                    //     value: '统一社会信用代码'
                    // },
                    // {
                    //     code: '51',
                    //     value: '营业执照'
                    // },
                    {
                        code: '10',
                        value: '身份证'
                    }
                ],
                licenceEnterList: [],
                // 证照模板信息
                licenceType: [],
                imageUrl: '',
                uploadAction: this.$store.state.app.uploadUrl,
                acceptTypes: this.$store.state.app.fileAccepts,
                // 照面信息
                surfaceDta1: [],
                getLicenceTypeShow: false,
                total: null,
                listLoading: true,
                statusList: [0, 1],
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    certificateNo: undefined,
                    holderName: undefined,
                    contactPhone: undefined,
                    operatorName: undefined,
                    operatorIdcard: undefined,
                    operatorPhone: undefined
                },
                query: {
                    queryMap: {
                        certificate_no: undefined
                    },
                    isPagination: true,
                    page: 1,
                    rows: 20
                },
                licenceEnter: {
                    id: undefined,
                    surfaceData: {},
                    licenceType: undefined,
                    type: 'new',
                    licenseTypeCode: undefined,
                    licenseTypeName: undefined,
                    sequence: undefined,
                    value: undefined,
                    deptOrganizeCode: undefined,
                    deptName: undefined,
                    certificateDate: undefined,
                    validPeriodBegin: undefined,
                    validPeriodEnd: undefined,
                    holderType: undefined,
                    holderName: undefined,
                    certificateType: undefined,
                    certificateNo: undefined,
                    contactPhone: undefined,
                    permitContent: undefined,
                    fileInfo: undefined,
                    licenceValue: undefined,
                    operatorName: undefined,
                    operatorIdcard: undefined,
                    operatorPhone: undefined,
                    approveId: undefined,
                    approveCode: undefined,
                    approveName: undefined,
                    remark: undefined,
                    chooseLicenceType: undefined,
                    licenceId: undefined,
                    printNum: 0,
                    copyNum: 0,
                    copyPage: 0,
                    material: undefined
                },
                jsonObject: {
                    type: 'new',
                    oldData: {
                        licenseNo: undefined
                    },
                    metaData: {
                        licenseTypeCode: undefined,
                        licenseTypeName: undefined,
                        licenseNumber: [
                            {
                                sequence: undefined,
                                value: undefined
                            }
                        ],
                        deptOrganizeCode: undefined,
                        deptName: undefined,
                        certificateDate: undefined,
                        holderType: undefined,
                        holderName: undefined,
                        certificateType: undefined,
                        certificateNo: undefined,
                        contactPhone: undefined,
                        approveId: undefined,
                        approveCode: undefined,
                        approveName: undefined
                    },
                    surfaceData: {},
                    attachment: []
                },
                currentRow: null,
                selectedRows: [],
                selectedRowsForm: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                btnLoading: false,
                readonlyFlag: false,
                licenceEnterRules: {
                    approveCode: [
                        {required: true, message: '请选择事项', trigger: 'blur'}
                    ],
                    licenseTypeCode: [
                        {required: true, message: '请输入证照模板编码', trigger: 'blur'}
                    ],
                    licenseTypeName: [
                        {required: true, message: '请输入证照模板名称', trigger: 'blur'}
                    ],
                    sequence: [
                        {required: true, message: '请输入照面项序号'}
                    ],
                    value: [
                        {required: true, message: '请输入照面编号取值', trigger: 'blur'}
                    ],
                    deptOrganizeCode: [
                        {required: true, message: '请输入证照颁发机构代码', trigger: 'blur'}
                    ],
                    holderName: [
                        {required: true, message: '请输入持有者名称', trigger: 'blur'}
                    ],
                    certificateType: [
                        {required: true, message: '请选择持有者证件类型', trigger: 'blur'}
                    ],
                    certificateNo: [
                        {required: true, message: '请输入持有者证件号码', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getList();
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal',
                'dics'
            ])
        },
        methods: {
            bqbzMaterial(row){
                window.open('print/ggwsxk.html?material='+row.material+'&info=' + row.licenceValue);
                console.log($.parseJSON(row.licenceValue));
            },
            handleCheckAllChange() {
                this.material = this.checkAll ? cityOptions : [];
                this.isIndeterminate = false;
            },
            handleMaterialChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            onRadioChange(data) {
                if (/^[0-9]+$/.test(data)) {
                    console.log(this.radio);
                    data = data - 1;
                    this.licenceEnter.licenseTypeCode = this.licenceEnter.licenceType[data].licenceTypeCode;
                    this.licenceEnter.licenseTypeName = this.licenceEnter.licenceType[data].licenceTypeName;
                    this.licenceEnter.deptOrganizeCode = this.licenceEnter.licenceType[data].deptOrganizeCode;
                    this.licenceEnter.deptName = this.licenceEnter.licenceType[data].deptName;
                    this.licenceEnter.holderType = this.licenceEnter.licenceType[data].holderType;
                    this.licenceEnter.chooseLicenceType = this.licenceEnter.licenceType[data];
                    console.log(this.licenceEnter.chooseLicenceType);
                    this.getPaginateSurfaceByType();
                }
            },
            getList() {
                this.listLoading = true;
                getLicenceList(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.licenceEnterList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            // 获取证照模版列表（根据事项code)
            getLicenceTypeInfo() {
                this.surfaceDta1 = [];
                this.licenceEnter.licenceType = undefined;
                this.radio = undefined;
                if (this.licenceEnter.approveCode=='be755d835f3e4050b2d0c3ea61651188'){
                    this.checkShow = true;
                }
                getLicenceTypeByItemCode({approveCode: this.licenceEnter.approveCode}).then(response => {
                    this.getLicenceTypeShow = true;
                    if (response.httpCode === 200) {
                        $.each(response.data, (index, item) => {
                            item.id = index + 1;
                        });
                        if (this.dialogStatus == 'create') {
                            this.zzmbShow = true;
                        } else {
                            this.zzmbShow = false;
                        }
                        this.licenceEnter.licenceType = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getPaginateSurfaceByType() {
                this.getLicenceTypeShow = false;
                const licenseTypeCode = this.licenceEnter.licenseTypeCode;
                const holderType = this.licenceEnter.holderType;
                const itemCode = this.licenceEnter.approveCode;
                getPaginateSurfaceByType(licenseTypeCode, holderType, itemCode).then(response => {
                    if (response.httpCode === 200 && response.data.retCode == 'SUCCESS') {
                        this.surfaceDta1 = response.data.surfaceData[1];
                        this.getLicenceTypeShow = true;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            handleAvatarSuccess(res, file, fileList) {
                if (res.state === 'SUCCESS') {
                    this.imageUrl = URL.createObjectURL(file.raw);
                    const index = res.url.lastIndexOf('.');
                    const str = res.url.substr(index + 1, res.url.length);
                    this.licenceEnter.surfaceData.ZhaoPian = {
                        content: res.url,
                        type: str
                    };
                    console.log(this.licenceEnter);
                    this.$message.success('上传成功');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerAvatarError(err, file, fileList) {
                console.log(err);
                this.$message.error('网络不稳定，上传失败');
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isLt2M) {
                    this.$message.error('上传模板大小不能超过 10MB!');
                }
                return isLt2M;
            },
            handleRemove() {
                this.licenceEnter.surfaceData.ZhaoPian = {};
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.readonlyFlag = false;
                this.dialogStatus = 'create';
                this.updateShow = true;
                this.zzmbShow = false;
                this.checkShow = false;
                this.updateLicenceDisabled = false;
                this.getLicenceTypeShow = false;
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.getLicenceTypeShow = true;
                this.updateLicenceDisabled = true;
                this.updateShow = false;
                this.readonlyFlag = true;
                this.licenceEnter = copyProperties(this.licenceEnter, row);
                this.licenceEnter.surfaceData = JSON.parse(row.licenceValue);
                this.licenceEnter.licenceType = JSON.parse(row.licenceType);
                if (row.chooseLicenceType != undefined) {
                    this.licenceEnter.chooseLicenceType = JSON.parse(row.chooseLicenceType);
                }
                console.log(row.chooseLicenceType);
                this.getPaginateSurfaceByType()
                if (this.licenceEnter.surfaceData.ZhaoPian != undefined) {
                    this.imageUrl = this.licenceEnter.surfaceData.ZhaoPian.content;
                }

                if (this.licenceEnter.approveCode=='be755d835f3e4050b2d0c3ea61651188'){
                    this.checkShow = true;
                    if (this.licenceEnter.material!=undefined) {
                        let split = this.licenceEnter.material.split(",");
                        this.material = split;
                    }else{
                        this.material = [];
                    }
                }else{
                    this.checkShow = false;
                }
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doDelete();
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            doCreate() {
                this.$refs['licenceEnterForm'].validate(valid => {
                    if (valid) {
                        this.btnLoading = true;
                        this.dialogLoading = true;
                        for (const i in this.itemList) {
                            if (this.itemList[i].approveCode == this.licenceEnter.approveCode) {
                                this.licenceEnter.approveId = this.itemList[i].approveId;
                                this.licenceEnter.approveName = this.itemList[i].approveName
                            }
                        }
                        if (this.licenceEnter.approveCode=='be755d835f3e4050b2d0c3ea61651188'){
                            this.licenceEnter.material = this.material.toString()
                        }
                        this.licenceEnter.chooseLicenceType = JSON.stringify(this.licenceEnter.chooseLicenceType);
                        this.licenceEnter.licenceType = JSON.stringify(this.licenceEnter.licenceType);
                        this.licenceEnter.licenceValue = JSON.stringify(this.licenceEnter.surfaceData);
                        console.log(this.licenceEnter);
                        createLicenceEnter(this.licenceEnter).then(response => {
                            this.btnLoading = false;
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetLicenceEnterForm();
                                this.$message.success('创建成功');
                                this.getList();
                            } else {
                                this.$message.error('创建失败');
                            }
                        })

                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['licenceEnterForm'].validate(valid => {
                    if (valid) {
                        this.btnLoading = true;
                        this.dialogLoading = true;
                        for (const i in this.itemList) {
                            if (this.itemList[i].approveCode == this.licenceEnter.approveCode) {
                                this.licenceEnter.approveId = this.itemList[i].approveId;
                                this.licenceEnter.approveName = this.itemList[i].approveName
                            }
                        }
                        if (this.licenceEnter.approveCode=='be755d835f3e4050b2d0c3ea61651188'){
                            this.licenceEnter.material = this.material.toString()
                        }
                        this.licenceEnter.chooseLicenceType = JSON.stringify(this.licenceEnter.chooseLicenceType);
                        this.licenceEnter.licenceType = JSON.stringify(this.licenceEnter.licenceType);
                        this.licenceEnter.licenceValue = JSON.stringify(this.licenceEnter.surfaceData);
                        this.licenceEnter.type = 'change';
                        console.log(this.licenceEnter);
                        createLicenceEnter(this.licenceEnter).then(response => {
                            this.btnLoading = false;
                            this.dialogLoading = false;
                            this.dialogFormVisible = false;
                            if (response.httpCode === 200) {
                                this.resetLicenceEnterForm();
                                this.$message.success('修改成功');
                                this.getList();
                            } else {
                                this.$message.error('修改失败');
                            }
                        })

                    } else {
                        return false;
                    }
                });
            },
            // 新增证照库发布
            doAddRelease(row) {
                const _this = this;
                _this.licenceEnter = copyProperties(_this.licenceEnter, row);
                _this.licenceEnter.surfaceData = JSON.parse(row.licenceValue);
                _this.jsonObject.type = 'new';
                _this.jsonObject.metaData.licenseTypeCode = row.licenseTypeCode;
                _this.jsonObject.metaData.licenseTypeName = row.licenseTypeName;
                _this.jsonObject.metaData.licenseNumber[0].sequence = row.sequence;
                _this.jsonObject.metaData.licenseNumber[0].value = row.value;
                _this.jsonObject.metaData.deptOrganizeCode = row.deptOrganizeCode;
                _this.jsonObject.metaData.deptName = row.deptName;
                _this.jsonObject.metaData.certificateDate = row.certificateDate;
                _this.jsonObject.metaData.holderType = row.holderType;
                _this.jsonObject.metaData.holderName = row.holderName;
                _this.jsonObject.metaData.certificateType = row.certificateType;
                _this.jsonObject.metaData.certificateNo = row.certificateNo;
                _this.jsonObject.metaData.contactPhone = row.contactPhone;
                _this.jsonObject.metaData.approveId = row.approveId;
                _this.jsonObject.metaData.approveCode = row.approveCode;
                _this.jsonObject.metaData.approveName = row.approveName;
                _this.jsonObject.surfaceData = _this.licenceEnter.surfaceData;
                release(JSON.stringify(_this.jsonObject),_this.licenceEnter.operatorPhone,_this.licenceEnter.operatorName,_this.licenceEnter.approveName).then(response => {
                    if (response.status == 200 && response.data.retCode == 'SUCCESS') {
                        //    修改证照标识id
                        _this.updateLicenceInfo(row.id, response.data.id);
                    } else {
                        _this.$message.error(response.data.errors.message);
                    }
                })
            },
            updateLicenceInfo(id, licenceId) {
                this.resetTemp();
                this.licenceEnter = {
                    id: id,
                    licenceId: licenceId
                };
                console.dir(this.licenceEnter);
                createLicenceEnter(this.licenceEnter).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('入库成功');
                        this.getList();
                    } else {
                        this.$message.success('入库失败');
                    }
                })
            },
            // 更新证照库发布
            doUpdateRelease(row) {
                const _this = this;
                _this.currentRow = row;
                _this.licenceEnter = copyProperties(_this.licenceEnter, row);
                _this.licenceEnter.surfaceData = JSON.parse(row.licenceValue);
                _this.jsonObject.type = 'change';
                _this.jsonObject.metaData.licenseTypeCode = row.licenseTypeCode;
                _this.jsonObject.metaData.licenseTypeName = row.licenseTypeName;
                _this.jsonObject.metaData.licenseNumber[0].sequence = row.sequence;
                _this.jsonObject.metaData.licenseNumber[0].value = row.value;
                _this.jsonObject.metaData.deptOrganizeCode = row.deptOrganizeCode;
                _this.jsonObject.metaData.deptName = row.deptName;
                _this.jsonObject.metaData.certificateDate = row.certificateDate;
                _this.jsonObject.metaData.holderType = row.holderType;
                _this.jsonObject.metaData.holderName = row.holderName;
                _this.jsonObject.metaData.certificateType = row.certificateType;
                _this.jsonObject.metaData.certificateNo = row.certificateNo;
                _this.jsonObject.metaData.contactPhone = row.contactPhone;
                _this.jsonObject.metaData.approveId = row.approveId;
                _this.jsonObject.metaData.approveCode = row.approveCode;
                _this.jsonObject.metaData.approveName = row.approveName;
                _this.jsonObject.oldData.licenseNo = row.licenceId;
                _this.jsonObject.surfaceData = _this.licenceEnter.surfaceData;
                console.log(JSON.stringify(_this.jsonObject));
                release(JSON.stringify(_this.jsonObject)).then(response => {
                    if (response.status == 200 && response.data.retCode == 'SUCCESS') {
                        //    修改证照标识id
                        _this.updateLicenceInfo(row.id, response.data.id);
                    } else {
                        _this.$message.error(response.data.errors.message);
                    }
                })

            },
            //预览
            preview(row){
                console.dir(row.licenceId);
                if (row.licenceId == null){
                    this.$message.error('该证照未入库，请先点击新增发布');
                }else{
                    getLicenseInfoAndPicture(row.licenceId).then(response => {
                        if (response.httpCode === 200) {
                            window.open("http://new.zwfw.itl.gov.cn:10240"+response.data.url.substr(4))
                        }
                    })
                }
            },
            formatDate() {
                if (!this.licenceEnter.registerDate) {
                    return '';
                }
                this.licenceEnter.registerDate = moment(this.licenceEnter.registerDate).format('YYYY-MM-DD')
            },
            resetTemp() {
                this.licenceEnter = {
                    id: undefined,
                    surfaceData: {},
                    licenceType: undefined,
                    type: undefined,
                    licenseTypeCode: undefined,
                    licenseTypeName: undefined,
                    sequence: undefined,
                    value: undefined,
                    deptOrganizeCode: undefined,
                    deptName: undefined,
                    certificateDate: undefined,
                    validPeriodBegin: undefined,
                    validPeriodEnd: undefined,
                    holderType: undefined,
                    holderName: undefined,
                    fileInfo: undefined,
                    certificateType: undefined,
                    certificateNo: undefined,
                    contactPhone: undefined,
                    permitContent: undefined,
                    licenceValue: undefined,
                    operatorName: undefined,
                    operatorIdcard: undefined,
                    operatorPhone: undefined,
                    approveId: undefined,
                    approveCode: undefined,
                    approveName: undefined,
                    remark: undefined,
                    chooseLicenceType: undefined,
                    licenceId: undefined,
                    printNum: undefined,
                    copyPage: undefined,
                    copyNum: undefined,
                    material: undefined
                };
            },
            resetLicenceEnterForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'licenceEnterForm');
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.name = null;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            }
        }
    }
</script>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
