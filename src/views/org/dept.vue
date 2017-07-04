<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">
                添加
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="deptList" :list-loading="listLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete">
        </tree-grid>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="deptForm" class="small-space" :model="sysDept" label-position="left" label-width="70px"
                     style='width: 80%; margin-left:10%;'>
                <el-form-item label="上级部门">
                    <el-cascader :options="cascader" v-model="cascaderModel" @change="handleChange"
                                 :show-all-levels="true" expand-trigger="hover" :clearable="true"
                                 :change-on-select="true" style="width:100%"></el-cascader>
                </el-form-item>
                <el-form-item label="部门全称">
                    <el-input v-model="sysDept.deptName"></el-input>
                </el-form-item>
                <el-form-item label="部门简称">
                    <el-input v-model="sysDept.shortName"></el-input>
                </el-form-item>
                <el-form-item label="部门编号">
                    <el-input v-model="sysDept.deptCode"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="sysDept.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="sysDept.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import TreeGrid from 'components/TreeGrid';
    import {getDeptTree, getDeptCascader, createDept, updateDept, delDept} from 'api/org/dept';
    import {copyProperties} from 'utils';
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
                        dataIndex: 'deptName'
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
                    deptName: '',
                    shortName: '',
                    deptCode: '',
                    parentId: 0,
                    sortNo: 1,
                    status: 1,
                    treePosition: ''
                },
                cascader: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false
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
                'textMap'
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
            getOptions(id){
                this.dialogLoading = true;
                getDeptCascader(id).then(response => {
                    this.cascader = response.data;
                    this.dialogLoading = false;
                })
            },
            handleChange(value)
            {
                if (value.length > 0) {
                    this.sysDept.parentId = value[value.length - 1];
                    this.sysDept.treePosition = value.join('&');
                } else {
                    this.sysDept.parentId = 0;
                    this.sysDept.treePosition = undefined;
                }
            },
            handleToggle(row){
                row._expanded = !row._expanded;
            },
            handleCreate(row) {
                this.resetTemp();
                this.sysDept.treePosition = row.treePosition;
                this.sysDept.parentId = row.id;
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
            handleDelete(row)
            {
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
            create()
            {
                this.$refs['deptForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        createDept(this.sysDept).then(response => {
                            this.$message.success('创建成功');
                            TreeUtil.addRow(response.data, this.deptList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            update()
            {
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
                    deptName: '',
                    shortName: '',
                    deptCode: '',
                    parentId: 0,
                    sortNo: 1,
                    status: 1,
                    treePosition: ''
                };
            }
        }
    }
</script>
