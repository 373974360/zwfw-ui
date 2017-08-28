<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete"
                       :disabled="deleteAble">
                删除
            </el-button>
        </div>

        <el-table ref="sysMessageTemplateTable" :data="sysMessageTemplateList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="模板ID">
                <template scope="scope">
                    <span>{{scope.row.template_id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="模板标题" prop="sms_title">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.sms_title}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="模板内容" prop="sms_content">
                <template scope="scope">
                    <span>{{scope.row.sms_content}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="短信签名" prop="sms_signature">
                <template scope="scope">
                    <span>{{scope.row.sms_signature}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" label="状态">
                <template scope="scope">
                    <el-tag :type="scope.row.template_status | smsStatusFilter">
                        {{scope.row.template_status | dicts('sms-status')}}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="sysMessageTemplateForm" class="small-space" :model="sysMessageTemplate" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="sysMessageTemplateRules">
                <el-form-item label="模板标题" prop="sms_title">
                    <el-input v-model="sysMessageTemplate.sms_title"></el-input>
                </el-form-item>
                <el-form-item label="模板内容" prop="sms_content">
                    <el-input id="sms_content" type="textarea" :rows="3" v-model="sysMessageTemplate.sms_content" @focus="contentFocus"></el-input>
                </el-form-item>
                <el-form-item label="短信签名" prop="sms_signature">
                    <el-input v-model="sysMessageTemplate.sms_signature">
                    </el-input>
                </el-form-item>
                <el-form-item label="常用字段">
                    <template scope="scope">
                        <template v-for="(sysMessageFiled,index) in sysMessageFiledList">
                            <div class="wrapper" v-if="index != 0 && index % 6 == 0"></div>
                            <el-button type="info" @click="btnClick(sysMessageFiled.value)" >{{sysMessageFiled.name}}</el-button>
                        </template>
                    </template>
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
    import {
        getSysMessageTemplateList,
        createSysMessageTemplate,
        updateSysMessageTemplate,
        delSysMessageTemplates
    } from 'api/sys/system/sysMessageTemplate';

    import {getAllSysMessageFiled} from 'api/sys/system/sysMessageFiled';

    export default {
        name: 'sysMessageTemplate_table',
        data() {
            return {
                sysMessageTemplateList: [],
                sysMessageFiledList: [],
                listLoading: true,
                sysMessageTemplate: {
                    id: undefined,
                    template_id: undefined,
                    sms_title: '',
                    sms_content: '',
                    sms_signature: ''
                },
                $content: undefined,
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                sysMessageTemplateRules: {
                    sms_title: [
                        {required: true, message: '请输入短信模板标题', trigger: 'blur'}
                    ],
                    sms_content: [
                        {required: true, message: '请输入短信模板内容', trigger: 'blur'}
                    ],
                    sms_signature: [
                        {required: true, message: '请输入短信签名', trigger: 'blur'}
                    ]
                },
                deleteAble: true
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
                getSysMessageTemplateList().then(response => {
                    this.sysMessageTemplateList = response.data;
                    this.listLoading = false;
                })
            },
            getFiledList() {
                if (this.sysMessageFiledList.length <= 0) {
                    this.dialogLoading = true;
                    getAllSysMessageFiled().then(response => {
                        this.sysMessageFiledList = response.data;
                        this.dialogLoading = false;
                    })
                }
            },
            btnClick(value){
                if(this.$content){
                    const index = this.$content.selectionEnd;
                    var arr = this.sysMessageTemplate.sms_content.split('');
                    arr.splice(index, 0, value);
                }
                this.sysMessageTemplate.sms_content = arr.join('');
            },
            contentFocus(event){
                this.$content = event.srcElement;
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
                if (this.selectedRows.length == 1) {
                    this.deleteAble = false;
                } else {
                    this.deleteAble = true;
                }
            },
            toggleSelection(row) {
                this.$refs.sysMessageTemplateTable.toggleRowSelection(row);
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
                this.getFiledList();
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.sysMessageTemplate = copyProperties(this.sysMessageTemplate, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
                this.getFiledList();
            },
            handleDelete() {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let template_id = this.selectedRows[0].template_id;
                    delSysMessageTemplates(template_id).then(response => {
                        for (const deleteRow of this.selectedRows) {
                            const index = this.sysMessageTemplateList.indexOf(deleteRow);
                            this.sysMessageTemplateList.splice(index, 1);
                        }
                        this.$message.success('删除成功');
                        this.listLoading = false;
                    })
                }).catch(() => {
                    console.dir("取消");
                });
            },
            create() {
                this.$refs['sysMessageTemplateForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createSysMessageTemplate(this.sysMessageTemplate).then(response => {
                            this.sysMessageTemplateList.unshift(response.data);
                            this.$message.success('创建成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['sysMessageTemplateForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateSysMessageTemplate(this.sysMessageTemplate).then(response => {
                            copyProperties(this.currentRow, this.sysMessageTemplate);
                            this.$message.success('更新成功');
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.sysMessageTemplate = {
                    id: undefined,
                    template_id: undefined,
                    sms_title: '',
                    sms_content: '',
                    sms_signature: ''
                };
            }
        }
    }
</script>
<style scoped>
    .wrapper{height: 10px;}
</style>
