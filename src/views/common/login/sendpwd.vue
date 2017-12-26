<template>
    <div class="sendpwd-container">
        <canvas id="canvas"></canvas>
        <el-form autoComplete="on" :model="resetForm" :rules="resetRules" ref="resetForm" label-position="left"
                 label-width="0px"
                 class="card-box reset-form">
            <div>
                <router-link to="/login" class="back-icon">
                    <i class="el-icon-arrow-left"></i>
                </router-link>
                <h3 class="title">发送验证码至邮箱</h3>
            </div>
            <el-form-item prop="account">
                <span class="svg-container"><wscn-icon-svg icon-class="youxiang"/></span>
                <el-input name="account" type="text" v-model="resetForm.account"
                          placeholder="邮箱"></el-input>
            </el-form-item>

            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleSendPWD">
                    发送验证码至邮箱
                </el-button>
            </el-form-item>
            <router-link to="/reset">
                <el-button type="info" style="width:100%;">
                    已收到验证码,去重设密码
                </el-button>
            </router-link>
        </el-form>
    </div>
</template>

<script>
    import {isWscnEmail} from 'utils/validate';
    import {sendPWD2Email} from 'api/common/login/login';
    import doCanvas from 'utils/canvas';

    export default {
        name: 'reset',
        data() {
            const validateEmail = (rule, value, callback) => {
                if (!isWscnEmail(value)) {
                    callback(new Error('请输入正确的邮箱'));
                } else {
                    callback();
                }
            };
            return {
                resetForm: {
                    account: ''
                },
                resetRules: {
                    account: [
                        {required: true, trigger: 'blur', validator: validateEmail}
                    ]
                },
                loading: false
            }
        },
        methods: {
            handleSendPWD() {
                this.loading = true;
                this.$refs.resetForm.validate(valid => {
                    if (valid) {
                        sendPWD2Email(this.resetForm.account).then(() => {
                            this.$message.success('密码有发送至邮箱,请查收')
                        });
                    } else {
                        this.loading = false;
                        return false;
                    }
                });
            }
        },
        mounted() {
            doCanvas();
            window.onresize = function () {
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
    .sendpwd-container {
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
    }

</style>
