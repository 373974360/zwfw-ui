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
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="createEnterpriseInfo" icon="plus">
                添加
            </el-button>
            <el-upload
                    class="filter-item" style="margin-left: 10px;"
                    :action="importEnterpriseInfoAction"
                    multiple
                    :limit="3"
                    :show-file-list=false
                    :on-success="success"
                    :on-error="error">
                <el-button type="primary" icon="upload">设立导入</el-button>
            </el-upload>
            <el-upload
                    class="filter-item" style="margin-left: 10px;"
                    :action="importUpdateEnterpriseInfoAction"
                    multiple
                    :limit="3"
                    :show-file-list=false
                    :on-success="success"
                    :on-error="error">
                <el-button type="primary" icon="upload">变更导入</el-button>
            </el-upload>
        </div>


        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"
                  @row-click="updateHistoryList">
            <el-table-column type="expand">
                <template scope="scope">
                    <!--<span>{{scope.row.jyfw}}</span>-->
                   <el-table :data="historyList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                        <el-table-column align="left" label="变更企业名称" width="300">
                            <template scope="scope">
                                <span>{{scope.row.qymc}}</span>
                            </template>
                        </el-table-column>
                       <el-table-column align="center" label="变更经营范围">
                           <template scope="scope">
                               <span>{{scope.row.jyfw}}</span>
                           </template>
                       </el-table-column>
                       <el-table-column align="center" label="变更经营地址">
                           <template scope="scope">
                               <span>{{scope.row.jgzs}}</span>
                           </template>
                       </el-table-column>
                       <el-table-column align="center" label="变更联系电话">
                           <template scope="scope">
                               <span>{{scope.row.lxdh}}</span>
                           </template>
                       </el-table-column>
                    </el-table>

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
            <el-table-column align="center" label="工商注册号">
                <template scope="scope">
                    <span>{{scope.row.gs_code}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="title=='create'? '新增' : '编辑'" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetEnterpriseForm">
            <el-form ref="enterpriseForm" :model="enterpriseList"
                     v-loading="dialogLoading">
                <el-row>
                    <el-form-item label="企业名称：">
                        <el-input v-model="enterpriseList.qymc"></el-input>
                    </el-form-item>

                    <el-form-item label="法人：" prop="shortName">
                        <el-input v-model="enterpriseList.fr"></el-input>
                    </el-form-item>

                    <el-form-item label="社会同一信用码：">
                        <el-input v-model="enterpriseList.ty_code"></el-input>
                    </el-form-item>

                    <el-form-item label="联系电话：">
                        <el-input v-model="enterpriseList.lxdh"></el-input>
                    </el-form-item>

                    <el-form-item label="工商注册号：">
                        <el-input v-model="enterpriseList.gs_code"></el-input>
                    </el-form-item>

                    <el-form-item label="注册资金(元)：">
                        <el-input-number v-model="enterpriseList.zczj" :min="0" label="注册资金"></el-input-number>
                    </el-form-item>

                    <el-form-item label="企业类型：">
                        <el-select class="filter-item" v-model="enterpriseList.qllx" clearable
                                   placeholder="请选择企业类型">
                            <el-option
                                    v-for="name in qllxoptions1"
                                    :key="name"
                                    :label="name"
                                    :value="name">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="成立日期：">
                        <el-date-picker v-model="enterpriseList.clrq" type="date"
                                        placeholder="选择日期" format="yyyy-MM-dd" clearable
                                        @change="changeclrq"></el-date-picker>
                    </el-form-item>

                    <el-form-item label="注册地址：">
                        <el-input v-model="enterpriseList.jgzs"></el-input>
                    </el-form-item>

                    <el-form-item label="经营范围：">
                        <el-input :rows="6" type="textarea" v-model="enterpriseList.jyfw" ></el-input>
                    </el-form-item>

                    <el-form-item label="登记机关：">
                        <el-input v-model="enterpriseList.djjg"></el-input>
                    </el-form-item>

                    <el-form-item label="营业期限：">
                        <el-input v-model="enterpriseList.yyqx"></el-input>
                    </el-form-item>

                    <el-form-item label="核准日期：">
                        <el-date-picker v-model="enterpriseList.hzrq" type="date"
                                        placeholder="选择日期" format="yyyy-MM-dd"
                                        @change="changehzrq">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="所属街道：">
                        <el-input v-model="enterpriseList.ssjd"></el-input>
                    </el-form-item>

                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetEnterpriseForm">关 闭</el-button>
                <!--<el-button type="primary" icon="circle-check" @click="title=='create' ? 'doCreate' : 'doUpdate'">确 定</el-button>-->
                <el-button v-if="title=='create'" type="primary" icon="circle-check" @click="doCreate">确 定</el-button>
                <el-button v-else type="primary" icon="circle-check" @click="doUpdate">确 定</el-button>
            </div>
        </el-dialog>

        <!--<el-dialog :title="title" :visible.sync="dialogFormVisible"
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
        </el-dialog>-->

    </div>
</template>


<script>
    import {
        queryCompanysInfo, updateCompanyInfo, insertCompanyInfo, queryHistoryCompanysInfo
    } from 'api/hallSystem/window/receive/windowAccept';
    import {
        getQylxOptions
    } from 'api/zwfwSystem/business/enterpriseInfo.js';
    import {mapGetters} from 'vuex';
    import {copyProperties, resetForm} from 'utils';
    import moment from 'moment';
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
                importEnterpriseInfoAction: '/api/hallSystem/hallCompositeWindow/importEnterpriseInfo',
                importUpdateEnterpriseInfoAction: '/api/hallSystem/hallCompositeWindow/importUpdateEnterpriseInfo',
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
                    diff: 1
                },
                qllxoptions1: [],
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
//                    add_type: '',
//                    add_time: '',
//                    add_user: '',
//                    up_time: '',
//                    up_user: '',
                    ssjd: ''
