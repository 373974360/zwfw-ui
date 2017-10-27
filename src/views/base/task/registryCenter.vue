<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="姓名"
                      v-model="listQuery.name"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleConnect" type="success"
                       icon="caret-right" :disabled="connectAble">
                连接
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete"
                       :disabled="deleteAble">
                删除
            </el-button>
        </div>

        <el-table ref="registryCenterTable" :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="name" align="center" label="注册中心名称">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="zkAddressList" align="center" label="注册中心地址">
                <template scope="scope">
                    <span>{{scope.row.zkAddressList}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="namespace" align="center" label="命名空间">
                <template scope="scope">
                    <span>{{scope.row.namespace}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="activated" class-name="status-col" label="状态">
                <template scope="scope">
                    <el-tag :type="scope.row.activated ? 'success' : 'gray'">
                        {{scope.row.activated ? '已连接' : '未连接'}}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form id="checkboxTable" ref="registryCenterFrom" class="small-space" :model="registryCenter"
                     label-position="right"
                     label-width="110px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="registryCenterRules1">
                <el-form-item label="注册中心名称" prop="name">
                    <el-input v-model="registryCenter.name"/>
                </el-form-item>
                <el-form-item label="注册中心地址" prop="zkAddressList">
                    <el-input v-model="registryCenter.zkAddressList"/>
                </el-form-item>
                <el-form-item label="命名空间" prop="namespace">
                    <el-input v-model="registryCenter.namespace"/>
                </el-form-item>
                <el-form-item label="登陆凭证" prop="digest">
                    <el-input v-model="registryCenter.digest"/>
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
    import {
        getRegistryCenterList,
        isExistByName,
        createRegistryCenter,
        updateRegistryCenter,
        connectRegistryCenter,
        delRegistryCenter
    } from 'api/base/task/registryCenter';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'table_demo',
        data() {
            const isExist = (rule, value, callback) => {
                if (value == null || value == '') {
                    return callback(new Error('请输入注册中心名称'));
                } else {
                    if (this.dialogStatus != 'update') {
                        isExistByName(value).then(response => {
                            if (response.data) {
                                return callback(new Error('注册中心名称已存在'));
                            } else {
                                return callback();
                            }
                        })
                    } else {
                        return callback();
                    }
                }
            };
            return {
                list: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined
                },
                registryCenter: {
                    name: '',
                    zkAddressList: '',
                    namespace: '',
                    digest: '',
                    activated: false
                },
                registryCenterRules1: {
                    name: [
                        {required: true, validator: isExist, trigger: 'blur'}
                    ],
                    zkAddressList: [
                        {required: true, message: '请输入注册中心地址', trigger: 'blur'}
                    ],
                    namespace: [
                        {required: true, message: '请输入命名空间', trigger: 'blur'}
                    ]
                },
                connectAble: true,
                deleteAble: true,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums'
            ])
        },
        created() {
            this.getList();
        },
        methods: {
            handleSelectionChange(rows) {
                this.selectedRows = rows;
                if (this.selectedRows.length > 0) {
                    this.deleteAble = false;
                } else {
                    this.deleteAble = true;
                }
                if (this.selectedRows.length == 1 && !this.selectedRows[0].activated) {
                    this.connectAble = false;
                } else {
                    this.connectAble = true;
                }
            },
            toggleSelection(row) {
                this.$refs.registryCenterTable.toggleRowSelection(row);
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
                this.registryCenter = copyProperties(this.registryCenter, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            getList() {
                this.listLoading = true;
                getRegistryCenterList(this.listQuery).then(response => {
                    this.list = response.data;
                    this.listLoading = false;
                })
            },
            handleConnect() {
                this.listLoading = true;
                let names = new Array();
                for (const deleteRow of this.selectedRows) {
                    names.push(deleteRow.name);
                }
                connectRegistryCenter(names).then(response => {
                    if (response.data) {
                        this.$message.success('连接成功');
                        this.getList();
                    } else {
                        this.$message.error('连接失败');
                        this.getList();
                    }
                    this.listLoading = false;
                })
            },
            handleDelete() {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let names = new Array();
                    for (const deleteRow of this.selectedRows) {
                        names.push(deleteRow.name);
                    }
                    delRegistryCenter(names).then(response => {
                        for (const deleteRow of this.selectedRows) {
                            const index = this.list.indexOf(deleteRow);
                            this.list.splice(index, 1);
                        }
                        this.$message.success('删除成功');
                        this.listLoading = false;
                    })
                }).catch(() => {
                    console.dir('取消');
                });
            },
            create() {
                this.$refs['registryCenterFrom'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createRegistryCenter(this.registryCenter).then(response => {
                            if (response.data) {
                                this.list.unshift(this.registryCenter);
                                this.$message.success('创建成功');
                                this.listLoading = false;
                            } else {
                                this.$message.error('创建失败');
                                this.listLoading = false;
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['registryCenterFrom'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        this.registryCenter.sysDeptVo = {};
                        updateRegistryCenter(this.registryCenter).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            resetTemp() {
                this.registryCenter = {
                    name: '',
                    zkAddressList: '',
                    namespace: '',
                    digest: '',
                    activated: false
                };
            }
        }
    }
</script>
