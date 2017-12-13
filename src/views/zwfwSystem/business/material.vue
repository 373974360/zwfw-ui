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
            <el-table-column align="center" label="ID" width="150">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" align="left" label="材料名称" width="600">
                <template scope="scope">
                    <el-tooltip content="点击编辑" placement="right" effect="dark">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="type" align="center" label="材料类型">
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

        <div v-show="!pageLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetZwfwMaterialForm">
            <el-form ref="zwfwMaterialForm" class="small-space" :model="zwfwMaterial" label-position="right"
                     label-width="80px"
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
                <el-form-item label="是否需要电子材料" prop="electronicMaterial">
                    <el-switch
                            v-model="zwfwMaterial.electronicMaterial"
                            on-color="#13ce66"
                            off-color="#ff4949"
                            :on-value="true"
                            :off-value="false">
                    </el-switch>
                </el-form-item>
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
                        <el-input slot="trigger" v-model="this.zwfwMaterial.example" placeholder="选择文件" readonly
                                  style="width: 320px"></el-input>
                        <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
                        <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadExample">
                            上传到服务器
                        </el-button>-->
                        <!--<el-button style="margin-left: 10px;" size="small" type="info" @click="showMaterialExample">
                            点击下载
                        </el-button>-->
                        <a :href="this.zwfwMaterial.example" :download="downloadExample" :class="{disabled: !this.zwfwMaterial.example}">
                            <el-button style="margin-left: 10px;" size="small" type="info" :disabled="!this.zwfwMaterial.example">点击下载</el-button>
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
                        <el-input slot="trigger" v-model="this.zwfwMaterial.eform" placeholder="选择文件" readonly
                                  style="width: 320px"></el-input>
                        <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
                        <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadEform">
                            上传到服务器
                        </el-button>-->
                        <!--<el-button style="margin-left: 10px;" size="small" type="info" @click="showEformFile">
                            点击下载
                        </el-button>-->
                        <a :href="this.zwfwMaterial.eform" :download="downloadEform" :class="{disabled: !this.zwfwMaterial.eform}">
                            <el-button style="margin-left: 10px;" size="small" type="info" :disabled="!this.zwfwMaterial.eform">点击下载</el-button>
                        </a>
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

    export default {
        name: 'zwfwMaterial_table',
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
                    electronicMaterial: true,
                    eform: '',
                    name: '',
                    acceptStandard: '',
                    remark: '',
                    source: '',
                    type: '',
                    example: '',
                    notice: ''
                },
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
                }
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
                let ids = [];
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
            submitUploadExample() {
                if (this.zwfwMaterial.example) {
                    this.$refs.uploadExample.submit();
                } else {
                    this.$message.warning('请选择文件')
                }
            },
            submitUploadEform() {
                if (this.zwfwMaterial.eform) {
                    this.$refs.uploadEform.submit();
                } else {
                    this.$message.warning('请选择文件')
                }
            },
            showMaterialExample() {
                if (this.zwfwMaterial.example) {
                    window.open(this.zwfwMaterial.example);
                }
            },
            showEformFile() {
                if (this.zwfwMaterial.eform) {
                    window.open(this.zwfwMaterial.eform);
                }
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
                    electronicMaterial: true,
                    eform: '',
                    name: '',
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
            }
        }
    }
</script>

<style>
    a.disabled {
        pointer-events: none;
    }
</style>