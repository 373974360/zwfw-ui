<template>
    <div class="app-container calendar-list-container">
        <el-row :gutter="10" justify="center">
            <el-col>
                <span style="font-size: 20px">欢迎进入身份验证页面，请按照如下步骤操作，感谢您的配合！</span>
            </el-col>
        </el-row>
        <el-row :gutter="30">
            <el-col>
                <p style="font-size: 17px;"> 1.请填写身份信息，确定正确后点击实名认证按钮
                </p>
                <p style="font-size: 17px;">2.请使用微信扫一扫扫描页面生成的二维码</p>
            </el-col>

        </el-row>
        <el-row :gutter="10">
            <el-col :span="14">
                <el-form id="checkboxTable" class="small-space" label-position="right"
                         label-width="100px" ref="zwfwidentificationForm" :model="authenticationVo"
                         :rules="authenticationVoRules">
                    <el-form-item label="姓名" prop="name">
                        <el-input style="width: 310px;" v-model="authenticationVo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="pid">
                        <el-input style="width: 310px;" v-model="authenticationVo.pid"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input style="width: 310px;" v-model="authenticationVo.phone"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-left: 100px;">
                        <el-button type="primary" style="font-size: medium;height:60px; width: 130px; "
                                   @click="getCertToken()">实名认证
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="7">
                <div v-show="resultUrl.qrcodeContent != ''" id="qrcode"></div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {isIdCardNo, validatMobiles} from '../../../../utils/validate';
    import QRCode from 'qrcodejs2';
    import axios from 'axios';

    export default {
        data() {
            const validateIdcard = (rule, value, callback) => {
                if (!isIdCardNo(value)) {
                    callback(new Error('身份证号格式不正确，请重新输入'));
                } else {
                    callback();
                }
            };
            const validatePhone = (rule, value, callback) => {
                if (!validatMobiles(value)) {
                    callback(new Error('手机号码格式不正确，请重新输入'));
                } else {
                    callback();
                }
            };
            return {
                authenticationVoRules: {
                    name: [
                        {required: true, message: '请填写姓名', trigger: 'blur'}
                    ],
                    pid: [
                        {required: true, message: '请填写身份证号码', trigger: 'blur'},
                        {validator: validateIdcard, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请填写手机号', trigger: 'blur'},
                        {validator: validatePhone, trigger: 'blur'}
                    ]
                },
                resultUrl: {
                    qrcodeContent: '',
                    sernum: ''
                },
                qrcode: undefined,
                authenticationVo: {
                    token: '',
                    pid: '',
                    name: '',
                    phone: '',
                    unitno: ''
                },
                getAccessTokenTime: 0,
                token: ''
            }
        },
        methods: {
            getToken() {
                return new Promise((resolve) => {
                    axios.get('/ctid/authentication/getScanToken').then(function(response) {
                        console.log(JSON.stringify(response));
                        if (response.data.code == 0) {
                            alert(response.data.token);
                            this.token = response.data.token;
                            alert(this.token);
                            this.authenticationVo.unitno = response.data.platcode;
                            this.getAccessTokenTime = new Date().getTime();
                            alert(this.getAccessTokenTime);
                            resolve(0);
                        } else {
                            this.$message.error('获取token失败(' + response.data.message + ')')
                        }
                    }).catch(function(error) {
                        console.log(error);
                    });
                })

            },
            refreshGetToken() {
                return new Promise((resolve) => {
                    const now = new Date().getTime();
                    if ((now - this.getAccessTokenTime) > 7000000) {
                        this.getToken().then(result => {
                            resolve(result);
                        });
                    } else {
                        resolve(0);
                    }
                })
            },
            getCertToken() {
                this.resultUrl.qrcodeContent = '';
                this.$refs['zwfwidentificationForm'].validate(valid => {
                    if (valid) {
                        this.refreshGetToken().then(result => {
                            alert(result);
                            if (result == 0) {
                                this.authenticationVo.pid = this.authenticationVo.pid.toUpperCase();
                                axios.get('/ctid/authentication/addUser', {
                                    params: {
                                        token: this.authenticationVo.token,
                                        pid: this.authenticationVo.pid,
                                        name: this.authenticationVo.name,
                                        phone: this.authenticationVo.phone,
                                        unitno: this.authenticationVo.unitno
                                    }
                                }).then(function(response) {
                                    if (response.data.code == 0) {
                                        this.$message.success('请使用微信扫一扫扫描二维码进行认证');
                                        this.resultUrl.qrcodeContent = response.data.url;
                                        this.resultUrl.sernum = response.data.sernum;
                                        this.qrcode.makeCode(this.resultUrl.qrcodeContent + '?param=' + this.resultUrl.sernum);
                                    } else {
                                        this.$message.error('上传认证信息失败(' + response.data.message + ')')
                                    }
                                }).catch(function(error) {
                                    console.log(error);
                                });
                            } else {
                                this.$message.error('获取token失败')
                            }
                        })
                    }
                });
            }
        },
        created() {
            this.getToken();
            this.qrcode = new QRCode('qrcode', {
                width: 300,
                height: 300
            });
        }
    }

</script>