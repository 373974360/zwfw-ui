<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.name"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>

        <el-table ref="zwfwMemberTable" :data="zwfwMemberList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
                            <el-table-column align="center" label="QQ号码" prop="qq">
                    <template scope="scope">
                                                    <span>{{scope.row.qq}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="联系地址" prop="address">
                    <template scope="scope">
                                                    <span>{{scope.row.address}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="性别" prop="gender">
                    <template scope="scope">
                                                    <span>{{scope.row.gender}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="注册时间" prop="registerTime">
                    <template scope="scope">
                                                    <span>{{scope.row.registerTime}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="微信号" prop="wechat">
                    <template scope="scope">
                                                    <span>{{scope.row.wechat}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="备注" prop="remark">
                    <template scope="scope">
                                                    <span>{{scope.row.remark}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="用户类型,1=个人用户,2=企业用户" prop="type">
                    <template scope="scope">
                                                    <span>{{scope.row.type}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="关联企业" prop="companyId">
                    <template scope="scope">
                                                    <span>{{scope.row.companyId}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="密码" prop="password">
                    <template scope="scope">
                                                    <span>{{scope.row.password}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="密码加密类型" prop="encrptionType">
                    <template scope="scope">
                                                    <span>{{scope.row.encrptionType}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="手机号码" prop="mobilephone">
                    <template scope="scope">
                                                    <span>{{scope.row.mobilephone}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="用户名" prop="loginName">
                    <template scope="scope">
                                                    <span>{{scope.row.loginName}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="姓名" prop="name">
                    <template scope="scope">
                                                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                                <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                            </el-tooltip>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="固定电话" prop="tellphone">
                    <template scope="scope">
                                                    <span>{{scope.row.tellphone}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="密码盐" prop="passwordSalt">
                    <template scope="scope">
                                                    <span>{{scope.row.passwordSalt}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="电子邮箱" prop="email">
                    <template scope="scope">
                                                    <span>{{scope.row.email}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="帐号可用状态" prop="status">
                    <template scope="scope">
                                                    <span>{{scope.row.status}}</span>
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
            <el-form ref="zwfwMemberForm" class="small-space" :model="zwfwMember" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwMemberRules">
                                    <el-form-item label="QQ号码" prop="qq">
                        <el-input v-model="zwfwMember.qq"></el-input>
                    </el-form-item>
                                    <el-form-item label="联系地址" prop="address">
                        <el-input v-model="zwfwMember.address"></el-input>
                    </el-form-item>
                                    <el-form-item label="性别" prop="gender">
                        <el-input v-model="zwfwMember.gender"></el-input>
                    </el-form-item>
                                    <el-form-item label="注册时间" prop="registerTime">
                        <el-input v-model="zwfwMember.registerTime"></el-input>
                    </el-form-item>
                                    <el-form-item label="微信号" prop="wechat">
                        <el-input v-model="zwfwMember.wechat"></el-input>
                    </el-form-item>
                                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="zwfwMember.remark"></el-input>
                    </el-form-item>
                                    <el-form-item label="用户类型,1=个人用户,2=企业用户" prop="type">
                        <el-input v-model="zwfwMember.type"></el-input>
                    </el-form-item>
                                    <el-form-item label="关联企业" prop="companyId">
                        <el-input v-model="zwfwMember.companyId"></el-input>
                    </el-form-item>
                                    <el-form-item label="密码" prop="password">
                        <el-input v-model="zwfwMember.password"></el-input>
                    </el-form-item>
                                    <el-form-item label="密码加密类型" prop="encrptionType">
                        <el-input v-model="zwfwMember.encrptionType"></el-input>
                    </el-form-item>
                                    <el-form-item label="手机号码" prop="mobilephone">
                        <el-input v-model="zwfwMember.mobilephone"></el-input>
                    </el-form-item>
                                    <el-form-item label="用户名" prop="loginName">
                        <el-input v-model="zwfwMember.loginName"></el-input>
                    </el-form-item>
                                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="zwfwMember.name"></el-input>
                    </el-form-item>
                                    <el-form-item label="固定电话" prop="tellphone">
                        <el-input v-model="zwfwMember.tellphone"></el-input>
                    </el-form-item>
                                    <el-form-item label="密码盐" prop="passwordSalt">
                        <el-input v-model="zwfwMember.passwordSalt"></el-input>
                    </el-form-item>
                                    <el-form-item label="电子邮箱" prop="email">
                        <el-input v-model="zwfwMember.email"></el-input>
                    </el-form-item>
                                    <el-form-item label="帐号可用状态" prop="status">
                        <el-input v-model="zwfwMember.status"></el-input>
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
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import {getZwfwMemberList, createZwfwMember, updateZwfwMember, delZwfwMembers} from 'api/zwfw/zwfwMember';

    export default {
        name: 'zwfwMember_table',
        data() {
            return {
                zwfwMemberList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                },
                zwfwMember: {
                    id: undefined,
                                         qq: undefined,
                                         address: undefined,
                                         gender: undefined,
                                         registerTime: undefined,
                                         wechat: undefined,
                                         remark: undefined,
                                         type: undefined,
                                         companyId: undefined,
                                         password: undefined,
                                         encrptionType: undefined,
                                         mobilephone: undefined,
                                         loginName: undefined,
                                         name: undefined,
                                         tellphone: undefined,
                                         passwordSalt: undefined,
                                         email: undefined,
                                         status: undefined,
                                    },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                zwfwMemberRules: {
                                           qq: [
                         {required: true, message: '请输入QQ号码', trigger: 'blur'}
                      ],
                                           address: [
                         {required: true, message: '请输入联系地址', trigger: 'blur'}
                      ],
                                           gender: [
                         {required: true, message: '请输入性别', trigger: 'blur'}
                      ],
                                           registerTime: [
                         {required: true, message: '请输入注册时间', trigger: 'blur'}
                      ],
                                           wechat: [
                         {required: true, message: '请输入微信号', trigger: 'blur'}
                      ],
                                           remark: [
                         {required: true, message: '请输入备注', trigger: 'blur'}
                      ],
                                           type: [
                         {required: true, message: '请输入用户类型,1=个人用户,2=企业用户', trigger: 'blur'}
                      ],
                                           companyId: [
                         {required: true, message: '请输入关联企业', trigger: 'blur'}
                      ],
                                           password: [
                         {required: true, message: '请输入密码', trigger: 'blur'}
                      ],
                                           encrptionType: [
                         {required: true, message: '请输入密码加密类型', trigger: 'blur'}
                      ],
                                           mobilephone: [
                         {required: true, message: '请输入手机号码', trigger: 'blur'}
                      ],
                                           loginName: [
                         {required: true, message: '请输入用户名', trigger: 'blur'}
                      ],
                                           name: [
                         {required: true, message: '请输入姓名', trigger: 'blur'}
                      ],
                                           tellphone: [
                         {required: true, message: '请输入固定电话', trigger: 'blur'}
                      ],
                                           passwordSalt: [
                         {required: true, message: '请输入密码盐', trigger: 'blur'}
                      ],
                                           email: [
                         {required: true, message: '请输入电子邮箱', trigger: 'blur'}
                      ],
                                           status: [
                         {required: true, message: '请输入帐号可用状态', trigger: 'blur'}
                      ],
                                     }
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
                getZwfwMemberList(this.listQuery).then(response => {
                    this.zwfwMemberList = response.data.list;
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
                this.$refs.zwfwMemberTable.toggleRowSelection(row);
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
                this.zwfwMember = copyProperties(this.zwfwMember, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let selectCounts = this.selectedRows.length;
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delZwfwMembers(ids).then(response => {
                            this.total -= selectCounts;
                            for (const deleteRow of this.selectedRows) {
                                const index = this.zwfwMemberList.indexOf(deleteRow);
                                this.zwfwMemberList.splice(index, 1);
                            }
                            this.$message.success('删除成功');
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            create() {
                this.$refs['zwfwMemberForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwMember(this.zwfwMember).then(response => {
                            this.zwfwMemberList.unshift(response.data);
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
                this.$refs['zwfwMemberForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateZwfwMember(this.zwfwMember).then(response => {
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
                this.zwfwMember = {
                    id: undefined,
                                    qq: undefined,
                                    address: undefined,
                                    gender: undefined,
                                    registerTime: undefined,
                                    wechat: undefined,
                                    remark: undefined,
                                    type: undefined,
                                    companyId: undefined,
                                    password: undefined,
                                    encrptionType: undefined,
                                    mobilephone: undefined,
                                    loginName: undefined,
                                    name: undefined,
                                    tellphone: undefined,
                                    passwordSalt: undefined,
                                    email: undefined,
                                    status: undefined,
                                };
            }
        }
    }
</script>
