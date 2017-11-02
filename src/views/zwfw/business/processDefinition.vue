<template>
    <div class="app-container calendar-list-container">
        <!--搜索区-->
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="流程模型名称"
                      v-model="listQuery.name" no-match-text="没有找到哦">
            </el-input>

            <el-button style="margin-left: 10px;" class="filter-item" type="primary" v-waves icon="search"
                       @click="getList">搜索
            </el-button>

            <el-button class="filter-item" style="margin-left: 10px;" @click="handleSuspend" type="danger" icon="check">
                挂起
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleActive" type="danger" icon="check">
                激活
            </el-button>
            <el-button class="filter-item " style="margin-left: 10px;" @click="handleDelete" type="danger" icon="remove">删除
            </el-button>
        </div>
        <!--表格-->
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="流程定义ID" width="200">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="50px" align="center" label="流程定义名称">
                <template scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="50px" align="center" label="流程版本">
                <template scope="scope">
                    {{scope.row.version}}
                </template>
            </el-table-column>
            <el-table-column min-width="50px" align="center" label="是否挂起">
                <template scope="scope">
                    <i v-if="scope.row.suspended" style="color:green" class="el-icon-circle-check"></i>
                    <i v-else class="el-icon-circle-cross" style="color:red"></i>
                </template>
            </el-table-column>
            <el-table-column min-width="50px" align="center" label="启动步骤是自定义表单">
                <template scope="scope">
                    <i v-if="scope.row.hasStartFormKey" style="color:green" class="el-icon-circle-check"></i>
                    <i v-else class="el-icon-circle-cross" style="color:red"></i>
                </template>
            </el-table-column>
            <el-table-column min-width="50px" align="center" label="是否有绘图">
                <template scope="scope">
                    <i v-if="scope.row.hasGraphicalNotation" style="color:green" class="el-icon-circle-check"></i>
                    <i v-else class="el-icon-circle-cross" style="color:red"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="描述" width="200">
                <template scope="scope">
                    <span>{{scope.row.description}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column-->
            <!--fixed="right"-->
            <!--label="操作"-->
            <!--width="100">-->
            <!--<template scope="scope">-->
            <!--<el-button @click="handleView" type="text" size="small">查看</el-button>-->
            <!--<el-button @click="handleCreateInstance" type="text" size="small">创建实例</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->

        </el-table>
        <!--列表分页-->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

        <!--弹出层-->
        <el-dialog title="创建流程实例" :visible.sync="addDialogFormVisible" :close-on-click-modal="closeOnClickModal">
            <el-form ref="zwfwProcessDefinitionForm" :model="zwfwProcessDefinition" label-position="right"
                     label-width="110px"
                     :rules="rules">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="zwfwProcessDefinition.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="description">
                    <el-input type="textarea" v-model="zwfwProcessDefinition.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createInstance">创建</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {
        getZwfwProcessDefinitionList,
        suspendZwfwProcessDefinition,
        activeZwfwProcessDefinition,
        deleteZwfwProcessDefinition
    } from 'api/zwfw/business/activiti';
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
                    pageSize: this.$store.state.app.rows
                },
                zwfwProcessDefinition: {
                    id: undefined,
                    name: '',
                    category: '',
                    description: ''
                },
                dialogStatus: '',
                checked: true,
                addDialogFormVisible: false,
                selectedRows: [],
                rules: {
                    name: [{
                        required: true, message: '请输入模型名称'
                    }]
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
                getZwfwProcessDefinitionList(this.listQuery).then(response => {
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
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            resetForm(zwfwProcessDefinitionForm) {
                this.$refs[zwfwProcessDefinitionForm].resetFields();
            },
            /**
             * 查看流程定义
             */
            handleView() {

            },
            /**
             * 点击创建实例
             */
            handleCreateInstance() {

            },
            handleSuspend() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将模挂起流程定义, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const ids = new Array();
                        for (const deployRow of this.selectedRows) {
                            ids.push(deployRow.id);
                        }
                        suspendZwfwProcessDefinition(ids).then(response => {
                            console.log(response);
                            this.listLoading = false;
                            this.$message.success('挂起成功');
                            this.getList();
                        });
                    }).catch((e) => {
                        console.log('发生错误', e);
                    });
                }
            },
            handleActive() {
                const selectCounts = this.selectedRows.length;
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将重新激活流程定义, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const ids = new Array();
                        for (const deployRow of this.selectedRows) {
                            ids.push(deployRow.id);
                        }
                        activeZwfwProcessDefinition(ids).then(response => {
                            console.log(response);
                            this.listLoading = false;
                            this.$message.success('激活成功');
                            this.getList();
                        });
                    }).catch((e) => {
                        console.log('发生错误', e);
                    });
                }
            },
            /**
             * 删除
             */
            handleDelete() {
                const selectCounts = this.selectedRows.length;
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将删除流程定义和所有此流程的实例, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const ids = new Array();
                        for (const deployRow of this.selectedRows) {
                            ids.push(deployRow.id);
                        }
                        deleteZwfwProcessDefinition(ids).then(response => {
                            console.log(response);
                            this.listLoading = false;
                            this.$message.success('删除成功');
                            this.getList();
                        });
                    }).catch((e) => {
                        console.log('发生错误', e);
                    });
                }
            },
            createInstance() {
                this.$refs['zwfwProcessDefinitionForm'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        this.listLoading = true;

                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.zwfwProcessDefinition = {
                    id: undefined,
                    name: '',
                    description: '',
                    category: ''
                };
            }
        }
    }
</script>
<style>

</style>
