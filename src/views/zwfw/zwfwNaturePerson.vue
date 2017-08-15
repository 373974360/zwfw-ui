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

        <el-table ref="zwfwNaturePersonTable" :data="zwfwNaturePersonList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="出生日期" prop="birthday">
                <template scope="scope">
                    <span>{{scope.row.birthday}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="登录密码" prop="password">
                <template scope="scope">
                    <span>{{scope.row.password}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="住址" prop="address">
                <template scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="性别" prop="gender">
                <template scope="scope">
                    <span>{{scope.row.gender}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="民族" prop="nation">
                <template scope="scope">
                    <span>{{scope.row.nation}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联系电话" prop="phone">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名" prop="name">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="照片" prop="photo">
                <template scope="scope">
                    <span>{{scope.row.photo}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark">
                <template scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="密码加密盐" prop="passwordSalt">
                <template scope="scope">
                    <span>{{scope.row.passwordSalt}}</span>
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
            <el-form ref="zwfwNaturePersonForm" class="small-space" :model="zwfwNaturePerson" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwNaturePersonRules">
                <el-form-item label="出生日期" prop="birthday">
                    <el-input v-model="zwfwNaturePerson.birthday"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                    <el-input v-model="zwfwNaturePerson.password"></el-input>
                </el-form-item>
                <el-form-item label="住址" prop="address">
                    <el-input v-model="zwfwNaturePerson.address"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-input v-model="zwfwNaturePerson.gender"></el-input>
                </el-form-item>
                <el-form-item label="民族" prop="nation">
                    <el-input v-model="zwfwNaturePerson.nation"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="zwfwNaturePerson.phone"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="zwfwNaturePerson.name"></el-input>
                </el-form-item>
                <el-form-item label="照片" prop="photo">
                    <el-input v-model="zwfwNaturePerson.photo"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="zwfwNaturePerson.remark"></el-input>
                </el-form-item>
                <el-form-item label="密码加密盐" prop="passwordSalt">
                    <el-input v-model="zwfwNaturePerson.passwordSalt"></el-input>
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
    import {
        getZwfwNaturePersonList,
        createZwfwNaturePerson,
        updateZwfwNaturePerson,
        delZwfwNaturePersons
    } from 'api/zwfw/zwfwNaturePerson';

    export default {
        name: 'zwfwNaturePerson_table',
        data() {
            return {
                zwfwNaturePersonList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                },
                zwfwNaturePerson: {
                    id: undefined,
                    birthday: undefined,
                    password: undefined,
                    address: undefined,
                    gender: undefined,
                    nation: undefined,
                    phone: undefined,
                    name: undefined,
                    photo: undefined,
                    remark: undefined,
                    passwordSalt: undefined
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                zwfwNaturePersonRules: {
                    birthday: [
                        {required: true, message: '请输入出生日期', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入住址', trigger: 'blur'}
                    ],
                    gender: [
                        {required: true, message: '请输入性别', trigger: 'blur'}
                    ],
                    nation: [
                        {required: true, message: '请输入民族', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    photo: [
                        {required: true, message: '请输入照片', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入备注', trigger: 'blur'}
                    ],
                    passwordSalt: [
                        {required: true, message: '请输入密码加密盐', trigger: 'blur'}
                    ]
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
                getZwfwNaturePersonList(this.listQuery).then(response => {
                    this.zwfwNaturePersonList = response.data.list;
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
                this.$refs.zwfwNaturePersonTable.toggleRowSelection(row);
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
                this.zwfwNaturePerson = copyProperties(this.zwfwNaturePerson, row);
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
                        delZwfwNaturePersons(ids).then(response => {
                            this.total -= selectCounts;
                            for (const deleteRow of this.selectedRows) {
                                const index = this.zwfwNaturePersonList.indexOf(deleteRow);
                                this.zwfwNaturePersonList.splice(index, 1);
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
                this.$refs['zwfwNaturePersonForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwNaturePerson(this.zwfwNaturePerson).then(response => {
                            this.zwfwNaturePersonList.unshift(response.data);
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
                this.$refs['zwfwNaturePersonForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateZwfwNaturePerson(this.zwfwNaturePerson).then(response => {
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
                this.zwfwNaturePerson = {
                    id: undefined,
                    birthday: undefined,
                    password: undefined,
                    address: undefined,
                    gender: undefined,
                    nation: undefined,
                    phone: undefined,
                    name: undefined,
                    photo: undefined,
                    remark: undefined,
                    passwordSalt: undefined
                };
            }
        }
    }
</script>
