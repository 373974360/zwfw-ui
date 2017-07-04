<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="角色名称"
                      v-model="listQuery.roleName">
            </el-input>

            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="200">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="200px" align="center" label="角色名称">
                <template scope="scope">
                    <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.roleName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="250px" align="center" label="角色类型">
                <template scope="scope">
                    <span>{{scope.row.roleType | enums('RoleType')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button class="filter-item" style="margin-left: 10px;" @click="handleMenuList(scope.row.id)"
                               type="primary"
                               size="small">
                        关联权限
                    </el-button>
                    <el-button class="filter-item" style="margin-left: 10px;" @click="handleUserList(scope.row.id)"
                               type="primary"
                               size="small">
                        关联用户
                    </el-button>
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
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialogFormVisible">
            <el-form ref="roleForm" class="small-space" :model="sysRole" label-position="left" label-width="80px"
                     style='width: 80%; margin-left:10%;'>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="sysRole.roleName"/>
                </el-form-item>
                <el-form-item label="角色类型" prop="enable">
                    <el-select v-model="sysRole.roleType" placeholder="请选择" style="width:100%">
                        <el-option
                                v-for="item in enums['RoleType']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>

        <!--关联权限-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="roleMenuDialogFormVisible">
            <el-form ref="roleMenuForm" class="small-space" :model="sysRole" label-position="left" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="roleMenuDialogLoading">
                <el-tree ref="menuTree" :data="menuTree" show-checkbox node-key="id" :default-expand-all="true"
                         @check-change="menuTreeChecked" :default-checked-keys="checkedMenu"></el-tree>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleMenuDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitRoleMenu">确 定</el-button>
            </div>
        </el-dialog>

        <!--关联用户-->
        <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="userRoleDialogFormVisible">
            <el-form ref="roleForm" class="small-space" :model="sysRole" label-position="left" label-width="100px"
                     style='width: 400px; margin-left:50px;'>
                <el-tree :data="regions" :props="defaultProps" @node-click="handleNodeClick" style="width: 546px;">
                </el-tree>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userRoleDialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='userList'" type="primary" @click="userList">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>-->
    </div>
</template>

<script>
    import {getRoleList, createRole, updateRole, createRoleMenus, getAllRoleMenus} from 'api/org/role';
    import {getMenuTree} from 'api/org/menu';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from 'utils/TreeUtil.js';
    import {getUserList} from 'api/org/user';


    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    roleName: '',
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows
                },
                sysRole: {
                    id: undefined,
                    roleName: '',
                    roleType: 0
                },
                dialogStatus: '',
                addDialogFormVisible: false,
                roleMenuDialogFormVisible: false,
                roleMenuDialogLoading: false,
                userRoleDialogFormVisible: false,
                userRoleDialogLoading: false,
                currentRoleId: 0,
                menuTree: [],
                checkedMenu: [],
                userTree: [],
                checkedUser: []
            }
        },
        created() {
            this.getList();
        },
        computed: {
            ...
                mapGetters([
                    'textMap',
                    'enums'
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
                this.resetTemp();
                this.sysRole = copyProperties(this.sysRole, row);
                this.dialogStatus = 'update';
                this.addDialogFormVisible = true;
            },
            handleDelete(row) {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
            },
            create() {
                this.$refs['roleForm'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        this.listLoading = true;
                        createRole(this.sysRole).then(response => {
                            this.list.push(response.data);
                            this.$message.success('创建成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['roleForm'].validate((valid) => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        updateRole(this.sysRole).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                            TreeUtil.editRow(response.data, this.list);
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.sysRole = {
                    id: undefined,
                    deptName: '',
                    roleName: '',
                    roleType: 1,
                    deptCode: 0,
                    deptId: '',
                    treePosition: '',
                    parentId: 0
                };
            },
            getMenuTree(){
                this.roleMenuDialogLoading = true;
                getMenuTree().then(response => {
                    this.menuTree = response.data;
                    this.roleMenuDialogLoading = false;
                    this.getAllRoleMenu();
                })
            },
            getAllRoleMenu(){
                this.checkedMenu = [];
                getAllRoleMenus(this.currentRoleId).then(response => {
                    const menus = response.data;
                    let checked = [];
                    for (const menu of menus) {
                        checked.push(menu.menuId);
                    }
                    this.$refs.menuTree.setCheckedKeys(checked);
                })
            },
            menuTreeChecked(data, checked, indeterminate){
                if (checked) {
                    this.checkedMenu.push(data.id);
                } else {
                    const index = this.checkedMenu.indexOf(data.id);
                    if (index >= 0) {
                        this.checkedMenu.splice(index, 1);
                    }
                }
            },
            handleMenuList(roleId) {
                this.currentRoleId = roleId;
                this.dialogStatus = 'roleMenu';
                this.roleMenuDialogFormVisible = true;
                this.getMenuTree();
            },
            submitRoleMenu(){
                this.roleMenuDialogLoading = true;
                createRoleMenus(this.currentRoleId, this.checkedMenu).then(response => {
                    this.roleMenuDialogLoading = false;
                    this.roleMenuDialogFormVisible = false;
                    this.$message.success('关联成功');
                })
            },
            handleUserList(roleId) {
                this.currentRoleId = roleId;
                this.dialogStatus = 'roleUser';
                this.userRoleDialogFormVisible = true;
            }
        }
    }
</script>
