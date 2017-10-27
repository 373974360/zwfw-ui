<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 180px;" class="filter-item" placeholder="redis key"
                      v-model="listQuery.key">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" type="danger" v-waves icon="delete" @click="handleDelete">删除</el-button>
            <el-button class="filter-item" type="danger" v-waves icon="delete" @click="handleFlush">清空缓存</el-button>
        </div>

        <el-table ref="cacheTable" :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" width="70" label="序号" align="center"  />
            <el-table-column align="center" label="Key" min-width="140">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="查看详细" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.key}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型" min-width="180">
                <template scope="scope">
                    <span>{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="过期时间">
                <template scope="scope">
                    <span>{{scope.row.ttl | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal">
            <el-form ref="logForm1" class="small-space" :model="redisResult" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading">
                <el-form-item label="Key">
                    <el-input :value="redisResult.key" :disabled="true"/>
                </el-form-item>
                <el-form-item label="Value">
                    <div class="editor-container">
                        <json-editor ref="jsonEditor" v-model="redisResult.value"></json-editor>
                    </div>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input :value="redisResult.type" :disabled="true"/>
                </el-form-item>
                <el-form-item label="过期时间">
                    <el-input :value="redisResult.ttl | date('YYYY-MM-DD HH:mm:ss')" :disabled="true"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogFormVisible = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import {getCacheList,editCache,delCache,flushCache} from 'api/base/system/cache';
    import jsonEditor from 'components/jsonEditor';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'cache_table',
        data() {
            return {
                allList: null,
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    key: undefined
                },
                redisResult: {
                    key: '',
                    value: '',
                    type: '',
                    ttl: ''
                },
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: 'view',
                dialogLoading: false
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        components: { jsonEditor },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getCacheList(this.listQuery).then(response => {
                    this.allList = response.data;
                    this.total = response.data.length;
                    this.handlePage();
                    this.listLoading = false;
                })
            },
            handleSelectionChange(row) {
                this.selectedRows = row;
            },
            toggleSelection(row) {
                this.$refs.cacheTable.toggleRowSelection(row);
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.key = null;
                this.handlePage();
            },
            handlePageChange(val) {
                this.listQuery.page = val;
                this.handlePage();
            },
            handlePage(){
                this.list = this.allList.slice((this.listQuery.page - 1) * this.listQuery.rows,(this.listQuery.page - 1) * this.listQuery.rows + this.listQuery.rows);
            },
            handleUpdate(row) {
                this.resetTemp();
                this.redisResult = copyProperties(this.redisResult, row);
                this.dialogFormVisible = true;
            },
            handleDelete(){
                const selectCounts = this.selectedRows.length;
                if (this.selectedRows.length == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将删除该缓存信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let keys = new Array();
                        for (const deleteRow of this.selectedRows) {
                            keys.push(deleteRow.key);
                        }
                        delCache(keys).then(response => {
                            this.listLoading = false;
                            this.total -= selectCounts;
                            this.$message.success('删除成功');
                        })
                        for (const deleteRow of this.selectedRows) {
                            let index = this.list.indexOf(deleteRow);
                            this.list.splice(index, 1);
                            index = this.allList.indexOf(deleteRow);
                            this.allList.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            handleFlush(){
                this.$confirm('此操作将清空缓存数据库, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    flushCache().then(response => {
                        this.listLoading = false;
                        this.$message.success('清空成功');
                    })
                    this.list = [];
                    this.allList = [];
                }).catch(() => {
                    console.dir('取消');
                });
            },
            resetTemp(){
                this.redisResult = {
                    key: '',
                    value: '',
                    type: '',
                    ttl: ''
                };
            },
            handleDownload() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('vendor/Export2Excel');
                    const tHeader = ['时间', '地区', '类型', '标题', '重要性'];
                    const filterVal = ['timestamp', 'province', 'type', 'title', 'importance'];
                    const data = this.formatJson(filterVal, this.list);
                    export_json_to_excel(tHeader, data, 'table数据');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            }
        }
    }
</script>
<style>
    .editor-container{
        position: relative;
        height: 300px;
        overflow-x: hidden;
    }
    .el-input.is-disabled .el-input__inner {
        color: #1f2d3d;
    }
    .el-textarea.is-disabled .el-textarea__inner {
        color: #1f2d3d;
    }
</style>