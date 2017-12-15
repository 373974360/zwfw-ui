<template>
    <div class="app-container calendar-list-container form-suie">
        <el-form ref="userForm" :model="sysUser" :rules="sysUserRules" label-width="80px">
            <el-form-item label="所属部门">
                <el-input v-model="sysUser.deptVo.name" :disabled="true"></el-input>
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
            <el-form-item label="帐号" prop="account">
                <el-input v-model="sysUser.account" :disabled="true"/>
            </el-form-item>
            <el-form-item label="工号" prop="empNo">
                <el-input v-model="sysUser.empNo" disabled/>
            </el-form-item>
            <el-form-item label="修改密码">
                <el-checkbox v-model="checked">是</el-checkbox>
            </el-form-item>
            <el-form-item label="旧密码" prop="oldPassword" v-show="checked">
                <el-input v-model="sysUser.oldPassword"/>
            </el-form-item>
            <el-form-item label="密码" prop="password" v-show="checked">
                <el-input v-model="sysUser.password" type="password" placeholder="修改密码时填入新密码，若不需要则无需输入"/>
            </el-form-item>
            <el-form-item label="确认密码" prop="passwordConfirm" v-show="checked">
                <el-input v-model="sysUser.passwordConfirm" type="password" placeholder="修改密码时填入新密码，若不需要则无需输入"/>
            </el-form-item>
            <el-form-item>
                <el-button style="margin-left: 84px;" type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {getInfo} from 'api/common/login/login';
    import {updateUser} from 'api/baseSystem/org/user';
    import {mapGetters} from 'vuex';
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
                sysUser: {
                    id: undefined,
                    deptId: '',
                    name: '',
                    deptVo: {},
                    sex: '',
                    phone: '',
                    avatar: '',
                    account: '',
                    password: '',
                    passwordConfirm: '',
                    empNo: '',
                    oldPassword: ''
                },
                sysUserRules: {
                    name: [
                        {required: true, message: '请输入姓名'}
                    ],
                    phone: [
                        {required: true, validator: validatMobiles}
                    ],
                    avatar: [
                        {type: 'url', required: true, message: '头像地址不正确'}
                    ],
                    empNo: [
                        {required: true, message: '工号'}
                    ],
                    oldPassword: [
                        {required: true, message: '请输入密码'}
                    ],
                    password: [
                        {required: true, message: '请输入密码'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符'}
                    ],
                    passwordConfirm: [
                        {required: true, validator: validatePass2}
                    ]
                },
                uploadAction: this.$store.state.app.uploadUrl,
                acceptTypes: this.$store.state.app.imageAccepts,
                imageUrl: '',
                checked: false
            }
        },
        created() {
            this.getCurrentUserInfo();
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        methods: {
            getCurrentUserInfo() {
                getInfo().then(response => {
                    this.sysUser = response.data;
                    this.sysUser.password = '';
                    this.imageUrl = this.sysUser.avatar;
                    this.sysUserRules.oldPassword[0].required = false;
                    this.sysUserRules.password[0].required = false;
                    this.sysUserRules.passwordConfirm[0].required = false;
                })
            },
            handleAvatarSuccess(res, file) {
                if (res.state === 'SUCCESS') {
                    this.imageUrl = URL.createObjectURL(file.raw);
                    this.sysUser.avatar = res.url;
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
                this.sysUser.avatar = '';
            },
            onSubmit() {
                if (this.checked) {
                    this.sysUserRules.oldPassword[0].required = true;
                    this.sysUserRules.password[0].required = true;
                    this.sysUserRules.passwordConfirm[0].required = true;
                }
                this.$refs['userForm'].validate(valid => {
                    if (valid) {
                        const query = {
                            id: this.sysUser.id,
                            deptId: this.sysUser.deptId,
                            name: this.sysUser.name,
                            sex: this.sysUser.sex,
                            empNo: this.sysUser.empNo,
                            phone: this.sysUser.phone,
                            avatar: this.sysUser.avatar,
                            account: this.sysUser.account,
                            oldPassword: this.sysUser.oldPassword,
                            password: this.sysUser.password,
                            passwordConfirm: this.sysUser.passwordConfirm
                        }
                        updateUser(query).then(response => {
                            if (response.httpCode === 200) {
                                this.$message.success('更新成功！');
                            } else {
                                this.$message.error(response.msg);
                            }
                        })
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>
<style>

    .form-suie .el-input {
        width: 300px;
    }
    .form-suie .el-form {
        width: 80%;
        margin-left: 30%;
        position: static;
    }
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