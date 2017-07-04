<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="角色名称"
                      v-model="listQuery.roleName">
            </el-input>

            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">

            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="200">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column width="200px" align="center" label="角色名称">
                <template scope="scope">
                    <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.roleName}}</span>
                </template>
            </el-table-column>

            <el-table-column width="200px" align="center" label="权限">
                <template scope="scope">
                    <span>{{scope.row.menuName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button class="filter-item" style="margin-left: 10px;" @click="handleMenuList" type="primary"
                               size="small">
                        分配菜单权限
                    </el-button>
                    <el-button class="filter-item" style="margin-left: 10px;" @click="handleUserList" type="primary"
                               size="small">
                        分配用户权限
                    </el-button>
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
            <el-form ref="roleForm" class="small-space" :model="sysRole" label-position="left" label-width="70px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="sysRole.roleName"/>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
        <!--分配菜单权限-->
        <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
        <!--<el-form ref="roleForm" class="small-space" :model="sysRole" label-position="left" label-width="100px"-->
        <!--style='width: 400px; margin-left:50px;'>-->
        <!--<el-tree :data="regions" :props="props" :load="loadNode" lazy="" show-checkbox-->
        <!--@check-change="handleCheckChange" style="width: 546px;">-->
        <!--</el-tree>-->

        <!--</el-form>-->
        <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
        <!--<el-button v-if="dialogStatus=='menuList'" type="primary" @click="menuList">确 定</el-button>-->
        <!--<el-button v-else type="primary" @click="update">确 定</el-button>-->
        <!--</div>-->
        <!--</el-dialog>-->
        <!--&lt;!&ndash;分配菜单权限&ndash;&gt;-->
        <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
        <!--<el-form ref="roleForm" class="small-space" :model="sysRole" label-position="left" label-width="100px"-->
        <!--style='width: 400px; margin-left:50px;'>-->
        <!--<el-tree :data="regions" :props="defaultProps" @node-click="handleNodeClick" style="width: 546px;">-->
        <!--</el-tree>-->

        <!--</el-form>-->
        <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
        <!--<el-button v-if="dialogStatus=='userList'" type="primary" @click="userList">确 定</el-button>-->
        <!--<el-button v-else type="primary" @click="update">确 定</el-button>-->
        <!--</div>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    import {getRoleList, createRole, updateRole, delRole} from 'api/org/role';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    //    import {getUserList} from 'api/org/user';


    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows
                },
                sysRole: {
                    id: undefined,
                    roleName: ''
                },
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                showAuditor: false,
                tableKey: 0,
                cascader: [],
                currentRow: [],
                props: [],
                regions: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1'
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1'
                        }]
                    }]
                }],
            }
        },
        created() {
            this.getList();
//            this.getOptions();
        },
        computed: {
            cascaderModel: function () {
                if (this.sysRole.treePosition) {
                    const arr = this.sysRole.treePosition.split('&');
                    return arr;
                }
            },
            ...
                mapGetters([
                    'textMap',
                    'enums'
                ])
        },
        methods: {
//            handleNodeClick(data) {
//                console.log(data);
//            },
            getList() {
                this.listLoading = true;
                getRoleList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
//            getOptions() {
//                this.dialogLoading = true;
//                getUserList(this.listQuery).then(response => {
//                    this.props = response.data;
//                    this.regions = response.data;
//                    this.dialogLoading = false;
//                })
//            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            handleMenuList() {
                this.dialogStatus = 'menuList';
                this.dialogFormVisible = true;
            },
            handleUserList() {
                this.dialogStatus = 'userList';
                this.dialogFormVisible = true;
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.sysRole = copyProperties(this.sysRole, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                if (this.selectedRows.length == 0) {
                    this.$message.error('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delRole(ids).then(response => {
                            this.listLoading = false;
                            this.$message.success('删除成功');
                        })
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
                this.$refs['roleForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createRole(this.sysRole).then(response => {
                            this.list.push(response.data);
                            this.$message.success('创建成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['roleForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        updateRole(this.sysRole).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.sysRole = {
                    id: undefined,
                    deptName: '',
                    roleName: '',
                    roleType: 1,
                    deptCode: 0,
                    deptId: '',
                    treePosition: '',
                    parentId: 0
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
