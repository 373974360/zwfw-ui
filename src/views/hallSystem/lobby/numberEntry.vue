<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="50px" align="center" label="窗口">
                <template scope="scope">
                    <el-tooltip content="点击编辑" placement="right" effect="dark">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="日期">
                <template scope="scope">
                    <span>{{scope.row.entryTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办件量">
                <template scope="scope">
                    <span>{{scope.row.count}}</span>
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
                   :close-on-click-modal="closeOnClickModal" :before-close="resetNumberEntryForm">
            <el-form ref="numberEntryForm" class="small-space" :model="numberEntry" label-position="left"
                     label-width="130px"
                     style='width: 80%; margin-left:10%;' :rules="numberEntryRules" v-loading="dialogLoading">
                <el-form-item label="窗口名称" prop="name">
                    <el-input value="综合服务G41" readonly/>
                </el-form-item>
                <el-form-item label="叫号设备key" prop="entryTime">
                    <el-date-picker
                            v-model="numberEntry.entryTime"
                            type="datetime"
                            placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" @change="changeDate">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="办件量" prop="count">
                    <el-input v-model="numberEntry.count"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="numberEntry.remark"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetNumberEntryForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="doCreate">确 定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="doUpdate" @click="doUpdate">确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {
        getNumberEntryList,
        createNumberEntry,
        updateNumberEntry,
        delNumberEntry
    } from '../../../api/hallSystem/lobby/numberEntry.js';
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    export default {
        name: 'number_entry',
        data() {
            const countValidate = (rule, value, callback) => {
                if (!/^[1-9]\d*$/.test(this.numberEntry.count)) {
                    callback(new Error('办件量是正整数'));
                }
                callback();
            };
            return {
                list: null,
                total: null,
                listLoading: true,
                dialogLoading: false,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows
                },
                numberEntry: {
                    id: undefined,
                    count: '',
                    entryTime: ''
                },
                numberEntryRules: {
                    count: [
                        {required: true, validator: countValidate, trigger: 'blur'}
                    ],
                    entryTime: [
                        {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
                    ]
                },
                dialogStatus: '',
                addDialogFormVisible: false
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
                getNumberEntryList(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.list = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.addDialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.numberEntry = copyProperties(this.numberEntry, row);
                this.dialogStatus = 'update';
                this.addDialogFormVisible = true;
            },
            doCreate() {
                this.$refs['numberEntryForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        createNumberEntry(this.numberEntry).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetNumberEntryForm();
                                this.$message.success('创建成功');
                                this.getList();
                            } else {
                                this.$message.error('创建失败')
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['numberEntryForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        updateNumberEntry(this.numberEntry).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetNumberEntryForm();
                                this.$message.success('更新成功');
                                this.getList();
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
                this.numberEntry = {
                    id: undefined,
                    count: '',
                    entryTime: ''
                };
            },
            resetNumberEntryForm() {
                this.addDialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'numberEntryForm');
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
            changeDate() {
                this.numberEntry.entryTime = moment(this.numberEntry.entryTime).format('YYYY-MM-DD HH:mm:ss');
                console.log(this.numberEntry.entryTime);
            }
        }
    }
</script>
<style scoped>
    .item {
        margin-top: 10px;
        margin-right: 40px;
    }

    .el-checkbox__label {
        font-weight: normal;
    }
</style>
