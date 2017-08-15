<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="plus">
                添加
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="categoryList" :list-loading="listLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete">
        </tree-grid>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="categoryForm" class="small-space" :model="category" label-position="right" label-width="110px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="categoryRules">
                <el-form-item label="上级事项分类">
                    <el-cascader :options="cascader" v-model="cascaderModel" @change="handleChange"
                                 :show-all-levels="true" expand-trigger="hover" :clearable="true"
                                 :change-on-select="true" style="width:100%"></el-cascader>
                </el-form-item>
                <el-form-item label="事项分类名称" prop="name">
                    <el-input v-model="category.name"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="category.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="category.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import TreeGrid from 'components/TreeGrid';
    import {getCategoryTree, getCategoryCascader, createCategory, updateCategory, delCategory} from 'api/zwfw/category';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from 'utils/TreeUtil.js';


    export default {
        name: 'category_table',
        data() {
            return {
                categoryList: [],
                listLoading: true,
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'id',
                        width: '300'
                    },
                    {
                        text: '事项分类名称',
                        dataIndex: 'name',
                        editAble: true
                    },
                    {
                        text: '创建时间',
                        dataIndex: 'createTime',
                        dateformart: 'YYYY-MM-DD HH:mm:ss',
                        width: '450'
                    },
                    {
                        text: '状态',
                        dataIndex: 'enable',
                        enums: 'Enable',
                        width: '150'
                    }
                ],
                category: {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    treePosition: '',
                    enable: '',
                    remark: ''
                },
                cascader: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                categoryRules: {
                    name: [
                        {required: true, message: '请输入事项分类名称', trigger: 'blur'}
                    ]
                }
            }
        },
        components: {
            TreeGrid
        },
        created() {
            this.getList();
        },
        computed: {
            cascaderModel: function () {
                if (this.category.treePosition) {
                    const arr = this.category.treePosition.split('&');
                    return arr;
                }
            },
            ...mapGetters([
                'textMap'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                getCategoryTree().then(response => {
                    this.categoryList = response.data;
                    this.listLoading = false;
                })
            },
            getOptions(id) {
                this.dialogLoading = true;
                getCategoryCascader(id).then(response => {
                    this.cascader = response.data;
                    this.dialogLoading = false;
                })
            },
            handleChange(value) {
                if (value.length > 0) {
                    this.category.parentId = value[value.length - 1];
                    this.category.treePosition = value.join('&');
                } else {
                    this.category.parentId = 0;
                    this.category.treePosition = undefined;
                }
            },
            handleToggle(row) {
                row._expanded = !row._expanded;
            },
            handleCreate(row) {
                this.resetTemp();
                if (row.treePosition) {
                    if (row.treePosition.substr(0, 1) == "&") {
                        this.category.treePosition = row.treePosition.substring(1);
                    } else {
                        this.category.treePosition = row.treePosition;
                    }
                }
                if (row.id) {
                    this.category.parentId = row.id;
                } else {
                    this.category.parentId = 0;
                }
                this.getOptions(null);
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.resetTemp();
                this.category = copyProperties(this.category, row);
                if (row._parent) {
                    this.category.treePosition = row._parent.treePosition;
                } else {
                    this.category.treePosition = undefined;
                }
                this.getOptions(this.category.id);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delCategory(row.id).then(response => {
                        this.$message.success('删除成功');
                        TreeUtil.delRow(response.data, this.categoryList);
                    })
                }).catch(() => {
                    console.dir("取消");
                });
            },
            create() {
                this.$refs['categoryForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        console.dir(this.category.parentId);
                        createCategory(this.category).then(response => {
                            this.$message.success('创建成功');
                            TreeUtil.addRow(response.data, this.categoryList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['categoryForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        updateCategory(this.category).then(response => {
                            this.$message.success('更新成功');
                            TreeUtil.editRow(response.data, this.categoryList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.category = {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    treePosition: '',
                    remark: '',
                    enable: '',
                };
            }
        }
    }
</script>
