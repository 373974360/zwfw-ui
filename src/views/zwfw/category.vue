<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="plus">
                添加
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="categoryList" :list-loading="listLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete" :handle-create1="handleCreate1">
        </tree-grid>

        <el-dialog  :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModal">
            <el-form ref="categoryForm" class="small-space" :model="category" label-position="right" label-width="110px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="categoryRules">
                <el-form-item label="上级事项分类">
                    <el-cascader :options="cascader" v-model="cascaderModel" @change="handleChange"
                                 :show-all-levels="true" expand-trigger="hover" :clearable="true"
                                 :change-on-select="true" style="width:100%"></el-cascader>
                </el-form-item>
                <el-form-item label="事项分类名称" prop="name">
                    <el-input v-model="category.name"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="category.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="category.remark"></el-input>
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

        <!--事项关联dialog-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisibleItem" :close-on-click-modal="closeOnClickModal">
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
                        <span>{{scope.row.type}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办件类型" prop="processType">
                    <template scope="scope">
                        <el-tag :type="scope.row.processType | dicts('bjlx')">
                            {{scope.row.processType | dicts('bjlx')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办理形式" prop="handleType">
                    <template scope="scope">
                        <el-tag :type="scope.row.handleType | dicts('blxs')">
                            {{scope.row.handleType | dicts('blxs')}}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-form ref="zwfwItemForm" class="small-space" :model="zwfwItem"
                     label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%; margin-top: 5%;' v-loading="dialogLoading"
                     :rules="categoryItemRules">
                <el-form-item label="事项名称" prop="name">
                    <el-select
                            v-model="zwfwItem.name"
                            filterable
                            remote
                            placeholder="请输入关键词"
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
    import TreeGrid from 'components/TreeGrid';
    import {getCategoryTree, getCategoryCascader, createCategory, updateCategory, delCategory} from 'api/zwfw/category';
    import {getAllByNameOrbasicCode} from 'api/zwfw/zwfwItem';
    import {getAllCategoeyItem, createZwfwCategoryItem, deleteZwfwCategoryItem} from 'api/zwfw/zwfwCategoryItem';
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from 'utils/TreeUtil.js';


    export default {
        name: 'category_table',
        data() {
            return {
                categoryList: [],
                categoryItem: [],
                zwfwItemList: [],
                listLoading: true,
                listLoading1: true,
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'id',
                        width: '300'
                    },
                    {
                        text: '事项分类名称',
                        dataIndex: 'name',
                        editAble: true
                    },
                    {
                        text: '创建时间',
                        dataIndex: 'createTime',
                        dateformart: 'YYYY-MM-DD HH:mm:ss',
                        width: '450'
                    },
                    {
                        text: '状态',
                        dataIndex: 'enable',
                        enums: 'Enable',
                        width: '150'
                    }
                ],
                category: {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    treePosition: '',
                    enable: '',
                    remark: ''
                },
                zwfwItem: {
                    id: undefined,
                    name: '',
                    basicCode: ''
                },
                selectedRows: [],
                categoryId: '',
                itemCategoryList: [],
                cascader: [],
                optionsName: [],
                dialogFormVisible: false,
                dialogFormVisibleItem: false,
                dialogStatus: '',
                dialogLoading: false,
                categoryRules: {
                    name: [
                        {required: true, message: '请输入事项分类名称'}
                    ]
                },
                categoryItemRules: {
                    name: [
                        {required: true, message: '请输入事项名称'}
                    ]
                }
            }
        },
        components: {
            TreeGrid
        },
        created() {
            this.getList();
            this.getItemList();
        },
        computed: {
            cascaderModel: function () {
                if (this.category.treePosition) {
                    const arr = this.category.treePosition.split('&');
                    return arr;
                }
            },
            ...mapGetters([
                'textMap',
                'closeOnClickModal'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                getCategoryTree().then(response => {
                    this.categoryList = response.data;
                    this.listLoading = false;
                })
            },
            getOptions(id) {
                this.dialogLoading = true;
                getCategoryCascader(id).then(response => {
                    this.cascader = response.data;
                    this.dialogLoading = false;
                })
            },
            handleChange(value) {
                if (value.length > 0) {
                    this.category.parentId = value[value.length - 1];
                    this.category.treePosition = value.join('&');
                } else {
                    this.category.parentId = 0;
                    this.category.treePosition = undefined;
                }
            },
            handleToggle(row) {
                row._expanded = !row._expanded;
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            handleCreate(row) {
                this.resetTemp();
                if (row.treePosition) {
                    if (row.treePosition.substr(0, 1) == "&") {
                        this.category.treePosition = row.treePosition.substring(1);
                    } else {
                        this.category.treePosition = row.treePosition;
                    }
                }
                if (row.id) {
                    this.category.parentId = row.id;
                } else {
                    this.category.parentId = 0;
                }
                this.getOptions(null);
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
                resetForm(this, 'categoryForm');
            },
            handleUpdate(row) {
                this.resetTemp();
                this.category = copyProperties(this.category, row);
                if (row._parent) {
                    this.category.treePosition = row._parent.treePosition;
                } else {
                    this.category.treePosition = undefined;
                }
                this.getOptions(this.category.id);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleCreate1(row) {
                this.currentItem = row;
                this.dialogStatus = 'associateItem';
                this.dialogFormVisibleItem = true;
                resetForm(this, 'zwfwItemForm');
                this.categoryId = row.id;
                this.getItemListByCategoryId();
            },
            getItemListByCategoryId() {
                this.listLoading1 = true;
                getAllCategoeyItem(this.categoryId).then(response => {
                    const arr = [];
                    console.log(response.data);
                    for (const ids of response.data) {
                        for (const idList of this.itemCategoryList) {
                            if (ids.itemId == idList.id) {
                                arr.push(idList);
                            }
                        }
                    }
                    this.zwfwItemList = arr;
                    this.listLoading1 = false;
                })
            },
            getItemList() {
                const query = {}
                getAllByNameOrbasicCode(query).then(response => {
                    this.itemCategoryList = response.data;
                    console.log(this.itemCategoryList);
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
                        this.optionsName = response.data;
                    })
                } else {
                    this.optionsName = [];
                }
            },
            changeMaterial(value) {
                for (const obj of this.itemCategoryList) {
                    if (obj.name == value) {
                        this.zwfwItem = Object.assign({}, obj);
                    }
                }
            },
            saveCategoryItem() {
                this.categoryItemRules.name[0].required = true;
                this.$refs['zwfwItemForm'].validate((valid) => {
                    if (valid) {
                        for (let obj of this.zwfwItemList) {
                            if (obj.id == this.zwfwItem.id) {
                                this.$message.warning('事项已存在');
                                this.zwfwItem = {};
                                this.categoryItemRules.name[0].required = false;
                                return false;
                            }
                        }
                        const query = {
                            categoryId: this.categoryId,
                            itemId: this.zwfwItem.id
                        }
                        this.listLoading1 = true;
                        createZwfwCategoryItem(query).then(response => {
                            this.zwfwItemList.unshift(this.zwfwItem);
                            this.$message.success('创建成功');
                            this.listLoading1 = false;
                            this.currentItem.categoryItemCount += 1;
                            this.categoryItemRules.name[0].required = false;
                            this.zwfwItem = {};
                        })
                    } else {
                        return false;
                    }
                });
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
                        const length = this.selectedRows.length;
                        const ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        deleteZwfwCategoryItem(this.categoryId, ids).then(response => {
                            this.currentItem.categoryItemCount -= length;
                            this.$message.success('删除成功');
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
            handleDelete(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    delCategory(row.id).then(response => {
                        TreeUtil.delRow(response.data, this.categoryList);
                        this.$message.success('删除成功');
                        this.listLoading = false;
                    })
                }).catch(() => {
                    console.dir("取消");
                });
            },
            create() {
                this.$refs['categoryForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        console.dir(this.category.parentId);
                        createCategory(this.category).then(response => {
                            this.$message.success('创建成功');
                            TreeUtil.addRow(response.data, this.categoryList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['categoryForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        updateCategory(this.category).then(response => {
                            this.$message.success('更新成功');
                            TreeUtil.editRow(response.data, this.categoryList);
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.category = {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    treePosition: '',
                    remark: '',
                    enable: ''
                };
            }
        }
    }
</script>
