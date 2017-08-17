<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="流程模型名称"
                      v-model="listQuery.name" no-match-text="没有找到哦">
            </el-input>

            <el-button style="margin-left: 10px;" class="filter-item" type="primary" v-waves icon="search"
                       @click="getList">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="模型ID" width="200">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="50px" align="center" label="流程模型名称">
                <template scope="scope">
                    <el-tooltip content="点击编辑" placement="right" effect="dark">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" >
            <template scope="scope">
                <span>{{scope.row.createTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
        </el-table-column>
            <el-table-column align="center" label="操作" width="350">
                <template scope="scope">

                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {getZwfwActivitiModelList,getZwfwActivitiModelEditUrl} from 'api/zwfw/zwfwActiviti';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    id: '',
                    name: '',
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows
                },
                activitiModel: {
                    id: undefined,
                    name: '',
                    callerKey: '',
                    judgeKey: '',
                    cameraKey: '',
                    ledKey: ''
                },
                dialogStatus: '',
                checked: true,
                addDialogFormVisible: false,
                selectedRows: []
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
                getZwfwActivitiModelList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleSelectionChange(row) {
                this.selectedRows = row;
                console.log(this.selectedRows);
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            resetForm(activitiModelForm) {
                this.$refs[activitiModelForm].resetFields();
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.addDialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.activitiModel = copyProperties(this.activitiModel, row);
                this.dialogStatus = 'update';
                this.addDialogFormVisible = true;
                getZwfwActivitiModelEditUrl(row.id).then(response => {
                    window.open(response.data);
                });
            },
            handleDelete() {
                const selectCounts = this.selectedRows.length;
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将删除关联信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delactivitiModel(ids).then(response => {
                            this.listLoading = false;
                            this.total -= selectCounts;
                            this.$message.success('删除成功');
                        });
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
                this.$refs['activitiModelForm'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        this.listLoading = true;

                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['activitiModelForm'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        updateactivitiModel(this.activitiModel).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.activitiModel = {
                    id: undefined,
                    name: '',
                    callerKey: '',
                    judgeKey: '',
                    cameraKey: '',
                    ledKey: ''
                };
            }
        }
    }
</script>
<style>
    .item {
        margin-top: 10px;
        margin-right: 40px;
    }
</style>
