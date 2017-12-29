<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 300px;" class="filter-item" placeholder="电子邮箱/手机号码" v-model="listQuery.email"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="delete">
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
            <el-table-column align="center" label="会员类型" prop="type">
                <template scope="scope">
                    <span v-if="scope.row.type==1">个人</span>
                    <span v-else-if="scope.row.type==2">企业</span>
                    <span v-else>未知</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电子邮箱" prop="email">
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
            <el-table-column align="center" label="注册时间" prop="registerdate">
                <template scope="scope">
                    <span>{{scope.row.registerdate}}</span>
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
                        <el-radio :label="1">企业</el-radio>
                        <el-radio :label="2">个人</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="jobMember.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="jobMember.phone"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                    <el-input v-model="jobMember.password"></el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="passwords">
                    <el-input v-model="jobMember.passwords"></el-input>
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
    import {getMemberList, createJobMember, updateJobMember} from 'api/jobSystem/member/memberAccount';

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
            const validatePass2 = (rule, value, callback) => {
                if (this.jobMember.password && this.jobMember.passwords
                    && this.jobMember.password != this.jobMember.passwords) {
                    callback(new Error('两次输入密码不一致'))
                }
                callback()
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
                    email: '',
                    phone: '',
                    password: '',
                    passwords: ''
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                jobMemberRules: {
                    email: [
                        {required: true, message: '请输入电子邮箱'},
                        {validator: validateEmail, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码'},
                        {validator: validateMobiles, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'}
                    ],
                    passwords: [
                        {required: true, message: '请输入重复输入密码'},
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                }
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
        },
        methods: {
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
            resetTemp() {
                this.jobMember = {
                    id: undefined,
                    type: 1,
                    email: '',
                    phone: '',
                    password: '',
                    passwords: ''
                };
            }
        }
    }
</script>