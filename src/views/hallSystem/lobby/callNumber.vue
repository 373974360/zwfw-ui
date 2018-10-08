<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select v-model="checkWindowIds" class="filter-item" multiple filterable placeholder="选择窗口"
                       @change="reloadItemWindowList">
                <el-option :key="item.id" v-for="item in windowList" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="checkItemIds" class="filter-item" multiple filterable placeholder="选择事项">
                <el-option :key="item.id" v-for="item in itemList" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-select class="filter-item" v-model="listQuery.isCall" clearable placeholder="是否叫号">
                <el-option label="全部" value="">
                </el-option>
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker class="filter-item"
                            v-model="dataChange"
                            type="daterange"
                            align="right"
                            placeholder="选择叫号日期范围"
                            :picker-options="pickerOptions2" @change="formatStartDate">
            </el-date-picker>
            <el-input @keyup.enter.native="getCallNumberList" style="width: 230px;" class="filter-item"
                      placeholder="电话号码"
                      v-model="listQuery.personPhone"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getCallNumberList">搜索
            </el-button>
            <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">
                导出叫号信息excel
            </el-button>
        </div>

        <el-table ref="zwfwCallNumberTable" :data="zwfwCallNumberList" v-loading.body="pageLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column align="left" label="事项名称" prop="itemName" width="300">
                <template scope="scope">
                    <span>{{scope.row.itemName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="抽号编码" prop="processNumber">
                <template scope="scope">
                    <span>{{scope.row.orderNo}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="抽号时间" prop="takeTime">
                <template scope="scope">
                    <span>{{scope.row.takeTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办事人姓名" prop="personName">
                <template scope="scope">
                    <span>{{scope.row.personName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办事人身份证号" prop="personId">
                <template scope="scope">
                    <span>{{scope.row.personId}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isCall" align="center" label="是否叫号">
                <template scope="scope">
                    <span>{{scope.row.numberIsCall | enums('YesNo')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="叫号时间" prop="callTime">
                <template scope="scope">
                    <span>{{scope.row.callTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="叫号窗口" prop="windowName">
                <template scope="scope">
                    <span>{{scope.row.windowName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="手机号码" prop="personPhone">
                <template scope="scope">
                    <span>{{scope.row.personPhone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="语音状态" prop="resultCode">
                <template scope="scope">
                    <span>{{scope.row.resultCode | enums('SingleCallByTtsResultCode')}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!pageLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>


    </div>
</template>

<script>

    import {getAllByNameOrbasicCode} from 'api/hallSystem/business/item'
    import {getCallNumberList} from '../../../api/hallSystem/business/callNumber'
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import {getAllWindow} from 'api/hallSystem/lobby/window';
    import {enums} from '../../../filters';
    import {copyProperties} from 'utils';


    export default {
        name: 'call_number',
        data() {
            return {
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                dataChange: [],
                options: [{
                    value: '1',
                    label: '是'
                }, {
                    value: '0',
                    label: '否'
                }],
                itemList: [],
                windowList: [],
                checkItemIds: [],
                checkWindowIds: [],
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    itemIds: undefined,
                    windowIds: undefined,
                    startDate: undefined,
                    endDate: undefined,
                    isCall: '',
                    personPhone: undefined
                },
                copylistQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    itemIds: undefined,
                    windowIds: undefined,
                    startDate: undefined,
                    endDate: undefined,
                    isCall: ''
                },
                itemListQuery: {
                    itemWindows: ''
                },
                zwfwCallNumberList: null,
                pageLoading: true,
                total: null,
                selectedRows: [],
                exportList: null
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'dics',
                'closeOnClickModal'
            ])
        },
        created() {
            this.getWindowList();
            this.getItemList();
            this.getCallNumberList();
        },
        methods: {
            formatStartDate() {
                if (this.dataChange[0] == null) {
                    this.listQuery.startDate = undefined;
                    this.listQuery.endDate = undefined;
                } else {
                    this.listQuery.startDate = moment(this.dataChange[0]).format("YYYY-MM-DD");
                    this.listQuery.endDate = moment(this.dataChange[1]).format("YYYY-MM-DD");
                }
                console.log(this.dataChange);
            },
            getCallNumberList() {
                this.pageLoading = true;
                this.listQuery.itemIds = this.checkItemIds.join();
                this.listQuery.windowIds = this.checkWindowIds.join();
                getCallNumberList(this.listQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.zwfwCallNumberList = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error(response.msg || '事项列表查询失败');
                    }
                    this.pageLoading = false;
                })
            },
            getWindowList() {
                getAllWindow().then(response => {
                    if (response.httpCode === 200) {
                        this.windowList = response.data;
                    } else {
                        this.$message.error('窗口信息加载失败')
                    }
                })
            },
            getItemList() {
                this.itemListQuery.itemWindows = this.checkWindowIds.join();
                getAllByNameOrbasicCode(this.itemListQuery).then(response => {
                    if (response.httpCode === 200) {
                        this.itemList = response.data
                    } else {
                        this.$message.error('事项信息加载失败')
                    }
                })
            },
            reloadItemWindowList() {
                this.reloadItemList();
            },
            reloadItemList() {
                this.getItemList();
                this.listQuery.itemIds = [];
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.name = null;
                this.getCallNumberList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getCallNumberList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.zwfwCallNumberTable.toggleRowSelection(row);
            },
            handleDownload() {
                this.copylistQuery = copyProperties(this.copylistQuery, this.listQuery);
                this.copylistQuery.rows = 100000;
                this.copylistQuery.page = 1;
                getCallNumberList(this.copylistQuery).then(response => {
                    this.exportList = response.data;
                    require.ensure([], () => {
                        const {export_json_to_excel} = require('vendor/Export2Excel');
                        const tHeader = ['序号', '事项', '抽号时间', '抽号编码', '办事人', '身份证号', '手机号', '是否叫号', '叫号窗口', '叫号时间'];
                        const filterVal = ['id', 'itemName', 'takeTime', 'orderNo', 'personName', 'personId', 'personPhone', 'numberIsCall', 'windowName', 'callTime', 'departmentName', 'status'];
                        const exportList = this.exportList.list;
                        const data = this.formatJson(filterVal, exportList);
                        export_json_to_excel(tHeader, data, '叫号信息表');
                    })
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(function (v, index) {
                    return filterVal.map(function (j) {
                        console.log(index);
                        if (j === 'id') {
                            return index + 1;
                        } else if (j === 'numberIsCall') {
                            return enums(v[j], 'YesNo')
                        } else {
                            return v[j]
                        }
                    });
                });
            }
        }
    }
</script>
