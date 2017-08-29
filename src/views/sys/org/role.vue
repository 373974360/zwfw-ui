<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="角色名称"
                      v-model="listQuery.name" no-match-text="没有找到哦">
            </el-input>

            <el-button style="margin-left: 10px;" class="filter-item" type="primary" v-waves icon="search"
                       @click="getList">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="200">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="200px" align="center" label="角色名称">
                <template scope="scope">
                    <el-tooltip content="点击编辑" placement="right" effect="dark">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column width="250px" align="center" label="角色类型">
                <template scope="scope">
                    <span>{{scope.row.type | enums('RoleType')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-badge :value="scope.row.roleMenuCount" class="item">
                        <el-button class="filter-item" style="margin-left: 10px;" @click="handleMenuList(scope.row)"
                                   type="primary" size="small">
                            关联权限
                        </el-button>
                    </el-badge>
                    <el-badge :value="scope.row.userRoleCount" class="item">
                        <el-button class="filter-item" style="margin-left: 10px;" @click="handleUserList(scope.row)"
                                   type="primary" size="small">
                            关联用户
                        </el-button>
                    </el-badge>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <!--添加编辑-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetRoleForm">
            <el-form ref="roleForm" class="small-space" :model="sysRole" label-position="left" label-width="80px"
                     style='width: 80%; margin-left:10%;' :rules="roleRules">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="sysRole.name"/>
                </el-form-item>
                <el-form-item label="角色类型" prop="enable">
                    <el-radio-group v-model="sysRole.type">
                        <el-radio  v-for="item in enums['RoleType']"
                                   :key="item.code"
                                   :label="item.code"
                                   :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetRoleForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--关联权限-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="roleMenuDialogFormVisible" :close-on-click-modal="closeOnClickModal">
            <el-form ref="roleMenuForm" class="small-space" :model="sysRole" label-position="left" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="roleMenuDialogLoading">
                <el-tree ref="menuTree" :data="menuTree" show-checkbox node-key="id" :default-expand-all="true"
                         @check-change="menuTreeChecked" :default-checked-keys="checkedMenu"></el-tree>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="roleMenuDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitRoleMenu">确 定</el-button>
            </div>
        </el-dialog>

        <!--关联用户 :default-checked-keys="checkedUserList"-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="userRoleDialogFormVisible"
                   :close-on-click-modal="closeOnClickModal">
            <el-form id="checkboxTable" ref="userForm" class="small-space" :model="sysRole"
                     label-position="left" label-width="25px"
                     style='width: 100%;' v-loading="userRoleDialogLoading">
                <el-form-item :data="name" v-for="(users,name) in userList" :key="name">
                    <el-checkbox-group v-model="checkedUsers" @change="handleCheckedUsersChange"
                                       style="margin-bottom: -39px;">
                        <el-row>
                            <el-col :span="12">
                                <div class="grid-content bg-purple-light" style="width:191%;">
                                    <h4 style="margin-left: 16px;margin-top: 0px;">{{name}}：</h4>
                                </div>
                            </el-col>
                        </el-row>
                        <el-checkbox v-for="user in users" :key="user.id" :label="user.id" style="top: -29px;margin-left: 15px;">
                            {{user.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="userRoleDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUserRole">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getRoleList, createRole, updateRole, createRoleMenus, createUserRole, getAllRoleMenus, getAllUserRole, delRole} from 'api/sys/org/role';
    import {getMenuTree} from 'api/sys/org/menu';
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {getDeptNameAndUsers} from 'api/sys/org/user';

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    name: '',
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows
                },
                sysRole: {
                    id: undefined,
                    name: '',
                    type: 0,
                    userId: ''
                },
                roleRules: {
                    name: [
                        {required: true, message: '请输入角色名称'}
                    ]
                },
                dialogStatus: '',
                checked: true,
                addDialogFormVisible: false,
                roleMenuDialogFormVisible: false,
                roleMenuDialogLoading: false,
                userRoleDialogFormVisible: false,
                userRoleDialogLoading: false,
                currentRole: [],
                menuTree: [],
                checkedMenu: [],
                userTree: [],
                checkedUser: [],
                deptList: [],
                userList: [],
                checkedUsers: [],
                selectedRows: []
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
                getRoleList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleSelectionChange(row) {
                this.selectedRows = row;
                console.log(this.selectedRows);
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.addDialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.sysRole = copyProperties(this.sysRole, row);
                this.dialogStatus = 'update';
                this.addDialogFormVisible = true;
            },
            handleDelete() {
                const selectCounts = this.selectedRows.length;
                if (this.selectedRows.length == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将删除关联信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delRole(ids).then(response => {
                            this.listLoading = false;
                            this.total -= selectCounts;
                            this.$message.success('删除成功');
                        })
                        for (const deleteRow of this.selectedRows) {
                            const index = this.list.indexOf(deleteRow);
                            this.list.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            create() {
                this.$refs['roleForm'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        this.listLoading = true;
                        createRole(this.sysRole).then(response => {
                            this.list.unshift(response.data);
                            this.total += 1;
                            this.$message.success('创建成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['roleForm'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        updateRole(this.sysRole).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.sysRole = {
                    id: undefined,
                    name: '',
                    type: 1,
                    deptCode: 0,
                    deptId: '',
                    treePosition: '',
                    parentId: 0
                };
            },
            getMenuTree() {
                this.roleMenuDialogLoading = true;
                getMenuTree().then(response => {
                    this.menuTree = response.data;
                    this.roleMenuDialogLoading = false;
                    this.getAllRoleMenu();
                })
            },
            getAllRoleMenu() {
                this.checkedMenu = [];
                getAllRoleMenus(this.currentRole.id).then(response => {
                    const menus = response.data;
                    let checked = [];
                    for (const menu of menus) {
                        checked.push(menu.menuId);
                    }
                    console.log(checked);
                    this.$refs.menuTree.setCheckedKeys(checked);
                })
            },
            menuTreeChecked(data, checked) {
                if (checked) {
                    this.checkedMenu.push(data.id);
                } else {
                    const index = this.checkedMenu.indexOf(data.id);
                    if (index >= 0) {
                        this.checkedMenu.splice(index, 1);
                    }
                }
            },
            handleMenuList(role) {
                this.currentRole = role;
                this.dialogStatus = 'associateMenu';
                this.roleMenuDialogFormVisible = true;
                this.getMenuTree();
            },
            submitRoleMenu() {
                this.roleMenuDialogLoading = true;
                createRoleMenus(this.currentRole.id, this.checkedMenu).then(response => {
                    this.roleMenuDialogLoading = false;
                    this.roleMenuDialogFormVisible = false;
                    this.$message.success('关联成功');
                    this.currentRole.roleMenuCount = this.checkedMenu.length;
                })
            },
            handleUserList(role) {
                this.currentRole = role;
                this.dialogStatus = 'associateUser';
                this.userRoleDialogFormVisible = true;
                this.getDeptAndUsersList();
            },
            getDeptAndUsersList() {
                this.userRoleDialogLoading = true;
                getDeptNameAndUsers(this.listQuery).then(response => {
                    this.userList = response.data;
                    this.userRoleDialogLoading = false;
                    this.getAllUserRoles();
                })
            },
            getAllUserRoles() {
                this.checkedUsers = [];
                getAllUserRole(this.currentRole.id).then(response => {
                    if (response.data) {
                        for (const item of response.data) {
                            this.checkedUsers.push(item.userId);
                        }
                    }
                })
            },
            handleCheckedUsersChange(value) {
                this.checkedUsers = value;
            },
            submitUserRole() {
                this.userRoleDialogLoading = true;
                createUserRole(this.currentRole.id, this.checkedUsers).then(response => {
                    this.userRoleDialogLoading = false;
                    this.userRoleDialogFormVisible = false;
                    this.$message.success('关联成功');
                    this.currentRole.userRoleCount = this.checkedUsers.length;
                })
            },
            resetRoleForm() {
                this.addDialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'roleForm');
            }
        }
    }
</script>
<style scoped>
    .item {
        margin-top: 10px;
        margin-right: 40px;
    }
</style>