//                    vtype: ''

                },
                historyList: null
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
                this.enterpriseList = {
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
                    clrq: null,
                    yyqx: '',
                    jyfw: '',
                    djjg: '',
                    hzrq: '',
                    djzt: '',
                    bak: '',
//                    add_type: '',
//                    add_time: '',
//                    add_user: '',
//                    up_time: '',
//                    up_user: '',
                    ssjd: ''
//                    vtype: ''
                }
                resetForm(this, 'enterpriseForm');
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.enterpriseList = copyProperties(this.enterpriseList, row);
                if(this.enterpriseList.clrq!=null && this.enterpriseList.clrq!="") {
                    this.enterpriseList.clrq = this.enterpriseList.clrq.replace('年', '-').replace('月', '-').replace('日', '');
                }
                if(this.enterpriseList.hzrq!=null && this.enterpriseList.hzrq!="") {
                    this.enterpriseList.hzrq = this.enterpriseList.hzrq.replace('年', '-').replace('月', '-').replace('日', '');
                }
                console.log(this.enterpriseList)
                this.title = '详细信息';
                this.dialogFormVisible = true;
            },
            createEnterpriseInfo() {
                this.title = 'create';
                this.dialogFormVisible = true;
                this.getQylx1("");
                console.log(this.enterpriseList);
            },
            getQylx1(qylb) {
                getQylxOptions(qylb).then(response => {
                    if (response.httpCode === 200) {
                        this.qllxoptions1 = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            changeclrq() {
                if(this.enterpriseList.clrq!=null && this.enterpriseList.clrq!=""){
                    this.enterpriseList.clrq = moment(this.enterpriseList.clrq).format('YYYY-MM-DD').toString();
                }
            },
            changehzrq() {
                if(this.enterpriseList.hzrq!=null && this.enterpriseList.hzrq!=""){
                    this.enterpriseList.hzrq = moment(this.enterpriseList.hzrq).format('YYYY-MM-DD').toString()
                }
            },
            doUpdate() {
                this.$refs['enterpriseForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.dialogLoading = true;
                        updateCompanyInfo(this.enterpriseList).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetEnterpriseForm();
                                this.$message.success('更新成功');
                                this.getList();
                            } else {
                                this.$message.error('更新失败！');
                            }
                        }).catch(e => {
                            this.dialogLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            doCreate() {
                debugger;
                this.$refs['enterpriseForm'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.dialogLoading = true;
                        insertCompanyInfo(this.enterpriseList).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetEnterpriseForm();
                                this.$message.success('添加成功');
                                this.getList();
                            } else {
                                this.$message.error('添加失败！');
                            }
                        }).catch(e => {
                            this.dialogLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            updateHistoryList(row, event, column) {
                this.currentRow = row;
                this.enterpriseList = copyProperties(this.enterpriseList, row);
                queryHistoryCompanysInfo(this.enterpriseList.gs_code).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        const data2 = response.data;
                        this.historyList = data2;
                        console.log(this.historyList);
                    } else {
                        this.$message.error('数据加载失败')
                    }
                }).catch(e => {
                    this.listLoading = false;
                })
            },
            success(response, file, fileList) {
                if (response.httpCode === 200) {
                    this.$message.success('导入成功');
                } else {
                    this.$message.error('导入失败');
                }
            },
            error(err, file, fileList) {
                this.$message.error('系统繁忙，请稍后重试');
            }
        }
    }
</script>
