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

        <el-table ref="mailboxTable" :data="mailboxList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="设备名称" prop="name">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="设备ID" prop="deviceId">
                <template slot-scope="scope">
                    <span>{{scope.row.deviceId}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="设备地址" prop="address">
                <template slot-scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
                        {{scope.row.enable | enums('Enable')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="getBoxStatus(scope.row)">查看箱格状态</el-button>
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
                   :close-on-click-modal="closeOnClickModal" :before-close="resetMailboxForm">
            <el-form ref="mailboxForm" class="small-space" :model="mailbox" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="mailboxRules">
                <el-form-item label="设备名称" prop="name">
                    <el-input v-model="mailbox.name"></el-input>
                </el-form-item>
                <el-form-item label="设备ID" prop="deviceId">
                    <el-input v-model="mailbox.deviceId"></el-input>
                </el-form-item>
                <el-form-item label="设备地址" prop="address">
                    <el-input v-model="mailbox.address"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="mailbox.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetMailboxForm">取 消</el-button>
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
    import {
        getMailboxList,
        addMailbox,
        updateMailbox,
        delMailboxes,
        queryBoxStatus
    } from '../../../../api/hallSystem/window/mailbox';

    export default {
        name: 'mailbox_table',
        data() {
            return {
                mailboxList: [],
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined
                },
                mailbox: {
                    id: undefined,
                    name: undefined,
                    deviceId: undefined,
                    address: undefined,
                    remark: undefined
                },
                mailboxRules: {
                    name: [
                        {required: true, message: '请输入设备名称', trigger: 'blur'}
                    ],
                    deviceId: [
                        {required: true, message: '请输入设备ID', trigger: 'blur'}
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
                getMailboxList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.mailboxList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listLoading = false;
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
                this.mailbox = copyProperties(this.mailbox, row);
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
                this.$refs['mailboxForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        addMailbox(this.mailbox).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetMailboxForm();
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
                this.$refs['mailboxForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        updateMailbox(this.mailbox).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetMailboxForm();
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
                delMailboxes(ids).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('删除成功！');
                        this.getList();
                    } else {
                        this.$message.error('删除失败！');
                    }
                    this.listLoading = false;
                })
            },
            getBoxStatus(row) {
                queryBoxStatus(row.deviceId).then(response => {
                    if (response.httpCode === 200) {
                        let boxStatus = response.data;
                        if (boxStatus) {
                            const h = this.$createElement;
                            this.$msgbox({
                                title: '箱格状态',
                                message: h('div', null, [
                                    h('p', { style: 'font-size: 16px' }, '小箱数量：' + boxStatus.small),
                                    h('p', { style: 'font-size: 16px' }, '中箱数量：' + boxStatus.medium),
                                    h('p', { style: 'font-size: 16px' }, '大箱数量：' + boxStatus.big)
                                ]),
                                confirmButtonText: '确定'
                            })
                        }
                    } else {
                        this.$message.error('获取信息失败，请稍后重试');
                    }
                })
            },
            resetTemp() {
                this.mailbox = {
                    id: undefined,
                    name: undefined,
                    deviceId: undefined,
                    address: undefined,
                    remark: undefined
                }
            },
            resetMailboxForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'mailboxForm');
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
                this.$refs.mailboxTable.toggleRowSelection(row);
            }
        }
    }
</script>
