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

        <el-table ref="zwfwCompanyTable" :data="zwfwCompanyList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
                            <el-table-column align="center" label="营业执照编码" prop="businessLicense">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.businessLicense}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="最后修改人" prop="modifyUser">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.modifyUser}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="标记是否删除" prop="flagDel">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.flagDel}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="企业地址" prop="address">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.address}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="修改时间" prop="modifyTime">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.modifyTime}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="组织机构代码" prop="organizationCode">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.organizationCode}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="法人" prop="legalPerson">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.legalPerson}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="企业名称" prop="name">
                    <template slot-scope="scope">
                                                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                                <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                            </el-tooltip>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="备注" prop="remark">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.remark}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="统一社会信用代码" prop="unifyCode">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.unifyCode}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="法人身份证" prop="legalPersonCard">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.legalPersonCard}}</span>
                                            </template>
                </el-table-column>
                            <el-table-column align="center" label="状态,1=未审核,2=已审核,3=审核后有修改" prop="status">
                    <template slot-scope="scope">
                                                    <span>{{scope.row.status}}</span>
                                            </template>
                </el-table-column>
                        <el-table-column prop="enable" class-name="status-col" label="状态">
                <template slot-scope="scope">
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
            <el-form ref="zwfwCompanyForm" class="small-space" :model="zwfwCompany" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwCompanyRules">
                                    <el-form-item label="营业执照编码" prop="businessLicense">
                        <el-input v-model="zwfwCompany.businessLicense"></el-input>
                    </el-form-item>
                                    <el-form-item label="最后修改人" prop="modifyUser">
                        <el-input v-model="zwfwCompany.modifyUser"></el-input>
                    </el-form-item>
                                    <el-form-item label="标记是否删除" prop="flagDel">
                        <el-input v-model="zwfwCompany.flagDel"></el-input>
                    </el-form-item>
                                    <el-form-item label="企业地址" prop="address">
                        <el-input v-model="zwfwCompany.address"></el-input>
                    </el-form-item>
                                    <el-form-item label="修改时间" prop="modifyTime">
                        <el-input v-model="zwfwCompany.modifyTime"></el-input>
                    </el-form-item>
                                    <el-form-item label="组织机构代码" prop="organizationCode">
                        <el-input v-model="zwfwCompany.organizationCode"></el-input>
                    </el-form-item>
                                    <el-form-item label="法人" prop="legalPerson">
                        <el-input v-model="zwfwCompany.legalPerson"></el-input>
                    </el-form-item>
                                    <el-form-item label="企业名称" prop="name">
                        <el-input v-model="zwfwCompany.name"></el-input>
                    </el-form-item>
                                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="zwfwCompany.remark"></el-input>
                    </el-form-item>
                                    <el-form-item label="统一社会信用代码" prop="unifyCode">
                        <el-input v-model="zwfwCompany.unifyCode"></el-input>
                    </el-form-item>
                                    <el-form-item label="法人身份证" prop="legalPersonCard">
                        <el-input v-model="zwfwCompany.legalPersonCard"></el-input>
                    </el-form-item>
                                    <el-form-item label="状态,1=未审核,2=已审核,3=审核后有修改" prop="status">
                        <el-input v-model="zwfwCompany.status"></el-input>
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
    import {getZwfwCompanyList, createZwfwCompany, updateZwfwCompany, delZwfwCompanys} from 'api/zwfwSystem/zwfwCompany';

    export default {
        name: 'zwfwCompany_table',
        data() {
            return {
                zwfwCompanyList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                },
                zwfwCompany: {
                    id: undefined,
                                         businessLicense: undefined,
                                         modifyUser: undefined,
                                         flagDel: undefined,
                                         address: undefined,
                                         modifyTime: undefined,
                                         organizationCode: undefined,
                                         legalPerson: undefined,
                                         name: undefined,
                                         remark: undefined,
                                         unifyCode: undefined,
                                         legalPersonCard: undefined,
                                         status: undefined,
                                    },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                zwfwCompanyRules: {
                                           businessLicense: [
                         {required: true, message: '请输入营业执照编码', trigger: 'blur'}
                      ],
                                           modifyUser: [
                         {required: true, message: '请输入最后修改人', trigger: 'blur'}
                      ],
                                           flagDel: [
                         {required: true, message: '请输入标记是否删除', trigger: 'blur'}
                      ],
                                           address: [
                         {required: true, message: '请输入企业地址', trigger: 'blur'}
                      ],
                                           modifyTime: [
                         {required: true, message: '请输入修改时间', trigger: 'blur'}
                      ],
                                           organizationCode: [
                         {required: true, message: '请输入组织机构代码', trigger: 'blur'}
                      ],
                                           legalPerson: [
                         {required: true, message: '请输入法人', trigger: 'blur'}
                      ],
                                           name: [
                         {required: true, message: '请输入企业名称', trigger: 'blur'}
                      ],
                                           remark: [
                         {required: true, message: '请输入备注', trigger: 'blur'}
                      ],
                                           unifyCode: [
                         {required: true, message: '请输入统一社会信用代码', trigger: 'blur'}
                      ],
                                           legalPersonCard: [
                         {required: true, message: '请输入法人身份证', trigger: 'blur'}
                      ],
                                           status: [
                         {required: true, message: '请输入状态,1=未审核,2=已审核,3=审核后有修改', trigger: 'blur'}
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
                getZwfwCompanyList(this.listQuery).then(response => {
                    this.zwfwCompanyList = response.data.list;
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
                this.$refs.zwfwCompanyTable.toggleRowSelection(row);
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
                this.zwfwCompany = copyProperties(this.zwfwCompany, row);
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
                        delZwfwCompanys(ids).then(response => {
                            this.total -= selectCounts;
                            for (const deleteRow of this.selectedRows) {
                                const index = this.zwfwCompanyList.indexOf(deleteRow);
                                this.zwfwCompanyList.splice(index, 1);
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
                this.$refs['zwfwCompanyForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwCompany(this.zwfwCompany).then(response => {
                            this.zwfwCompanyList.unshift(response.data);
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
                this.$refs['zwfwCompanyForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateZwfwCompany(this.zwfwCompany).then(response => {
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
                this.zwfwCompany = {
                    id: undefined,
                                    businessLicense: undefined,
                                    modifyUser: undefined,
                                    flagDel: undefined,
                                    address: undefined,
                                    modifyTime: undefined,
                                    organizationCode: undefined,
                                    legalPerson: undefined,
                                    name: undefined,
                                    remark: undefined,
                                    unifyCode: undefined,
                                    legalPersonCard: undefined,
                                    status: undefined,
                                };
            }
        }
    }
</script>
