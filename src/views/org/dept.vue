<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="部门全称/部门简称"
                      v-model="listQuery.deptName">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">
                添加
            </el-button>
            <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
        </div>


        <!--<tree-grid :columns="columns" :tree-structure="true" :data-source="itemList" :list-loading="listLoading"-->
        <!--:handle-toggle="handleToggle" :handle-create="handleCreate"-->
        <!--:handle-update="handleUpdate" :handle-delete="handleDelete">-->
        <!--</tree-grid>-->

        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">

            <el-table-column align="center" label="序号" width="165">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="280px" align="center" label="部门全称">
                <template scope="scope">
                    <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.deptName}}</span>
                </template>
            </el-table-column>

            <el-table-column width="200px" label="部门简称">
                <template scope="scope">
                    <span>{{scope.row.shortName}}</span>
                </template>
            </el-table-column>

            <el-table-column width="110px" align="center" label="部门编号">
                <template scope="scope">
                    <span>{{scope.row.deptCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="上级部门" width="95">
                <template scope="scope">
                    <span>{{scope.row.parentId}}</span>
                </template>
            </el-table-column>

            <el-table-column class-name="status-col" label="状态" width="90">
                <template scope="scope">
                    <el-tag :type="scope.row.enable | statusFilter">{{scope.row.enable}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="140">
                <template scope="scope">
                    <el-button v-if="scope.row.status!='draft'" type="primary" size="small"
                               @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button v-if="scope.row.status!='deleted'" size="small" type="danger"
                               @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>


        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="deptForm" class="small-space" :model="sysDept" label-position="left" label-width="70px"
                     style='width: 80%; margin-left:10%;'>
                <el-form-item label="上级部门">
                    <el-cascader :options="cascader" v-model="cascaderModel" :show-all-levels="true"
                                 :change-on-select="true" style="width:100%" :disabled="true"></el-cascader>
                </el-form-item>
                <el-form-item label="部门全称">
                    <el-input v-model="sysDept.deptName"></el-input>
                </el-form-item>
                <el-form-item label="部门简称">
                    <el-input v-model="sysDept.shortName"></el-input>
                </el-form-item>
                <el-form-item label="部门编号">
                    <el-input v-model="sysDept.deptCode"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="sysDept.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="sysDept.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import app from 'store/modules/app';
    import {getDeptList, createDept, updateDept, delDept} from 'api/org/dept';
    import {copyProperties} from 'utils';
    import TreeUtil from 'utils/TreeUtil.js';

    export default {
        name: 'dept_table',
        data() {
            return {
//                list: null,
                total: null,
                pageSize: app.state.pageSize,
                listLoading: true,
                currentRow: [],
                list: [],
                cascader: [],
                listQuery: {
                    page: app.state.page,
                    rows: app.state.rows,
                    deptName: undefined
                },
                sysDept: {
                    id: undefined,
                    deptName: '',
                    shortName: '',
                    deptCode: '',
                    parentId: 0,
                    sortNo: 1,
                    status: 1,
                    treePosition: ''
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '添加'
                }
            }
        },
        created() {
            this.getList();
        },
        computed: {
            cascaderModel: function() {
                if (this.sysDept.treePosition) {
                    var arr = this.sysDept.treePosition.split('&');
                    if (this.dialogStatus === 'update') {
                        return arr.splice(0, arr.length - 2);
                    } else {
                        return arr.splice(0, arr.length - 1);
                    }
                }
            },
            parentId: function () {
                if (this.cascaderModel) {
                    return this.cascaderModel[this.cascaderModel.length - 1];
                } else {
                    return 0;
                }
            }
        },
        methods: {
            getList() {
                this.listLoading = true;
                getDeptList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleFilter() {
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
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
                this.sysDept = copyProperties(this.sysDept, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delDept(row.id).then(response => {
//                        this.getList();
//                        this.currentRow.splice()
                        const index = this.list.indexOf(row);
                        this.list.splice(index, 1);
//                        TreeUtil.delRow(row, this.list);
//                        this.$message.success('删除成功');
                    })
                }).catch(() => {
                    console.dir("取消");
                });
//                this.$notify({
//                    title: '成功',
//                    message: '删除成功',
//                    type: 'success',
//                    duration: 2000
//                });
//                const index = this.list.indexOf(row);
//                this.list.splice(index, 1);
            },
            create() {
                this.$refs['deptForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createDept(this.sysDept).then(response => {
                            TreeUtil.addRow(this.currentRow, response.data, this.list);
//                            this.getList();
//                            this.list = response.data.list;
                            this.$message.success('创建成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['deptForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateDept(this.sysDept).then(response => {
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
                this.sysDept = {
                    id: undefined,
                    deptName: '',
                    shortName: '',
                    deptCode: '',
                    parentId: 0,
                    sortNo: 1,
                    status: 1,
                    treePosition: ''
                };
            },
            handleDownload() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('vendor/Export2Excel');
                    const tHeader = ['时间', '地区', '类型', '标题', '重要性'];
                    const filterVal = ['timestamp', 'province', 'type', 'title', 'importance'];
                    const data = this.formatJson(filterVal, this.list);
                    export_json_to_excel(tHeader, data, 'table数据');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            }
        }
    }
</script>
