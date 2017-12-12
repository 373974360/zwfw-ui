<template xmlns="http://www.w3.org/1999/html">
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <!--<el-select class="filter-item" v-model="listQuery.flagTakeCert" placeholder="请选择状态">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>-->
            <el-select v-model="listQuery.itemId" class="filter-item" clearable filterable placeholder="事项筛选">
                <el-option v-for="item in itemList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="listQuery.memberId" class="filter-item"
                       clearable filterable remote
                       placeholder="请输入会员名称或证件号"
                       :remote-method="remoteMethod">
                <el-option
                        v-for="item in optionsName"
                        :key="item.id"
                        :label="item.name + ' | ' + item.loginName"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-tooltip style="margin-left: 10px; margin-top: 0px;" class="item" effect="dark" content="搜索"
                        placement="top-start">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">
                    搜索
                </el-button>
            </el-tooltip>
            <el-button class="filter-item" type="primary">添加</el-button>
        </div>

        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="办件号" width="220">
                <template scope="scope">
                    <span>{{scope.row.processNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="事项名称" min-width="180">
                <template scope="scope">
                    <span>{{scope.row.itemName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="申请人信息" min-width="180">
                <template scope="scope">
                    <span>
                        <span v-if="scope.row.companyName!=null">
                            公司：{{scope.row.companyName}}<br>
                        </span>
                        申请人：{{scope.row.memberRealname}}<br>联系电话：{{scope.row.memberPhonenumber}}<br>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办结时间" width="180">
                <template scope="scope">
                    <span>{{scope.row.finishItemTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="取件方式">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" placement="right" content="点击修改">
                        <el-button type="text" @click="changeTakeType(scope.row)">
                            <span>{{scope.row.takeTypeInfo.takeType | enums('TakeType')}}</span>
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="取件状态" width="120">
                <template scope="scope">
                    <span>{{scope.row.takeTypeInfo.flagTakeCert | enums('TakeStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="240">
                <template scope="scope">
                    <el-button v-if="scope.row.takeTypeInfo.flagTakeCert == 1 || scope.row.takeTypeInfo.flagTakeCert == 7"
                               type="primary" @click="completeTake(scope.row)">确认收件</el-button>
                    <el-button v-else-if="scope.row.takeTypeInfo.flagTakeCert == 3 && scope.row.takeTypeInfo.mailboxInfo.status == 1"
                               type="primary" @click="mailboxReserve(scope.row)">预约投递</el-button>
                    <el-tooltip v-else-if="scope.row.takeTypeInfo.flagTakeCert == 3 && scope.row.takeTypeInfo.mailboxInfo.status == 2"
                                class="item" effect="dark" placement="right" content="点击更新状态">
                        <el-button type="text" @click="mailboxStatusUpdate(scope.row)">预约中...</el-button>
                    </el-tooltip>
                    <el-button-group v-else-if="scope.row.takeTypeInfo.flagTakeCert == 3 && scope.row.takeTypeInfo.mailboxInfo.status == 3">
                        <el-button type="primary" @click="showReserveCode(scope.row)">获取<br>开箱码</el-button>
                        <el-button type="primary" @click="mailboxCancelReserve(scope.row)">取消<br>预约</el-button>
                        <el-button type="primary" @click="mailboxInfoUpdate(scope.row)">更新<br>状态</el-button>
                    </el-button-group>
                    <el-button v-else-if="scope.row.takeTypeInfo.flagTakeCert == 4" type="primary" @click="mailboxStatusUpdate(scope.row)">
                        更新状态
                    </el-button>
                    <el-button v-else-if="scope.row.takeTypeInfo.flagTakeCert == 6" type="primary"
                               @click="enterExpressInfo(scope.row)">录入邮寄信息</el-button>
                    <el-button v-else type="primary">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog title="修改取件信息" :visible.sync="takeTypeVisible" :close-on-click-modal="closeOnClickModal"
                   :before-close="resetTakeTypeForm">
            <el-form ref="takeTypeForm" :model="takeTypeInfo" :rules="takeTypeInfoRules"
                     label-width="100px" class="small-space" label-position="right"
                     style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                <el-form-item label="取件方式" prop="takeType">
                    <el-select v-model="takeTypeInfo.takeType">
                        <el-option v-for="item in enums['TakeType']" :key="item.code"
                                   :value="item.code" :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快件箱" prop="mailboxInfo.mailboxId" v-show="takeTypeInfo.takeType == 2">
                    <!--<el-radio-group v-model="takeTypeInfo.mailboxId">
                        <el-radio-button v-for="item in mailboxList" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
                    </el-radio-group>-->
                    <el-select v-model="takeTypeInfo.mailboxInfo.mailboxId">
                        <el-option v-for="item in mailboxList" :key="item.id"
                                   :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收件人姓名" prop="postInfo.name" v-show="takeTypeInfo.takeType == 3">
                    <el-input v-model="takeTypeInfo.postInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="postInfo.mobilephone" v-show="takeTypeInfo.takeType == 3">
                    <el-input v-model="takeTypeInfo.postInfo.mobilephone"></el-input>
                </el-form-item>
                <el-form-item label="收件地址" prop="postInfo.address" v-show="takeTypeInfo.takeType == 3">
                    <el-input v-model="takeTypeInfo.postInfo.address"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetTakeTypeForm">取 消</el-button>
                <el-button type="primary" icon="circle-check" @click="submitTakeTypeInfo">确 定</el-button>
            </div>
        </el-dialog>

        <!--快递邮寄 确定标记为已邮寄dialog-->
        <el-dialog title="邮寄信息" :visible.sync="expressInfoVisible" :close-on-click-modal="closeOnClickModal"
                   :before-close="resetExpressInfoForm">
            <el-form ref="expressInfoForm" :model="expressInfo" :rules="expressFormRules"
                     label-width="80px" class="small-space" label-position="left"
                     style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                <el-form-item label="快递公司" prop="expressCompany">
                    <el-input v-model="expressInfo.expressCompany"></el-input>
                </el-form-item>
                <el-form-item label="快递单号" prop="expressNumber">
                    <el-input v-model="expressInfo.expressNumber"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitTakeTypeExpress" type="primary" icon="circle-check">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="otherProcessVisible">
            <el-form>
                <el-form-item label="事项名称"></el-form-item>
                <el-form-item label="发件名称"></el-form-item>
                <el-form-item label="文件形式"></el-form-item>
                <el-form-item label="文件数量"></el-form-item>
                <el-form-item label="取件方式">
                    <el-select>
                        <el-option v-for="item in enums['TakeType']" :key="item.code"
                                   :value="item.code" :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>


<script>
    import {copyProperties, validateQueryStr, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {getAllByNameOrbasicCode} from 'api/zwfwSystem/business/item';
    import {getAllMailbox} from 'api/hallSystem/window/mailbox'
    import {getByNameOrLoginName} from '../../../../api/hallSystem/member/member'
    import {getFinishList, saveExpressInfo, saveTakeType, complete, reserve, cancelReserve, getOrderStatus, getOrderDetail} from '../../../../api/hallSystem/window/delivery'

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                itemList: [],
                optionsName: [],
                mailboxList: [],
                total: null,
                listLoading: true,
                dialogLoading: false,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    itemId: undefined,
                    memberId: undefined
                },
                takeTypeVisible: false,
                takeCodeVisible: false,
                expressInfoVisible: false,
                otherProcessVisible: false,
                takeTypeInfo: {
                    id: '',
                    processNumber: '',
                    memberId: '',
                    takeType: '',
                    mailboxInfo: {
                        id: '',
                        mailboxId: ''
                    },
                    postInfo: {
                        id: '',
                        name: '',
                        mobilephone: '',
                        address: ''
                    }
                },
                takeTypeInfoRules: {},
                expressInfo: {
                    id: '',
                    processNumber: '',
                    expressCompany: '',
                    expressNumber: ''
                },
                expressFormRules: {
                    expressCompany: [
                        {required: true, message: '请输入快递公司', trigger: 'blur'}
                    ],
                    expressNumber: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'}
                    ]
                },
                otherProcessInfo: {
                    itemId: '',
                    resultName: ''
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
            this.getMailboxList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getFinishList(this.listQuery).then(response => {
                    this.listLoading = false;
                    if (response.httpCode === 200) {
                        this.list = response.data.list;
                        this.total = response.data.total;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getAllItemList() {
                const query = {};
                getAllByNameOrbasicCode(query).then(response => {
                    if (response.httpCode === 200) {
                        this.itemList = response.data;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getMailboxList() {
                const query = {}
                getAllMailbox(query).then(response => {
                    if (response.httpCode === 200) {
                        this.mailboxList = response.data
                    } else {
                        this.$message.error('数据加载失败')
                    }
                });
            },
            remoteMethod(query) {
                if (query !== '') {
                    let valid = validateQueryStr(query);
                    if (valid) {
                        this.$message.error(`输入中包含非法字符 ${valid}`)
                        return
                    }
                    getByNameOrLoginName(query).then(response => {
                        if (response.httpCode === 200) {
                            this.optionsName = response.data;
                        } else {
                            this.$message.error('数据加载失败')
                        }
                    })
                } else {
                    this.optionsName = [];
                }
            },
            changeTakeType(row) {
                if (row.takeTypeInfo.flagTakeCert !== 1
                    && row.takeTypeInfo.flagTakeCert !== 3
                    && row.takeTypeInfo.flagTakeCert !== 6) {
                    this.$message.warning('当前状态不可修改取件方式');
                    return;
                }
                this.takeTypeInfo.id = row.takeTypeInfo.id;
                this.takeTypeInfo.processNumber = row.processNumber;
                this.takeTypeInfo.memberId = row.memberId;
                this.takeTypeInfo.takeType = row.takeTypeInfo.takeType;
                if (row.takeTypeInfo.mailboxInfo) {
                    this.takeTypeInfo.mailboxInfo = copyProperties(this.takeTypeInfo.mailboxInfo, row.takeTypeInfo.mailboxInfo);
                }
                if (row.takeTypeInfo.postInfo) {
                    this.takeTypeInfo.postInfo = copyProperties(this.takeTypeInfo.postInfo, row.takeTypeInfo.postInfo);
                }
                this.takeTypeVisible = true;
            },
            submitTakeTypeInfo() {
                this.$refs['takeTypeForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        saveTakeType(this.takeTypeInfo).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetTakeTypeForm();
                                this.$message.success('修改成功');
                                this.getList();
                            } else {
                                this.$message.error('修改失败');
                            }
                        })
                    } else {
                        return false;
                    }
                })
            },
            enterExpressInfo(row) {
                this.expressInfo.id = row.takeTypeInfo.postInfo.id;
                this.expressInfo.processNumber = row.processNumber;
                this.expressInfoVisible = true;
            },
            submitTakeTypeExpress() {
                this.$refs['expressInfoForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        saveExpressInfo(this.expressInfo).then(response => {
                            this.dialogLoading = false;
                            if (response.httpCode === 200) {
                                this.resetExpressInfoForm();
                                this.$message.success('信息保存成功');
                                this.getList();
                            } else {
                                this.$message.error('操作失败')
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            completeTake(row) {
                this.$confirm('确定标记为客户已取件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    complete(row.takeTypeInfo.id).then(response => {
                        if (response.httpCode === 200) {
                            this.getList();
                        } else {
                            this.$message.error('操作失败')
                        }
                        this.listLoading = false;
                    })
                }).catch(() => {
                    console.dir('取消');
                });
            },
            mailboxReserve(row) {
                this.listLoading = true;
                reserve(row.processNumber).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('预约已提交，请耐心等待');
                        this.getList();
                    } else {
                        this.$message.error('预约提交失败，请重新预约')
                    }
                    this.listLoading = false;
                });
            },
            mailboxCancelReserve(row) {
                this.listLoading = true;
                cancelReserve(row.processNumber).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('取消成功');
                        this.getList();
                    } else {
                        this.$message.error('取消失败，请重试')
                    }
                    this.listLoading = false;
                })
            },
            mailboxInfoUpdate(row) {
                this.listLoading = true;
                getOrderDetail(row.processNumber).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('快件信息已更新');
                        this.getList();
                    } else {
                        this.$message.error('获取快件信息失败');
                    }
                    this.listLoading = false;
                });
            },
            mailboxStatusUpdate(row) {
                this.listLoading = true;
                getOrderStatus(row.processNumber).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('快件状态已更新');
                        this.getList();
                    } else {
                        this.$message.error('获取快件信息失败');
                    }
                    this.listLoading = false;
                })
            },
            showReserveCode(row) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '开箱码',
                    message: h('p', { style: 'text-align: center' }, [
                        h('b', { style: 'font-size: 24px' }, row.takeTypeInfo.mailboxInfo.resvCode)
                    ]),
                    confirmButtonText: '关闭'
                })
            },
            handlePageChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.getList();
            },
            resetExpressInfoForm() {
                this.expressInfoVisible = false;
                this.resetExpressInfoTemp();
                resetForm(this, 'expressInfoForm')
            },
            resetExpressInfoTemp() {
                this.expressInfo = {
                    id: '',
                    processNumber: '',
                    expressCompany: '',
                    expressNumber: ''
                }
            },
            resetTakeTypeForm() {
                this.takeTypeVisible = false;
                this.resetTakeTypeTemp();
                resetForm(this, 'takeTypeForm')
            },
            resetTakeTypeTemp() {
                this.takeTypeInfo = {
                    id: '',
                    processNumber: '',
                    takeType: '',
                    mailboxInfo: {
                        id: '',
                        mailboxId: ''
                    },
                    postInfo: {
                        id: '',
                        name: '',
                        mobilephone: '',
                        address: ''
                    }
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
    /*.el-button-group .el-button {
        white-space: inherit;
        width: 64px;
    }*/
</style>
