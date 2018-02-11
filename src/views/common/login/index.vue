<template>
    <div class="login">
        <div class="login-container">
            <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
                     label-width="0px"
                     class="card-box login-form">
                <el-input type="hidden" v-model="loginForm.random"></el-input>
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <el-form-item prop="account">
                            <el-input type="text" v-model="loginForm.account" autoComplete="off"
                                      placeholder="帐号" class="borderNone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <el-form-item prop="password">
                            <el-input type="password" @keyup.enter.native="handleLogin"
                                      v-model="loginForm.password"
                                      autoComplete="off" placeholder="密码" class="borderNone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" >
                    <el-col :span="24">
                        <el-form-item prop="captcha" >
                            <el-input type="text" v-model="loginForm.verifyCode" @keyup.enter.native="handleLogin"
                                      placeholder="验证码" autoComplete="off" class="validate borderNone"></el-input>
                            <img class="captcha" :src="loginForm.imgUrl" @click.self="changeCaptcha">
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--<el-row type="flex" justify="center" class="forgetRow">
                    <el-col :span="24" style="text-align: right">
                        <router-link to="/sendpwd" class="forget-pwd">
                            忘记密码?
                        </router-link>
                    </el-col>
                </el-row>-->
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <el-form-item>
                            <el-button class="loginBtn"  :loading="loading"
                                       @click.native.prevent="handleLogin">
                                登 录
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {isWscnEmail} from 'utils/validate';

    export default {
        name: 'login',
        data() {
            const validateEmail = (rule, value, callback) => {
                if (!isWscnEmail(value)) {
                    callback(new Error('请输入正确的合法邮箱'));
                } else {
                    callback();
                }
            };
            return {
                loginForm: {
                    account: '',
                    password: '',
                    verifyCode: '',
                    imgUrl: '',
                    random: '',
                },
                loginRules: {
                    account: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {min: 6, message: '密码不能小于6位', trigger: 'blur'}
                    ],
                    verifyCode: [
                        {min: 4, max: 4, message: '验证码只能是4位', trigger: 'blur'}
                    ]
                },

                loading: false,
                canvas: true
            }
        },
        computed: {
            siteTitle: function () {
                return window.siteTitle;
            }
        },

        methods: {
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
                            this.$message.success("登陆成功");
                            this.loading = false;
                            this.canvas = false;
                            this.$router.push({path: '/'});

                        }).catch(err => {
                            this.loading = false;
                            this.$message.error(err);
                            this.loginForm.password = '';
                            this.loginForm.captcha = '';
                            this.changeCaptcha();
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            changeCaptcha() {
                this.loginForm.random = Math.random();
                this.loginForm.imgUrl = '/api/common/getVerifyCode?random=' + this.loginForm.random;
            }
        },
        mounted() {
            this.changeCaptcha();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import 'src/styles/mixin.scss';

    .login{background: url("../../../assets/login.png") top center no-repeat; min-height: 930px;
        overflow: hidden;}
    .login-container{width: 1120px; margin: 0 auto;}
    .login-form{width: 308px; margin-top: 454px; margin-left: 732px;}
    .el-input__inner{-webkit-box-shadow:0 0 0 50px #ffffff inset;}
    .borderNone .el-input__inner{border:none;}
    .validate{width: 190px;}
    .captcha{width: 95px; position: absolute; right: 0px;top: -2px; cursor: pointer;}
    .el-form-item__error{right: 0px;text-align: right;}
    .loginBtn{width: 200px; height: 45px;margin-left: 35px; background: #1d6885; color: #ffffff;}
    .marginBottonNone{margin-bottom: 0px;}
    .forgetRow{margin-top: 15px;margin-bottom: 13px;}
    .forget-pwd{color: #2b5062; font-size: 14px;}
</style>
