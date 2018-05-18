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

        <el-table ref="zwfwCategoryItemTable" :data="zwfwCategoryItemList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="事项id" prop="itemId">
                <template slot-scope="scope">
                    <span>{{scope.row.itemId}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分类id" prop="categoryId">
                <template slot-scope="scope">
                    <span>{{scope.row.categoryId}}</span>
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

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetZwfwCategoryItemForm">
            <el-form ref="zwfwCategoryItemForm" class="small-space" :model="zwfwCategoryItem" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwCategoryItemRules">
                <el-form-item label="事项id" prop="itemId">
                    <el-input v-model="zwfwCategoryItem.itemId"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="zwfwCategoryItem.remark"></el-input>
                </el-form-item>
                <el-form-item label="分类id" prop="categoryId">
                    <el-input v-model="zwfwCategoryItem.categoryId"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetZwfwCategoryItemForm">取 消</el-button>
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
        getZwfwCategoryItemList,
        createZwfwCategoryItem,
        updateZwfwCategoryItem,
        delZwfwCategoryItems
    } from 'api/zwfwSystem/zwfwCategoryItem';

    export default {
        name: 'zwfwCategoryItem_table',
        data() {
            return {
                zwfwCategoryItemList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                },
                zwfwCategoryItem: {
                    id: undefined,
                    itemId: undefined,
                    remark: undefined,
                    categoryId: undefined
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                zwfwCategoryItemRules: {
                    itemId: [
                        {required: true, message: '请输入事项id', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入备注', trigger: 'blur'}
                    ],
                    categoryId: [
                        {required: true, message: '请输入分类id', trigger: 'blur'}
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
                'enums',
                'closeOnClickModal'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                getZwfwCategoryItemList(this.listQuery).then(response => {
                    this.zwfwCategoryItemList = response.data.list;
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
                this.$refs.zwfwCategoryItemTable.toggleRowSelection(row);
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
                this.zwfwCategoryItem = copyProperties(this.zwfwCategoryItem, row);
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
                        delZwfwCategoryItems(ids).then(response => {
                            this.total -= selectCounts;
                            for (const deleteRow of this.selectedRows) {
                                const index = this.zwfwCategoryItemList.indexOf(deleteRow);
                                this.zwfwCategoryItemList.splice(index, 1);
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
                this.$refs['zwfwCategoryItemForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwCategoryItem(this.zwfwCategoryItem).then(response => {
                            this.zwfwCategoryItemList.unshift(response.data);
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
                this.$refs['zwfwCategoryItemForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateZwfwCategoryItem(this.zwfwCategoryItem).then(response => {
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
                this.zwfwCategoryItem = {
                    id: undefined,
                    itemId: undefined,
                    remark: undefined,
                    categoryId: undefined
                };
            },
            resetZwfwCategoryItemForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'zwfwCategoryItemForm');
            }
        }
    }
</script>
