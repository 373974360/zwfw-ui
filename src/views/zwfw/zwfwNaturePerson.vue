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

        <el-table ref="zwfwNaturePersonTable" :data="zwfwNaturePersonList" v-loading.body="listLoading" border fit
                  highlight-current-row
                  style="width: 100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="序号" width="200px">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名" prop="name">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="点击编辑" placement="right-start">
                        <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.name}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="身份证号" prop="idcard" width="250px">
                <template scope="scope">
                    <span>{{scope.row.idcard}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="性别" prop="gender">
                <template scope="scope">
                    <span>{{scope.row.gender | enums('Gender')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="出生日期" prop="birthday">
                <template scope="scope">
                    <span>{{scope.row.birthday | date('YYYY-MM-DD')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="住址" prop="address">
                <template scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="民族" prop="nation">
                <template scope="scope">
                    <span>{{scope.row.nation}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联系电话" prop="phone">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
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
                   :close-on-click-modal="closeOnClickModal" :before-close="resetZwfwNaturePersonForm">
            <el-form ref="zwfwNaturePersonForm" class="small-space" :model="zwfwNaturePerson" label-position="right"
                     label-width="80px"
                     style='width: 80%; margin-left:10%;' v-loading="dialogLoading" :rules="zwfwNaturePersonRules">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="zwfwNaturePerson.name"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="idcard">
                    <el-input v-model="zwfwNaturePerson.idcard"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="zwfwNaturePerson.gender">
                        <el-radio v-for="item in enums['Gender']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker v-model="zwfwNaturePerson.birthday" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="changeDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="住址" prop="address">
                    <el-input v-model="zwfwNaturePerson.address"></el-input>
                </el-form-item>
                <el-form-item label="民族" prop="nation">
                    <el-input v-model="zwfwNaturePerson.nation"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="zwfwNaturePerson.phone"></el-input>
                </el-form-item>
                <el-form-item label="照片" prop="photo">
                    <el-upload  class="avatar-uploader" action="" :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="zwfwNaturePerson.password" type="password" placeholder="修改密码时填入新密码，若不需要则无需输入"/>
                </el-form-item>
                <el-form-item label="确认密码" prop="passwordConfirm">
                    <el-input v-model="zwfwNaturePerson.passwordConfirm" type="password" placeholder="修改密码时填入新密码，若不需要则无需输入"/>
                </el-form-item>
                <el-form-item label="状态" prop="enable">
                    <el-radio-group v-model="zwfwNaturePerson.enable">
                        <el-radio v-for="item in enums['Enable']"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                            <span style="font-weight:normal;">{{item.value}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="zwfwNaturePerson.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetZwfwNaturePersonForm">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" icon="circle-check" @click="create">确 定
                </el-button>
                <el-button v-else type="primary" icon="circle-check" @Keyup.enter="update" @click="update">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {copyProperties, resetForm} from 'utils';
    import moment from 'moment';
    import {mapGetters} from 'vuex';
    import {
        getZwfwNaturePersonList,
        createZwfwNaturePerson,
        updateZwfwNaturePerson,
        delZwfwNaturePersons
    } from 'api/zwfw/zwfwNaturePerson';

    export default {
        name: 'zwfwNaturePerson_table',
        data() {
            const validatMobiles = (rule, value, callback) => {
                if (!/^((13|15|18|14|17)+\d{9})$/.test(value)) {
                    return callback(new Error('电话号码格式不正确'));
                } else {
                    callback();
                }
            };
            //身份证验证不完善，同时输入身份证的日期显示在出生日期中
            const validateIdcard = (rule, value, callback) => {
                if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
                    return callback(new Error('身份证号码不合法'));
                } else {
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (this.zwfwNaturePerson.password === '') {
                    callback();
                } else {
                    if (value === '') {
                        callback(new Error('请再次输入密码'));
                    } else if (value !== this.zwfwNaturePerson.password) {
                        callback(new Error('两次输入密码不一致!'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                zwfwNaturePersonList: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.app.page,
                    rows: this.$store.state.app.rows,
                    name: undefined
                },
                zwfwNaturePerson: {
                    id: undefined,
                    birthday: '',
                    password: '',
                    address: '',
                    gender: 1,
                    idcard: '',
                    nation: '',
                    phone: '',
                    name: '',
                    photo: '',
                    remark: '',
                    enable: 1
                },
                imageUrl: '',
                currentRow: null,
                selectedRows: [],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogLoading: false,
                zwfwNaturePersonRules: {
                    birthday: [
                        {required: true, message: '请输入出生日期'}
                    ],
                    idcard: [
                        {required: true, validator: validateIdcard}
                    ],
                    address: [
                        {required: true, message: '请输入住址'}
                    ],
                    nation: [
                        {required: true, message: '请输入民族'}
                    ],
                    phone: [
                        {required: true, validator: validatMobiles}
                    ],
                    name: [
                        {required: true, message: '请输入姓名'}
                    ],
                    password: [
                        {required: true, message: '请输入密码'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符'}
                    ],
                    passwordConfirm: [
                        {required: true, validator: validatePass2}
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
                'enums',
                'closeOnClickModal'
            ])
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            getList() {
                this.listLoading = true;
                getZwfwNaturePersonList(this.listQuery).then(response => {
                    this.zwfwNaturePersonList = response.data.list;
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
                this.$refs.zwfwNaturePersonTable.toggleRowSelection(row);
            },
            changeDate() {
                this.zwfwNaturePerson.birthday = moment(this.zwfwNaturePerson.birthday).format("YYYY-MM-DD");
            },
            handleCreate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.zwfwNaturePersonRules.password[0].required = true;
                this.zwfwNaturePersonRules.passwordConfirm[0].required = true;
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.currentRow = row;
                this.resetTemp();
                this.zwfwNaturePerson = copyProperties(this.zwfwNaturePerson, row);
                this.zwfwNaturePerson.birthday = new Date(row.birthday).toLocaleDateString().replace(/\//g, "-");
                this.zwfwNaturePerson.password = '';
                this.zwfwNaturePersonRules.password[0].required = false;
                this.zwfwNaturePersonRules.passwordConfirm[0].required = false;
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
                        delZwfwNaturePersons(ids).then(response => {
                            this.total -= selectCounts;
                            for (const deleteRow of this.selectedRows) {
                                const index = this.zwfwNaturePersonList.indexOf(deleteRow);
                                this.zwfwNaturePersonList.splice(index, 1);
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
                this.$refs['zwfwNaturePersonForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        createZwfwNaturePerson(this.zwfwNaturePerson).then(response => {
                            this.zwfwNaturePersonList.unshift(response.data);
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
                this.$refs['zwfwNaturePersonForm'].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.listLoading = true;
                        updateZwfwNaturePerson(this.zwfwNaturePerson).then(response => {
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
                this.zwfwNaturePerson = {
                    id: undefined,
                    birthday: '',
                    password: '',
                    address: '',
                    gender: 1,
                    idcard: '',
                    nation: '',
                    phone: '',
                    name: '',
                    photo: '',
                    remark: '',
                    enable: 1
                };
            },
            resetZwfwNaturePersonForm() {
                this.dialogFormVisible = false;
                this.resetTemp();
                resetForm(this, 'zwfwNaturePersonForm');
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