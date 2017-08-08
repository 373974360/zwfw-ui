<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="plus">
                添加
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="itemList" :list-loading="listLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete">
        </tree-grid>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="itemForm" class="small-space" :model="itemCategory" label-position="right" label-width="110px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="itemRules">
                <el-form-item label="上级事项分类">
                    <el-cascader :options="cascader" v-model="cascaderModel" @change="handleChange"
                                 :show-all-levels="true" expand-trigger="hover" :clearable="true"
                                 :change-on-select="true" style="width:100%"></el-cascader>
                </el-form-item>
                <el-form-item label="事项分类名称" prop="name">
                    <el-input v-model="itemCategory.name"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="itemCategory.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="itemCategory.remark"></el-input>
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
    import {getItemTree, getItemCascader, createItem, updateItem, delItem} from 'api/sys/operate/itemCategory';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from 'utils/TreeUtil.js';


    export default {
        name: 'item_table',
        data() {
            return {
                itemList: [],
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
                itemCategory: {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    treePosition: '',
                    enable: '',
                    remark: '',
                    createTime: ''
                },
                cascader: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                itemRules: {
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
                if (this.itemCategory.treePosition) {
                    const arr = this.itemCategory.treePosition.split('&');
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
                getItemTree().then(response => {
                    this.itemList = response.data;
                    this.listLoading = false;
                })
            },
            getOptions(id) {
                this.dialogLoading = true;
                getItemCascader(id).then(response => {
                    this.cascader = response.data;
                    this.dialogLoading = false;
                })
            },
            handleChange(value) {
                if (value.length > 0) {
                    this.itemCategory.parentId = value[value.length - 1];
                    this.itemCategory.treePosition = value.join('&');
                } else {
                    this.itemCategory.parentId = 0;
                    this.itemCategory.treePosition = undefined;
                }
            },
            handleToggle(row) {
                row._expanded = !row._expanded;
            },
            handleCreate(row) {
                this.resetTemp();
                if (row.treePosition) {
                    if (row.treePosition.substr(0, 1) == "&") {
                        this.itemCategory.treePosition = row.treePosition.substring(1);
                    } else {
                        this.itemCategory.treePosition = row.treePosition;
                    }
                }
                if (row.id) {
                    this.itemCategory.parentId = row.id;
                } else {
                    this.itemCategory.parentId = 0;
                }
                this.getOptions(null);
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.resetTemp();
                this.itemCategory = copyProperties(this.itemCategory, row);
                if (row._parent) {
                    this.itemCategory.treePosition = row._parent.treePosition;
                } else {
                    this.itemCategory.treePosition = undefined;
                }
                this.getOptions(this.itemCategory.id);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delItem(row.id).then(response => {
                        this.$message.success('删除成功');
                        TreeUtil.delRow(response.data, this.itemList);
                    })
                }).catch(() => {
                    console.dir("取消");
                });
            },
            create() {
                this.$refs['itemForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        console.dir(this.itemCategory.parentId);
                        createItem(this.itemCategory).then(response => {
                            this.$message.success('创建成功');
                            TreeUtil.addRow(response.data, this.itemList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['itemForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        updateItem(this.itemCategory).then(response => {
                            this.$message.success('更新成功');
                            TreeUtil.editRow(response.data, this.itemList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.itemCategory = {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    treePosition: '',
                    remark: '',
                    enable: '',
                    createTime: ''
                };
            }
        }
    }
</script>
