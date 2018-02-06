<template xmlns="http://www.w3.org/1999/html">
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                      placeholder="企业名称"
                      v-model="listQuery.qymc"></el-input>

            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                      placeholder="企业统一信用代码"
                      v-model="listQuery.ty_code"></el-input>

            <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                      placeholder="法人姓名"
                      v-model="listQuery.fr"></el-input>


            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                搜索
            </el-button>
        </div>


        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column type="expand">
                <template scope="scope">
                    <span>{{scope.row.jyfw}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column align="center" label="编号" width="140">-->
            <!--<template scope="scope">-->
            <!--{{scope.row.id}}-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="left" label="企业名称" width="300">
                <template scope="scope">
                    <el-tooltip content="点击详情" placement="right" effect="dark">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.qymc}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="统一社会信用代码" width="200">
                <template scope="scope">
                    <span style="font-family: Consolas,Monaco,monospace">{{scope.row.ty_code}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="法人姓名">
                <template scope="scope">
                    <span>{{scope.row.fr}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联系电话">
                <template scope="scope">
                    <span>{{scope.row.lxdh}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="企业类型">
                <template scope="scope">
                    <span>{{scope.row.qllx}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属街道">
                <template scope="scope">
                    <span>{{scope.row.ssjd}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="title" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetEnterpriseForm">
            <el-form ref="enterpriseForm" class="small-space" :model="enterpriseList" label-position="right"
                     v-loading="dialogLoading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="企业名称：">
                            <span>{{enterpriseList.qymc}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法人：" prop="shortName">
                            <span>{{enterpriseList.fr}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="社会同一信用码：">
                            <span>{{enterpriseList.ty_code}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="联系电话：">
                            <span>{{enterpriseList.lxdh}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="工商注册号：">
                            <span>{{enterpriseList.gs_code}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="企业类型：">
                            <span>{{enterpriseList.qllx}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="注册资金：">
                            <span>{{enterpriseList.zczj}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="成立日期：">
                            <span>{{enterpriseList.clrq}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="注册地址：">
                            <span>{{enterpriseList.jgzs}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="经营范围：">
                            <span>{{enterpriseList.jyfw}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="登记机关：">
                            <span>{{enterpriseList.djjg}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="营业期限：">
                            <span>{{enterpriseList.yyqx}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="核准日期：">
                            <span>{{enterpriseList.hzrq}}</span>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属街道：">
                            <span>{{enterpriseList.ssjd}}</span>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetEnterpriseForm">关 闭</el-button>

            </div>
        </el-dialog>


    </div>
</template>


<script>
    import {
        queryCompanysInfo
    } from 'api/hallSystem/window/receive/windowAccept';
    import {mapGetters} from 'vuex';
    import {copyProperties, resetForm} from 'utils';
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        components: {
            ElCol,
            ElRow
        },
        name: 'table_demo',
        data() {
            return {
                title: null,
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    qymc: undefined,
                    ty_code: undefined,
                    fr: undefined,
                    diff:'gwq'
                },
                dialogFormVisible: false,
                dialogLoading: false,
                enterpriseList: {
                    id: undefined,
                    node_id: '',
                    ty_code: '',
                    zz_code: '',
                    gs_code: '',
                    qymc: '',
                    fr: '',
                    lxr: '',
                    lxdh: '',
                    qllx: '',
                    jgzs: '',
                    zczj: '',
                    clrq: '',
                    yyqx: '',
                    jyfw: '',
                    djjg: '',
                    hzrq: '',
                    djzt: '',
                    bak: '',
                    add_type: '',
                    add_time: '',
                    add_user: '',
                    up_time: '',
                    up_user: '',
                    ssjd: '',
                    vtype: ''

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
        },
        methods: {
            getList() {
                this.listLoading = true;
                queryCompanysInfo(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        const data2 = response.data;
                        this.list = data2.list;
                        this.total = data2.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                }).catch(e => {
                    this.listLoading = false;
                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            handlePageChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            resetEnterpriseForm() {
                this.dialogFormVisible = false;
                resetForm(this, 'enterpriseForm');
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.enterpriseList = copyProperties(this.enterpriseList, row);
                this.title = '详细信息';
                this.dialogFormVisible = true;
            },
        }
    }
</script>
