<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="plus">
                添加
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="deptList" :list-loading="listLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete" :defaultExpandAll="false">
        </tree-grid>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetDeptForm">
            <el-form ref="deptForm" class="small-space" :model="sysDept" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="deptRules">
                <el-form-item label="上级部门">
                    <el-cascader :options="cascader" v-model="cascaderModel" @change="handleChange"
                                 :show-all-levels="true" expand-trigger="hover" :clearable="true"
                                 :change-on-select="true" style="width:100%"></el-cascader>
                </el-form-item>
                <el-form-item label="部门全称" prop="name">
                    <el-input v-model="sysDept.name"></el-input>
                </el-form-item>
                <el-form-item label="部门简称" prop="shortName">
                    <el-input v-model="sysDept.shortName"></el-input>
                </el-form-item>
                <el-form-item label="部门编号" prop="deptCode">
                    <el-input v-model="sysDept.deptCode"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="sysDept.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="sysDept.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetDeptForm">取 消</el-button>
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
    import {getDeptTree, getDeptCascader, createDept, updateDept, delDept} from 'api/sys/org/dept';
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from 'utils/TreeUtil.js';

    export default {
        name: 'dept_table',
        data() {
            return {
                deptList: [],
                listLoading: true,
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'id'
                    },
                    {
                        text: '部门名称',
                        dataIndex: 'name',
                        editAble: true
                    },
                    {
                        text: '部门简称',
                        dataIndex: 'shortName'
                    },
                    {
                        text: '部门编号',
                        dataIndex: 'deptCode'
                    },
                    {
                        text: '排序',
                        dataIndex: 'sortNo'
                    }
                ],
                sysDept: {
                    id: undefined,
                    name: '',
                    shortName: '',
                    deptCode: '',
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
                deptRules: {
                    name: [
                        {required: true, message: '请输入部门名称'}
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
                if (this.sysDept.treePosition) {
                    const arr = this.sysDept.treePosition.split('&');
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
                getDeptTree().then(response => {
                    this.deptList = response.data;
                    this.listLoading = false;
                })
            },
            getOptions(id) {
                this.dialogLoading = true;
                getDeptCascader(id).then(response => {
                    this.cascader = response.data;
                    this.dialogLoading = false;
                })
            },
            handleChange(value) {
                if (value.length > 0) {
                    this.sysDept.parentId = value[value.length - 1];
                    this.sysDept.treePosition = value.join('&');
                } else {
                    this.sysDept.parentId = 0;
                    this.sysDept.treePosition = undefined;
                }
            },
            handleToggle(row) {
                row._expanded = !row._expanded;
            },
            handleCreate(row) {
                this.resetTemp();
                if (row.treePosition) {
                    this.sysDept.treePosition = row.treePosition;
                }
                if (row.id) {
                    this.sysDept.parentId = row.id;
                } else {
                    this.sysDept.parentId = 0;
                }
                this.getOptions(null);
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.resetTemp();
                this.sysDept = copyProperties(this.sysDept, row);
                if (row._parent) {
                    this.sysDept.treePosition = row._parent.treePosition;
                } else {
                    this.sysDept.treePosition = undefined;
                }
                this.getOptions(this.sysDept.id);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delDept(row.id).then(response => {
                        this.$message.success('删除成功');
                        TreeUtil.delRow(response.data, this.deptList);
                    })
                }).catch(() => {
                    console.dir("取消");
                });
            },
            create() {
                this.$refs['deptForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        console.dir(this.sysDept.parentId);
                        createDept(this.sysDept).then(response => {
                            this.$message.success('创建成功');
                            TreeUtil.addRow(response.data, this.deptList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['deptForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        updateDept(this.sysDept).then(response => {
                            this.$message.success('更新成功');
                            TreeUtil.editRow(response.data, this.deptList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.sysDept = {
                    id: undefined,
                    name: '',
                    shortName: '',
                    deptCode: '',
                    parentId: 0,
                    sortNo: 1,
                    status: 1,
                    treePosition: '',
                    remark: ''
                };
            },
            resetDeptForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'deptForm');
            }
        }
    }
</script>
