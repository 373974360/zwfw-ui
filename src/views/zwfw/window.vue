<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="窗口名称"
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
            <el-table-column min-width="50px" align="center" label="窗口">
                <template scope="scope">
                    <el-tooltip content="点击编辑" placement="right" effect="dark">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" >
            <template scope="scope">
                <span>{{scope.row.createTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
        </el-table-column>
            <el-table-column align="center" label="操作" width="350">
                <template scope="scope">
                    <!--<el-badge :value="scope.row.itemWindowCount" class="item">-->
                        <!--<el-button class="filter-item" style="margin-left: 10px;" @click="handleMenuList(scope.row)"-->
                                   <!--type="primary" size="small">-->
                            <!--关联事项-->
                        <!--</el-button>-->
                    <!--</el-badge>-->
                    <el-badge :value="scope.row.windowUserCount" class="item">
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
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialogFormVisible">
            <el-form ref="windowForm" class="small-space" :model="window" label-position="left" label-width="130px"
                     style='width: 80%; margin-left:10%;' :rules="windowRules">
                <el-form-item label="窗口名称" prop="name">
                    <el-input v-model="window.name"/>
                </el-form-item>
                <el-form-item label="叫号设备key" prop="callerKey">
                    <el-input v-model="window.callerKey"/>
                </el-form-item>
                <el-form-item label="评价设备key" prop="judgeKey">
                    <el-input v-model="window.judgeKey"/>
                </el-form-item>
                <el-form-item label="高拍仪设备key" prop="cameraKey">
                    <el-input v-model="window.cameraKey"/>
                </el-form-item>
                <el-form-item label="LED显示设备key" prop="ledKey">
                    <el-input v-model="window.ledKey"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="addDialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--关联权限-->
        <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="roleMenuDialogFormVisible">-->
            <!--<el-form ref="roleMenuForm" class="small-space" :model="window" label-position="left" label-width="80px"-->
                     <!--style='width: 80%; margin-left:10%;' v-loading="roleMenuDialogLoading">-->
                <!--<el-tree ref="menuTree" :data="menuTree" show-checkbox node-key="id" :default-expand-all="true"-->
                         <!--@check-change="menuTreeChecked" :default-checked-keys="checkedMenu"></el-tree>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button icon="circle-cross" type="danger" @click="roleMenuDialogFormVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="submitWindowMenu">确 定</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->

        <!--关联用户 :default-checked-keys="checkedUserList"-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="userWindowDialogFormVisible">
            <el-form id="checkboxTable" ref="userForm" class="small-space" :model="window"
                     label-position="left" label-width="25px"
                     style='width: 100%;' v-loading="userWindowDialogLoading">
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
                        <el-checkbox v-for="user in users" :key="user.id" :label="user.id"
                                     style="top: -29px;margin-left: 15px;">
                            {{user.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="userWindowDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUserWindow">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getWindowList, createWindow, updateWindow, createUserWindow, getAllUserWindow, delWindow} from 'api/zwfw/window';
    import {copyProperties} from 'utils';
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
                window: {
                    id: undefined,
                    name: '',
                    callerKey: '',
                    judgeKey: '',
                    cameraKey: '',
                    ledKey: ''
                },
                windowRules: {
                    name: [
                        {required: true, message: '请输入窗口名称', trigger: 'blur'}
                    ],
                    callerKey: [
                        {required: true, message: '请输入叫号设备key', trigger: 'blur'}
                    ],
                    judgeKey: [
                        {required: true, message: '请输入评价设备key', trigger: 'blur'}
                    ],
                    cameraKey: [
                        {required: true, message: '请输入高拍仪设备key', trigger: 'blur'}
                    ],
                    ledKey: [
                        {required: true, message: '请输入LED显示设备key', trigger: 'blur'}
                    ]
                },
                dialogStatus: '',
                checked: true,
                addDialogFormVisible: false,
                userWindowDialogFormVisible: false,
                userWindowDialogLoading: false,
                currentWindow: [],
                userTree: [],
                checkedUser: [],
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
                'enums'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                getWindowList(this.listQuery).then(response => {
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
            resetForm(windowForm) {
                this.$refs[windowForm].resetFields();
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.addDialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.window = copyProperties(this.window, row);
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
                        delWindow(ids).then(response => {
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
                this.$refs['windowForm'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        this.listLoading = true;
                        createWindow(this.window).then(response => {
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
                this.$refs['windowForm'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        updateWindow(this.window).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.window = {
                    id: undefined,
                    name: '',
                    callerKey: '',
                    judgeKey: '',
                    cameraKey: '',
                    ledKey: ''
                };
            },
            handleUserList(data) {
                this.currentWindow = data;
                this.dialogStatus = 'associateUser';
                this.userWindowDialogFormVisible = true;
                this.getDeptAndUsersList();
            },
            getDeptAndUsersList() {
                this.userWindowDialogLoading = true;
                getDeptNameAndUsers(this.listQuery).then(response => {
                    this.userList = response.data;
                    this.userWindowDialogLoading = false;
                    this.getAllUserWindows();
                })
            },
            getAllUserWindows() {
                this.checkedUsers = [];
                getAllUserWindow(this.currentWindow.id).then(response => {
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
            submitUserWindow() {
                this.userWindowDialogLoading = true;
                createUserWindow(this.currentWindow.id, this.checkedUsers).then(response => {
                    this.userWindowDialogLoading = false;
                    this.userWindowDialogFormVisible = false;
                    this.$message.success('关联成功');
                    this.currentWindow.windowUserCount = this.checkedUsers.length;
                })
            }
        }
    }
</script>
<style>
    .item {
        margin-top: 10px;
        margin-right: 40px;
    }
</style>