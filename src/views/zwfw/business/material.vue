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

        <el-table ref="zwfwMaterialTable" :data="zwfwMaterialList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="ID" width="150">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="材料名称">
                <template scope="scope">
                    <el-tooltip content="点击编辑" placement="right" effect="dark">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="type" align="center" label="材料类型">
                <template scope="scope">
                    <span>{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column v-once prop="source" align="center" label="来源渠道">
                <template scope="scope">
                    <span>{{scope.row.source}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="electronicMaterial" align="center" label="是否需要电子材料">
                <template scope="scope">
                    <span>{{scope.row.electronicMaterial | enums('YesNo')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" align="center" label="受理标准">
                <template scope="scope">
                    <span>{{scope.row.acceptStandard}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" align="center" label="填报须知">
                <template scope="scope">
                    <span>{{scope.row.notice}}</span>
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
                   :close-on-click-modal="closeOnClickModal" :before-close="resetZwfwMaterialForm">
            <el-form ref="zwfwMaterialForm" class="small-space" :model="zwfwMaterial" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwMaterialRules">
                <el-form-item label="材料名称" prop="name">
                    <el-input v-model="zwfwMaterial.name"></el-input>
                </el-form-item>
                <el-form-item label="材料类型" prop="type">
                    <el-input v-model="zwfwMaterial.type"></el-input>
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
                    <el-input v-model="zwfwMaterial.source"></el-input>
                </el-form-item>
                <el-form-item label="材料样本" prop="example">
                    <el-upload name="uploadFile"  accept="uploadAccepts"
                               :action="uploadAction" :file-list="uploadAvatarsExample"
                               :on-success="handleAvatarExampleSuccess"
                               :before-upload="beforeAvatarUpload"
                               :on-remove="handleRemoveExample">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="电子表单" prop="eform">
                    <el-upload name="uploadFile"  :accept="uploadAccepts"
                               :action="uploadAction" :file-list="uploadAvatarsEform"
                               :on-success="handleAvatarEformSuccess"
                               :before-upload="beforeAvatarUpload"
                               :on-remove="handleRemoveEform">
                        <el-button size="small" type="primary">点击上传</el-button>
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
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
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
    } from 'api/zwfw/zwfwMaterial';

    export default {
        name: 'zwfwMaterial_table',
        data() {
            return {
                zwfwMaterialList: [],
                total: null,
                listLoading: true,
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
                uploadAction: process.env.SYS_API + '/sysUpload/',
                uploadAvatarsEform: [],
                uploadAvatarsExample: [],
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
                uploadAccepts: '.gif,.jpg,.jpeg,.bmp,.png,.xls,.xlsx,.doc,.docx,.zip,.rar,.pdf'
            }
        },
        created() {
            this.getList();
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                getZwfwMaterialList(this.listQuery).then(response => {
                    this.zwfwMaterialList = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
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
                this.$refs.zwfwMaterialTable.toggleRowSelection(row);
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
                if (this.zwfwMaterial.eform == '') {
                    this.handleRemoveEform();
                } else {
                    this.uploadAvatarsEform = [];
                    this.uploadAvatarsEform.push({url: this.zwfwMaterial.eform});
                }
                if (this.zwfwMaterial.example == '') {
                    this.handleRemoveExample();
                } else {
                    this.uploadAvatarsExample = [];
                    this.uploadAvatarsExample.push({url: this.zwfwMaterial.example});
                }
                this.dialogFormVisible = true;
            },

            handleAvatarEformSuccess(res, file, fileList) {
                fileList.length = 0;
                fileList.push(file);
                this.zwfwMaterial.eform = res.url;
            },
            handleRemoveEform() {
                this.zwfwMaterial.eform = '';
            },
            handleAvatarExampleSuccess(res, file, fileList) {
                fileList.length = 0;
                fileList.push(file);
                this.zwfwMaterial.example = res.url;
            },
            handleRemoveExample() {
                this.zwfwMaterial.example = '';
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isLt2M) {
                    this.$message.error('上传模板大小不能超过 10MB!');
                }
                return isLt2M;
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
                        delZwfwMaterials(ids).then(response => {
                            this.total -= selectCounts;
                            for (const deleteRow of this.selectedRows) {
                                const index = this.zwfwMaterialList.indexOf(deleteRow);
                                this.zwfwMaterialList.splice(index, 1);
                            }
                            this.$message.success('删除成功');
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            create() {
                this.$refs['zwfwMaterialForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwMaterial(this.zwfwMaterial).then(response => {
                            this.zwfwMaterialList.unshift(response.data);
                            this.total += 1;
                            this.listLoading = false;
                            this.$message.success('创建成功');
                            this.uploadAvatarsExample = [];
                            this.uploadAvatarsEform = [];
                            this.resetZwfwMaterialForm();
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['zwfwMaterialForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateZwfwMaterial(this.zwfwMaterial).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                            this.listLoading = false;
                            this.uploadAvatarsExample = [];
                            this.uploadAvatarsEform = [];
                            this.resetZwfwMaterialForm();
                        })
                    } else {
                        return false;
                    }
                });
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
            resetZwfwMaterialForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                this.uploadAvatarsExample = [];
                this.uploadAvatarsEform = [];
                resetForm(this, 'zwfwMaterialForm');
            }
        }
    }
</script>
