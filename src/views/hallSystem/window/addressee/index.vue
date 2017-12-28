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

        <el-table ref="addresseeTable" :data="addresseeList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="收件人姓名" prop="name">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="手机号码" prop="deviceId">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="收件地址" prop="remark">
                <template scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
                    <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
                        {{scope.row.enable | enums('Enable')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-tag v-if="scope.row.defaultFlag" type="danger">
                        默认地址
                    </el-tag>
                    <el-button v-else type="text" @click="setDefault(scope.row.id)">设为默认</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetAddresseeForm">
            <el-form ref="addresseeForm" class="small-space" :model="addressee" label-position="right"
                     label-width="100px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="addresseeRules">
                <el-form-item label="收件人姓名" prop="name">
                    <el-input v-model="addressee.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="addressee.phone"></el-input>
                </el-form-item>
                <el-form-item label="收件地址" prop="address">
                    <el-input v-model="addressee.address"></el-input>
                </el-form-item>
                <el-form-item label="设为默认地址" prop="defaultFlag">
                    <el-switch v-model="addressee.defaultFlag" on-color="#13ce66" off-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetAddresseeForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {validatMobiles} from 'utils/validate'
    import {getAddresseeList, addAddressee, updateAddressee, delAddressees, setDefaultAddressee} from '../../../../api/hallSystem/window/addressee'

    export default {
        name: 'addressee_table',
        data() {
            const validateMobiles = (rule, value, callback) => {
                if (!validatMobiles(value)) {
                    callback(new Error('手机号码格式不正确'));
                }
                callback();
            };
            return {
                addresseeList: [],
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined
                },
                addressee: {
                    id: undefined,
                    name: undefined,
                    phone: undefined,
                    address: undefined,
                    postcode: undefined,
                    defaultFlag: false
                },
                addresseeRules: {
                    name: [
                        {required: true, message: '请输入收件人姓名', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: validateMobiles, trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入收件地址', trigger: 'blur'}
                    ]
                },
                currentRow: null,
                selectedRows: [],
                total: null,
                listLoading: true,
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false
            }
        },
        created() {
            this.getList();
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        methods: {
            handleFilter() {
                this.getList();
            },
            getList() {
                this.listLoading = true;
                getAddresseeList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.addresseeList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listLoading = false;
                })
            },
            setDefault(id) {
                setDefaultAddressee(id).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('设置成功')
                        this.getList();
                    } else {
                        this.$message.error(response.msg);
                    }
                })
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
                this.addressee = copyProperties(this.addressee, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
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
                        this.delete();
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            create() {
                this.$refs['addresseeForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        addAddressee(this.addressee).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetAddresseeForm();
                                this.$message.success('创建成功！');
                                this.getList();
                            } else {
                                this.$message.error('创建失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['addresseeForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        updateAddressee(this.addressee).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetAddresseeForm();
                                this.$message.success('更新成功！');
                                this.getList();
                            } else {
                                this.$message.error('更新失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            delete() {
                this.listLoading = true;
                let ids = [];
                for (const deleteRow of this.selectedRows) {
                    ids.push(deleteRow.id);
                }
                delAddressees(ids).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('删除成功！');
                        this.getList();
                    } else {
                        this.$message.error('删除失败！');
                    }
                    this.listLoading = false;
                })
            },
            resetTemp() {
                this.addressee = {
                    id: undefined,
                    name: undefined,
                    phone: undefined,
                    address: undefined,
                    postcode: undefined,
                    defaultFlag: false
                };
            },
            resetAddresseeForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'addresseeForm');
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
                this.$refs.addresseeTable.toggleRowSelection(row);
            }
        }
    }
</script>
