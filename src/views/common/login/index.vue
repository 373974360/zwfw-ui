<template>
    <div class="login">
        <canvas id="canvas"></canvas>
        <div class="login-container">
            <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
                     label-width="0px"
                     class="card-box login-form">
                <h3 class="title">西安德雅通科技有限公司</h3>
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <el-form-item prop="account">
                            <span class="svg-container"><wscn-icon-svg icon-class="youxiang"/></span>
                            <el-input type="text" v-model="loginForm.account" autoComplete="on"
                                      placeholder="帐号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <el-form-item prop="password">
                            <span class="svg-container"><wscn-icon-svg icon-class="mima"/></span>
                            <el-input type="password" @keyup.enter.native="handleLogin"
                                      v-model="loginForm.password"
                                      autoComplete="on" placeholder="密码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <el-form-item prop="captcha">
                            <span class="svg-container"><wscn-icon-svg icon-class="yanzhengma"/></span>
                            <el-input type="text" v-model="loginForm.captcha" @keyup.enter.native="handleLogin"
                                      placeholder="验证码"></el-input>
                            <img class="captcha" :src="loginForm.imgUrl" @click.self="changeCaptcha">
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <el-form-item>
                            <el-button type="primary" style="width:100%;" :loading="loading"
                                       @click.native.prevent="handleLogin">
                                登录
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="24" style="text-align: right">
                        <router-link to="/sendpwd" class="forget-pwd">
                            忘记密码?
                        </router-link>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {isWscnEmail} from 'utils/validate';
    import doCanvas from 'utils/canvas';

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
                    account: '373974360@qq.com',
                    password: '',
                    captcha: '',
                    imgUrl: ''
                },
                loginRules: {
                    account: [
                        {required: true, trigger: 'blur', validator: validateEmail}
                    ],
                    password: [
                        { min: 6, message: '密码不能小于6位', trigger: 'blur' }
                    ],
                    captcha: [
                        { min: 4, max: 4, message: '验证码只能是4位', trigger: 'blur' }
                    ]
                },
                loading: false,
                canvas: true
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
                this.loginForm.imgUrl = process.env.SYS_API + '/base/getVerifyCode?' + Math.random();
            }
        },
        mounted() {
            doCanvas();
            this.changeCaptcha();
            const _this = this;
            window.onresize = function () {
                if(_this.canvas){
                    doCanvas();
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import 'src/styles/mixin.scss';

    canvas {
        position: fixed;
    }

    .login {
        position: fixed;
        display: flex;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #2d3a4b;
    }

    .login-container {

        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #e0e1e2 inset !important;
            -webkit-text-fill-color: #000000 !important;
        }

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #000000;
            height: 47px;
        }

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 350px;
            padding: 35px 35px 15px 35px;
            margin: 170px auto;
        }

        .card-box {
            padding: 20px;
            box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
            -webkit-border-radius: 5px;
            border-radius: 5px;
            -moz-border-radius: 5px;
            background-clip: padding-box;
            margin-bottom: 20px;
            background-color: #F9FAFC;
            width: 430px;
            border: 2px solid #8492A6;
        }

        .title {
            margin: 0px auto 28px auto;
            text-align: center;
            color: #505458;
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

        .captcha {
            width: 70px;
            height: 35px;
            position: absolute;
            right: 10px;
            top: 6px;
            cursor: pointer;
        }

        .forget-pwd {
            color: #000;
            font-size: small;
            margin-right: 10px;
        }

    }
</style>
