<template xmlns="http://www.w3.org/1999/html">
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select class="filter-item" v-model="listQuery.flagTakeCert" placeholder="请选择状态">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="listQuery.itemId" class="filter-item" clearable filterable placeholder="事项筛选">
                <el-option :key="item.id" v-for="item in itemList" :label="item.name" :value="item.id"/>
            </el-select>
            <el-select v-model="listQuery.companyCode" class="filter-item" filterable
                       remote
                       placeholder="请输入公司名称"
                       :remote-method="remoteMethod">
                <el-option
                        v-for="item in optionsName"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-tooltip style="margin-left: 10px;    margin-top: 0px;" class="item" effect="dark" content="搜索"
                        placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.pretrialNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="事项名称" min-width="140">
                <template scope="scope">
                    <span>{{scope.row.itemName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="申请人信息" min-width="180">
                <template scope="scope">
                    <span>公司：{{scope.row.companyName}}<br>申请人：{{scope.row.memberRealname}}<br>联系电话：{{scope.row.memberPhonenumber}}<br>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办结时间">
                <template scope="scope">
                    <span>{{scope.row.finishItemTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="取件时间">
                <template scope="scope">
                    <span v-if="scope.row.takeCertTime != null">{{scope.row.takeCertTime | date('YYYY-MM-DD HH:mm:ss')}}
                        <div v-if="scope.row.itemPostInfo!=null">{{scope.row.itemPostInfo.expressCompany}}:{{scope.row.itemPostInfo.expressNumber}}</div>
                    </span>
                    <span v-if="scope.row.takeCertTime == null">未取</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="取件" width="120">
                <template scope="scope">

                    <el-button v-if="scope.row.itemPostInfo == null && scope.row.flagTakeCert == 0" class="filter-item"
                               type="primary"
                               @click="changeTakeTypePick(scope.row)">大厅自取
                    </el-button>
                    <el-button v-if="scope.row.itemPostInfo != null && scope.row.flagTakeCert == 0" class="filter-item"
                               type="primary"
                               @click="changeTakeTypeExpress(scope.row)">快递邮寄
                    </el-button>
                    <span v-if="scope.row.itemPostInfo == null && scope.row.flagTakeCert == 1">已取</span>
                    <span v-if="scope.row.itemPostInfo != null && scope.row.flagTakeCert == 1">已邮寄</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>


        <!--快递邮寄  确定标记为已邮寄dialog-->
        <el-dialog :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal">
            <el-form class="small-space" :model="express" label-position="left" label-width="80px"
                     style='width: 80%; margin-left:10%;' :rules="validateExpressForm" ref="validateExpressForm">
                <el-form-item label="快递公司" prop="expressCompany">
                    <el-input v-model="express.expressCompany"/>
                </el-form-item>
                <el-form-item label="快递单号" prop="expressNumber">
                    <el-input v-model="express.expressNumber"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitTakeTypeExpress" type="primary" icon="circle-check">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import {getFinishList, updateTake} from 'api/zwfw/zwfwItemProcess';
    import {getAllByNameOrbasicCode} from 'api/zwfw/zwfwItem';
    import {getAllCompany} from 'api/zwfw/zwfwCompany';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                optionsName: [],
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    itemId: undefined,
                    companyCode: undefined,
                    flagTakeCert: '0'
                },
                options: [
                    {
                        value: '0',
                        label: '未领取'
                    }, {
                        value: '1',
                        label: '已领取'
                    }],
                express: {
                    expressCompany: '',
                    expressNumber: ''
                },
                itemList: [],
                companyList: [],
                dialogVisible: false,
                selectedRows: [],
                dialogFormVisible: false,
                validateExpressForm: {
                    expressCompany: [
                        {
                            required: true, message: '请输入快递公司'
                        }
                    ],
                    expressNumber: [
                        {
                            required: true, message: '请输入快递单号'
                        }]
                }
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
            this.getList();
            this.getAllItemList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getFinishList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            remoteMethod(query) {
                if (query !== '') {
                    const listQueryName = {
                        name: query
                    }
                    getAllCompany(listQueryName).then(response => {
                        this.optionsName = response.data;
                        console.log(this.optionsName);
                    })
                } else {
                    this.optionsName = [];
                }
            },
            handlePageChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            getAllItemList() {
                const query = {};
                getAllByNameOrbasicCode(query).then(response => {
                    this.itemList = response.data;
                })
            },
            changeTakeTypePick(row) {
                this.currentRow = row;
                this.$confirm('确定标记为客户已取件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    const query = {
                        id: row.id
                    };
                    updateTake(query).then(response => {
                        copyProperties(this.currentRow, response.data);
                        this.listLoading = false;
                    })
                }).catch(() => {
                    console.dir('取消');
                });
            },
            changeTakeTypeExpress(row) {
                this.currRow = row;
                this.resetTemp();
                this.dialogFormVisible = true;
            },
            submitTakeTypeExpress() {
                this.$refs['validateExpressForm'].validate((valid) => {
                    if (valid) {
                        this.listLoading = true;
                        const query = {
                            id: this.currRow.id,
                            expressNumber: this.express.expressNumber,
                            expressCompany: this.express.expressCompany
                        };
                        updateTake(query).then(response => {
                            copyProperties(this.currRow, response.data);
                            this.listLoading = false;
                            this.currRow = null;
                            this.dialogFormVisible = false;
                        });
                    } else {
                        return false;
                    }
                });

            },
            resetTemp() {
                this.express = {
                    expressCompany: '',
                    expressNumber: ''
                }
            }
        }
    }
</script>
<style>
    .el-input.is-disabled .el-input__inner {
        color: #1f2d3d;
    }

    .el-textarea.is-disabled .el-textarea__inner {
        color: #1f2d3d;
    }
</style>
