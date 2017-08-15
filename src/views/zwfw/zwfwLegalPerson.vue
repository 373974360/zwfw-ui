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

        <el-table ref="zwfwLegalPersonTable" :data="zwfwLegalPersonList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="统一社会信用代码" prop="companyCode">
                <template scope="scope">
                    <span>{{scope.row.companyCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="登录密码" prop="password">
                <template scope="scope">
                    <span>{{scope.row.password}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册地址" prop="registerPlace">
                <template scope="scope">
                    <span>{{scope.row.registerPlace}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="机构类型" prop="companyType">
                <template scope="scope">
                    <span>{{scope.row.companyType}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="机构名称" prop="companyName">
                <template scope="scope">
                    <span>{{scope.row.companyName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="法定代表人" prop="legalPerson">
                <template scope="scope">
                    <span>{{scope.row.legalPerson}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark">
                <template scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="机构代码" prop="agencyCode">
                <template scope="scope">
                    <span>{{scope.row.agencyCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="密码加密盐" prop="passwordSalt">
                <template scope="scope">
                    <span>{{scope.row.passwordSalt}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册日期" prop="registerDate">
                <template scope="scope">
                    <span>{{scope.row.registerDate}}</span>
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
            <el-form ref="zwfwLegalPersonForm" class="small-space" :model="zwfwLegalPerson" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwLegalPersonRules">
                <el-form-item label="统一社会信用代码" prop="companyCode">
                    <el-input v-model="zwfwLegalPerson.companyCode"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                    <el-input v-model="zwfwLegalPerson.password"></el-input>
                </el-form-item>
                <el-form-item label="注册地址" prop="registerPlace">
                    <el-input v-model="zwfwLegalPerson.registerPlace"></el-input>
                </el-form-item>
                <el-form-item label="机构类型" prop="companyType">
                    <el-input v-model="zwfwLegalPerson.companyType"></el-input>
                </el-form-item>
                <el-form-item label="机构名称" prop="companyName">
                    <el-input v-model="zwfwLegalPerson.companyName"></el-input>
                </el-form-item>
                <el-form-item label="法定代表人" prop="legalPerson">
                    <el-input v-model="zwfwLegalPerson.legalPerson"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="zwfwLegalPerson.remark"></el-input>
                </el-form-item>
                <el-form-item label="机构代码" prop="agencyCode">
                    <el-input v-model="zwfwLegalPerson.agencyCode"></el-input>
                </el-form-item>
                <el-form-item label="密码加密盐" prop="passwordSalt">
                    <el-input v-model="zwfwLegalPerson.passwordSalt"></el-input>
                </el-form-item>
                <el-form-item label="注册日期" prop="registerDate">
                    <el-input v-model="zwfwLegalPerson.registerDate"></el-input>
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
        getZwfwLegalPersonList,
        createZwfwLegalPerson,
        updateZwfwLegalPerson,
        delZwfwLegalPersons
    } from 'api/zwfw/zwfwLegalPerson';

    export default {
        name: 'zwfwLegalPerson_table',
        data() {
            return {
                zwfwLegalPersonList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                },
                zwfwLegalPerson: {
                    id: undefined,
                    companyCode: undefined,
                    password: undefined,
                    registerPlace: undefined,
                    companyType: undefined,
                    companyName: undefined,
                    legalPerson: undefined,
                    remark: undefined,
                    agencyCode: undefined,
                    passwordSalt: undefined,
                    registerDate: undefined
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                zwfwLegalPersonRules: {
                    companyCode: [
                        {required: true, message: '请输入统一社会信用代码', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'}
                    ],
                    registerPlace: [
                        {required: true, message: '请输入注册地址', trigger: 'blur'}
                    ],
                    companyType: [
                        {required: true, message: '请输入机构类型', trigger: 'blur'}
                    ],
                    companyName: [
                        {required: true, message: '请输入机构名称', trigger: 'blur'}
                    ],
                    legalPerson: [
                        {required: true, message: '请输入法定代表人', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入备注', trigger: 'blur'}
                    ],
                    agencyCode: [
                        {required: true, message: '请输入机构代码', trigger: 'blur'}
                    ],
                    passwordSalt: [
                        {required: true, message: '请输入密码加密盐', trigger: 'blur'}
                    ],
                    registerDate: [
                        {required: true, message: '请输入注册日期', trigger: 'blur'}
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
                getZwfwLegalPersonList(this.listQuery).then(response => {
                    this.zwfwLegalPersonList = response.data.list;
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
                this.$refs.zwfwLegalPersonTable.toggleRowSelection(row);
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
                this.zwfwLegalPerson = copyProperties(this.zwfwLegalPerson, row);
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
                        delZwfwLegalPersons(ids).then(response => {
                            this.total -= selectCounts;
                            for (const deleteRow of this.selectedRows) {
                                const index = this.zwfwLegalPersonList.indexOf(deleteRow);
                                this.zwfwLegalPersonList.splice(index, 1);
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
                this.$refs['zwfwLegalPersonForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwLegalPerson(this.zwfwLegalPerson).then(response => {
                            this.zwfwLegalPersonList.unshift(response.data);
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
                this.$refs['zwfwLegalPersonForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateZwfwLegalPerson(this.zwfwLegalPerson).then(response => {
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
                this.zwfwLegalPerson = {
                    id: undefined,
                    companyCode: undefined,
                    password: undefined,
                    registerPlace: undefined,
                    companyType: undefined,
                    companyName: undefined,
                    legalPerson: undefined,
                    remark: undefined,
                    agencyCode: undefined,
                    passwordSalt: undefined,
                    registerDate: undefined
                };
            }
        }
    }
</script>
