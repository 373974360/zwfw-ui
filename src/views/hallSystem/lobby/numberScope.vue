<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="排号单前缀"
                      v-model="listQuery.prefixName" no-match-text="没有找到哦">
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
            <el-table-column align="center" label="序号" width="200">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="50px" align="center" label="排号单前缀">
                <template scope="scope">
                    <el-tooltip content="点击编辑" placement="right" effect="dark">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.prefixName}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="起始段号">
                <template scope="scope">
                    <span>{{scope.row.beginNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
                <template scope="scope">
                    <span>{{scope.row.createTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="350">
                <template scope="scope">
                    <el-badge :value="scope.row.numberItemCount" class="item">
                        <el-button class="filter-item" @click="handleItemList(scope.row)"
                                   type="primary" size="small">
                            关联事项
                        </el-button>
                    </el-badge>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <!--添加编辑-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetNumberForm">
            <el-form ref="zwfwNumberScope" class="small-space" :model="zwfwNumberScope" label-position="left"
                     label-width="100px"
                     style='width: 80%; margin-left:10%;' :rules="numberScopeRules">
                <el-form-item label="排号单前缀" prop="prefixName">
                    <el-input v-model="zwfwNumberScope.prefixName"/>
                </el-form-item>
                <el-form-item label="起始段号" prop="beginNumber">
                    <el-input v-model="zwfwNumberScope.beginNumber"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetNumberForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--事项关联dialog-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisibleItem"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetZwfwItemForm">
            <div class="filter-container">
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleDeleteOne" type="danger"
                           icon="delete">
                    删除
                </el-button>
            </div>
            <el-table ref="zwfwItemTable" :data="zwfwItemList" v-loading.body="listLoading1" border fit
                      highlight-current-row
                      style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column align="center" label="序号">
                    <template scope="scope">
                        <span>{{scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项名称" prop="name">
                    <template scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="基本编码" prop="basicCode">
                    <template scope="scope">
                        <span>{{scope.row.basicCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项类型" prop="type">
                    <template scope="scope">
                        <span>{{scope.row.type | dics('sslx')}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办件类型" prop="processType">
                    <template scope="scope">
                        <el-tag :type="scope.row.processType | dics('bjlx')">
                            {{scope.row.processType | dics('bjlx')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办理形式" prop="handleType">
                    <template scope="scope">
                        <el-tag :type="scope.row.handleType | dics('blxs')">
                            {{scope.row.handleType | dics('blxs')}}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-form ref="zwfwItemForm" class="small-space" :model="zwfwItem"
                     label-position="right"
                     label-width="130px"
                     style='width: 80%; margin-left:10%; margin-top: 5%;' v-loading="dialogLoading"
                     :rules="zwfwNumberScopeItemRules">
                <el-form-item label="事项名称：" prop="name">
                    <el-select
                            v-model="zwfwItem.name"
                            filterable
                            remote
                            placeholder="请输入事项名称或基本编码"
                            :remote-method="remoteMethod"
                            @change="changeMaterial">
                        <el-option
                                v-for="item in optionsName"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="text-align: center" slot="footer" class="dialog-footer">
                <el-button type="primary" icon="circle-check" @click="saveCategoryItem">保 存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getNumberScopeList,
        createZwfwNumberScope,
        updateZwfwNumberScope,
        delZwfwNumberScope,
        getAllItemNumberScope,
        createZwfwNumberScopeItem,
        deleteZwfwNumberScopeItem
    } from 'api/hallSystem/lobby/numberScope';
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {getAllByNameOrbasicCode} from 'api/zwfwSystem/business/item';

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listLoading1: true,
                dialogLoading: false,
                listQuery: {
                    prefixName: '',
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows
                },
                zwfwNumberScope: {
                    id: undefined,
                    prefixName: '',
                    beginNumber: ''
                },
                numberScopeRules: {
                    prefixName: [
                        {required: true, message: '请输入排号单前缀', trigger: 'blur'}
                    ],
                    beginNumber: [
                        {required: true, message: '请输入起始段号', trigger: 'blur'}
                    ]
                },
                zwfwNumberScopeItemRules: {
                    name: [
                        {required: true, message: '请输入事项名称或基本编码'}
                    ]
                },
                zwfwItem: {
                    id: undefined,
                    name: '',
                    basicCode: ''
                },
                dialogStatus: '',
                checked: true,
                addDialogFormVisible: false,
                dialogFormVisibleItem: false,
                selectedRows: [],
                zwfwItemList: [],
                itemNumberScopeList: [],
                optionsName: [],
                numberScopeList: []
            }
        },
        created() {
            this.getList();
            this.getItemList();
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
                getNumberScopeList(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.list = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            handleSelectionChange(row) {
                this.selectedRows = row;
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.addDialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.zwfwNumberScope = copyProperties(this.zwfwNumberScope, row);
                this.dialogStatus = 'update';
                this.addDialogFormVisible = true;
            },
            handleDelete() {
                const selectCounts = this.selectedRows.length;
                if (this.selectedRows.length == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将删除关联信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delZwfwNumberScope(ids).then(response => {
                            this.listLoading = false;
                            if (response.httpCode === 200) {
                                this.total -= selectCounts;
                                this.$message.success('删除成功');
                            } else {
                                this.$message.error('删除失败')
                            }
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
                this.$refs['zwfwNumberScope'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwNumberScope(this.zwfwNumberScope).then(response => {
                            this.listLoading = false;
                            if (response.httpCode === 200) {
                                this.list.unshift(response.data);
                                this.total += 1;
                                this.$message.success('创建成功');
                            } else {
                                this.$message.error('创建失败')
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['zwfwNumberScope'].validate(valid => {
                    if (valid) {
                        this.addDialogFormVisible = false;
                        this.listLoading = true;
                        updateZwfwNumberScope(this.zwfwNumberScope).then(response => {
                            this.listLoading = false;
                            if (response.httpCode === 200) {
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
                            } else {
                                this.$message.error('更新失败')
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.zwfwNumberScope = {
                    id: undefined,
                    prefixName: '',
                    beginNumber: ''
                };
            },
            handleItemList(row) {
                this.currentItem = row;
                this.dialogStatus = 'associateItem';
                this.dialogFormVisibleItem = true;
                this.numberScopeId = row.id;
                this.getItemListByNumberScopeId();
            },
            getItemListByNumberScopeId() {
                this.listLoading1 = true;
                const query = {
                    numberScopeId: this.numberScopeId
                }
                getAllItemNumberScope(query).then(response => {
                    this.listLoading1 = false;
                    if (response.httpCode === 200) {
                        const arr = [];
                        for (const ids of response.data) {
                            for (const idList of this.itemNumberScopeList) {
                                if (ids.itemId == idList.id) {
                                    arr.push(idList);
                                }
                            }
                        }
                        this.zwfwItemList = arr
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getItemList() {
                const query = {}
                getAllByNameOrbasicCode(query).then(response => {
                    if (response.httpCode === 200) {
                        this.itemNumberScopeList = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            remoteMethod(query) {
                const listQueryName = {
                    name: undefined,
                    basicCode: undefined
                }
                if (query !== '') {
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(query)) {
                        listQueryName.name = query;
                    } else {
                        listQueryName.basicCode = query
                    }
                    getAllByNameOrbasicCode(listQueryName).then(response => {
                        if (response.httpCode === 200) {
                            this.optionsName = response.data;
                        } else {
                            this.$message.error('数据加载失败')
                        }
                    })
                } else {
                    this.optionsName = [];
                }
            },
            changeMaterial(value) {
                for (const obj of this.itemNumberScopeList) {
                    if (obj.name == value) {
                        this.zwfwItem = Object.assign({}, obj);
                    }
                }
            },
            saveCategoryItem() {
                const query = {};
                getAllItemNumberScope(query).then(response => {
                    if (response.httpCode === 200) {
                        this.numberScopeList = response.data;
                        this.$refs['zwfwItemForm'].validate((valid) => {
                            if (valid) {
                                for (let obj of this.zwfwItemList) {
                                    if (obj.id == this.zwfwItem.id) {
                                        this.$message.warning('事项已存在');
                                        this.resetTemp1();
                                        resetForm(this, 'zwfwItemForm');
                                        return false;
                                    }
                                }
                                for (const arr of this.numberScopeList) {
                                    if (arr.itemId == this.zwfwItem.id) {
                                        this.$message.warning('该事项已关联其他排号前缀');
                                        this.resetTemp1();
                                        resetForm(this, 'zwfwItemForm');
                                        return false;
                                    }
                                }
                                const query = {
                                    numberScopeId: this.numberScopeId,
                                    itemId: this.zwfwItem.id
                                }
                                this.listLoading1 = true;
                                createZwfwNumberScopeItem(query).then(response => {
                                    this.listLoading1 = false;
                                    if (response.httpCode === 200) {
                                        this.zwfwItemList.unshift(this.zwfwItem);
                                        this.$message.success('创建成功');
                                        this.currentItem.numberItemCount += 1;
                                        this.resetZwfwItemForm();
                                    } else {
                                        this.$message.error('创建失败')
                                    }
                                })
                            } else {
                                return false;
                            }
                        });
                    } else {
                        this.$message.error('操作失败')
                    }
                })
            },
            handleDeleteOne() {
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading1 = true;
                        const length = this.selectedRows.length;
                        const ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        deleteZwfwNumberScopeItem(this.numberScopeId, ids).then(response => {
                            this.listLoading1 = false;
                            if (response.httpCode === 200) {
                                this.currentItem.numberItemCount -= length;
                                this.$message.success('删除成功');
                                this.resetZwfwItemForm();
                            } else {
                                this.$message.error('删除失败')
                            }
                        })
                        for (const deleteRow of this.selectedRows) {
                            const index = this.zwfwItemList.indexOf(deleteRow);
                            this.zwfwItemList.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            resetTemp1() {
                this.zwfwItem = {
                    id: undefined,
                    name: '',
                    basicCode: ''
                };
            },
            resetNumberForm() {
                this.addDialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'zwfwNumberScope');
            },
            resetZwfwItemForm() {
                this.dialogFormVisibleItem = false;
                this.resetTemp1();
                resetForm(this, 'zwfwItemForm');
            }
        }
    }
</script>
<style>
    .item {
        margin-top: 10px;
        margin-right: 40px;
    }

    .el-checkbox__label {
        font-weight: normal;
    }
</style>
