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

        <el-table ref="zwfwItemMaterialTable" :data="zwfwItemMaterialList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否需要电子材料" prop="electronicMaterial">
                <template scope="scope">
                    <span>{{scope.row.electronicMaterial}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电子表单" prop="eform">
                <template scope="scope">
                    <span>{{scope.row.eform}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="材料名称" prop="name">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="纸质材料说明（数量和规格）" prop="paperDescription">
                <template scope="scope">
                    <span>{{scope.row.paperDescription}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="受理标准" prop="acceptStandard">
                <template scope="scope">
                    <span>{{scope.row.acceptStandard}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark">
                <template scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="来源渠道" prop="source">
                <template scope="scope">
                    <span>{{scope.row.source}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="材料类型" prop="type">
                <template scope="scope">
                    <span>{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="材料样本" prop="example">
                <template scope="scope">
                    <span>{{scope.row.example}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="填报须知" prop="notice">
                <template scope="scope">
                    <span>{{scope.row.notice}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
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

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="zwfwItemMaterialForm" class="small-space" :model="zwfwItemMaterial" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwItemMaterialRules">
                <el-form-item label="是否需要电子材料" prop="electronicMaterial">
                    <el-input v-model="zwfwItemMaterial.electronicMaterial"></el-input>
                </el-form-item>
                <el-form-item label="电子表单" prop="eform">
                    <el-input v-model="zwfwItemMaterial.eform"></el-input>
                </el-form-item>
                <el-form-item label="材料名称" prop="name">
                    <el-input v-model="zwfwItemMaterial.name"></el-input>
                </el-form-item>
                <el-form-item label="纸质材料说明（数量和规格）" prop="paperDescription">
                    <el-input v-model="zwfwItemMaterial.paperDescription"></el-input>
                </el-form-item>
                <el-form-item label="受理标准" prop="acceptStandard">
                    <el-input v-model="zwfwItemMaterial.acceptStandard"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="zwfwItemMaterial.remark"></el-input>
                </el-form-item>
                <el-form-item label="来源渠道" prop="source">
                    <el-input v-model="zwfwItemMaterial.source"></el-input>
                </el-form-item>
                <el-form-item label="材料类型" prop="type">
                    <el-input v-model="zwfwItemMaterial.type"></el-input>
                </el-form-item>
                <el-form-item label="材料样本" prop="example">
                    <el-input v-model="zwfwItemMaterial.example"></el-input>
                </el-form-item>
                <el-form-item label="填报须知" prop="notice">
                    <el-input v-model="zwfwItemMaterial.notice"></el-input>
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
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import {
        getZwfwItemMaterialList,
        createZwfwItemMaterial,
        updateZwfwItemMaterial,
        delZwfwItemMaterials
    } from 'api/zwfw/zwfwItemMaterial';

    export default {
        name: 'zwfwItemMaterial_table',
        data() {
            return {
                zwfwItemMaterialList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                },
                zwfwItemMaterial: {
                    id: undefined,
                    electronicMaterial: undefined,
                    eform: undefined,
                    name: undefined,
                    paperDescription: undefined,
                    acceptStandard: undefined,
                    remark: undefined,
                    source: undefined,
                    type: undefined,
                    example: undefined,
                    notice: undefined
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                zwfwItemMaterialRules: {
                    electronicMaterial: [
                        {required: true, message: '请输入是否需要电子材料', trigger: 'blur'}
                    ],
                    eform: [
                        {required: true, message: '请输入电子表单', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入材料名称', trigger: 'blur'}
                    ],
                    paperDescription: [
                        {required: true, message: '请输入纸质材料说明（数量和规格）', trigger: 'blur'}
                    ],
                    acceptStandard: [
                        {required: true, message: '请输入受理标准', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入备注', trigger: 'blur'}
                    ],
                    source: [
                        {required: true, message: '请输入来源渠道', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请输入材料类型', trigger: 'blur'}
                    ],
                    example: [
                        {required: true, message: '请输入材料样本', trigger: 'blur'}
                    ],
                    notice: [
                        {required: true, message: '请输入填报须知', trigger: 'blur'}
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
                'enums'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                getZwfwItemMaterialList(this.listQuery).then(response => {
                    this.zwfwItemMaterialList = response.data.list;
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
                this.$refs.zwfwItemMaterialTable.toggleRowSelection(row);
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
                this.zwfwItemMaterial = copyProperties(this.zwfwItemMaterial, row);
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
                        delZwfwItemMaterials(ids).then(response => {
                            this.total -= selectCounts;
                            for (const deleteRow of this.selectedRows) {
                                const index = this.zwfwItemMaterialList.indexOf(deleteRow);
                                this.zwfwItemMaterialList.splice(index, 1);
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
                this.$refs['zwfwItemMaterialForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwItemMaterial(this.zwfwItemMaterial).then(response => {
                            this.zwfwItemMaterialList.unshift(response.data);
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
                this.$refs['zwfwItemMaterialForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateZwfwItemMaterial(this.zwfwItemMaterial).then(response => {
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
                this.zwfwItemMaterial = {
                    id: undefined,
                    electronicMaterial: undefined,
                    eform: undefined,
                    name: undefined,
                    paperDescription: undefined,
                    acceptStandard: undefined,
                    remark: undefined,
                    source: undefined,
                    type: undefined,
                    example: undefined,
                    notice: undefined
                };
            }
        }
    }
</script>
