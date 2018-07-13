<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.label"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>

        <el-table ref="formFieldTable" :data="formFieldList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <!--<el-table-column align="center" label="序号">-->
                <!--<template slot-scope="scope">-->
                    <!--<span>{{scope.row.id}}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="表单域名称" prop="label">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.label}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="唯一标识">
                <template slot-scope="scope">
                    <span>{{scope.row.key}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="默认内容">
                <template slot-scope="scope">
                    <span>{{scope.row.defaultValue}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型">
                <template slot-scope="scope">
                    <span>{{scope.row.inputType | enums('InputType')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="必填">
                <template slot-scope="scope">
                    <i v-if="scope.row.require" style="color:green" class="el-icon-circle-check"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="复用">
                <template slot-scope="scope">
                    <i v-if="scope.row.flagHistoryValue" style="color:green" class="el-icon-circle-check"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="正则表达式">
                <template slot-scope="scope">
                    <span>{{scope.row.regex}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="正则验证失败提示">
                <template slot-scope="scope">
                    <span>{{scope.row.regexError}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column prop="enable" class-name="status-col" label="状态">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-tag :type="scope.row.enable | enums('Enable') | statusFilter">-->
                        <!--{{scope.row.enable | enums('Enable')}}-->
                    <!--</el-tag>-->
                <!--</template>-->
            <!--</el-table-column>-->
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetFormFieldForm">
            <el-form ref="formFieldForm" class="small-space" :model="formField" label-position="right"
                     label-width="120px"
                     label-suffix="："
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="formFieldRules">
                <el-form-item label="上级表单域分类">
                    <el-cascader :options="cascader" v-model="selectedCategoryArray" @change="handleChange"
                                 :show-all-levels="false" expand-trigger="hover" :clearable="true"
                                 :change-on-select="false" style="width:100%"></el-cascader>
                </el-form-item>
                <el-form-item label="名称" prop="label">
                    <el-input v-model="formField.label"/>
                </el-form-item>
                <el-form-item label="key" prop="key">
                    <el-input v-model="formField.key"/>
                </el-form-item>
                <el-form-item label="类型" prop="inputType">
                    <el-select v-model="formField.inputType">
                        <el-option v-for="type in enums['InputType']"
                                   :key="type.code" :value="type.code" :label="type.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="formField.inputType == 2 || formField.inputType == 3" label="选项字典" prop="optionDic">
                    <el-input v-model="formField.optionDic"/>
                    <br>
                    <span>选项之间使用分号(|)隔开</span>
                </el-form-item>
                <el-form-item label="默认内容" prop="defaultValue">
                    <el-input v-model="formField.defaultValue"/>
                </el-form-item>
                <el-form-item label="是否是必填项" prop="require">
                    <el-checkbox v-model="formField.require" true-label="1" false-label="0"/>
                </el-form-item>
                <el-form-item label="是否可复用" prop="flagHistoryValue">
                    <el-checkbox v-model="formField.flagHistoryValue" true-label="1" false-label="0"/>
                    <br>
                    <span>如果此内容后期可在输入时复用请勾选，否则请勿勾选</span>
                </el-form-item>
                <el-form-item v-if="formField.inputType == 1" label="正则表达式" prop="regex">
                    <el-input type="textarea" v-model="formField.regex"/>
                    <br>
                    <a href="https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=%E5%B8%B8%E7%94%A8%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F"
                       class="link-type" target="_blank">常用正则表达式</a>
                </el-form-item>
                <el-form-item v-if="formField.inputType == 1" label="验证失败提示" prop="regexError">
                    <el-input v-model="formField.regexError"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formField.remark"/>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetFormFieldForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {copyProperties, resetForm} from '../../../utils';
    import {mapGetters} from 'vuex';
    import {
        getFormFieldList,
        createFormField,
        updateFormField,
        delFormFields
    } from '../../../api/baseSystem/data/formField';

    import {
        getCategoryTree,
        getCategoryCascader
    } from '../../../api/baseSystem/data/formFieldCategory';

    export default {
        name: 'formField_table',
        data() {
            return {
                formFieldList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    label: undefined
                },
                formField: {
                    id: undefined,
                    categoryId: undefined,
                    label: undefined,
                    key: undefined,
                    inputType: undefined,
                    require: false,
                    defaultValue: null,
                    regex: undefined,
                    regexError: undefined,
                    remark: undefined,
                    optionDic: undefined,
                    flagHistoryValue: false
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                formFieldRules: {
                    label: [
                        {required: true, message: '请输入表单域名称'}
                    ],
                    key: [
                        {required: true, message: '请输入表单域key'}
                    ]
                },
                cascader: [],
                selectedCategoryArray: []
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
                getFormFieldList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.formFieldList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listLoading = false;
                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.label = null;
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
                this.$refs.formFieldTable.toggleRowSelection(row);
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
                this.selectedCategoryArray = [];
                this.getOptions(null);
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.formField = copyProperties(this.formField, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
                this.selectedCategoryArray = [];
                if (this.formField.categoryId) {
                    this.selectedCategoryArray.push(this.formField.categoryId);
                }
                this.getOptions(this.formField.categoryId);
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
                        delFormFields(ids).then(response => {
                            if (response.httpCode === 200) {
                                this.total -= selectCounts;
                                for (const deleteRow of this.selectedRows) {
                                    const index = this.formFieldList.indexOf(deleteRow);
                                    this.formFieldList.splice(index, 1);
                                }
                                this.$message.success('删除成功！');
                                this.listLoading = false;
                            } else {
                                this.$message.error('删除失败！');
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            create() {
                this.$refs['formFieldForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createFormField(this.formField).then(response => {
                            if (response.httpCode === 200) {
                                this.formFieldList.unshift(response.data);
                                this.total += 1;
                                this.$message.success('创建成功！');
                                this.listLoading = false;
                            } else {
                                this.$message.error('创建失败！');
                            }
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['formFieldForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateFormField(this.formField).then(response => {
                            if (response.httpCode === 200) {
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功！');
                                this.listLoading = false;
                            } else {
                                this.$message.error('更新失败！');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.formField = {
                    id: undefined,
                    categoryId: undefined,
                    label: undefined,
                    key: undefined,
                    inputType: 1,
                    require: false,
                    defaultValue: null,
                    regex: undefined,
                    regexError: undefined,
                    remark: undefined,
                    optionDic: undefined,
                    flagHistoryValue: false
                };
            },
            resetFormFieldForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'formFieldForm');
            },
            getOptions(id) {
                getCategoryCascader(id).then(response => {
                    if (response.httpCode === 200) {
                        this.cascader = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            },
            handleChange(value) {
                if (value.length > 0) {
                    this.formField.categoryId = value[value.length - 1];
                } else {
                    this.formField.categoryId = value;
                }
            }
        }
    }
</script>
