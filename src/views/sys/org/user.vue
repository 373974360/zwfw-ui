<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="姓名"
                      v-model="listQuery.name"></el-input>
            <el-cascader :options="cascader" class="filter-item" @change="handleChange"
                         :show-all-levels="true" clearable filterable expand-trigger="hover"
                         :change-on-select="true" style="width: 180px" placeholder="选择部门">
            </el-cascader>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>

        <el-table ref="userTable" :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="姓名">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="sysDeptVo.name" align="center" label="部门">
                <template scope="scope">
                    <span v-if="scope.row.sysDeptVo.name">{{scope.row.sysDeptVo.name}}</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column prop="sex" align="center" label="性别">
                <template scope="scope">
                    <span>{{scope.row.sex | enums('Gender')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电话">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="帐号">
                <template scope="scope">
                    <span>{{scope.row.account}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
                    <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
                        {{scope.row.enable | enums('Enable')}}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form id="checkboxTable" ref="userForm1" class="small-space" :model="sysUser" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="sysUserRules1">
                <el-form-item label="部门" prop="deptId">
                    <el-cascader :options="cascader" class="filter-item" @change="handleChanges" v-model="updateModel"
                                 :show-all-levels="true"
                                 :change-on-select="true" expand-trigger="hover" :clearable="true" style="width: 180px"
                                 placeholder="选择部门"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="sysUser.name"/>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="sysUser.sex">
                        <el-radio v-for="item in enums['Gender']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="sysUser.phone"/>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <el-input v-model="sysUser.avatar"/>
                </el-form-item>
                <el-form-item label="帐号" prop="account">
                    <el-input v-model="sysUser.account"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="sysUser.password" type="password"/>
                </el-form-item>
                <el-form-item label="确认密码" prop="passwordConfirm">
                    <el-input v-model="sysUser.passwordConfirm" type="password"/>
                </el-form-item>
                <el-form-item label="状态" prop="enable">
                    <el-radio-group v-model="sysUser.enable">
                        <el-radio v-for="item in enums['Enable']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="sysUser.remark" :rows="3"/>
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
    import {getDeptCascader} from 'api/sys/org/dept';
    import {getUserList, updateUser, createUser, delUser} from 'api/sys/org/user';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import {delWindowUser} from 'api/sys/operate/window';
    import ElRadio from "../../../../node_modules/element-ui/packages/radio/src/radio";

    export default {
        components: {ElRadio},
        name: 'table_demo',
        data() {
            const validatMobiles = (rule, value, callback) => {
                if (!/^((13|15|18|14|17)+\d{9})$/.test(value)) {
                    return callback(new Error('电话号码格式不正确'));
                } else {
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.sysUser.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                    deptId: undefined
                },
                sysUser: {
                    id: '',
                    deptId: '',
                    name: '',
                    sysDeptVo: {},
                    sex: 1,
                    phone: '',
                    avatar: '',
                    account: '',
                    password: '',
                    passwordConfirm: '',
                    enable: 1,
                    remark: ''
                },
                sysUserRules1: {
                    deptId: [
                        {required: false, message: '请选择部门'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别'}
                    ],
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, validator: validatMobiles}
                    ],
                    avatar: [
                        {type: 'url', required: true, message: '头像地址不正确', trigger: 'blur'}
                    ],
                    account: [
                        {type: 'email', required: true, message: '请输入合法的邮箱'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
                    ],
                    passwordConfirm: [
                        {required: true, validator: validatePass2}
                    ]
                },
                selectedRows: [],
                cascader: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums'
            ]),
            updateModel: function () {
                let result = [];
                if (this.sysUser.sysDeptVo.treePosition) {
                    result = (this.sysUser.sysDeptVo.treePosition + '&' + this.sysUser.sysDeptVo.id).split('&');
                } else {
                    result = [this.sysUser.sysDeptVo.id + ''];
                }
                return result;
            }
        },
        created() {
            this.getList();
            this.getOptions();
        },
        methods: {
            getOptions(id) {
                getDeptCascader(id).then(response => {
                    this.cascader = response.data;
                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.deptId = null;
                this.listQuery.name = null;
                console.dir(this.listQuery.page);
                this.getList();
            },
            handleChange(value) {
                this.listQuery.deptId = null;
                if (value.length > 0) {
                    this.listQuery.deptId = value[value.length - 1];
                } else {
                    this.sysUser.deptId = 0;
                    this.getList();
                }
            },
            handleChanges(value) {
                if (value.length > 0) {
                    this.sysUser.deptId = value[value.length - 1];
                } else {
                    this.sysUser.deptId = 0;
                    this.getList();
                }
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.userTable.toggleRowSelection(row);
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.sysUser.deptId = row.id;
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.sysUser = copyProperties(this.sysUser, row);
                this.sysUser.password = '';
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            getList() {
                this.listLoading = true;
                getUserList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleDelete() {
                this.listLoading = true;
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delUser(ids).then(response => {
                            delWindowUser(ids).then(response => {
                                this.listLoading = false;
                                this.total -= selectCounts;
                                this.$message.success('删除成功');
                                this.getList();
                            })
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
                this.$refs['userForm1'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        console.log(this.sysUser);
                        createUser(this.sysUser).then(response => {
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
                this.$refs['userForm1'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        this.sysUser.sysDeptVo = {};
                        updateUser(this.sysUser).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            resetTemp() {
                this.sysUser = {
                    id: '',
                    deptId: '',
                    name: '',
                    sysDeptVo: {},
                    sex: 1,
                    phone: '',
                    avatar: '',
                    account: '',
                    password: '',
                    passwordConfirm: '',
                    enable: 1,
                    remark: ''
                };
            },
            handleDownload() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('vendor/Export2Excel');
                    const tHeader = ['时间', '地区', '类型', '标题', '重要性'];
                    const filterVal = ['timestamp', 'province', 'type', 'title', 'importance'];
                    const data = this.formatJson(filterVal, this.list);
                    export_json_to_excel(tHeader, data, 'table数据');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            }
        }
    }
</script>
