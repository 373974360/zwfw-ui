<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="menuList" :list-loading="listLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete" :defaultExpandAll="false"></tree-grid>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetMenuForm">
            <el-form ref="menuForm" class="small-space" :model="sysMenu" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="sysMenuRules">

                <el-form-item label="上级菜单">
                    <el-cascader :options="cascader" v-model="cascaderModel" :show-all-levels="true"
                                 :change-on-select="true" expand-trigger="hover"  style="width:100%" :disabled="false" :clearable="true"
                                 @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="sysMenu.name"/>
                </el-form-item>
                <el-form-item label="菜单类型">
                    <el-radio-group v-model="sysMenu.type">
                        <el-radio  v-for="item in enums['MenuType']"
                                   :key="item.code"
                                   :label="item.code"
                                   :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单图标"  prop="iconcls">
                    <el-input v-model="sysMenu.iconcls"/>
                </el-form-item>
                <el-form-item label="请求地址" prop="request">
                    <el-input v-model="sysMenu.request"/>
                </el-form-item>
                <el-form-item label="权限标识" prop="permission">
                    <el-input v-model="sysMenu.permission"/>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="sysMenu.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注"  prop="remark">
                    <el-input type="textarea" v-model="sysMenu.remark" :rows="3"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetMenuForm">取 消</el-button>
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
    import {getMenuTree, getMenuCascader, createMenu, updateMenu, delMenu} from 'api/base/org/menu';
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from 'utils/TreeUtil.js';

    export default {
        name: 'menu_table',
        data() {
            return {
                menuList: [],
                listLoading: true,
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'id'
                    },
                    {
                        text: '菜单名称',
                        dataIndex: 'name',
                        editAble: true
                    },
                    {
                        text: '菜单类型',
                        dataIndex: 'type',
                        enums: 'MenuType',
                        width: '170'
                    },
                    {
                        text: '请求地址',
                        dataIndex: 'request'
                    },
                    {
                        text: '权限标识',
                        dataIndex: 'permission'
                    }
                ],
                sysMenu: {
                    id: undefined,
                    parentId: 0,
                    name: '',
                    type: 1,
                    iconcls: '',
                    treePosition: '',
                    request: '',
                    sortNo: 1,
                    permission: '',
                    remark: ''
                },
                sysMenuRules: {
                    name: [
                        {required: true, message: '请输入菜单名称'}
                    ],
                    request: [
                        {required: true, message: '请输入请求地址'}
                    ],
                    permission: [
                        {required: true, message: '请输入权限标识'}
                    ]
                },
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                cascader: []
            }
        },
        computed: {
            cascaderModel: function() {
                if (this.sysMenu.treePosition) {
                    const arr = this.sysMenu.treePosition.split('&');
                    return arr;
                }
            },
            ...mapGetters([
                'enums',
                'textMap',
                'closeOnClickModal'
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
                getMenuTree().then(response => {
                    this.menuList = response.data;
                    this.listLoading = false;
                })
            },
            getOptions(id) {
                this.dialogLoading = true;
                getMenuCascader(id).then(response => {
                    this.cascader = response.data;
                    this.dialogLoading = false;
                })
            },
            handleChange(value) {
                if (value.length > 0) {
                    this.sysMenu.parentId = value[value.length - 1];
                    this.sysMenu.treePosition = value.join('&');
                } else {
                    this.sysMenu.parentId = 0;
                    this.sysMenu.treePosition = undefined;
                }
            },
            handleToggle(row) {
                row._expanded = !row._expanded;
            },
            handleCreate(row) {
                this.resetTemp();
                if (row.treePosition) {
                    this.sysMenu.treePosition = row.treePosition;
                }
                if (row.id) {
                    this.sysMenu.parentId = row.id;
                } else {
                    this.sysMenu.parentId = 0;
                }
                this.getOptions(null);
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.resetTemp();
                this.sysMenu = copyProperties(this.sysMenu, row);
                if (row._parent) {
                    this.sysMenu.treePosition = row._parent.treePosition;
                } else {
                    this.sysMenu.treePosition = undefined;
                }
                this.getOptions(this.sysMenu.id);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delMenu(row.id).then(response => {
                        this.$message.success('删除成功');
                        TreeUtil.delRow(response.data, this.menuList);
                    })
                }).catch(() => {
                    console.dir("取消");
                });
            },
            create() {
                this.$refs['menuForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        createMenu(this.sysMenu).then(response => {
                            this.$message.success('创建成功');
                            TreeUtil.addRow(response.data, this.menuList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['menuForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        updateMenu(this.sysMenu).then(response => {
                            this.$message.success('更新成功');
                            TreeUtil.editRow(response.data, this.menuList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.sysMenu = {
                    id: undefined,
                    name: '',
                    type: 1,
                    iconcls: '',
                    parentId: 0,
                    treePosition: '',
                    request: '',
                    sortNo: 1,
                    permission: '',
                    remark: ''
                };
            },
            resetMenuForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'menuForm');
            }
        }
    }
</script>