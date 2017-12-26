<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="list" :list-loading="listLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete" :defaultExpandAll="false">
        </tree-grid>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="hyflForm" class="small-space" :model="jobHyfl" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="jobHyflRules">

                <el-form-item label="上级分类">
                    <el-cascader :options="cascader" v-model="cascaderModel" :show-all-levels="true"
                                 :change-on-select="true" expand-trigger="hover"  style="width:100%" :disabled="false" :clearable="true"
                                 @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="jobHyfl.name"/>
                </el-form-item>
                <el-form-item label="排　　序">
                    <el-input-number v-model="jobHyfl.sortNo" :min="1" :max="100"/>
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
    import TreeGrid from 'components/TreeGrid'
    import {getHyflTree,getHyflCascader,delHyfl,createHyfl, updateHyfl} from 'api/jobSystem/flxx/hyfl';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from 'utils/TreeUtil.js';

    export default {
        name: 'hyfl_table',
        data() {
            return {
                list: [],
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
                        text: '排列顺序',
                        dataIndex: 'sortNo'
                    }
                ],
                jobHyfl: {
                    id: undefined,
                    parentId: 0,
                    name: '',
                    treePosition: '',
                    sortNo: 1
                },
                jobHyflRules: {
                    name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'}
                    ]
                },
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                cascader: []
            }
        },
        computed: {
            cascaderModel: function () {
                if (this.jobHyfl.treePosition) {
                    const arr = this.jobHyfl.treePosition.split('&');
                    return arr;
                }
            },
            ...mapGetters([
                'enums',
                'textMap'
            ])
        },
        components: {
            TreeGrid
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getHyflTree().then(response => {
                    if (response.httpCode == 200) {
                        this.list = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listLoading = false;
                })
            },
            getOptions(id) {
                this.dialogLoading = true;
                getHyflCascader(id).then(response => {
                    if (response.httpCode == 200) {
                        this.cascader = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.dialogLoading = false;
                })
            },
            handleChange(value) {
                if (value.length > 0) {
                    this.jobHyfl.parentId = value[value.length - 1];
                    this.jobHyfl.treePosition = value.join('&');
                } else {
                    this.jobHyfl.parentId = 0;
                    this.jobHyfl.treePosition = undefined;
                }
            },
            handleToggle(row) {
                row._expanded = !row._expanded;
            },
            handleCreate(row) {
                this.resetTemp();
                if (row.treePosition) {
                    this.jobHyfl.treePosition = row.treePosition;
                }
                if (row.id) {
                    this.jobHyfl.parentId = row.id;
                } else {
                    this.jobHyfl.parentId = 0;
                }
                this.getOptions(null);
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.resetTemp();
                this.jobHyfl = copyProperties(this.jobHyfl, row);
                if (row._parent) {
                    this.jobHyfl.treePosition = row._parent.treePosition;
                } else {
                    this.jobHyfl.treePosition = undefined;
                }
                this.getOptions(this.jobHyfl.id);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    delHyfl(row.id).then(response => {
                        if (response.httpCode == 200) {
                            this.$message.success('删除成功');
                            TreeUtil.delRow(response.data, this.list);
                        } else {
                            this.$message.error(response.msg);
                        }
                        this.listLoading = false;
                    })
                }).catch(() => {
                    console.dir("取消");
                });
            },
            create() {
                this.$refs['hyflForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createHyfl(this.jobHyfl).then(response => {
                            if (response.httpCode == 200) {
                                this.$message.success('创建成功');
                                TreeUtil.addRow(response.data, this.list);
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['hyflForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateHyfl(this.jobHyfl).then(response => {
                            if (response.httpCode == 200) {
                                this.$message.success('更新成功');
                                TreeUtil.editRow(response.data, this.list);
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.jobHyfl = {
                    id: undefined,
                    parentId: 0,
                    name: '',
                    treePosition: '',
                    sortNo: 1
                };
            }
        }
    }
</script>