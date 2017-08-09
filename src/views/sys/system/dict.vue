<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listDictIndexQuery.name" style="width: 180px;" class="filter-item" placeholder="字典名称"></el-input>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索字典" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getDictIndexList">
                    搜索
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加用户" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleDictIndexCreate" type="primary"
                           icon="plus">
                    添加
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleDictIndexDelete" type="danger"
                           icon="delete">
                    删除
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="dictIndexlist" v-loading.body="listDictIndexLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleDictIndexSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="字典名称" min-width="140">
                <template scope="scope">
                    <span class="link-type" @click='handleDictIndexUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="索引" min-width="140">
                <template scope="scope">
                    <span>{{scope.row.key}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" min-width="130">
                <template scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="180">
                <template scope="scope">
                    <el-button class="filter-item" style="margin-left: 10px;" @click="handleDictIndexClicke(scope.row)" type="primary" size="small">
                        字典子项目
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="textMap[dialogDictIndexStatus]" :visible.sync="dialogDictIndexVisible">
            <el-form id="checkboxTable" ref="dictIndexForm" class="small-space" :model="sysDictIndex" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' :rules="sysDictIndexRules">
                <el-form-item label="字典名称" prop="name">
                    <el-input v-model="sysDictIndex.name"/>
                </el-form-item>
                <el-form-item label="索引" prop="key">
                    <span v-if="dialogDictIndexStatus == 'update'"><el-input v-model="sysDictIndex.key" disabled="disabled"/></span>
                    <span v-else><el-input v-model="sysDictIndex.key"/></span>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="sysDictIndex.remark" :rows="3"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogDictIndexVisible = false">取 消</el-button>
                <el-button v-if="dialogDictIndexStatus=='create'" type="primary" icon="circle-check" @click="createDictIndex">确 定</el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="updateDictIndex" @click="updateDictIndex">确 定</el-button>
            </div>
        </el-dialog>

        <!--字典子项目-->
        <el-dialog :title="dialogDictListTitle" :visible.sync="dialogDictListVisible">
            <div class="filter-container">
                <el-tooltip class="item" effect="dark" content="添加用户" placement="top-start">
                    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="plus" @click="handleDictCreate">
                        添加
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除用户" placement="top-start">
                    <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="delete" @click="handleDictDelete">
                        删除
                    </el-button>
                </el-tooltip>
            </div>
            <el-table :data="dictlist" v-loading.body="listDictLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleDictSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column align="center" label="序号"  min-width="140">
                    <template scope="scope">
                        <span>{{scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="子项名称" min-width="140">
                    <template scope="scope">
                        <span class="link-type" @click='handleDictUpdate(scope.row)'>{{scope.row.codeText}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="英文代码" min-width="110">
                    <template scope="scope">
                        <span>{{scope.row.code}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="排序" min-width="80">
                    <template scope="scope">
                        <span>{{scope.row.sortNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注" min-width="120">
                    <template scope="scope">
                        <span>{{scope.row.remark}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog :title="textMap[dialogDictFormStatus]" :visible.sync="dialogDictFormVisible">
            <el-form id="checkboxTable1" ref="dictForm" class="small-space" :model="sysDict" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' :rules="sysDictRules">
                <el-form-item label="英文代码" prop="code">
                    <span v-if="dialogDictFormStatus=='update'"><el-input v-model="sysDict.code" disabled="disabled"/></span>
                    <span v-else><el-input v-model="sysDict.code"/></span>
                </el-form-item>
                <el-form-item label="子项名称" prop="codeText">
                    <el-input v-model="sysDict.codeText"/>
                </el-form-item>
                <el-form-item label="排列顺序" prop="sortNo">
                    <el-input-number v-model="sysDict.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="sysDictIndex.remark" :rows="3"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogDictFormVisible = false">取 消</el-button>
                <el-button v-if="dialogDictFormStatus=='create'" type="primary" icon="circle-check" @click="createDict">确 定</el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="updateDict" @click="updateDict">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {getDictIndexList,updateDictIndex,createDictIndex,delDictIndex,getDictList,updateDict,createDict,delDict} from "api/sys/system/dict";
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    export default{
        name: 'table_demo',
        data() {
            return {
                dictIndexlist: null,
                listDictIndexLoading: true,
                listDictIndexQuery: {
                    name: ''
                },
                sysDictIndex: {
                    id: '',
                    key: '',
                    name: '',
                    remark: ''
                },
                sysDictIndexRules: {
                    key: [
                        {required: true, message: '请填写索引'}
                    ],
                    name: [
                        {required: true, message: '请填写项目名称'}
                    ]
                },
                selectedDictIndexRows: [],
                dialogDictIndexVisible: false,
                dialogDictIndexStatus: '',

                dictlist: null,
                indexId: '',
                listDictLoading: true,
                listDictQuery: {
                    indexId: ''
                },
                sysDict: {
                    id: '',
                    indexId: this.indexId,
                    code: '',
                    codeText: '',
                    sortNo: '1',
                    remark: ''
                },
                sysDictRules: {
                    code: [
                        {required: true, message: '请填写英文代码'}
                    ],
                    codeText: [
                        {required: true, message: '请填写字典项名称'}
                    ],
                    sortNo: [
                        {required: true, message: '请填写排列顺序'}
                    ]
                },
                selectedDictRows: [],
                dialogDictListVisible: false,
                dialogDictFormVisible: false,
                dialogDictFormStatus: '',
                dialogDictListTitle: ''
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums'
            ])
        },
        created() {
            this.getDictIndexList();
        },
        methods: {
            getDictIndexList() {
                this.listDictIndexLoading = true;
                getDictIndexList(this.listDictIndexQuery).then(response => {
                    this.dictIndexlist = response.data;
                    this.listDictIndexLoading = false;
                })
            },
            handleDictIndexSelectionChange(row) {
                this.selectedDictIndexRows = row;
            },
            handleDictIndexUpdate(row) {
                this.currentRow = row;
                this.resetDictIndexTemp();
                this.sysDictIndex = copyProperties(this.sysDictIndex, row);
                this.dialogDictIndexStatus = 'update';
                this.dialogDictIndexVisible = true;
            },
            handleDictIndexCreate() {
                this.resetDictIndexTemp();
                this.dialogDictIndexStatus = 'create';
                this.dialogDictIndexVisible = true;
            },
            createDictIndex() {
                this.$refs['dictIndexForm'].validate(valid => {
                    if (valid) {
                        this.dialogDictIndexVisible = false;
                        this.listDictIndexLoading = true;
                        createDictIndex(this.sysDictIndex).then(response => {
                            if (response.httpCode == 200){
                                this.dictIndexlist.unshift(response.data);
                                this.$message.success('更新成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listDictIndexLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            updateDictIndex() {
                this.$refs['dictIndexForm'].validate(valid => {
                    if (valid) {
                        this.dialogDictIndexVisible = false;
                        this.listDictIndexLoading = true;
                        updateDictIndex(this.sysDictIndex).then(response => {
                            if (response.httpCode == 200){
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listDictIndexLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            handleDictIndexDelete() {
                const selectCounts = this.selectedDictIndexRows.length;
                if (selectCounts == 0) {
                    this.$message.error('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedDictIndexRows) {
                            ids.push(deleteRow.id);
                        }
                        delDictIndex(ids).then(response => {
                            this.listDictIndexLoading = false;
                            this.$message.success('删除成功');
                        });
                        for (const deleteRow of this.selectedDictIndexRows) {
                            const index = this.dictIndexlist.indexOf(deleteRow);
                            this.dictIndexlist.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            resetDictIndexTemp() {
                this.sysDictIndex = {
                    id: '',
                    key: '',
                    name: '',
                    remark: ''
                };
            },


            handleDictIndexClicke(row) {
                this.indexId = row.id;
                this.dialogDictListTitle = row.name;
                this.dialogDictListVisible = true;
                this.listDictQuery.indexId = this.indexId;
                this.getDictList();
            },
            handleDictSelectionChange(row) {
                this.selectedDictRows = row;
            },
            getDictList() {
                this.listDictLoading = true;
                getDictList(this.listDictQuery).then(response => {
                    this.dictlist = response.data;
                    this.listDictLoading = false;
                })
            },
            handleDictCreate() {
                this.resetDictTemp();
                this.dialogDictFormStatus = 'create';
                this.dialogDictFormVisible = true;
            },
            createDict() {
                this.$refs['dictForm'].validate(valid => {
                    if (valid) {
                        this.dialogDictFormVisible = false;
                        this.listDictLoading = true;
                        createDict(this.sysDict).then(response => {
                            if (response.httpCode == 200){
                                this.dictlist.unshift(response.data);
                                this.$message.success('更新成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listDictLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            handleDictUpdate(row) {
                this.currentRow = row;
                this.resetDictTemp();
                this.sysDict = copyProperties(this.sysDict, row);
                this.dialogDictFormStatus = 'update';
                this.dialogDictFormVisible = true;
            },
            updateDict() {
                this.$refs['dictForm'].validate(valid => {
                    if (valid) {
                        this.dialogDictFormVisible = false;
                        this.listDictLoading = true;
                        updateDict(this.sysDict).then(response => {
                            if (response.httpCode == 200){
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listDictLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            handleDictDelete() {
                const selectCounts = this.selectedDictRows.length;
                if (selectCounts == 0) {
                    this.$message.error('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedDictRows) {
                            ids.push(deleteRow.id);
                        }
                        delDict(ids).then(response => {
                            this.listDictLoading = false;
                            this.$message.success('删除成功');
                        });
                        for (const deleteRow of this.selectedDictRows) {
                            const index = this.dictlist.indexOf(deleteRow);
                            this.dictlist.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            resetDictTemp() {
                this.sysDict = {
                    id: '',
                    indexId: this.indexId,
                    code: '',
                    codeText: '',
                    sortNo: '1',
                    remark: ''
                };
            }
        }
    }
</script>