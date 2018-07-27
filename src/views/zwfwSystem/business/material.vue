<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getMaterialList" style="width: 250px;" class="filter-item" placeholder="材料名称"
                      v-model="listQuery.name"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getMaterialList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>

        <el-table ref="zwfwMaterialTable" :data="zwfwMaterialList" v-loading.body="pageLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <!--<el-table-column align="right" label="ID" width="150">-->
            <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.id}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="name" align="left" label="材料名称" width="600">
                <template slot-scope="scope">
                    <el-tooltip content="点击编辑" placement="right" effect="dark">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="type" align="center" label="材料类型">
                <template slot-scope="scope">
                    <span>{{scope.row.type | dics('cllx')}}</span>
                </template>
            </el-table-column>
            <el-table-column v-once prop="source" align="center" label="来源渠道" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.source | dics('sxsqclly')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="electronicMaterial" align="center" label="是否需要电子材料">
                <template slot-scope="scope">
                    <span>{{scope.row.electronicMaterial | enums('YesNo')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="electronicMaterial" align="center" label="预审表单" width="120">
                <template slot-scope="scope">
                    <span class="link-type" @click='handlePretrialForm(scope.row,$event)'>设置表单域</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!pageLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetZwfwMaterialForm">
            <el-form ref="zwfwMaterialForm" class="small-space" :model="zwfwMaterial" label-position="right"
                     label-width="100px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwMaterialRules">
                <el-form-item label="材料名称" prop="name">
                    <el-input v-model="zwfwMaterial.name"></el-input>
                </el-form-item>
                <el-form-item label="材料类型" prop="type">
                    <el-select v-model="zwfwMaterial.type" placeholder="请选择材料类型">
                        <el-option
                                v-for="item in dics['cllx']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--<el-col :span="12">-->
                    <!--<el-form-item label="原件份数" prop="originalNumber">-->
                        <!--<el-input-number v-model="zwfwMaterial.originalNumber" :min="0" :max="20"/>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
                <!--<el-col :span="12">-->
                    <!--<el-form-item label="复印件份数" prop="copyNumber">-->
                        <!--<el-input-number v-model="zwfwMaterial.copyNumber" :min="0" :max="20"/>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
                <!--<el-col :span="12">-->
                    <!--<el-form-item label="是否必须" prop="necessary">-->
                        <!--<el-switch-->
                                <!--v-model="zwfwMaterial.necessary"-->
                                <!--on-color="#13ce66"-->
                                <!--off-color="#ff4949"-->
                                <!--:on-value="true"-->
                                <!--:off-value="false">-->
                        <!--</el-switch>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
                <el-col :span="12">
                    <el-form-item label="是否需要电子材料" prop="electronicMaterial">
                        <el-switch
                                v-model="zwfwMaterial.electronicMaterial"
                                on-color="#13ce66"
                                off-color="#ff4949"
                                :on-value="true"
                                :off-value="false">
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-form-item label="受理标准" prop="acceptStandard">
                    <el-input v-model="zwfwMaterial.acceptStandard"></el-input>
                </el-form-item>
                <el-form-item label="来源渠道" prop="source">
                    <el-select v-model="zwfwMaterial.source" placeholder="请选择来源渠道" style="width:100%">
                        <el-option
                                v-for="item in dics['sxsqclly']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出具单位" prop="issuingUnit">
                    <el-input v-model="zwfwMaterial.issuingUnit"></el-input>
                </el-form-item>
                <el-form-item label="文书格式" prop="documentFormat">
                    <el-select v-model="zwfwMaterial.documentFormat" placeholder="请选择文书格式" style="width:100%">
                        <el-option
                                v-for="item in dics['wsgs']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务分类" prop="businessClassification">
                    <el-select v-model="zwfwMaterial.businessClassification" placeholder="请选择业务分类" style="width:100%">
                        <el-option
                                v-for="item in dics['ywfl']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="材料样本" prop="example">
                    <el-upload name="uploadFile"
                               ref="uploadExample"
                               :accept="acceptTypes"
                               :action="uploadAction"
                               :show-file-list="false"
                               :with-credentials="true"
                               :headers="uploadHeaders"
                               :before-upload="beforeAvatarUpload"
                               :on-change="changeAvatarExampleFile">
                        <el-input slot="trigger" v-model="zwfwMaterial.example" placeholder="选择文件" readonly
                                  style="width: 320px"></el-input>
                        <a :href="this.zwfwMaterial.example" :download="downloadExample" target="_blank"
                           :class="{disabled: !zwfwMaterial.example}">
                            <el-button style="margin-left: 10px;" size="small" type="info"
                                       :disabled="!zwfwMaterial.example">点击下载
                            </el-button>
                        </a>
                    </el-upload>
                </el-form-item>
                <el-form-item label="电子表单" prop="eform">
                    <el-upload name="uploadFile"
                               ref="uploadEform"
                               :accept="acceptTypes"
                               :action="uploadAction"
                               :show-file-list="false"
                               :with-credentials="true"
                               :headers="uploadHeaders"
                               :before-upload="beforeAvatarUpload"
                               :on-change="changeAvatarEformFile">
                        <el-input slot="trigger" v-model="zwfwMaterial.eform" placeholder="选择文件" readonly
                                  style="width: 320px"></el-input>
                        <a :href="this.zwfwMaterial.eform" :download="downloadEform" target="_blank"
                           :class="{disabled: !zwfwMaterial.eform}">
                            <el-button style="margin-left: 10px;" size="small" type="info"
                                       :disabled="!zwfwMaterial.eform">点击下载
                            </el-button>
                        </a>
                    </el-upload>
                </el-form-item>
                <el-form-item label="套打模板" prop="templateFile">
                    <el-upload name="uploadFile"
                               ref="uploadTemplateFile"
                               :accept="'application/vnd.openxmlformats-officedocument.wordprocessingml.document'"
                               :action="uploadAction"
                               :show-file-list="false"
                               :with-credentials="true"
                               :headers="uploadHeaders"
                               :before-upload="beforeAvatarUpload"
                               :on-change="changeTemplateFile"
                               :on-success="onUploadSuccess">
                        <el-input slot="trigger" v-model="zwfwMaterial.templateFile" placeholder="选择文件" readonly
                                  style="width: 320px"></el-input>
                        <a :href="this.zwfwMaterial.templateFile" :download="downloadTemplateFile" target="_blank"
                           :class="{disabled: !zwfwMaterial.templateFile}">
                            <el-button style="margin-left: 10px;" size="small" type="info"
                                       :disabled="!zwfwMaterial.templateFile">点击下载
                            </el-button>
                        </a>
                        <span style="color:red"> 必须是docx格式 </span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="填报须知" prop="notice">
                    <el-input v-model="zwfwMaterial.notice"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="zwfwMaterial.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetZwfwMaterialForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="doCreate">确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="doUpdate">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--材料表单配置-->
        <el-dialog title="材料表单配置" :visible.sync="dialogItemPretrialFormVisible"
                   :close-on-click-modal="closeOnClickModal"
                   :before-close="closeZwfwItemPretrialForm"
                   size="large"
                   @open="onPretrialFormOpen">
            <item-pretrial-form ref="materialForm" @changeVersion="changeFormVersion"></item-pretrial-form>
            <div style="text-align: center" slot="footer" class="dialog-footer">
                <div v-if="editingForm">
                    <el-button type="primary" @click="testRegex">测试正则</el-button>
                    <el-button type="primary"
                               :disabled="!editingForm || editingForm.status === 3"
                               @click="submitItemPretrialForm">
                        <span v-if="editingForm.status===3">历史不可修改</span>
                        <span v-else>保存/修改</span>
                    </el-button>
                    <el-button type="danger"
                               :disabled="!editingForm || editingForm.status ===2 || editingForm.status ===3 "
                               @click="publishItemPretrialForm">
                        <span v-if="editingForm.status===2">已发布</span>
                        <span v-else-if="editingForm.status===3">历史发布</span>
                        <span v-else>保存/修改并发布</span>
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {
        getZwfwMaterialList,
        createZwfwMaterial,
        updateZwfwMaterial,
        delZwfwMaterials
    } from 'api/zwfwSystem/business/material';
    import ItemPretrialForm from "./itemPretrialForm";


    export default {
        name: 'zwfwMaterial_table',
        components: {
            ItemPretrialForm
        },
        data() {
            return {
                zwfwMaterialList: [],
                total: null,
                pageLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: ''
                },
                zwfwMaterial: {
                    id: undefined,
                    electronicMaterial: false,
                    eform: '',
                    name: '',
                    acceptStandard: '',
                    remark: '',
                    source: '',
                    type: '',
                    example: '',
                    notice: '',
                    templateFile: '',
                    necessary: 0,
                    originalNumber: 0,
                    cpoyNumber: 0,
                    issuingUnit: '',
                    documentFormat: '',
                    businessClassification: ''
                },
                dialogItemPretrialFormVisible: false,
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                uploadAction: this.$store.state.app.uploadUrl,
                acceptTypes: this.$store.state.app.fileAccepts,
                zwfwMaterialRules: {
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
                editingForm: undefined
            }
        },
        created() {
            this.getMaterialList();
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'dics',
                'closeOnClickModal'
            ]),
            uploadHeaders() {
                return {'User-Authorization': this.$store.getters.token}
            },
            downloadEform() {
                return this.zwfwMaterial.name + this.zwfwMaterial.eform.substring(this.zwfwMaterial.eform.lastIndexOf('.'))
            },
            downloadExample() {
                return this.zwfwMaterial.name + this.zwfwMaterial.example.substring(this.zwfwMaterial.example.lastIndexOf('.'))
            },
            downloadTemplateFile() {
                if (this.zwfwMaterial.templateFile) {
                    return this.zwfwMaterial.name + this.zwfwMaterial.templateFile.substring(this.zwfwMaterial.templateFile.lastIndexOf('.'));
                }
                return '';
            }
        },
        methods: {
            getMaterialList() {
                this.pageLoading = true;
                getZwfwMaterialList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.zwfwMaterialList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.pageLoading = false;
                })
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
                this.zwfwMaterial = copyProperties(this.zwfwMaterial, row);
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
                this.$refs['zwfwMaterialForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.dialogLoading = true;
                        createZwfwMaterial(this.zwfwMaterial).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetZwfwMaterialForm();
                                this.$message.success('创建成功！');
                                this.getMaterialList();
                            } else {
                                this.$message.error('创建失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['zwfwMaterialForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.dialogLoading = true;
                        updateZwfwMaterial(this.zwfwMaterial).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetZwfwMaterialForm();
                                this.$message.success('更新成功');
                                this.getMaterialList();
                            } else {
                                this.$message.error('更新失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doDelete() {
                this.pageLoading = true;
                const ids = [];
                for (const deleteRow of this.selectedRows) {
                    ids.push(deleteRow.id);
                }
                delZwfwMaterials(ids).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('删除成功！');
                        this.getMaterialList();
                    } else {
                        this.$message.error('删除失败！');
                    }
                    this.pageLoading = false;
                })
            },
            changeAvatarEformFile(file, fileList) {
                this.zwfwMaterial.eform = file.name;
                if (file.response) {
                    this.zwfwMaterial.eform = file.response.url;
                }
            },
            changeAvatarExampleFile(file, fileList) {
                this.zwfwMaterial.example = file.name;
                if (file.response) {
                    this.zwfwMaterial.example = file.response.url;
                }
            },

            changeTemplateFile(file, fileList) {
                this.zwfwMaterial.templateFile = file.name;
                if (file.response) {
                    this.zwfwMaterial.templateFile = file.response.url;
                }
            },
            onUploadSuccess(response, file, fileList) {
                this.$message.success(file.name + '上传成功');
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isLt2M) {
                    this.$message.error('上传模板大小不能超过 10MB!');
                }
                return isLt2M;
            },
            resetZwfwMaterialForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'zwfwMaterialForm');
            },
            resetTemp() {
                this.zwfwMaterial = {
                    id: undefined,
                    electronicMaterial: false,
                    eform: '',
                    name: '',
                    acceptStandard: '',
                    remark: '',
                    source: '',
                    type: '',
                    example: '',
                    notice: '',
                    templateFile: '',
                    necessary: 0,
                    originalNumber: 0,
                    cpoyNumber: 0,
                    issuingUnit: '',
                    documentFormat: '',
                    businessClassification: ''
                };
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.name = null;
                this.getMaterialList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getMaterialList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.zwfwMaterialTable.toggleRowSelection(row);
            },
            /* 预审表单设置 */
            handlePretrialForm(zwfwMaterial, $event) {
                this.zwfwMaterial = zwfwMaterial;
                $event.stopPropagation(); // 阻止选中事项
                /* 显示添加界面 */
                this.dialogItemPretrialFormVisible = true;
            },
            onPretrialFormOpen() {
                this.$nextTick(function () {
                    this.$refs.materialForm.loadPretrialForm(this.zwfwMaterial);
                })
            },
            testRegex() {
                this.$refs.materialForm.testRegex();
            },
            /* 提交预审表单配置 */
            submitItemPretrialForm() {
                this.$refs.materialForm.submitItemPretrialForm();
            },
            publishItemPretrialForm() {
                this.$refs.materialForm.publishPretrialForm();
            },
            changeFormVersion(data) {
                this.editingForm = data;
            },
            closeZwfwItemPretrialForm() {
                this.$refs.materialForm.selectFormId = null;
                this.dialogItemPretrialFormVisible = false;
            }
        }
    }
</script>

<style>
    a.disabled {
        pointer-events: none;
    }
</style>