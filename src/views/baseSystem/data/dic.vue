<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="listDicIndexQuery.name" style="width: 180px;" class="filter-item" placeholder="字典名称"></el-input>
            <el-tooltip style="margin-left: 10px;" class="item" effect="dark" content="搜索字典" placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getDicIndexList">
                    搜索
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加用户" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleDicIndexCreate" type="primary"
                           icon="plus">
                    添加
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top-start">
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleDicIndexDelete" type="danger"
                           icon="delete">
                    删除
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="dicIndexlist" v-loading.body="listDicIndexLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleDicIndexSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="字典名称" min-width="140">
                <template scope="scope">
                    <span class="link-type" @click='handleDicIndexUpdate(scope.row)'>{{scope.row.name}}</span>
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
                    <el-button class="filter-item" style="margin-left: 10px;" @click="handleDicIndexClicke(scope.row)" type="primary" size="small">
                        字典子项目
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="textMap[dialogDicIndexStatus]" :visible.sync="dialogDicIndexVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetCheckboxTable">
            <el-form id="checkboxTable" ref="dicIndexForm" class="small-space" :model="dicIndex" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' :rules="dicIndexRules">
                <el-form-item label="字典名称" prop="name">
                    <el-input v-model="dicIndex.name"/>
                </el-form-item>
                <el-form-item label="索　　引" prop="key">
                    <span v-if="dialogDicIndexStatus == 'update'"><el-input v-model="dicIndex.key" disabled="disabled"/></span>
                    <span v-else><el-input v-model="dicIndex.key"/></span>
                </el-form-item>
                <el-form-item label="备　　注">
                    <el-input type="textarea" v-model="dicIndex.remark" :rows="3"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetCheckboxTable">取 消</el-button>
                <el-button v-if="dialogDicIndexStatus=='create'" type="primary" icon="circle-check" @click="createDicIndex">确 定</el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="updateDicIndex" @click="updateDicIndex">确 定</el-button>
            </div>
        </el-dialog>

        <!--字典子项目-->
        <el-dialog :title="dialogDictListTitle" :visible.sync="dialogDictListVisible" :close-on-click-modal="closeOnClickModal">
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
            <el-table :data="diclist" v-loading.body="listDictLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleDictSelectionChange">
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
        <el-dialog :title="textMap[dialogDictFormStatus]" :visible.sync="dialogDictFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetDictForm">
            <el-form id="checkboxTable1" ref="dicForm" class="small-space" :model="dic" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' :rules="dicRules">
                <el-form-item label="英文代码" prop="code">
                    <span v-if="dialogDictFormStatus=='update'"><el-input v-model="dic.code" disabled="disabled"/></span>
                    <span v-else><el-input v-model="dic.code"/></span>
                </el-form-item>
                <el-form-item label="子项名称" prop="codeText">
                    <el-input v-model="dic.codeText"/>
                </el-form-item>
                <el-form-item label="排列顺序" prop="sortNo">
                    <el-input-number v-model="dic.sortNo" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="备　　注">
                    <el-input type="textarea" v-model="dicIndex.remark" :rows="3"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetDictForm">取 消</el-button>
                <el-button v-if="dialogDictFormStatus=='create'" type="primary" icon="circle-check" @click="createDict">确 定</el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="updateDict" @click="updateDict">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {getDicIndexList,updateDicIndex,createDicIndex,delDicIndex,getDictList,updateDict,createDict,delDict} from "api/baseSystem/data/dic";
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    export default{
        name: 'table_demo',
        data() {
            return {
                dicIndexlist: null,
                listDicIndexLoading: true,
                listDicIndexQuery: {
                    name: ''
                },
                dicIndex: {
                    id: '',
                    key: '',
                    name: '',
                    remark: ''
                },
                dicIndexRules: {
                    key: [
                        {required: true, message: '请填写索引'}
                    ],
                    name: [
                        {required: true, message: '请填写项目名称'}
                    ]
                },
                selectedDicIndexRows: [],
                dialogDicIndexVisible: false,
                dialogDicIndexStatus: '',

                diclist: null,
                indexId: '',
                listDictLoading: true,
                listDictQuery: {
                    indexId: ''
                },
                dic: {
                    id: '',
                    indexId: this.indexId,
                    code: '',
                    codeText: '',
                    sortNo: '1',
                    remark: ''
                },
                dicRules: {
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
                'enums',
                'closeOnClickModal'
            ])
        },
        created() {
            this.getDicIndexList();
        },
        methods: {
            getDicIndexList() {
                this.listDicIndexLoading = true;
                getDicIndexList(this.listDicIndexQuery).then(response => {
                    if (response.httpCode == 200) {
                        this.dicIndexlist = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listDicIndexLoading = false;
                })
            },
            handleDicIndexSelectionChange(row) {
                this.selectedDicIndexRows = row;
            },
            handleDicIndexUpdate(row) {
                this.currentRow = row;
                this.resetDicIndexTemp();
                this.dicIndex = copyProperties(this.dicIndex, row);
                this.dialogDicIndexStatus = 'update';
                this.dialogDicIndexVisible = true;
            },
            handleDicIndexCreate() {
                this.resetDicIndexTemp();
                this.dialogDicIndexStatus = 'create';
                this.dialogDicIndexVisible = true;
            },
            createDicIndex() {
                this.$refs['dicIndexForm'].validate(valid => {
                    if (valid) {
                        this.dialogDicIndexVisible = false;
                        this.listDicIndexLoading = true;
                        createDicIndex(this.dicIndex).then(response => {
                            if (response.httpCode == 200){
                                this.dicIndexlist.unshift(response.data);
                                this.$message.success('更新成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listDicIndexLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            updateDicIndex() {
                this.$refs['dicIndexForm'].validate(valid => {
                    if (valid) {
                        this.dialogDicIndexVisible = false;
                        this.listDicIndexLoading = true;
                        updateDicIndex(this.dicIndex).then(response => {
                            if (response.httpCode == 200){
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listDicIndexLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            handleDicIndexDelete() {
                const selectCounts = this.selectedDicIndexRows.length;
                if (selectCounts == 0) {
                    this.$message.error('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = new Array();
                        for (const deleteRow of this.selectedDicIndexRows) {
                            ids.push(deleteRow.id);
                        }
                        delDicIndex(ids).then(response => {
                            this.listDicIndexLoading = false;
                            this.$message.success('删除成功');
                        });
                        for (const deleteRow of this.selectedDicIndexRows) {
                            const index = this.dicIndexlist.indexOf(deleteRow);
                            this.dicIndexlist.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            resetDicIndexTemp() {
                this.dicIndex = {
                    id: '',
                    key: '',
                    name: '',
                    remark: ''
                };
            },


            handleDicIndexClicke(row) {
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
                    if (response.httpCode == 200) {
                        this.diclist = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listDictLoading = false;
                })
            },
            handleDictCreate() {
                this.resetDictTemp();
                this.dialogDictFormStatus = 'create';
                this.dialogDictFormVisible = true;
            },
            createDict() {
                this.$refs['dicForm'].validate(valid => {
                    if (valid) {
                        this.dialogDictFormVisible = false;
                        this.listDictLoading = true;
                        createDict(this.dic).then(response => {
                            if (response.httpCode == 200){
                                this.diclist.unshift(response.data);
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
                this.dic = copyProperties(this.dic, row);
                this.dialogDictFormStatus = 'update';
                this.dialogDictFormVisible = true;
            },
            updateDict() {
                this.$refs['dicForm'].validate(valid => {
                    if (valid) {
                        this.dialogDictFormVisible = false;
                        this.listDictLoading = true;
                        updateDict(this.dic).then(response => {
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
                            const index = this.diclist.indexOf(deleteRow);
                            this.diclist.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            resetDictTemp() {
                this.dic = {
                    id: '',
                    indexId: this.indexId,
                    code: '',
                    codeText: '',
                    sortNo: '1',
                    remark: ''
                };
            },
            resetCheckboxTable() {
                this.dialogDicIndexVisible = false;
                this.resetDicIndexTemp();
                resetForm(this, 'dicIndexForm');
            },
            resetDictForm() {
                this.dialogDictFormVisible = false;
                this.resetDictTemp();
                resetForm(this, 'dicForm');
            }
        }
    }
</script>