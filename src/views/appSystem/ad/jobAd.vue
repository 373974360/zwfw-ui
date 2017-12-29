<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="名称"
                      v-model="listQuery.name"></el-input>
            <el-select v-model="listQuery.wz" placeholder="推荐位置" class="filter-item" style="width: 180px">
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
        <el-table ref="jobAdTable" :data="jobAdList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="165">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="名称" prop="name" width="260">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="推荐位置" prop="wz" width="150">
                <template scope="scope">
                    <span>{{scope.row.wzName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="链接地址" prop="linkurl" width="300">
                <template scope="scope">
                    <span>{{scope.row.linkurl}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="过期时间" prop="wz" width="180">
                <template scope="scope">
                    <span>{{scope.row.downtime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" prop="status" width="90">
                <template scope="scope">
                    <span v-if="scope.row.status==0">未发布</span>
                    <span v-else-if="scope.row.status==1">正常</span>
                    <span v-else-if="scope.row.status==2">已过期</span>
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
            <el-form ref="jobAdForm" class="small-space" :model="jobAd" label-position="right" label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="jobAdRules">
                <el-form-item label="名　　称" prop="name">
                    <el-input v-model="jobAd.name"></el-input>
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
                <el-form-item label="链接地址" prop="linkurl">
                    <el-input v-model="jobAd.linkurl"></el-input>
                </el-form-item>
                <table>
                    <tr>
                        <td>
                            <el-form-item label="广告位置" prop="wz">
                                <el-select v-model="jobAd.wz" placeholder="广告位置">
                                    <el-option
                                            v-for="item in selectOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </td>
                        <td width="50"></td>
                        <td>
                            <el-form-item label="过期时间" prop="downtime">
                                <el-date-picker v-model="jobAd.downtime" type="datetime" placeholder="选择日期" :picker-options="pickerOptions" @change="pickTime"></el-date-picker>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                <el-form-item label="备　　注" prop="remark">
                    <el-input v-model="jobAd.remark" type="textarea"></el-input>
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
    import {getJobAdList, createJobAd, updateJobAd, delJobAds, getAllJobAdTypeList} from 'api/jobSystem/ad/jobAd';

    export default {
        name: 'jobAd_table',
        data() {
            return {
                selectOptions:null,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                jobAdList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                    wz: undefined
                },
                jobAd: {
                    id: undefined,
                    name: undefined,
                    downtime: undefined,
                    img: undefined,
                    wz: undefined,
                    remark: undefined,
                    linkurl: undefined,
                    status: 0,
                },
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                jobAdRules: {
                    name: [
                        {required: true, message: '请输入广告名称', trigger: 'blur'}
                    ],
                    downtime: [
                        {required: true, message: '请输入过期时间', trigger: 'change'}
                    ],
                    linkurl: [
                        {required: true, message: '请输入链接地址', trigger: 'blur'}
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
            getList() {
                this.listLoading = true;
                getJobAdList(this.listQuery).then(response => {
                    this.jobAdList = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            getSelectOptions() {
                getAllJobAdTypeList().then(response => {
                    this.selectOptions = response.data;
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
                this.$refs.jobAdTable.toggleRowSelection(row);
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
                this.jobAd = copyProperties(this.jobAd, row);
                this.imageUrl = this.jobAd.img;
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleAvatarSuccess(res, file) {
                if (res.state === 'SUCCESS') {
                    this.imageUrl = URL.createObjectURL(file.raw);
                    this.jobAd.img = res.url;
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
                this.jobAd.img = '';
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
                        delJobAds(ids).then(response => {
                            if (response.httpCode == 200) {
                                this.total -= selectCounts;
                                for (const deleteRow of this.selectedRows) {
                                    const index = this.jobAdList.indexOf(deleteRow);
                                    this.jobAdList.splice(index, 1);
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
                this.$refs['jobAdForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createJobAd(this.jobAd).then(response => {
                            if (response.httpCode == 200) {
                                this.jobAdList.unshift(response.data);
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
                this.$refs['jobAdForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateJobAd(this.jobAd).then(response => {
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
            pickTime(val) {
                this.jobAd.downtime = val;
            },
            resetTemp() {
                this.jobAd = {
                    id: undefined,
                    name: undefined,
                    downtime: undefined,
                    img: undefined,
                    wz: undefined,
                    remark: undefined,
                    linkurl: undefined,
                    status: 0
                };
                this.imageUrl = '';
            }
        }
    }
</script>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>