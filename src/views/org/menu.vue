<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="itemList" :list-loading="listLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete"></tree-grid>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="menuForm" class="small-space" :model="sysMenu" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="sysMenuRules">

                <el-form-item label="上级菜单">
                    <el-cascader :options="cascader" v-model="cascaderModel" :show-all-levels="true"
                                 :change-on-select="true" style="width:100%" :disabled="false"></el-cascader>
                </el-form-item>
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="sysMenu.menuName"/>
                </el-form-item>
                <el-form-item label="菜单类型">
                    <el-select v-model="sysMenu.menuType" placeholder="请选择" style="width:100%">
                        <el-option
                                v-for="item in enums['MenuType']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单图标">
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
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="sysMenu.remark" :rows="3"/>
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
    /* eslint-disable no-unused-vars,object-shorthand */

    import TreeGrid from 'components/TreeGrid'
    import {getMenuTree, getMenuCascader, createMenu, updateMenu, delMenu} from 'api/org/menu';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from 'utils/TreeUtil.js';

    export default {
        name: 'menu_table',
        data () {
            return {
                itemList: [],
                listLoading: true,
                currentRow: [],
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'id'
                    },
                    {
                        text: '菜单名称',
                        dataIndex: 'menuName',
                        editAble: true
                    },
                    {
                        text: '菜单类型',
                        dataIndex: 'menuType',
                        enums: 'MenuType'
                    },
                    {
                        text: '请求地址',
                        dataIndex: 'request'
                    }
                    ,
                    {
                        text: '权限标识',
                        dataIndex: 'permission'
                    }
                ],
                sysMenu: {
                    id: undefined,
                    parentId: 0,
                    menuName: '',
                    menuType: 1,
                    iconcls: '',
                    treePosition: '',
                    request: '',
                    sortNo: 1,
                    permission: ''
                },
                sysMenuRules: {
                    menuName: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'}
                    ],
                    request: [
                        {required: true, message: '请输入请求地址', trigger: 'blur'}
                    ],
                    permission: [
                        {required: true, message: '请输入权限标识', trigger: 'blur'}
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
                if (this.sysMenu.treePosition) {
                    var arr = this.sysMenu.treePosition.split('&');
                    if (this.dialogStatus === 'update') {
                        return arr.splice(0, arr.length - 2);
                    } else {
                        return arr.splice(0, arr.length - 1);
                    }
                }
            },
            parentId: function () {
                if (this.cascaderModel) {
                    return this.cascaderModel[this.cascaderModel.length - 1];
                } else {
                    return 0;
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
        methods: {
            getList() {
                this.listLoading = true;
                getMenuTree().then(response => {
                    this.itemList = response.data;
                    this.listLoading = false;
                })
            },
            getOptions(id){
                this.dialogLoading = true;
                getMenuCascader(id).then(response => {
                    this.cascader = response.data;
                    this.dialogLoading = false;
                })
            },
            handleToggle(row){
                row._expanded = !row._expanded;
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.sysMenu.treePosition = row.treePosition;
                this.getOptions(null);
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.sysMenu = copyProperties(this.sysMenu, row);
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
                        TreeUtil.delRow(row, this.itemList);
                        this.$message.success('删除成功');
                    })
                }).catch(() => {
                    console.dir("取消");
                });
            },
            create() {
                this.$refs['menuForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        this.sysMenu.parentId = this.parentId;
                        createMenu(this.sysMenu).then(response => {
                            TreeUtil.addRow(this.currentRow, response.data, this.itemList);
                            this.$message.success('创建成功');
                            this.listLoading = false;
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
                        this.listLoading = true;
                        updateMenu(this.sysMenu).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.sysMenu = {
                    id: undefined,
                    menuName: '',
                    menuType: 1,
                    iconcls: '',
                    parentId: 0,
                    treePosition: '',
                    request: '',
                    sortNo: 1,
                    permission: ''
                };
            }
        },
        created() {
            this.getList();
        }
    }
</script>