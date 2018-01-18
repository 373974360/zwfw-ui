<template xmlns="http://www.w3.org/1999/html">
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <div class="top-serach">
                <div class="top-serach-input-san">
                    <span>企业名称：</span>
                    <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                              placeholder="请输入企业名称"
                              v-model="listQuery.qymc">
                    </el-input>
                </div>
                <div class="top-serach-input-san">
                    <span>法人姓名：</span>
                    <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                              placeholder="请输入法人姓名"
                              v-model="listQuery.fr">
                    </el-input>
                </div>
                <div class="top-serach-input-san">
                    <span>联系电话：</span>
                    <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                              placeholder="请输入联系电话"
                              v-model="listQuery.lxdh">
                    </el-input>
                </div>
                <div class="top-serach-input-san">
                    <span>企业统一信用代码：</span>
                    <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                              placeholder="请输入企业统一信用代码"
                              v-model="listQuery.ty_code">
                    </el-input>
                </div>
            </div>
            <div class="top-serach">
                <div class="top-serach-input-san">
                    <span>企业类别：</span>
                    <el-select class="filter-item" v-model="listQuery.qylb" clearable placeholder="请选择企业类别"
                               @change="changeQYLB">
                        <el-option
                                v-for="name in qylboptions"
                                :key="name"
                                :label="name"
                                :value="name">
                        </el-option>
                    </el-select>
                </div>
                <div class="top-serach-input-san">
                    <span>企业类型：</span>
                    <el-select class="filter-item" v-model="listQuery.qllx" clearable placeholder="请选择企业类型">
                        <el-option
                                v-for="name in qllxoptions"
                                :key="name"
                                :label="name"
                                :value="name">
                        </el-option>
                    </el-select>
                </div>
                <div class="top-serach-input-san">
                    <span>经营地址：</span>
                    <el-input @keyup.enter.native="getList" style="width: 230px;" class="filter-item"
                              placeholder="请输入经营地址"
                              v-model="listQuery.jgzs">
                    </el-input>
                </div>
                <div class="top-serach-input-san">
                    <span>成&nbsp;立&nbsp;日&nbsp;期&nbsp;范&nbsp;围&nbsp;&nbsp;：</span>
                    <el-date-picker style="top: -5px;" v-model="listQuery.startDate" type="date" :editable="false"
                                    placeholder="开始时间" :clearable="false" format="yyyy-MM-dd" clearable
                                    @change="formatStartDate">
                    </el-date-picker>
                    <span>至</span>
                    <el-date-picker style="top: -5px;" v-model="listQuery.endDate" type="date" :editable="false"
                                    placeholder="结束时间" :clearable="false" format="yyyy-MM-dd" clearable
                                    @change="formatEndDate">
                    </el-date-picker>
                </div>

            </div>
            <div class="top-serach">
                <div class="top-serach-input-san">
                    <span>注册资本：</span>
                    <el-input  style="width: 230px;" class="filter-item"
                              placeholder="开始金额"
                              v-model="listQuery.zczbstart"></el-input>
                    <span>（万）-</span>
                    <el-input style="width: 230px;" class="filter-item"
                              placeholder="结束金额"
                              v-model="listQuery.zczbend"></el-input>
                    <span>（万）</span>
                </div>
                <div class="top-serach-input-san">
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                        搜索
                    </el-button>
                </div>
            </div>


        </div>


        <el-table v-show="listShow" :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column type="expand">
                <template scope="scope">
                    <span>{{scope.row.jyfw}}</span>
                </template>
            </el-table-column>
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
            <el-table-column align="center" label="注册地址">
                <template scope="scope">
                    <span>{{scope.row.jgzs}}</span>
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
                     label-width="170px"
                     style='width: 80%; margin-left:-3%;' v-loading="dialogLoading">
                <div class="dialog-form-div-san">
                    <el-form-item label="企业名称：">
                        <el-input v-model="enterpriseList.qymc"></el-input>
                    </el-form-item>
                    <el-form-item label="法人：" prop="shortName">
                        <el-input v-model="enterpriseList.fr"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="社会同一信用码：">
                        <el-input v-model="enterpriseList.ty_code"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话：">
                        <el-input v-model="enterpriseList.lxdh"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="工商注册号：">
                        <el-input v-model="enterpriseList.gs_code"></el-input>
                    </el-form-item>
                    <el-form-item label="注册地址：">
                        <el-input v-model="enterpriseList.jgzs"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="企业类别：">
                        <el-select class="filter-item" v-model="enterpriseList.qylb" clearable placeholder="请选择企业类别"
                                   @change="changeQYLB1">
                            <el-option
                                    v-for="name in qylboptions1"
                                    :key="name"
                                    :label="name"
                                    :value="name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="企业类型：">
                        <el-select class="filter-item" v-model="enterpriseList.qllx" clearable placeholder="请选择企业类型">
                            <el-option
                                    v-for="name in qllxoptions1"
                                    :key="name"
                                    :label="name"
                                    :value="name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="成立日期：">
                        <el-date-picker v-model="enterpriseList.clrq" type="date"
                                        placeholder="选择日期" format="yyyy-MM-dd" clearable
                                        @change="changeclrq"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="登记机关：">
                        <el-input v-model="enterpriseList.djjg"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="经营范围：">
                        <el-input type="textarea" v-model="enterpriseList.jyfw"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="行业门类：">
                        <el-select class="filter-item" v-model="enterpriseList.hyml" clearable @change="changeHyml">
                            <el-option
                                    v-for="name in hymloptions"
                                    :key="name"
                                    :label="name"
                                    :value="name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="行业：">
                        <el-select class="filter-item" v-model="enterpriseList.hy" clearable>
                            <el-option
                                    v-for="name in hyoptions"
                                    :key="name"
                                    :label="name"
                                    :value="name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="核准日期：">
                        <el-date-picker v-model="enterpriseList.hzrq" type="date"
                                        placeholder="选择日期" format="yyyy-MM-dd"
                                        @change="changehzrq">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="经营截止日期：">
                        <el-date-picker v-model="enterpriseList.jyjzrq" type="date"
                                        placeholder="选择日期" format="yyyy-MM-dd"
                                        @change="changejyjzrq">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="管辖单位：">
                        <el-input v-model="enterpriseList.gxdw"></el-input>
                    </el-form-item>
                    <el-form-item label="档案号：">
                        <el-input v-model="enterpriseList.dah"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="吊销时间：">
                        <el-date-picker v-model="enterpriseList.dxsj" type="date"
                                        placeholder="选择日期" format="yyyy-MM-dd" clearable
                                        @change="changedxsj">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="从业人数：">
                        <el-input v-model="enterpriseList.cyrs"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="国别地区：">
                        <el-input v-model="enterpriseList.gbdq"></el-input>
                    </el-form-item>
                    <el-form-item label="投资者人数：">
                        <el-input v-model="enterpriseList.tzzrs"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="注册资金：">
                        <el-input v-model="enterpriseList.zczj"></el-input>
                    </el-form-item>
                    <el-form-item label="注册资金折美元：">
                        <el-input v-model="enterpriseList.zczbzmy"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="投资总额：">
                        <el-input v-model="enterpriseList.tzze"></el-input>
                    </el-form-item>
                    <el-form-item label="投资总额折美元：">
                        <el-input v-model="enterpriseList.tzzezmy"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="实际出资额：">
                        <el-input v-model="enterpriseList.sjcze"></el-input>
                    </el-form-item>
                    <el-form-item label="实际出资额折美元：">
                        <el-input v-model="enterpriseList.sjczwzmy"></el-input>
                    </el-form-item>
                </div>
                <div class="dialog-form-div-san">
                    <el-form-item label="外方认缴出资额：">
                        <el-input v-model="enterpriseList.wfrjczezmy"></el-input>
                    </el-form-item>
                    <el-form-item label="外方实缴出资额折美元：">
                        <el-input v-model="enterpriseList.wfsjczezmy"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetEnterpriseForm">取 消</el-button>
                <el-button type="primary" icon="circle-check" @click="doUpdate">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import {
        queryCompanysInfo, updateCompanyInfo
    } from '../../../api/hallSystem/window/receive/windowAccept';
    import {
        getHymlOptions,
        getHyOptions,
        getQylbOptions,
        getQylxOptions
    } from '../../../api/zwfwSystem/business/enterpriseInfo.js'
    import {mapGetters} from 'vuex';
    import {copyProperties, resetForm} from 'utils';
    import moment from 'moment';
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";

    export default {
        components: {ElFormItem},
        name: 'table_demo',
        data() {
            return {
                title: null,
                list: null,
                total: null,
                listLoading: true,
                listShow: false,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    qymc: undefined,
                    ty_code: undefined,
                    fr: undefined,
                    startDate: undefined,
                    endDate: undefined,
                    qllx: undefined,
                    qylb: undefined,
                    jgzs: undefined,
                    zczbstart: undefined,
                    zczbend: undefined,
                    diff: 'gwq'
                },
                hyoptions: [],
                hymloptions: [],
                qllxoptions: [],
                qylboptions: [],
                qllxoptions1: [],
                qylboptions1: [],
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
                    vtype: '',
                    frid: '',
                    dah: '',
                    hy: '',
                    hyml: '',
                    dxsj: '',
                    gbdq: '',
                    qylb: '',
                    cyrs: '',
                    tzzrs: '',
                    tzze: '',
                    tzzezmy: '',
                    sjcze: '',
                    sjczwzmy: '',
                    wfrjczezmy: '',
                    wfrjcze: '',
                    wfsjczezmy: '',
                    jyjzrq: '',
                    remark: '',
                    gxdw: '',
                    zczbzmy: ''
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
            this.getHyml();
            this.getQylb();
        },
        methods: {
            getList() {
                this.listLoading = true;
                queryCompanysInfo(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.listShow = true;
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
                this.getHy(this.enterpriseList.hyml);
                this.getQylx1(this.enterpriseList.qylb);
                this.dialogFormVisible = true;
            },
            changeHyml(){
                this.enterpriseList.hy = '';
                this.getHy(this.enterpriseList.hyml);
            },
            getQylb(){
                getQylbOptions().then(response => {
                    if (response.httpCode === 200) {
                        this.qylboptions = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getHy(hyml){
                getHyOptions(hyml).then(response => {
                    if (response.httpCode === 200) {
                        this.hyoptions = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getHyml(){
                getHymlOptions().then(response => {
                    if (response.httpCode === 200) {
                        this.hymloptions = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            changeQYLB(){
                this.listQuery.qllx = '';
                if (this.listQuery.qylb == ""){
                    this.listQuery.qylb = null;
                }
                this.getQylx(this.listQuery.qylb);
            },
            changeQYLB1(){
                this.enterpriseList.qllx = '';
                if (this.enterpriseList.qylb == ""){
                    this.enterpriseList.qylb = null;
                }
                this.getQylx1(this.enterpriseList.qylb);
            },
            getQylx(qylb){
                getQylxOptions(qylb).then(response => {
                    if (response.httpCode === 200) {
                        this.qllxoptions = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getQylx1(qylb){
                getQylxOptions(qylb).then(response => {
                    if (response.httpCode === 200) {
                        this.qllxoptions1 = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getQylx1(qylb){
                getQylxOptions(qylb).then(response => {
                    if (response.httpCode === 200) {
                        this.qllxoptions1 = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
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
            formatStartDate() {
                if (!this.listQuery.startDate) {
                    this.listQuery.startDate = ''
                    this.listQuery.endDate = ''
                } else {
                    this.listQuery.startDate = moment(this.listQuery.startDate).format('YYYY-MM-DD')
                }
            },
            formatEndDate() {
                if (!this.listQuery.endDate) {
                    this.listQuery.endDate = ''
                } else {
                    this.listQuery.endDate = moment(this.listQuery.endDate).format('YYYY-MM-DD')
                }
            },
            changejyjzrq(){
                this.enterpriseList.jyjzrq = moment(this.enterpriseList.jyjzrq).format('YYYY-MM-DD').toString()
            },
            changehzrq(){
                this.enterpriseList.hzrq = moment(this.enterpriseList.hzrq).format('YYYY-MM-DD').toString()
            },
            changedxsj(){
                this.enterpriseList.dxsj = moment(this.enterpriseList.dxsj).format('YYYY-MM-DD').toString()
            },
            changeclrq(){
                this.enterpriseList.clrq = moment(this.enterpriseList.clrq).format('YYYY-MM-DD').toString()
            }

        }
    }
</script>
<style>
    .top-serach {
        display: -webkit-box;
    }

    .top-serach > div {
        margin-left: 24px;
    }

    .top-serach-input-san > span {
        vertical-align: super;
    }

    .top-serach .el-input {
        width: 230px;
    }

    .dialog-form-div-san {
        display: -webkit-box;
    }

    .dialog-form-div-san .el-input__inner {
        width: 290px;
    }

    .dialog-form-div-san .el-textarea__inner {
        width: 749px;
        height: 128px;
    }

    .dialog-form-div-san .el-date-editor.el-input {
        width: 291px;
    }
</style>
