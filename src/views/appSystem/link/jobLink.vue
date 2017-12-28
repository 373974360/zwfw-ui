<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.name"></el-input>
            <el-select v-model="listQuery.linktype" placeholder="链接类型" class="filter-item" style="width: 180px">
                <el-option
                        v-for="item in selectOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>
        <el-table ref="jobLinkTable" :data="jobLinkList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="165">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="链接名称" prop="name" width="300">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="left" label="链接类型" prop="linkTypeName" width="300">
                <template scope="scope">
                    <span>{{scope.row.linkTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="链接地址" prop="linkurl" width="300">
                <template scope="scope">
                    <span>{{scope.row.linkurl}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="排列顺序" prop="sortno" width="100">
                <template scope="scope">
                    <span>{{scope.row.sortno}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark">
                <template scope="scope">
                    <span>{{scope.row.remark}}</span>
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
            <el-form ref="jobLinkForm" class="small-space" :model="jobLink" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="jobLinkRules">
                <el-form-item label="链接名称" prop="name">
                    <el-input v-model="jobLink.name"></el-input>
                </el-form-item>
                <el-form-item label="图　　标" prop="img">
                    <el-upload class="avatar-uploader" name="uploadFile"
                               :accept="acceptTypes"
                               :action="uploadAction"
                               :on-success="handleAvatarSuccess"
                               :on-error="handlerAvatarError"
                               :before-upload="beforeAvatarUpload"
                               :show-file-list="false"
                               :on-remove="handleRemove">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <table>
                    <tr>
                        <td>
                            <el-form-item label="链接类型" prop="linktype">
                                <el-select v-model="jobLink.linktype" placeholder="链接类型">
                                    <el-option v-for="item in selectOptions" :key="item.id" :label="item.name" :value="item.id" @change="changeType"></el-option>
                                </el-select>
                            </el-form-item>
                        </td>
                        <td width="50"></td>
                        <td>
                            <el-form-item label="排列顺序" prop="sortno">
                                <el-input-number v-model="jobLink.sortno" :min="1" :max="100"/>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                <el-form-item label="链接地址" prop="linkurl">
                    <el-input v-model="jobLink.linkurl"></el-input>
                </el-form-item>
                <el-form-item label="备　　注" prop="remark">
                    <el-input v-model="jobLink.remark" type="textarea"></el-input>
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
    import {getJobLinkList, createJobLink, updateJobLink, delJobLinks, getAllJobLinkTypeList} from 'api/jobSystem/link/jobLink';
    export default {
        name: 'jobLink_table',
        data() {
            return {
                selectOptions:null,
                jobLinkList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                    linktype: undefined
                },
                jobLink: {
                    id: undefined,
                    img: undefined,
                    name: undefined,
                    remark: undefined,
                    linkurl: undefined,
                    linktype: undefined,
                    sortno: 1
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                jobLinkRules: {
                    name: [
                        {required: true, message: '请输入链接名称', trigger: 'blur'}
                    ],
                    linkurl: [
                        {required: true, message: '请输入链接地址', trigger: 'blur'}
                    ],
                    sortno: [
                        {required: true, message: '请输入排列顺序', type: 'number', trigger: 'change'}
                    ]
                },
                uploadAction: this.$store.state.app.uploadUrl,
                acceptTypes: this.$store.state.app.imageAccepts,
                imageUrl: ''
            }
        },
        created() {
            this.getList();
            this.getSelectOptions();
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums'
            ])
        },
        methods: {
            getSelectOptions() {
                getAllJobLinkTypeList().then(response => {
                    this.selectOptions = response.data;
                })
            },
            getList() {
                this.listLoading = true;
                getJobLinkList(this.listQuery).then(response => {
                    if (response.httpCode !== 200) {
                        this.$message.error(response.msg);
                    } else {
                        if (response.data == null) {
                            this.jobLinkList = response.data;
                            this.total = 0;
                        } else {
                            this.jobLinkList = response.data.list;
                            this.total = response.data.total;
                        }
                    }
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
                this.$refs.jobLinkTable.toggleRowSelection(row);
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
                this.jobLink = copyProperties(this.jobLink, row);
                this.imageUrl = this.jobLink.img;
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleAvatarSuccess(res, file) {
                if (res.state === 'SUCCESS') {
                    this.imageUrl = URL.createObjectURL(file.raw);
                    this.jobLink.img = res.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerAvatarError() {
                this.$message.error('网络不稳定，上传失败');
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleRemove() {
                this.jobLink.img = '';
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
                        delJobLinks(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.total -= selectCounts;
                                for (const deleteRow of this.selectedRows) {
                                    const index = this.jobLinkList.indexOf(deleteRow);
                                    this.jobLinkList.splice(index, 1);
                                }
                                this.$message.success('删除成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                    }).catch(() => {
                        console.dir("取消");
                    });
                }
            },
            create() {
                this.$refs['jobLinkForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createJobLink(this.jobLink).then(response => {
                            if (response.httpCode == 200) {
                                this.jobLinkList.unshift(response.data);
                                this.total += 1;
                                this.$message.success('创建成功');
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['jobLinkForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateJobLink(this.jobLink).then(response => {
                            if (response.httpCode == 200) {
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
                                this.getList();
                            } else {
                                this.$message.error(response.msg);
                            }
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            changeType(val) {
                console.log(val);
            },
            resetTemp() {
                this.jobLink = {
                    id: undefined,
                    img: undefined,
                    name: undefined,
                    remark: undefined,
                    linkurl: undefined,
                    linktype: undefined,
                    sortno: 1
                };
                this.imageUrl = '';
            }
        }
    }
</script>
