<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 300px;" class="filter-item" placeholder="电子邮箱/手机号码" v-model="listQuery.email"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleResetPass" type="primary" icon="edit">
                初始化密码
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleResetLock" type="primary" icon="share">
                禁用
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleResetNotLock" icon="share">
                启用
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>
        <el-table ref="jobMemberTable" :data="jobMemberList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="165">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="电子邮箱" prop="email">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.email}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="手机号码" prop="phone">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="会员类型" prop="type">
                <template scope="scope">
                    {{scope.row.type | enums('MemberType')}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="会员级别" prop="levelsName">
                <template scope="scope">
                    <span>{{scope.row.levelsName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册时间" prop="registerdate">
                <template scope="scope">
                    <span>{{scope.row.registerdate}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="账号状态" prop="islock">
                <template scope="scope">
                    <el-tag :type="scope.row.islock | enums('MemberLock') | statusFilter">
                        {{scope.row.islock | enums('MemberLock')}}
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
            <el-form ref="jobMemberForm" class="small-space" :model="jobMember" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading":rules="jobMemberRules">
                <el-form-item label="会员类型" prop="type">
                    <el-radio-group v-model="jobMember.type">
                        <el-radio v-for="item in enums['MemberType']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="会员级别" prop="levels">
                    <el-select v-model="jobMember.levels" placeholder="请选择会员级别">
                        <el-option
                                v-for="item in levelsOpteions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="jobMember.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="jobMember.phone"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定</el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {copyProperties} from 'utils';
    import {validatMobiles, isWscnEmail} from 'utils/validate';
    import {mapGetters} from 'vuex';
    import {getMemberList, createJobMember, updateJobMember, delJobMember, resetPassJobMember, resetLockJobMember} from 'api/jobSystem/member/memberAccount';
    import {getAllJobMemberLevel} from 'api/jobSystem/member/memberLevel';

    export default {
        name: 'jobMember_table',
        data() {
            const validateMobiles = (rule, value, callback) => {
                if (!validatMobiles(value)) {
                    callback(new Error('手机号码格式不正确'));
                } else {
                    callback();
                }
            };
            const validateEmail = (rule, value, callback) => {
                if (!isWscnEmail(value)) {
                    callback(new Error('电子邮箱格式不正确'));
                } else {
                    callback();
                }
            };
            return {
                jobMemberList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    email: ''
                },
                jobMember: {
                    id: undefined,
                    type: 1,
                    levels: '',
                    email: '',
                    phone: ''
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                jobMemberRules: {
                    levels: [
                        {required: true, message: '请选择会员级别', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入电子邮箱'},
                        {validator: validateEmail, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码'},
                        {validator: validateMobiles, trigger: 'blur'}
                    ]
                },
                levelsOpteions: null
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums'
            ])
        },
        created() {
            this.getList();
            this.getLevelsOpteions();
        },
        methods: {
            getLevelsOpteions() {
                getAllJobMemberLevel().then(response => {
                    this.levelsOpteions = response.data;
                })
            },
            getList() {
                this.listLoading = true;
                getMemberList(this.listQuery).then(response => {
                    this.jobMemberList = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.name = null;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.jobMemberTable.toggleRowSelection(row);
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.jobMember = copyProperties(this.jobMember, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            create() {
                this.$refs['jobMemberForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createJobMember(this.jobMember).then(response => {
                            if (response.httpCode == 200) {
                                this.jobMemberList.unshift(response.data);
                                this.total += 1;
                                this.$message.success('创建成功');
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
                this.$refs['jobMemberForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateJobMember(this.jobMember).then(response => {
                            if (response.httpCode == 200) {
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
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
            handleDelete() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = [];
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delJobMember(ids).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('删除成功！');
                                this.getList();
                            } else {
                                this.$message.error('删除失败！');
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handleResetPass() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将重置登陆密码为123456, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = [];
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        resetPassJobMember(ids).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('重置成功！');
                                this.getList();
                            } else {
                                this.$message.error('重置失败！');
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handleResetLock() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将禁止选中会员登陆, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = [];
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        resetLockJobMember({"ids": ids, "islock": 2}).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('禁用成功！');
                                this.getList();
                            } else {
                                this.$message.error('禁用失败！');
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handleResetNotLock() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将启用选中的会员登陆, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = [];
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        resetLockJobMember({"ids": ids, "islock": 1}).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('禁用成功！');
                                this.getList();
                            } else {
                                this.$message.error('禁用失败！');
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            resetTemp() {
                this.jobMember = {
                    id: undefined,
                    type: 1,
                    email: '',
                    phone: '',
                    levels: ''
                };
            }
        }
    }
</script>