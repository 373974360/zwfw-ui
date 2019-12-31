<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" type="primary" @click="btnCreate">新增</el-button>
            <el-button class="filter-item" type="primary" style="margin-left: 10px;" @click="btnUpdate" :disabled="selectedRows.length != 1">编辑</el-button>
            <el-button class="filter-item" type="danger" style="margin-left: 10px;" @click="btnDeleteByLevel" :disabled="selectedRows.length < 1">删除</el-button>
        </div>
        <el-table :data="configList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column align="center" label="评价等级" prop="level">
                <template slot-scope="scope">
                    <el-rate
                        disabled
                        v-model="scope.row.level | levelParseInt"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                        show-text
                        :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                    </el-rate>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="操作" align="center" width="100">
                <template slot-scope="scope">
                    <el-button title="编辑" type="primary" icon="el-icon-edit"  circle
                               @click.stop.safe="btnUpdate(scope.row)"></el-button>
                    <el-button title="删除" type="danger" icon="el-icon-delete"  circle
                               @click.stop.safe="btnDeleteByLevel(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" width="60%"
                   :close-on-click-modal="closeOnClickModal" @close="closeConfigDialog">
            <el-form ref="configDialogForm" class="small-space" :model="config" label-position="right"
                     label-width="110px" :rules="configRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="评价等级" prop="level">
                            <el-rate
                                style="margin-top: 10px"
                                :disabled="dialogStatus == 'update'"
                                v-model="config.level"
                                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                show-text
                                :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                            </el-rate>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组织机构代码" prop="organizationalCode">
                            <el-input v-model="config.organizationalCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div v-if="showFlag" v-for="(content, index) in config.contentList">
                    <div style="border-bottom: 1px solid #dcdfe6; margin-bottom: 30px"></div>

                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item
                                :label="'测评指标编码'"
                                :key="content.id"
                                :prop="'contentList.' + index + '.contentCode'"
                                :rules="[
                                    {required: true, message: '请输入测评指标编码'},
                                    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                                ]"
                            >
                                <el-input v-model="content.contentCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-button title="删除" type="danger" icon="el-icon-delete"  circle
                                       @click.prevent="removeContent(content)"></el-button>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item
                                :label="'测评指标内容'"
                                :key="content.id"
                                :prop="'contentList.' + index + '.content'"
                                :rules="[
                                    {required: true, message: '请输入测评指标内容'},
                                    {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                                ]"
                            >
                                <el-input v-model="content.content"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-button @click="addContent" type="primary"  style="float: right; padding-right: 20px">新增测评指标</el-button>
                    </el-col>
                    </el-row>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogStatus=='create'" type="primary"  @click="doCreate" :loading="submitLoading">确认</el-button>
                <el-button v-else type="primary"  @click="doUpdate" :loading="submitLoading">确认</el-button>
                <el-button  @click="closeConfigDialog">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {copyProperties} from 'utils';
    import {getStore} from '@/util/store';
    import {
        getEvaluateConfig,
        createOrUpdateConfig,
        delConfigs,
        delConfigsByLevel
    } from '../../../api/hallSystem/evaluate/config';

    export default {
        name: 'config',
        filters: {
            levelParseInt: function (value) {
                return parseInt(value);
            }
        },
        data() {
            const validateLevel = (rule, value, callback) => {
                if (value == 0) {
                    callback(new Error('请选择评价等级'));
                    return;
                } else {
                    for (let e of this.evaluationLevelEnum) {
                        if (value == e.code) {
                            this.config.description = e.value;
                            break;
                        }
                    }
                }
                callback();
            };
            return {
                configList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    size: this.$store.state.app.rows,
                    contentCode: undefined,
                    level: undefined
                },
                config: {
                    id: undefined,
                    level: undefined,
                    description: undefined,
                    content: undefined,
                    contentCode: undefined,
                    organizationalCode: undefined,
                    contentList: []
                },
                configRules: {
                    level: [
                        {required: true, message: '请选择评价等级'},
                        {validator: validateLevel, trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入评价等级描述（非常满意、满意等）'}
                    ],
                    content: [
                        {required: true, message: '请输入测评指标内容'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    contentCode: [
                        {required: true, message: '请输入测评指标编码'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    organizationalCode: [
                        {required: true, message: '请输入组织机构代码'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogStatus: undefined,
                submitLoading: false,
                evaluationLevelEnum: [],
                levelParseInt: {},
                showFlag: true,
                removeContentList: [],
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal',
            ]),
        },
        created(){
            this.evaluationLevelEnum = this.loadEnum('EvaluationLevelEnum');
            this.reloadList();
        },
        methods: {
            loadEnum(name) {
                return this.$store.state.app.enums[name];
            },
            resetSearch(){
                this.listQuery.contentCode = undefined;
                this.listQuery.level = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.configList = undefined;
                getEvaluateConfig().then(response => {
                    this.listLoading = false;
                    this.configList = response.data;
                })
            },
            handleSizeChange(val){
                this.listQuery.size = val;
                this.reloadList();
            },
            handleCurrentChange(val){
                this.listQuery.page = val;
                this.reloadList();
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },
            btnCreate(){
                this.resetConfig();
                this.dialogStatus = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetConfig();
                if (row.level) {
                    this.config = copyProperties(this.config, row);
                } else {
                    this.config = copyProperties(this.config, this.selectedRows[0]);
                }
                this.config.level = parseInt(this.config.level)
                if (this.config.contentList.length == 1 && !this.config.contentList[0].contentCode) {
                    this.showFlag = false;
                }
                this.dialogStatus = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm('此操作将永久删除该信息, 是否继续？', '提示', {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续？', '提示', {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate(){
                this.$refs['configDialogForm'].validate(valid => {
                    if(valid) {

                        // 测评指标信息
                        const contentInfo = JSON.stringify(this.config.contentList);
                        this.$set(this.config, 'contentInfo', contentInfo);
                        this.$delete(this.config, 'contentList');

                        this.submitLoading = true;
                        createOrUpdateConfig(this.config).then(() => {
                            this.resetConfigDialogAndList();
                            this.$message.success('创建成功');
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['configDialogForm'].validate(valid => {
                    if(valid) {

                        console.log('removeContentList' + JSON.stringify(this.removeContentList));
                        // 调用第三方接口时删除
                        this.config.contentList.push.apply(this.config.contentList, this.removeContentList);
                        console.log('config.contentList' + JSON.stringify(this.config.contentList));
                        // 测评指标信息
                        const contentInfo = JSON.stringify(this.config.contentList);
                        this.$set(this.config, 'contentInfo', contentInfo);
                        this.$delete(this.config, 'contentList');
                        this.$delete(this.config, 'dimensionList');

                        this.submitLoading = true;
                        createOrUpdateConfig(this.config).then(() => {
                            this.resetConfigDialogAndList();
                            this.$message.success('更新成功');
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                // this.listLoading = true;
                delConfigs(ids).then(() => {
                    // this.reloadList();
                    this.$message.success('删除成功');
                })
            },
            resetConfig(){
                this.config = {
                    id: undefined,
                    level: undefined,
                    description: undefined,
                    content: undefined,
                    contentCode: undefined,
                    organizationalCode: undefined,
                    contentList: []
                }
            },
            resetConfigDialogAndList(){
                this.closeConfigDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeConfigDialog() {
                this.dialogVisible = false;
                this.resetConfig();
                this.$refs['configDialogForm'].resetFields();
                this.showFlag = true;
                this.removeContentList = [];
            },
            addContent() {
                if (!this.showFlag) {
                    this.showFlag = true;
                } else {
                    this.config.contentList.push({
                        id: '',
                        contentCode: '',
                        content: ''
                    });
                }
            },
            removeContent(content) {
                // 删除
                content.enable = 2;
                this.removeContentList.push(content);
                var index = this.config.contentList.indexOf(content)
                if (index !== -1) {
                    this.config.contentList.splice(index, 1)
                }

            },
            btnDeleteByLevel(row){
                let levels = [];
                if (row.level) {
                    this.$confirm('此操作将永久删除该信息, 是否继续？', '提示', {type: 'error'}).then(() => {
                        levels.push(row.level);
                        this.doDeleteByLevel(levels);
                    })
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续？', '提示', {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            levels.push(deleteRow.level);
                        }
                        this.doDeleteByLevel(levels);
                    })
                }
            },
            doDeleteByLevel(levels){
                this.listLoading = true;
                delConfigsByLevel(levels).then(() => {
                    this.reloadList();
                    this.$message.success('删除成功');
                })
            },
        }
    }
</script>


