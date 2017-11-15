<template>
    <div class="reset-container">
        <canvas id="canvas"></canvas>
        <el-form autoComplete="on" :model="resetForm" :rules="resetRules" ref="resetForm" label-position="left"
                 label-width="0px"
                 class="card-box reset-form">
            <div>
                <router-link to="/login" class="back-icon">
                    <i class="el-icon-arrow-left"></i>
                </router-link>
                <h3 class="title">重设密码</h3>
            </div>
            <el-form-item prop="account">
                <span class="svg-container"><wscn-icon-svg icon-class="youxiang"/></span>
                <el-input name="account" type="text" v-model="resetForm.account"
                          placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <span class="svg-container"><wscn-icon-svg icon-class="yanzhengma"/></span>
                <el-input name="code" type="text" v-model="resetForm.code"
                          placeholder="验证码"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container"><wscn-icon-svg icon-class="mima"/></span>
                <el-input name="password" :type="passwordType" v-model="resetForm.password"
                          placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <span class="svg-container"><wscn-icon-svg icon-class="mima"/></span>
                <el-input name="checkPass" :type="passwordType"
                          v-model="resetForm.checkPass"
                          placeholder="确认密码"></el-input>
                <span class="showPwd"  @click="togglePasswordType"><wscn-icon-svg icon-class="yanjing"/></span>
            </el-form-item>

            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="setPWD">
                    修改密码
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {isWscnEmail} from 'utils/validate';
    // import { restPWD } from 'api/common/login/login';
    import doCanvas from 'utils/canvas';

    export default {
        name: 'reset',
        data() {
            const validateEmail = (rule, value, callback) => {
                if (!isWscnEmail(value)) {
                    callback(new Error('邮箱错误'));
                } else {
                    callback();
                }
            };
            const validaePass = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('密码不能小于6位'));
                } else {
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.resetForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                resetForm: {
                    account: '',
                    password: '',
                    checkPass: '',
                    code: ''
                },
                passwordType: 'password',
                resetRules: {
                    account: [
                        {required: true, trigger: 'blur', validator: validateEmail}
                    ],
                    password: [
                        {required: true, trigger: 'blur', validator: validaePass}
                    ],
                    checkPass: [
                        {required: true, trigger: 'blur', validator: validatePass2}
                    ],
                    code: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                },
                loading: false
            }
        },
        methods: {
            setPWD() {
                // this.loading = true;
                // const _this = this;
                // this.$refs.resetForm.validate(valid => {
                //   if (valid) {
                //     const data = {
                //       account: this.resetForm.account,
                //       code: this.resetForm.code,
                //       new_password: this.resetForm.checkPass
                //     };
                //     restPWD(data).then(() => {
                //       this.$message.success('密码设置成功,五秒后调整到登录页');
                //       setTimeout(() => {
                //         _this.$router.push({ path: '/login' })
                //       }, 5 * 1000)
                //     });
                //   } else {
                //     this.$message.error('error submit!!');
                //   }
                //   this.loading = false;
                // });
            },
            togglePasswordType() {
                if (this.passwordType === 'text') {
                    this.passwordType = 'password'
                } else {
                    this.passwordType = 'text'
                }
            }
        },
        mounted() {
            doCanvas();
            window.onresize = function() {
                doCanvas();
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "src/styles/mixin.scss";

    canvas {
        position: fixed;
    }
    .reset-container {
        .el-icon-arrow-left{
            color: #ffffff;
        }
        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
            -webkit-text-fill-color: #3E3E3E !important;
        }
        input {
            background: #293444;
        }
        @include relative;
        height:100vh;
        background-color: #324057;
        .back-icon {
            float: left;
            margin-top: 5px;
        }
        .reset-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 350px;
            padding: 35px 35px 15px 35px;
            margin: 170px auto;
        }
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #FFFFFF;
            height: 47px;
        }
        .card-box {
            padding: 20px;
            margin-bottom: 20px;
            width: 430px;
        }
        .title {
            margin: 0px auto 20px auto;
            text-align: center;
            color: #FFFFFF;
        }
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            color: #889aa4;
        }
        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
        .showPwd{
            color: #707a8a;
            position: absolute;
            right: 10px;
            top: 8px;
        }
    }

</style>
