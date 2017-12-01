<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 130px;" class="filter-item" placeholder="窗口名称"
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
            <el-table-column align="center" label="创建时间">
                <template scope="scope">
                    <span>{{scope.row.createTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="350">
                <template scope="scope">
                    <el-badge :value="scope.row.windowItemCount" class="item">
                        <el-button class="filter-item" @click="handleItemList(scope.row)"
                                   type="primary" size="small">
                            关联事项
                        </el-button>
                    </el-badge>
                    <el-badge :value="scope.row.windowUserCount" class="item">
                        <el-button class="filter-item" @click="handleUserList(scope.row)"
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
                   :close-on-click-modal="closeOnClickModal" :before-close="resetWindowForm">
            <el-form ref="windowForm" class="small-space" :model="window" label-position="left" label-width="130px"
                     style='width: 80%; margin-left:10%;' :rules="windowRules" v-loading="dialogLoading">
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
                <el-button icon="circle-cross" type="danger" @click="resetWindowForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="doCreate">确 定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="doUpdate" @click="doUpdate">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--事项关联dialog-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisibleItem"
                   :close-on-click-modal="closeOnClickModal" :before-close="closeZwfwItemForm">
            <div class="filter-container">
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleItemDelete" type="danger"
                           icon="delete">
                    删除
                </el-button>
            </div>
            <el-table ref="zwfwItemTable" :data="zwfwItemList" v-loading.body="dialogTableLoading" border fit
                      highlight-current-row
                      style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column align="center" label="序号">
                    <template scope="scope">
                        <span>{{scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项名称" prop="name">
                    <template scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="基本编码" prop="basicCode">
                    <template scope="scope">
                        <span>{{scope.row.basicCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项类型" prop="type">
                    <template scope="scope">
                        <span>{{scope.row.type }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办件类型" prop="processType">
                    <template scope="scope">
                        <el-tag :type="scope.row.processType | dics('bjlx')">
                            {{scope.row.processType | dics('bjlx')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办理形式" prop="handleType">
                    <template scope="scope">
                        <el-tag :type="scope.row.handleType | dics('blxs')">
                            {{scope.row.handleType | dics('blxs')}}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-form ref="zwfwItemForm" class="small-space" :model="zwfwItem"
                     label-position="right"
                     label-width="130px"
                     style='width: 80%; margin-left:10%; margin-top: 5%;' v-loading="dialogLoading"
                     :rules="windowItemRules">
                <el-form-item label="事项名称：" prop="name">
                    <el-select
                            v-model="zwfwItem.name"
                            filterable
                            remote
                            placeholder="请输入事项名称或基本编码"
                            :remote-method="remoteMethod"
                            @change="changeMaterial" style="width:100%">
                        <el-option
                                v-for="item in optionsName"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="窗口支持此事项：" class="checkbox-item">
                    <el-checkbox v-model="supportNormal">正常办理</el-checkbox>
                    <el-checkbox v-model="supportAssist">协助预审并办理</el-checkbox>
                    <el-checkbox v-model="supportEnquire">咨询</el-checkbox>
                </el-form-item>
            </el-form>
            <div style="text-align: center" slot="footer" class="dialog-footer">
                <el-button type="primary" icon="circle-check" @click="saveCategoryItem">保 存
                </el-button>
            </div>
        </el-dialog>

        <!--关联用户 :default-checked-keys="checkedUserList"-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="userWindowDialogFormVisible"
                   :close-on-click-modal="closeOnClickModal">
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
                <el-button icon="circle-cross" type="danger" @click="userWindowDialogFormVisible = false">取 消
                </el-button>
                <el-button type="primary" @click="submitUserWindow">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getWindowList,
        createWindow,
        updateWindow,
        createUserWindow,
        getAllUserWindow,
        delWindow,
        getAllItemWindow,
        createZwfwWindowItem,
        deleteZwfwWindowItem
    } from 'api/hallSystem/lobby/window';
    import {copyProperties, resetForm, validateQueryStr} from 'utils';
    import {mapGetters} from 'vuex';
    import {getDeptNameAndUsers} from 'api/baseSystem/org/user';
    import {getAllByNameOrbasicCode} from 'api/zwfwSystem/business/item';

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                dialogTableLoading: true,
                dialogLoading: false,
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
                windowItemRules: {
                    name: [
                        {required: true, message: '请输入事项名称或基本编码'}
                    ]
                },
                zwfwItem: {
                    id: undefined,
                    name: '',
                    basicCode: ''
                },
                supportNormal: true,
                supportAssist: true,
                supportEnquire: true,
                dialogStatus: '',
                checked: true,
                addDialogFormVisible: false,
                userWindowDialogFormVisible: false,
                userWindowDialogLoading: false,
                dialogFormVisibleItem: false,
                currentWindow: [],
                userTree: [],
                checkedUser: [],
                userList: [],
                checkedUsers: [],
                selectedRows: [],
                zwfwItemList: [],
                allItemList: [],
                optionsName: []
            }
        },
        created() {
            this.getList();
            this.getItemList();
            this.getDeptAndUsersList();
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
                getWindowList(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.list = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getItemList() {
                const query = {}
                getAllByNameOrbasicCode(query).then(response => {
                    if (response.httpCode === 200) {
                        this.allItemList = response.data;
                        this.zwfwItem.supportAssist = true;
                        this.zwfwItem.supportEnquire = true;
                        this.zwfwItem.supportNormal = true;
                    } else {
                        this.$message.error('事项信息加载失败')
                    }
                })
            },
            getDeptAndUsersList() {
                getDeptNameAndUsers(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.userList = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
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
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将删除关联信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doDelete();
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            doCreate() {
                this.$refs['windowForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        createWindow(this.window).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetWindowForm();
                                this.$message.success('创建成功');
                                this.getList();
                            } else {
                                this.$message.error('创建失败')
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['windowForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        updateWindow(this.window).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetWindowForm();
                                this.$message.success('更新成功');
                                this.getList();
                            } else {
                                this.$message.error('更新失败')
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doDelete() {
                this.listLoading = true;
                let ids = [];
                for (const deleteRow of this.selectedRows) {
                    ids.push(deleteRow.id);
                }
                delWindow(ids.join()).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('删除成功');
                        this.getList();
                    } else {
                        this.$message.error('删除失败')
                    }
                    this.listLoading = false;
                })
            },
            handleItemList(row) {
                this.currentItem = row;
                this.dialogStatus = 'associateItem';
                this.dialogFormVisibleItem = true;
                this.windowId = row.id;
                this.getWindowItemList();
            },
            getWindowItemList() {
                this.dialogTableLoading = true;
                getAllItemWindow(this.windowId).then(response => {
                    if (response.httpCode === 200) {
                        const arr = [];
                        for (const ids of response.data) {
                            for (const idList of this.allItemList) {
                                if (ids.itemId === idList.id) {
                                    arr.push(idList);
                                }
                            }
                        }
                        this.zwfwItemList = arr;
                        this.currentItem.windowItemCount = arr.length;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                    this.dialogTableLoading = false;
                })
            },
            remoteMethod(query) {
                const listQueryName = {
                    name: undefined,
                    basicCode: undefined
                }
                if (query !== '') {
                    let valid = validateQueryStr(query);
                    if (valid) {
                        this.$message.error(`输入中包含非法字符 ${valid}`)
                        return
                    }
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(query)) {
                        listQueryName.name = query;
                    } else {
                        listQueryName.basicCode = query
                    }
                    getAllByNameOrbasicCode(listQueryName).then(response => {
                        if (response.httpCode === 200) {
                            this.optionsName = response.data;
                        } else {
                            this.$message.error('数据加载失败')
                        }
                    })
                } else {
                    this.optionsName = [];
                }
            },
            changeMaterial(value) {
                for (const obj of this.optionsName) {
                    if (obj.id === value) {
                        this.zwfwItem = Object.assign({}, obj);
                    }
                }
            },
            saveCategoryItem() {
                this.$refs['zwfwItemForm'].validate(valid => {
                    if (valid) {
                        for (let obj of this.zwfwItemList) {
                            if (obj.id === this.zwfwItem.id) {
                                this.$message.warning('事项已存在');
                                this.resetZwfwItemForm();
                                return false;
                            }
                        }
                        const query = {
                            windowId: this.windowId,
                            itemId: this.zwfwItem.id,
                            supportNormal: this.supportNormal,
                            supportAssist: this.supportAssist,
                            supportEnquire: this.supportEnquire
                        }
                        this.dialogLoading = true;
                        createZwfwWindowItem(query).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetZwfwItemForm();
                                this.$message.success('创建成功');
                                this.getWindowItemList();
                            } else {
                                this.$message.error('创建失败')
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleItemDelete() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doItemDelete();
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            doItemDelete() {
                this.dialogTableLoading = true;
                let ids = [];
                for (const deleteRow of this.selectedRows) {
                    ids.push(deleteRow.id);
                }
                deleteZwfwWindowItem(this.windowId, ids.join()).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('删除成功');
                        this.getWindowItemList();
                    } else {
                        this.$message.error('删除失败')
                    }
                    this.dialogTableLoading = false;
                })
            },
            handleUserList(data) {
                this.currentWindow = data;
                this.dialogStatus = 'associateUser';
                this.userWindowDialogFormVisible = true;
                this.getWindowUserList();
            },
            getWindowUserList() {
                this.userWindowDialogLoading = true;
                this.checkedUsers = [];
                getAllUserWindow(this.currentWindow.id).then(response => {
                    if (response.httpCode === 200) {
                        if (response.data) {
                            for (const item of response.data) {
                                this.checkedUsers.push(item.userId);
                            }
                        }
                    } else {
                        this.$message.error('数据加载失败')
                    }
                    this.userWindowDialogLoading = false;
                })
            },
            handleCheckedUsersChange(value) {
                this.checkedUsers = value;
            },
            submitUserWindow() {
                this.userWindowDialogLoading = true;
                createUserWindow(this.currentWindow.id, this.checkedUsers.join()).then(response => {
                    this.userWindowDialogLoading = false;
                    if (response.httpCode === 200) {
                        this.userWindowDialogFormVisible = false;
                        this.$message.success('关联成功');
                        this.currentWindow.windowUserCount = this.checkedUsers.length;
                    } else {
                        this.$message.error('关联失败')
                    }
                })
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
            resetItemTemp() {
                this.zwfwItem = {
                    id: undefined,
                    name: '',
                    basicCode: ''
                };
            },
            resetWindowForm() {
                this.addDialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'windowForm');
            },
            closeZwfwItemForm() {
                this.dialogFormVisibleItem = false;
                this.resetZwfwItemForm();
            },
            resetZwfwItemForm() {
                this.resetItemTemp();
                resetForm(this, 'zwfwItemForm');
            },
            handleSelectionChange(row) {
                this.selectedRows = row;
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            }
        }
    }
</script>
<style>
    .item {
        margin-top: 10px;
        margin-right: 40px;
    }
    .el-checkbox__label {
        font-weight: normal;
    }
</style>
