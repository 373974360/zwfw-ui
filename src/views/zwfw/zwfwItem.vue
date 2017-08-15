<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.name"></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>

        <el-table ref="zwfwItemTable" :data="zwfwItemList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="设定依据" prop="setBasis">
                <template scope="scope">
                    <span>{{scope.row.setBasis}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否收费" prop="chargeable">
                <template scope="scope">
                    <span>{{scope.row.chargeable}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否支持预约办理" prop="orderable">
                <template scope="scope">
                    <span>{{scope.row.orderable}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="实施主体性质" prop="implObjectType">
                <template scope="scope">
                    <span>{{scope.row.implObjectType}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否支持网上支付" prop="payOnlineAble">
                <template scope="scope">
                    <span>{{scope.row.payOnlineAble}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="基本编码" prop="basicCode">
                <template scope="scope">
                    <span>{{scope.row.basicCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="承诺办结时间" prop="promiseEndTime">
                <template scope="scope">
                    <span>{{scope.row.promiseEndTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark">
                <template scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="运行系统" prop="runSystem">
                <template scope="scope">
                    <span>{{scope.row.runSystem}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="事项类型" prop="type">
                <template scope="scope">
                    <span>{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="结果样本" prop="resultExample">
                <template scope="scope">
                    <span>{{scope.row.resultExample}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="行使层级" prop="handleLevel">
                <template scope="scope">
                    <span>{{scope.row.handleLevel}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联办机构" prop="unionAgency">
                <template scope="scope">
                    <span>{{scope.row.unionAgency}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="服务对象" prop="serviceObject">
                <template scope="scope">
                    <span>{{scope.row.serviceObject}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办理地点" prop="handlePlace">
                <template scope="scope">
                    <span>{{scope.row.handlePlace}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="行使内容" prop="handleContent">
                <template scope="scope">
                    <span>{{scope.row.handleContent}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="申请材料" prop="applyMaterial">
                <template scope="scope">
                    <span>{{scope.row.applyMaterial}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="数量限制" prop="numberLimit">
                <template scope="scope">
                    <span>{{scope.row.numberLimit}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="通办范围" prop="handleScope">
                <template scope="scope">
                    <span>{{scope.row.handleScope}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="咨询电话" prop="askPhone">
                <template scope="scope">
                    <span>{{scope.row.askPhone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办理流程id" prop="handleWorkflow">
                <template scope="scope">
                    <span>{{scope.row.handleWorkflow}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="收费标准" prop="chargeStandard">
                <template scope="scope">
                    <span>{{scope.row.chargeStandard}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办件类型" prop="processType">
                <template scope="scope">
                    <span>{{scope.row.processType}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="法定办结时限" prop="legalEndTime">
                <template scope="scope">
                    <span>{{scope.row.legalEndTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否支持物流快递" prop="postable">
                <template scope="scope">
                    <span>{{scope.row.postable}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="版本生效时间" prop="versionAvailableTime">
                <template scope="scope">
                    <span>{{scope.row.versionAvailableTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="监督电话" prop="supervisePhone">
                <template scope="scope">
                    <span>{{scope.row.supervisePhone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="实施机构" prop="implAgency">
                <template scope="scope">
                    <span>{{scope.row.implAgency}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="受理条件" prop="acceptCondition">
                <template scope="scope">
                    <span>{{scope.row.acceptCondition}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="收费依据" prop="chargeBasis">
                <template scope="scope">
                    <span>{{scope.row.chargeBasis}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="内部流程描述" prop="workflowDescription">
                <template scope="scope">
                    <span>{{scope.row.workflowDescription}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="权限划分" prop="authorityDivision">
                <template scope="scope">
                    <span>{{scope.row.authorityDivision}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="版本号" prop="version">
                <template scope="scope">
                    <span>{{scope.row.version}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="结果名称" prop="resultName">
                <template scope="scope">
                    <span>{{scope.row.resultName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="办理形式" prop="handleType">
                <template scope="scope">
                    <span>{{scope.row.handleType}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="事项名称" prop="name">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="中介服务" prop="mediumService">
                <template scope="scope">
                    <span>{{scope.row.mediumService}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="常见问题" prop="commonRequestion">
                <template scope="scope">
                    <span>{{scope.row.commonRequestion}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="实施编码" prop="implCode">
                <template scope="scope">
                    <span>{{scope.row.implCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="权利更新类型" prop="updateType">
                <template scope="scope">
                    <span>{{scope.row.updateType}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
                    <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
                        {{scope.row.enable | enums('Enable')}}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.app.pageSize"
                           :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="zwfwItemForm" class="small-space" :model="zwfwItem" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwItemRules">
                <el-form-item label="设定依据" prop="setBasis">
                    <el-input v-model="zwfwItem.setBasis"></el-input>
                </el-form-item>
                <el-form-item label="是否收费" prop="chargeable">
                    <el-input v-model="zwfwItem.chargeable"></el-input>
                </el-form-item>
                <el-form-item label="是否支持预约办理" prop="orderable">
                    <el-input v-model="zwfwItem.orderable"></el-input>
                </el-form-item>
                <el-form-item label="实施主体性质" prop="implObjectType">
                    <el-input v-model="zwfwItem.implObjectType"></el-input>
                </el-form-item>
                <el-form-item label="是否支持网上支付" prop="payOnlineAble">
                    <el-input v-model="zwfwItem.payOnlineAble"></el-input>
                </el-form-item>
                <el-form-item label="基本编码" prop="basicCode">
                    <el-input v-model="zwfwItem.basicCode"></el-input>
                </el-form-item>
                <el-form-item label="承诺办结时间" prop="promiseEndTime">
                    <el-input v-model="zwfwItem.promiseEndTime"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="zwfwItem.remark"></el-input>
                </el-form-item>
                <el-form-item label="运行系统" prop="runSystem">
                    <el-input v-model="zwfwItem.runSystem"></el-input>
                </el-form-item>
                <el-form-item label="事项类型" prop="type">
                    <el-input v-model="zwfwItem.type"></el-input>
                </el-form-item>
                <el-form-item label="结果样本" prop="resultExample">
                    <el-input v-model="zwfwItem.resultExample"></el-input>
                </el-form-item>
                <el-form-item label="行使层级" prop="handleLevel">
                    <el-input v-model="zwfwItem.handleLevel"></el-input>
                </el-form-item>
                <el-form-item label="联办机构" prop="unionAgency">
                    <el-input v-model="zwfwItem.unionAgency"></el-input>
                </el-form-item>
                <el-form-item label="服务对象" prop="serviceObject">
                    <el-input v-model="zwfwItem.serviceObject"></el-input>
                </el-form-item>
                <el-form-item label="办理地点" prop="handlePlace">
                    <el-input v-model="zwfwItem.handlePlace"></el-input>
                </el-form-item>
                <el-form-item label="行使内容" prop="handleContent">
                    <el-input v-model="zwfwItem.handleContent"></el-input>
                </el-form-item>
                <el-form-item label="申请材料" prop="applyMaterial">
                    <el-input v-model="zwfwItem.applyMaterial"></el-input>
                </el-form-item>
                <el-form-item label="数量限制" prop="numberLimit">
                    <el-input v-model="zwfwItem.numberLimit"></el-input>
                </el-form-item>
                <el-form-item label="通办范围" prop="handleScope">
                    <el-input v-model="zwfwItem.handleScope"></el-input>
                </el-form-item>
                <el-form-item label="咨询电话" prop="askPhone">
                    <el-input v-model="zwfwItem.askPhone"></el-input>
                </el-form-item>
                <el-form-item label="办理流程id" prop="handleWorkflow">
                    <el-input v-model="zwfwItem.handleWorkflow"></el-input>
                </el-form-item>
                <el-form-item label="收费标准" prop="chargeStandard">
                    <el-input v-model="zwfwItem.chargeStandard"></el-input>
                </el-form-item>
                <el-form-item label="办件类型" prop="processType">
                    <el-input v-model="zwfwItem.processType"></el-input>
                </el-form-item>
                <el-form-item label="法定办结时限" prop="legalEndTime">
                    <el-input v-model="zwfwItem.legalEndTime"></el-input>
                </el-form-item>
                <el-form-item label="是否支持物流快递" prop="postable">
                    <el-input v-model="zwfwItem.postable"></el-input>
                </el-form-item>
                <el-form-item label="版本生效时间" prop="versionAvailableTime">
                    <el-input v-model="zwfwItem.versionAvailableTime"></el-input>
                </el-form-item>
                <el-form-item label="监督电话" prop="supervisePhone">
                    <el-input v-model="zwfwItem.supervisePhone"></el-input>
                </el-form-item>
                <el-form-item label="实施机构" prop="implAgency">
                    <el-input v-model="zwfwItem.implAgency"></el-input>
                </el-form-item>
                <el-form-item label="受理条件" prop="acceptCondition">
                    <el-input v-model="zwfwItem.acceptCondition"></el-input>
                </el-form-item>
                <el-form-item label="收费依据" prop="chargeBasis">
                    <el-input v-model="zwfwItem.chargeBasis"></el-input>
                </el-form-item>
                <el-form-item label="内部流程描述" prop="workflowDescription">
                    <el-input v-model="zwfwItem.workflowDescription"></el-input>
                </el-form-item>
                <el-form-item label="权限划分" prop="authorityDivision">
                    <el-input v-model="zwfwItem.authorityDivision"></el-input>
                </el-form-item>
                <el-form-item label="版本号" prop="version">
                    <el-input v-model="zwfwItem.version"></el-input>
                </el-form-item>
                <el-form-item label="结果名称" prop="resultName">
                    <el-input v-model="zwfwItem.resultName"></el-input>
                </el-form-item>
                <el-form-item label="办理形式" prop="handleType">
                    <el-input v-model="zwfwItem.handleType"></el-input>
                </el-form-item>
                <el-form-item label="事项名称" prop="name">
                    <el-input v-model="zwfwItem.name"></el-input>
                </el-form-item>
                <el-form-item label="中介服务" prop="mediumService">
                    <el-input v-model="zwfwItem.mediumService"></el-input>
                </el-form-item>
                <el-form-item label="常见问题" prop="commonRequestion">
                    <el-input v-model="zwfwItem.commonRequestion"></el-input>
                </el-form-item>
                <el-form-item label="实施编码" prop="implCode">
                    <el-input v-model="zwfwItem.implCode"></el-input>
                </el-form-item>
                <el-form-item label="权利更新类型" prop="updateType">
                    <el-input v-model="zwfwItem.updateType"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';
    import {getZwfwItemList, createZwfwItem, updateZwfwItem, delZwfwItems} from 'api/zwfw/zwfwItem';

    export default {
        name: 'zwfwItem_table',
        data() {
            return {
                zwfwItemList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                },
                zwfwItem: {
                    id: undefined,
                    setBasis: undefined,
                    chargeable: undefined,
                    orderable: undefined,
                    implObjectType: undefined,
                    payOnlineAble: undefined,
                    basicCode: undefined,
                    promiseEndTime: undefined,
                    remark: undefined,
                    runSystem: undefined,
                    type: undefined,
                    resultExample: undefined,
                    handleLevel: undefined,
                    unionAgency: undefined,
                    serviceObject: undefined,
                    handlePlace: undefined,
                    handleContent: undefined,
                    applyMaterial: undefined,
                    numberLimit: undefined,
                    handleScope: undefined,
                    askPhone: undefined,
                    handleWorkflow: undefined,
                    chargeStandard: undefined,
                    processType: undefined,
                    legalEndTime: undefined,
                    postable: undefined,
                    versionAvailableTime: undefined,
                    supervisePhone: undefined,
                    implAgency: undefined,
                    acceptCondition: undefined,
                    chargeBasis: undefined,
                    workflowDescription: undefined,
                    authorityDivision: undefined,
                    version: undefined,
                    resultName: undefined,
                    handleType: undefined,
                    name: undefined,
                    mediumService: undefined,
                    commonRequestion: undefined,
                    implCode: undefined,
                    updateType: undefined
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                zwfwItemRules: {
                    setBasis: [
                        {required: true, message: '请输入设定依据', trigger: 'blur'}
                    ],
                    chargeable: [
                        {required: true, message: '请输入是否收费', trigger: 'blur'}
                    ],
                    orderable: [
                        {required: true, message: '请输入是否支持预约办理', trigger: 'blur'}
                    ],
                    implObjectType: [
                        {required: true, message: '请输入实施主体性质', trigger: 'blur'}
                    ],
                    payOnlineAble: [
                        {required: true, message: '请输入是否支持网上支付', trigger: 'blur'}
                    ],
                    basicCode: [
                        {required: true, message: '请输入基本编码', trigger: 'blur'}
                    ],
                    promiseEndTime: [
                        {required: true, message: '请输入承诺办结时间', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入备注', trigger: 'blur'}
                    ],
                    runSystem: [
                        {required: true, message: '请输入运行系统', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请输入事项类型', trigger: 'blur'}
                    ],
                    resultExample: [
                        {required: true, message: '请输入结果样本', trigger: 'blur'}
                    ],
                    handleLevel: [
                        {required: true, message: '请输入行使层级', trigger: 'blur'}
                    ],
                    unionAgency: [
                        {required: true, message: '请输入联办机构', trigger: 'blur'}
                    ],
                    serviceObject: [
                        {required: true, message: '请输入服务对象', trigger: 'blur'}
                    ],
                    handlePlace: [
                        {required: true, message: '请输入办理地点', trigger: 'blur'}
                    ],
                    handleContent: [
                        {required: true, message: '请输入行使内容', trigger: 'blur'}
                    ],
                    applyMaterial: [
                        {required: true, message: '请输入申请材料', trigger: 'blur'}
                    ],
                    numberLimit: [
                        {required: true, message: '请输入数量限制', trigger: 'blur'}
                    ],
                    handleScope: [
                        {required: true, message: '请输入通办范围', trigger: 'blur'}
                    ],
                    askPhone: [
                        {required: true, message: '请输入咨询电话', trigger: 'blur'}
                    ],
                    handleWorkflow: [
                        {required: true, message: '请输入办理流程id', trigger: 'blur'}
                    ],
                    chargeStandard: [
                        {required: true, message: '请输入收费标准', trigger: 'blur'}
                    ],
                    processType: [
                        {required: true, message: '请输入办件类型', trigger: 'blur'}
                    ],
                    legalEndTime: [
                        {required: true, message: '请输入法定办结时限', trigger: 'blur'}
                    ],
                    postable: [
                        {required: true, message: '请输入是否支持物流快递', trigger: 'blur'}
                    ],
                    versionAvailableTime: [
                        {required: true, message: '请输入版本生效时间', trigger: 'blur'}
                    ],
                    supervisePhone: [
                        {required: true, message: '请输入监督电话', trigger: 'blur'}
                    ],
                    implAgency: [
                        {required: true, message: '请输入实施机构', trigger: 'blur'}
                    ],
                    acceptCondition: [
                        {required: true, message: '请输入受理条件', trigger: 'blur'}
                    ],
                    chargeBasis: [
                        {required: true, message: '请输入收费依据', trigger: 'blur'}
                    ],
                    workflowDescription: [
                        {required: true, message: '请输入内部流程描述', trigger: 'blur'}
                    ],
                    authorityDivision: [
                        {required: true, message: '请输入权限划分', trigger: 'blur'}
                    ],
                    version: [
                        {required: true, message: '请输入版本号', trigger: 'blur'}
                    ],
                    resultName: [
                        {required: true, message: '请输入结果名称', trigger: 'blur'}
                    ],
                    handleType: [
                        {required: true, message: '请输入办理形式', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入事项名称', trigger: 'blur'}
                    ],
                    mediumService: [
                        {required: true, message: '请输入中介服务', trigger: 'blur'}
                    ],
                    commonRequestion: [
                        {required: true, message: '请输入常见问题', trigger: 'blur'}
                    ],
                    implCode: [
                        {required: true, message: '请输入实施编码', trigger: 'blur'}
                    ],
                    updateType: [
                        {required: true, message: '请输入权利更新类型', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getList();
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                getZwfwItemList(this.listQuery).then(response => {
                    this.zwfwItemList = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.name = null;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.zwfwItemTable.toggleRowSelection(row);
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.zwfwItem = copyProperties(this.zwfwItem, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let selectCounts = this.selectedRows.length;
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delZwfwItems(ids).then(response => {
                            this.total -= selectCounts;
                            for (const deleteRow of this.selectedRows) {
                                const index = this.zwfwItemList.indexOf(deleteRow);
                                this.zwfwItemList.splice(index, 1);
                            }
                            this.$message.success('删除成功');
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            create() {
                this.$refs['zwfwItemForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwItem(this.zwfwItem).then(response => {
                            this.zwfwItemList.unshift(response.data);
                            this.total += 1;
                            this.$message.success('创建成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['zwfwItemForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateZwfwItem(this.zwfwItem).then(response => {
                            copyProperties(this.currentRow, response.data);
                            this.$message.success('更新成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.zwfwItem = {
                    id: undefined,
                    setBasis: undefined,
                    chargeable: undefined,
                    orderable: undefined,
                    implObjectType: undefined,
                    payOnlineAble: undefined,
                    basicCode: undefined,
                    promiseEndTime: undefined,
                    remark: undefined,
                    runSystem: undefined,
                    type: undefined,
                    resultExample: undefined,
                    handleLevel: undefined,
                    unionAgency: undefined,
                    serviceObject: undefined,
                    handlePlace: undefined,
                    handleContent: undefined,
                    applyMaterial: undefined,
                    numberLimit: undefined,
                    handleScope: undefined,
                    askPhone: undefined,
                    handleWorkflow: undefined,
                    chargeStandard: undefined,
                    processType: undefined,
                    legalEndTime: undefined,
                    postable: undefined,
                    versionAvailableTime: undefined,
                    supervisePhone: undefined,
                    implAgency: undefined,
                    acceptCondition: undefined,
                    chargeBasis: undefined,
                    workflowDescription: undefined,
                    authorityDivision: undefined,
                    version: undefined,
                    resultName: undefined,
                    handleType: undefined,
                    name: undefined,
                    mediumService: undefined,
                    commonRequestion: undefined,
                    implCode: undefined,
                    updateType: undefined
                };
            }
        }
    }
</script>
