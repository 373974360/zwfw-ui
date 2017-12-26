<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="plus">
                添加
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="metadataTypeList" :list-loading="listLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete">
        </tree-grid>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetMetadataTypeForm">
            <el-form ref="metadataTypeForm" class="small-space" :model="sysMetadataType" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="metadataTypeRules">
                <el-form-item label="上级分类">
                    <el-cascader :options="cascader" v-model="cascaderModel" @change="handleChange"
                                 :show-all-levels="true" expand-trigger="hover" :clearable="true"
                                 :change-on-select="true" style="width:100%"></el-cascader>
                </el-form-item>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="sysMetadataType.name"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="sysMetadataType.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="sysMetadataType.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetMetadataTypeForm">取 消</el-button>
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
    import {
        getMetadataTypeTree,
        getMetadataTypeCascader,
        createMetadataType,
        updateMetadataType,
        delMetadataType
    } from 'api/baseSystem/data/metadataType';
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from 'utils/TreeUtil.js';

    export default {
        name: 'metadataType_table',
        data() {
            return {
                metadataTypeList: [],
                listLoading: true,
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'id'
                    },
                    {
                        text: '分类名称',
                        dataIndex: 'name',
                        editAble: true
                    },
                    {
                        text: '排序',
                        dataIndex: 'sortNo'
                    }
                ],
                sysMetadataType: {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    status: 1,
                    treePosition: '',
                    remark: ''
                },
                cascader: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                metadataTypeRules: {
                    name: [
                        {required: true, message: '请输入分类名称'}
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
                if (this.sysMetadataType.treePosition) {
                    const arr = this.sysMetadataType.treePosition.split('&');
                    return arr;
                }
            },
            ...mapGetters([
                'textMap',
                'closeOnClickModal'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                getMetadataTypeTree().then(response => {
                    if (response.httpCode === 200) {
                        this.metadataTypeList = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listLoading = false;
                })
            },
            getOptions(id) {
                this.dialogLoading = true;
                getMetadataTypeCascader(id).then(response => {
                    if (response.httpCode === 200) {
                        this.cascader = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.dialogLoading = false;
                })
            },
            handleChange(value) {
                if (value.length > 0) {
                    this.sysMetadataType.parentId = value[value.length - 1];
                    this.sysMetadataType.treePosition = value.join('&');
                } else {
                    this.sysMetadataType.parentId = 0;
                    this.sysMetadataType.treePosition = undefined;
                }
            },
            handleToggle(row) {
                row._expanded = !row._expanded;
            },
            handleCreate(row) {
                this.resetTemp();
                if (row.treePosition) {
                    this.sysMetadataType.treePosition = row.treePosition;
                }
                if (row.id) {
                    this.sysMetadataType.parentId = row.id;
                } else {
                    this.sysMetadataType.parentId = 0;
                }
                this.getOptions(null);
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.resetTemp();
                this.sysMetadataType = copyProperties(this.sysMetadataType, row);
                if (row._parent) {
                    this.sysMetadataType.treePosition = row._parent.treePosition;
                } else {
                    this.sysMetadataType.treePosition = undefined;
                }
                this.getOptions(this.sysMetadataType.id);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delMetadataType(row.id).then(response => {
                        if (response.httpCode === 200) {
                            this.$message.success('删除成功！');
                            TreeUtil.delRow(response.data, this.metadataTypeList);
                        } else {
                            this.$message.erroe('删除失败！');
                        }
                    })
                }).catch(() => {
                    console.dir('取消');
                });
            },
            create() {
                this.$refs['metadataTypeForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        console.dir(this.sysMetadataType.parentId);
                        createMetadataType(this.sysMetadataType).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('创建成功！');
                                TreeUtil.addRow(response.data, this.metadataTypeList);
                            } else {
                                this.$message.error('创建失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['metadataTypeForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        updateMetadataType(this.sysMetadataType).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('更新成功！');
                                TreeUtil.editRow(response.data, this.metadataTypeList);
                            } else {
                                this.$message.error('更新失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.sysMetadataType = {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    status: 1,
                    treePosition: '',
                    remark: ''
                };
            },
            resetMetadataTypeForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'metadataTypeForm');
            }
        }
    }
</script>
