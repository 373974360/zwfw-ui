<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" placeholder="姓名"
                      v-model="listQuery.name"></el-input>
            <el-cascader :options="cascader" class="filter-item" @change="handleChange"
                         :show-all-levels="true" clearable filterable expand-trigger="hover"
                         :change-on-select="true" style="width: 180px" placeholder="选择部门">
            </el-cascader>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">
                添加
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="delete">
                删除
            </el-button>
        </div>

        <el-table ref="userTable" :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="姓名">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="deptVo.name" align="center" label="部门">
                <template scope="scope">
                    <span v-if="scope.row.deptVo">{{scope.row.deptVo.name}}</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column prop="sex" align="center" label="性别">
                <template scope="scope">
                    <span>{{scope.row.sex | enums('Gender')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电话">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="帐号">
                <template scope="scope">
                    <span>{{scope.row.account}}</span>
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

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="closeOnClickModal" :before-close="resetUserForm1">
            <el-form id="checkboxTable" ref="userForm1" class="small-space" :model="sysUser" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="sysUserRules1">
                <el-form-item label="部门" prop="deptId">
                    <el-cascader :options="cascader" class="filter-item" @change="handleChanges" v-model="updateModel"
                                 :show-all-levels="true"
                                 :change-on-select="true" expand-trigger="hover" :clearable="true" style="width: 180px"
                                 placeholder="选择部门"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="sysUser.name"/>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="sysUser.sex">
                        <el-radio v-for="item in enums['Gender']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="sysUser.phone"/>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <el-upload name="uploadFile" list-type="picture-card" accept="image/*"
                               :action="uploadAction" :file-list="uploadAvatars"
                               :on-success="handleAvatarSuccess"
                               :on-error="handlerAvatarError"
                               :before-upload="beforeAvatarUpload"
                               :show-file-list="true"
                               :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="帐号" prop="account">
                    <el-input v-model="sysUser.account"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="sysUser.password" type="password" placeholder="修改密码时填入新密码，若不需要则无需输入"/>
                </el-form-item>
                <el-form-item label="确认密码" prop="passwordConfirm">
                    <el-input v-model="sysUser.passwordConfirm" type="password" placeholder="修改密码时填入新密码，若不需要则无需输入"/>
                </el-form-item>
                <el-form-item label="状态" prop="enable">
                    <el-radio-group v-model="sysUser.enable">
                        <el-radio v-for="item in enums['Enable']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="sysUser.remark" :rows="3"/>
                </el-form-item>
                <el-form-item label="工号" prop="empNo">
                    <el-input v-model="sysUser.empNo"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetUserForm1">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>

                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import {getDeptCascader} from 'api/baseSystem/org/dept';
    import {getUserList, updateUser, createUser, delUser} from 'api/baseSystem/org/user';
    import {copyProperties, resetForm} from 'utils';
    import {mapGetters} from 'vuex';
    import {delWindowUser} from 'api/hallSystem/lobby/window';

    export default {
        name: 'table_demo',
        data() {
            const validatMobiles = (rule, value, callback) => {
                if (!/^((13|15|18|14|17)+\d{9})$/.test(value)) {
                    return callback(new Error('电话号码格式不正确'));
                } else {
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (this.sysUser.password === '') {
                    callback();
                } else {
                    if (value === '') {
                        callback(new Error('请再次输入密码'));
                    } else if (value !== this.sysUser.password) {
                        callback(new Error('两次输入密码不一致!'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined,
                    deptId: undefined
                },
                sysUser: {
                    id: undefined,
                    deptId: '',
                    name: '',
                    deptVo: {},
                    sex: 1,
                    phone: '',
                    avatar: '',
                    account: '',
                    password: '',
                    passwordConfirm: '',
                    enable: 1,
                    remark: '',
                    empNo: ''
                },
                sysUserRules1: {
                    deptId: [
                        {required: true, message: '请选择部门'}
                    ],
                    name: [
                        {required: true, message: '请输入姓名'}
                    ],
                    phone: [
                        {required: true, validator: validatMobiles}
                    ],
                    avatar: [
                        {type: 'url', required: true, message: '头像地址不正确'}
                    ],
                    account: [
                        {type: 'email', required: true, message: '请输入合法的邮箱'}
                    ],
                    password: [
                        {required: true, message: '请输入密码'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符'}
                    ],
                    passwordConfirm: [
                        {required: true, validator: validatePass2}
                    ],
                    empNo: [
                        {required: true, message: '请输入工号'}
                    ],
                },
                selectedRows: [],
                cascader: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                uploadAction: '/api/common/upload',
                uploadAvatars: []
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ]),
            updateModel: function () {
                let result = [];
                if (this.sysUser.deptVo.treePosition) {
                    result = (this.sysUser.deptVo.treePosition + '&' + this.sysUser.deptVo.id).split('&');
                } else {
                    result = [this.sysUser.deptVo.id + ''];
                }
                return result;
            }
        },
        created() {
            this.getList();
            this.getOptions();
        },
        methods: {
            getOptions(id) {
                getDeptCascader(id).then(response => {
                    this.cascader = response.data;
                })
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.listQuery.deptId = null;
                this.listQuery.name = null;
                console.dir(this.listQuery.page);
                this.getList();
            },
            handleChange(value) {
                this.listQuery.deptId = null;
                if (value.length > 0) {
                    this.listQuery.deptId = value[value.length - 1];
                } else {
                    this.sysUser.deptId = 0;
                    this.getList();
                }
            },
            handleChanges(value) {
                if (value.length > 0) {
                    this.sysUser.deptId = value[value.length - 1];
                } else {
                    this.sysUser.deptId = 0;
                    this.getList();
                }
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            toggleSelection(row) {
                this.$refs.userTable.toggleRowSelection(row);
            },
            handleCreate(row) {
                this.currentRow = row;
                //this.sysUser.deptId = row.id;
                this.sysUserRules1.password[0].required = true;
                this.sysUserRules1.passwordConfirm[0].required = true;
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.sysUser = copyProperties(this.sysUser, row);
                this.sysUser.password = '';
                this.sysUserRules1.password[0].required = false;
                this.sysUserRules1.passwordConfirm[0].required = false;
                this.uploadAvatars.push({url: this.sysUser.avatar});
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            getList() {
                this.listLoading = true;
                getUserList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },

            /**
             *
             * 后台返回响应就会触发
             *
             */
            handleAvatarSuccess(res, file, fileList) {
                console.log(res);
                if (res.state === 'SUCCESS') {
                    fileList.length = 0;
                    fileList.push(file);
                    this.sysUser.avatar = res.url;
                    this.$message.success("上传成功");
                } else {
                    this.$message.error("上传失败");
                }
            },
            /**
             * 网络无法联通时会触发，其他的场景没有进入
             * @param err
             * @param file
             * @param fileList
             */
            handlerAvatarError(err, file, fileList) {
                console.log(err);
                this.$message.error("网络不稳定，上传失败");
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleRemove() {
                this.sysUser.avatar = '';
            },
            handleDelete() {
                var selectCounts = this.selectedRows.length;
                if (this.selectedRows == 0) {
                    this.$message.warning('请选择需要操作的记录');
                } else {
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let ids = new Array();
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        delUser(ids).then(response => {
                            delWindowUser(ids).then(response => {
                                this.listLoading = false;
                                this.total -= selectCounts;
                                this.$message.success('删除成功');
                                this.getList();
                            })
                        })
                        for (const deleteRow of this.selectedRows) {
                            const index = this.list.indexOf(deleteRow);
                            this.list.splice(index, 1);
                        }
                    }).catch(() => {
                        console.dir('取消');
                    });
                }
            },
            create() {
                this.$refs['userForm1'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createUser(this.sysUser).then(response => {
                            if(response.httpCode!=200){
                                this.$message.error(response.msg);
                            }else{
                                this.list.unshift(response.data);
                                this.total += 1;
                                this.$message.success('创建成功');
                                this.resetUserForm1();
                            }
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            update() {
                this.$refs['userForm1'].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        this.sysUser.deptVo = {};
                        updateUser(this.sysUser).then(response => {
                            if(response.httpCode!=200){
                                this.$message.error(response.msg);
                            }else{
                                copyProperties(this.currentRow, response.data);
                                this.$message.success('更新成功');
                            }
                            this.listLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            resetTemp() {
                this.sysUser = {
                    id: undefined,
                    deptId: '',
                    name: '',
                    deptVo: {},
                    sex: 1,
                    phone: '',
                    avatar: '',
                    account: '',
                    password: '',
                    passwordConfirm: '',
                    enable: 1,
                    remark: '',
                    empNo: '',
                };
                this.uploadAvatars = []
            },
            handleDownload() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('vendor/Export2Excel');
                    const tHeader = ['时间', '地区', '类型', '标题', '重要性'];
                    const filterVal = ['timestamp', 'province', 'type', 'title', 'importance'];
                    const data = this.formatJson(filterVal, this.list);
                    export_json_to_excel(tHeader, data, 'table数据');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },
            resetUserForm1() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'userForm1');
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
        border-color: #20a0ff;
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
