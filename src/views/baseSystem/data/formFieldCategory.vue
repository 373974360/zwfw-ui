<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="plus">
                添加
            </el-button>

            <el-button class="filter-item" style="margin-left: 10px;" @click="getCategoryList" type="primary"
                       icon="search">
                刷新
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="formFieldCategoryList"
                   :list-loading="pageLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete" :defaultExpandAll="false">
        </tree-grid>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="closeCategoryForm">
            <el-form ref="formFieldCategoryForm" class="small-space" :model="formFieldCategory" label-position="right"
                     label-width="110px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogFormLoading" :rules="formFieldCategoryRules">
                <el-form-item label="上级表单域分类">
                    <el-cascader :options="cascader" v-model="cascaderModel" @change="handleChange"
                                 :show-all-levels="true" expand-trigger="hover" :clearable="true"
                                 :change-on-select="true" style="width:100%"></el-cascader>
                </el-form-item>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="formFieldCategory.name"></el-input>
                </el-form-item>

                <el-form-item label="排序">
                    <el-input-number v-model="formFieldCategory.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formFieldCategory.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="closeCategoryForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="doCategoryCreate">确
                    定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="doCategoryUpdate"
                           @click="doCategoryUpdate">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeGrid from '../../../components/TreeGrid';
    import {
        getCategoryTree,
        getCategoryCascader,
        createCategory,
        updateCategory,
        delCategory
    } from '../../../api/baseSystem/data/formFieldCategory';
    import {copyProperties, resetForm, validateQueryStr} from '../../../utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from '../../../utils/TreeUtil.js';


    export default {
        name: 'formFieldCategory_table',
        data() {
            return {
                formFieldCategoryList: [],
                pageLoading: true,
                dialogTableLoading: true,
                showButton: true,
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'id',
                        width: 300
                    },
                    {
                        text: '分类名称',
                        dataIndex: 'name',
                        editAble: true
                    },
                    {
                        text: '创建时间',
                        dataIndex: 'createTime',
                        dateformart: 'YYYY-MM-DD HH:mm:ss'
                    },
                    {
                        text: '状态',
                        dataIndex: 'enable',
                        enums: 'Enable',
                        width: 150
                    }
                ],
                formFieldCategory: {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    treePosition: '',
                    enable: '',
                    remark: ''
                },
                selectedRows: [],
                formFieldCategoryId: '',
                cascader: [],
                optionsName: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogFormLoading: false,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.dialogRows,
                    formFieldCategoryId: undefined,
                    name: ''
                },
                formFieldCategoryRules: {
                    name: [
                        {required: true, message: '请输入表单域分类名称'}
                    ]
                }
            }
        },
        components: {
            TreeGrid
        },
        created() {
            this.getCategoryList();
        },
        computed: {
            cascaderModel() {
                if (this.formFieldCategory.treePosition) {
                    const arr = this.formFieldCategory.treePosition.split('&');
                    return arr;
                }
            },
            ...mapGetters([
                'textMap',
                'closeOnClickModal'
            ])
        },
        methods: {
            getCategoryList() {
                this.pageLoading = true;
                getCategoryTree().then(response => {
                    if (response.httpCode === 200) {
                        this.formFieldCategoryList = response.data;
                    } else {
                        this.$message.error(response.msg || '数据加载失败');
                    }
                    this.pageLoading = false;
                })
            },
            getOptions(id) {
                this.dialogFormLoading = true;
                getCategoryCascader(id).then(response => {
                    if (response.httpCode === 200) {
                        this.cascader = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.dialogFormLoading = false;
                })
            },
            handleCreate(row) {
                this.resetCategoryTemp();
                if (row.treePosition) {
                    if (row.treePosition.substr(0, 1) === '&') {
                        this.formFieldCategory.treePosition = row.treePosition.substring(1);
                    } else {
                        this.formFieldCategory.treePosition = row.treePosition;
                    }
                }
                if (row.id) {
                    this.formFieldCategory.parentId = row.id;
                    this.formFieldCategory.treePosition = row.id;
                } else {
                    this.formFieldCategory.parentId = 0;
                }
                this.getOptions(null);
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.resetCategoryTemp();
                this.formFieldCategory = copyProperties(this.formFieldCategory, row);
                if (row._parent) {
                    this.formFieldCategory.treePosition = row._parent.treePosition;
                } else {
                    this.formFieldCategory.treePosition = undefined;
                }
                this.getOptions(this.formFieldCategory.id);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.doCategoryDelete(row.id);
                }).catch(() => {
                    console.dir('取消');
                });
            },
            doCategoryCreate() {
                this.$refs['formFieldCategoryForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormLoading = true;
                        createCategory(this.formFieldCategory).then(response => {
                            this.dialogFormLoading = false;
                            if (response.httpCode === 200) {
                                this.closeCategoryForm();
                                this.$message.success('创建成功！');
//                                TreeUtil.addRow(response.data, this.formFieldCategoryList);
                                this.getCategoryList();
                            } else {
                                this.$message.error('创建失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doCategoryUpdate() {
                this.$refs['formFieldCategoryForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormLoading = true;
                        updateCategory(this.formFieldCategory).then(response => {
                            this.dialogFormLoading = false;
                            if (response.httpCode === 200) {
                                this.closeCategoryForm();
                                this.$message.success('更新成功');
//                                TreeUtil.editRow(response.data, this.formFieldCategoryList);
                                this.getCategoryList();
                            } else {
                                this.$message.error('更新失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doCategoryDelete(id) {
                this.pageLoading = true;
                delCategory(id).then(response => {
                    if (response.httpCode === 200) {
                        TreeUtil.delRow(response.data, this.formFieldCategoryList);
                        this.$message.success('删除成功！');
                    } else {
                        this.$message.error('删除失败！');
                    }
                    this.pageLoading = false;
                })
            },
            handleChange(value) {
                if (value.length > 0) {
                    this.formFieldCategory.parentId = value[value.length - 1];
                    this.formFieldCategory.treePosition = value.join('&');
                } else {
                    this.formFieldCategory.parentId = 0;
                    this.formFieldCategory.treePosition = undefined;
                }
            },
            handleRemove() {

            },
            handleToggle(row) {
                row._expanded = !row._expanded;
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            closeCategoryForm() {
                this.dialogFormVisible = false;
                this.resetCategoryTemp();
                resetForm(this, 'formFieldCategoryForm');
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.formFieldCategoryId = undefined;
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
            },
            resetCategoryTemp() {
                this.formFieldCategory = {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    treePosition: '',
                    remark: '',
                    enable: ''
                };
            }
        }
    }
</script>
<style>

</style>
