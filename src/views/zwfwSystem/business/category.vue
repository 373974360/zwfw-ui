<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="plus">
                添加
            </el-button>
        </div>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="categoryList" :list-loading="pageLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete" :defaultExpandAll="false"
                   :handle-item="handleCreateItem"
                   :assoicateItem="showButton">
        </tree-grid>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="closeCategoryForm">
            <el-form ref="categoryForm" class="small-space" :model="category" label-position="right" label-width="110px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogFormLoading" :rules="categoryRules">
                <el-form-item label="上级事项分类">
                    <el-cascader :options="cascader" v-model="cascaderModel" @change="handleChange"
                                 :show-all-levels="true" expand-trigger="hover" :clearable="true"
                                 :change-on-select="true" style="width:100%"></el-cascader>
                </el-form-item>
                <el-form-item label="事项分类名称" prop="name">
                    <el-input v-model="category.name"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-upload class="avatar-uploader" name="uploadFile"
                               :accept="acceptTypes"
                               :action="uploadAction"
                               :on-success="handleAvatarSuccess"
                               :on-error="handlerAvatarError"
                               :before-upload="beforeAvatarUpload"
                               :show-file-list="false"
                               :on-remove="handleRemove">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="category.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="category.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="closeCategoryForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="doCategoryCreate">确
                    定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="doCategoryUpdate"
                           @click="doCategoryUpdate">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--事项关联dialog-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisibleItem"
                   :close-on-click-modal="closeOnClickModal" :before-close="closeZwfwItemForm" >
            <div class="filter-container">
                <el-input @keyup.enter.native="getCategoryItemList" style="width: 230px;" class="filter-item"
                          placeholder="输入事项名称/基本编码"
                          v-model="listQuery.name"></el-input>
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getCategoryItemList">搜索</el-button>
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleItemDelete" type="danger"
                           icon="delete">
                    删除
                </el-button>
            </div>
            <el-table ref="zwfwItemTable" :data="categoryItemList" v-loading.body="dialogTableLoading" border fit
                      highlight-current-row
                      style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"/>
                <el-table-column align="center" label="事项ID" width="80">
                    <template scope="scope">
                        <span>{{scope.row.itemId}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项名称" prop="name">
                    <template scope="scope">
                        <span>{{scope.row.itemName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="基本编码" prop="basicCode" width="120">
                    <template scope="scope">
                        <span>{{scope.row.basicCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项类型" prop="type" width="100">
                    <template scope="scope">
                        <span>{{scope.row.type | dics('sslx')}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办件类型" prop="processType" width="110">
                    <template scope="scope">
                        <el-tag :type="scope.row.processType | dics('bjlx')">
                            {{scope.row.processType | dics('bjlx')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办理形式" prop="handleType" width="110">
                    <template scope="scope">
                        <el-tag :type="scope.row.handleType | dics('blxs')">
                            {{scope.row.handleType | dics('blxs')}}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                               :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="categoryItemListTotle">
                </el-pagination>
            </div>
            <el-form ref="zwfwItemForm" class="small-space" :model="zwfwItem"
                     label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%; margin-top: 5%;' v-loading="dialogFormLoading"
                     :rules="categoryItemRules">
                <el-form-item label="事项名称" prop="name">
                    <el-autocomplete
                            v-model="zwfwItem.name"
                            :fetch-suggestions="searchItem"
                            placeholder="请输入事项名称或基本编码"
                            @select="changeItem" style="width:100%"
                            :props="{label:'name',value:'name'}"
                    ></el-autocomplete>
                </el-form-item>
            </el-form>
            <div style="text-align: center" slot="footer" class="dialog-footer">
                <el-button type="primary" icon="circle-check" @click="saveCategoryItem">添加
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeGrid from 'components/TreeGrid';
    import {
        getCategoryTree,
        getCategoryCascader,
        createCategory,
        updateCategory,
        delCategory
    } from 'api/zwfwSystem/business/category';
    import {getAllByNameOrbasicCode} from 'api/zwfwSystem/business/item';
    import {
        getAllPageList,
        createZwfwCategoryItem,
        deleteZwfwCategoryItem
    } from 'api/zwfwSystem/business/categoryItem';
    import {copyProperties, resetForm, validateQueryStr} from 'utils';
    import {mapGetters} from 'vuex';
    import TreeUtil from 'utils/TreeUtil.js';


    export default {
        name: 'category_table',
        data() {
            return {
                imageUrl: '',
                categoryList: [],
                itemList: [],
                categoryItem: [],
                categoryItemList: [],
                categoryItemListTotle: 0,
                pageLoading: true,
                dialogTableLoading: true,
                showButton: true,
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'id',
                        width: 300
                    },
                    {
                        text: '事项分类名称',
                        dataIndex: 'name',
                        editAble: true
                    },
                    {
                        text: '创建时间',
                        dataIndex: 'createTime',
                        dateformart: 'YYYY-MM-DD HH:mm:ss'
                    },
                    {
                        text: '状态',
                        dataIndex: 'enable',
                        enums: 'Enable',
                        width: 150
                    }
                ],
                category: {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    treePosition: '',
                    enable: '',
                    remark: '',
                    icon: ''
                },
                zwfwItem: {
                    id: undefined,
                    name: '',
                    basicCode: ''
                },
                selectedRows: [],
                categoryId: '',
                cascader: [],
                optionsName: [],
                dialogFormVisible: false,
                dialogFormVisibleItem: false,
                dialogStatus: '',
                dialogFormLoading: false,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.dialogRows,
                    categoryId: undefined,
                    name: ''
                },
                categoryRules: {
                    name: [
                        {required: true, message: '请输入事项分类名称'}
                    ]
                },
                categoryItemRules: {
                    name: [
                        {required: true, message: '请输入事项名称或基本编码'}
                    ]
                },
                uploadAction: this.$store.state.app.uploadUrl,
                acceptTypes: this.$store.state.app.imageAccepts
            }
        },
        components: {
            TreeGrid
        },
        created() {
            this.getCategoryList();
        },
        computed: {
            cascaderModel() {
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
            getCategoryList() {
                this.pageLoading = true;
                getCategoryTree().then(response => {
                    if (response.httpCode === 200) {
                        this.categoryList = response.data;
                    } else {
                        this.$message.error(response.msg || '数据加载失败');
                    }
                    this.pageLoading = false;
                })
            },
            getItemList() {
                const query = {}
                getAllByNameOrbasicCode(query).then(response => {
                    if (response.httpCode === 200) {
                        this.itemList = response.data;
                    } else {
                        this.$message.error(response.msg || '数据加载失败');
                    }
                })
            },
            getOptions(id) {
                this.dialogFormLoading = true;
                getCategoryCascader(id).then(response => {
                    if (response.httpCode === 200) {
                        this.cascader = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.dialogFormLoading = false;
                })
            },
            handleCreate(row) {
                this.resetCategoryTemp();
                if (row.treePosition) {
                    if (row.treePosition.substr(0, 1) === '&') {
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
            },
            handleUpdate(row) {
                this.resetCategoryTemp();
                this.category = copyProperties(this.category, row);
                if (row._parent) {
                    this.category.treePosition = row._parent.treePosition;
                } else {
                    this.category.treePosition = undefined;
                }
                this.getOptions(this.category.id);
                this.imageUrl = this.category.icon;
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.doCategoryDelete(row.id);
                }).catch(() => {
                    console.dir('取消');
                });
            },
            doCategoryCreate() {
                this.$refs['categoryForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormLoading = true;
                        createCategory(this.category).then(response => {
                            this.dialogFormLoading = false;
                            if (response.httpCode === 200) {
                                this.closeCategoryForm();
                                this.$message.success('创建成功！');
//                                TreeUtil.addRow(response.data, this.categoryList);
                                this.getCategoryList();
                            } else {
                                this.$message.error('创建失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doCategoryUpdate() {
                this.$refs['categoryForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormLoading = true;
                        updateCategory(this.category).then(response => {
                            this.dialogFormLoading = false;
                            if (response.httpCode === 200) {
                                this.closeCategoryForm();
                                this.$message.success('更新成功');
//                                TreeUtil.editRow(response.data, this.categoryList);
                                this.getCategoryList();
                            } else {
                                this.$message.error('更新失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doCategoryDelete(id) {
                this.pageLoading = true;
                delCategory(id).then(response => {
                    if (response.httpCode === 200) {
                        TreeUtil.delRow(response.data, this.categoryList);
                        this.$message.success('删除成功！');
                    } else {
                        this.$message.error('删除失败！');
                    }
                    this.pageLoading = false;
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

            handleAvatarSuccess(res, file, fileList) {
                if (res.state === 'SUCCESS') {
                    this.imageUrl = URL.createObjectURL(file.raw);
                    this.category.icon = res.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerAvatarError(err, file, fileList) {
                console.log(err);
                this.$message.error("网络不稳定，上传失败");
            },
            beforeAvatarUpload(file) {
                const isJPG = this.acceptTypes.includes(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片格式不正确!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            handleRemove() {
                this.category.icon = '';
            },
            handleToggle(row) {
                row._expanded = !row._expanded;
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            handleCreateItem(row) {
                this.currentItem = row;
                this.dialogStatus = 'associateItem';
                this.dialogFormVisibleItem = true;
                this.categoryId = row.id;
                this.getCategoryItemList();
            },
            getCategoryItemList() {
                this.dialogTableLoading = true;
                this.listQuery.categoryId = this.categoryId;
                getAllPageList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.categoryItemList = response.data.list;
                        this.categoryItemListTotle = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.dialogTableLoading = false;
                })
            },
            searchItem(query, cb) {
                const listQueryName = {
                    name: undefined,
                    basicCode: undefined
                }
                if (query !== '') {
                    let valid = validateQueryStr(query);
                    if (valid) {
                        this.$message.error(`输入中包含非法字符 ${valid}`)
                        return
                    }
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(query)) {
                        listQueryName.name = query;
                    } else {
                        listQueryName.basicCode = query
                    }
                    getAllByNameOrbasicCode(listQueryName).then(response => {
                        if (response.httpCode === 200) {
                            this.optionsName = response.data;
                            cb(this.optionsName);
                        } else {
                            this.$message.error(response.msg);
                        }
                    })
                } else {
                    this.optionsName = [];
                }
            },
            changeItem(value) {
                this.zwfwItem = value;
                // for (const obj of this.itemList) {
                //     if (obj.id === value) {
                //         this.zwfwItem = Object.assign({}, obj);
                //     }
                // }
            },
            handleItemDelete() {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doCategoryItemDelete();
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            saveCategoryItem() {
                this.$refs['zwfwItemForm'].validate(valid => {
                    if (valid) {
                        for (const obj of this.categoryItemList) {
                            if (obj.itemId === this.zwfwItem.id) {
                                this.$message.warning('事项已存在');
                                this.resetZwfwItemForm()
                                return false;
                            }
                        }
                        const query = {
                            categoryId: this.categoryId,
                            itemId: this.zwfwItem.id
                        }
                        this.dialogFormLoading = true;
                        createZwfwCategoryItem(query).then(response => {
                            this.dialogFormLoading = false;
                            if (response.httpCode === 200) {
                                this.getCategoryItemList();
                                this.$message.success('关联成功！');
                                this.currentItem.categoryItemCount += 1;
                                this.resetZwfwItemForm();
                            } else {
                                this.$message.error('关联失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doCategoryItemDelete() {
                const length = this.selectedRows.length;
                const ids = [];
                for (const deleteRow of this.selectedRows) {
                    ids.push(deleteRow.id);
                }
                deleteZwfwCategoryItem(this.categoryId, ids.join()).then(response => {
                    if (response.httpCode === 200) {
                        this.currentItem.categoryItemCount -= length;
                        for (const deleteRow of this.selectedRows) {
                            const index = this.categoryItemList.indexOf(deleteRow);
                            this.categoryItemList.splice(index, 1);
                        }
                        this.$message.success('删除成功！');
                    } else {
                        this.$message.error('删除失败！');
                    }
                })
            },
            closeCategoryForm() {
                this.dialogFormVisible = false;
                this.resetCategoryTemp();
                this.imageUrl = '';
                resetForm(this, 'categoryForm');
            },
            closeZwfwItemForm() {
                this.dialogFormVisibleItem = false;
                this.resetZwfwItemForm();
            },
            resetZwfwItemForm() {
                this.resetItemTemp();
                resetForm(this, 'zwfwItemForm');
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.categoryId = undefined;
                this.getCategoryItemList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getCategoryItemList();
            },
            resetCategoryTemp() {
                this.category = {
                    id: undefined,
                    name: '',
                    parentId: 0,
                    sortNo: 1,
                    treePosition: '',
                    remark: '',
                    enable: '',
                    icon: ''
                };
            },
            resetItemTemp() {
                this.zwfwItem = {
                    id: undefined,
                    name: '',
                    basicCode: ''
                };
            }
        }
    }
</script>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
