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
                         label-width="100px" ref="zwfwidentificationForm" :model="authentication"
                         :rules="authenticationRules">
                    <el-form-item label="姓名" prop="name">
                        <el-input style="width: 310px;" v-model="authentication.name"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="pid">
                        <el-input style="width: 310px;" v-model="authentication.pid"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input style="width: 310px;" v-model="authentication.phone"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="font-size: medium;height:60px; width: 130px; "
                                   @click="resetIdenForm()">清空数据
                        </el-button>
                        <el-button type="primary" style="font-size: medium;height:60px; width: 130px; "
                                   @click="getCertToken()">实名认证
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="7">
                <div  v-show="resultUrl.qrcodeContent != ''" class="qrcode" ref="qrCodeUrl"></div>
            </el-col>
        </el-row>
    </div>
</template>


<script>
    import {isIdCardNo, validatMobiles} from '../../../../utils/validate';
    import QRCode from 'qrcodejs2';
    import {getScanToken, addUser} from '../../../../api/hallSystem/window/identification';
    import {resetForm} from 'utils';

    export default {
        name: 'identification_table',
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
                authenticationRules: {
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
                authentication: {
                    token: '',
                    pid: '',
                    name: '',
                    phone: '',
                    unitno: ''
                },
                getAccessTokenTime: 0
            }
        },
        created() {
            this.getToken();
            this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
                width: 300,
                height: 300
            });
        },
        methods: {
            getToken() {
                return new Promise((resolve) => {
                    getScanToken().then(response => {
                        console.log(JSON.stringify(response));
                        if (response.code == 0) {
                            this.authentication.token = response.token;
                            this.authentication.unitno = response.platcode;
                            this.getAccessTokenTime = Number(new Date());
                            resolve(0);
                        } else {
                            this.$message.error('获取token失败(' + response.message + ')')
                        }
                    })
                })
            },
            refreshGetToken() {
                return new Promise((resolve) => {
                    const now = Number(new Date());
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
                this.resultUrl.sernum = '';
                $('.qrcode').html("");
                this.$refs['zwfwidentificationForm'].validate(valid => {
                    if (valid) {
                        this.refreshGetToken().then(result => {
                            if (result == 0) {
                                this.authentication.pid = this.authentication.pid.toUpperCase();
                                addUser(this.authentication).then(response => {
                                    if (response.code == 0) {
                                        this.$message.success('请使用微信扫一扫扫描二维码进行认证');
                                        this.resultUrl.qrcodeContent = response.url;
                                        this.resultUrl.sernum = response.sernum;
                                        this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
                                            text: this.resultUrl.qrcodeContent + '?param=' + this.resultUrl.sernum,
                                            width: 300,
                                            height: 300,
                                            colorDark: '#000000',
                                            colorLight: '#ffffff',
                                            correctLevel: QRCode.CorrectLevel.H
                                        });
                                    } else {
                                        this.$message.error('上传认证信息失败(' + response.message + ')')
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
            },
            resetTemp() {
                this.authentication.pid ='';
                this.authentication.name ='';
                this.authentication.phone ='';
                this.resultUrl.qrcodeContent = '';
                this.resultUrl.sernum = '';
                $('.qrcode').html("");
            },
            resetIdenForm() {
                this.resetTemp();
                resetForm(this, 'zwfwidentificationForm');
            }
        }
    }
</script>