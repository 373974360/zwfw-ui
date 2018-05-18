<template>
    <div class="app-container calendar-list-container">
        <el-row :gutter="10" justify="center">
            <el-col :span="12">
                <span style="font-size: large">欢迎进入身份验证页面，请按照如下步骤操作，感谢您的配合！</span>
            </el-col>
        </el-row>
        <el-row :gutter="30">
            <el-col :span="11">
                <p> 1.请填写身份信息，确定正确后 点击请求认证按钮 <span style="color: red">(需要注意每次提交认证，身份信息的有效期为2小时，请在2小时内完成所有验证 ,如果身份信息过期，请重新请求认证）。</span>
                </p>
                <p>2.请使用微警APP或微信小程序“网证CTID”扫描页面生成的二维码。若二维码失效，请重新请求认证</p>
                <p>3.完成所有认证操作后，可点击认证结果来确认认证是否成功</p>
            </el-col>
            <el-col :span="3" class="ewm">
                <p style="text-align: center"><img src="../../../assets/ctidxcx.png"/><br/>CTID小程序</p>
            </el-col>
            <el-col :span="3" class="ewm">
                <p style="text-align: center"><img src="../../../assets/ctidUserGuid.png"/><br/>网证CTID开通手册</p>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="24">
                <hr>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="17">
                <el-form id="checkboxTable" class="small-space" label-position="right"
                         label-width="100px" ref="zwfwidentificationForm" :model="certTokenParams"
                         :rules="certTokenRules">
                    <el-form-item label="姓名" prop="full_name">
                        <el-input style="width: 310px;" v-model="certTokenParams.full_name"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="id_num">
                        <el-input style="width: 310px;" v-model="certTokenParams.id_num"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="身份证起始日期（yyyymmdd)：" prop="id_start_date">
                         <el-input  style="width: 320px;" v-model="listQuery3.id_start_date"></el-input>
                     </el-form-item>
                     <el-form-item label="身份证结束日期（yyyymmdd)：" prop="id_end_date">
                         <el-input  style="width: 320px;"  v-model="listQuery3.id_end_date"></el-input>
                     </el-form-item>-->
                    <el-form-item>
                        <el-button type="primary" style="font-size: medium;height:60px; width: 130px; "
                                   @click="getCertToken()">请求认证
                        </el-button>
                        <el-button type="primary" style="font-size: medium;height:60px; width: 130px; "
                                   @click="getCertResult()">查看结果
                        </el-button>
                        <el-button v-if="certResultBase64" type="primary" style="font-size: medium;height:60px; width: 130px; "
                                   @click="printCertResult()">打印结果
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="7">
                <div v-show="certTokenInfo.qrcode_content != ''" id="qrcode"></div>
            </el-col>
        </el-row>
        <!--<div><img v-if="certResultBase64" :src="certResultBase64"/></div>-->
        <iframe id="certResultIframe" src="about:blank" frameborder="0" height="0" width="0" style="width:0;height: 0;" />
    </div>
</template>

<script>
    import {
        getAccessToken,
        getCertToken,
        getCertResult
    } from '../../../api/hallSystem/window/identification';
    import {isIdCardNo,} from 'utils/validate';
    import QRCode from 'qrcodejs2'

    export default {
        data() {
            const validateIdcard = (rule, value, callback) => {
                if (!isIdCardNo(value)) {
                    callback(new Error('身份证号格式不正确，请重新输入'));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible: false,
                innerVisible: false,
                getAccessTokenTime: 0,
                accessTokenExpireSecond: 0,
                clientInfo: {
                    client_id: 'xa_gjgwqzwzx_prod',
                    client_secret: 'e16406db-69f9-4e1c-b3b1-ea0027ce7b83'

                },
                certTokenParams: {
                    access_token: '',
                    with_id_info: 1,
                    mode: 66,
                    full_name: '',
                    id_num: '',
                    fore_back_url: ''
                },
                certTokenRules: {
                    full_name: [
                        {required: true, message: '请填写姓名', trigger: 'blur'},
                    ],
                    id_num: [
                        {required: true, message: '请填写身份证号码', trigger: 'blur'},
                        {validator: validateIdcard, trigger: 'blur'},
                    ],
                    /*  id_start_date: [
                          {required: true, message: '请填写证件有效开始时间', trigger: 'blur'},
                      ],
                      id_end_date: [
                          {required: true, message: '请填写证件有效结束时间', trigger: 'blur'},
                      ],*/
                },
                certTokenInfo: {
                    qrcode_content: ''
                },
                certResultParams: {
                    access_token: '',
                    cert_token: ''
                },
                qrcode: undefined,
                certResultBase64:undefined
            }
        },
        methods: {
            getAccessToken() {
                return new Promise((resolve) => {
                    getAccessToken(this.clientInfo).then(response => {
                        if (response.data.ret_code === 0) {
                            this.getAccessTokenTime = Number(new Date());
                            this.accessTokenExpireSecond = response.data.expire_seconds;
                            this.certTokenParams.access_token = response.data.access_token;
                            this.certResultParams.access_token = response.data.access_token;
                            resolve(0);
                        } else {
                            this.$message.error('初始化微警认证失败(' + response.data.error_msg + ')')
                        }
                    })
                })
            },
            refreshAccessToken() {
                return new Promise((resolve) => {
                    const now = Number(new Date());
                    if (this.certTokenParams.access_token != '') {
                        if ((now - this.getAccessTokenTime) > this.accessTokenExpireSecond * 1000) {
                            this.getAccessToken().then(result => {
                                resolve(result);
                            });
                        } else {
                            resolve(0);
                        }
                    } else {
                        this.getAccessToken().then(result => {
                            resolve(result);
                        });
                    }
                })
            },
            getCertToken() {
                this.certTokenInfo.qrcode_content = '';
                this.certResultParams.cert_token = '';
                this.certResultBase64 = undefined;
                this.$refs['zwfwidentificationForm'].validate(valid => {
                    if (valid) {
                        this.refreshAccessToken().then(result => {
                            if (result == 0) {
                                getCertToken(this.certTokenParams).then(response => {
                                    if (response.data.ret_code == 0) {
                                        this.$message.success("请求微警认证成功，请使用微信扫一扫扫描二维码进行认证");
                                        this.certTokenInfo.qrcode_content = response.data.qrcode_content;
                                        this.certResultParams.cert_token = response.data.cert_token;
                                        this.qrcode.makeCode(response.data.qrcode_content);
                                    }
                                })
                            } else {
                                this.$message.error('请求微警认证失败(' + response.data.error_msg + ')')
                            }
                        })
                    }
                });
            },
            getCertResult() {
                if (this.certResultParams.cert_token != '' && this.certResultParams.access_token != '') {
                    getCertResult(Object.assign({},this.certTokenParams,this.certResultParams)).then(response => {
                        if (response.data.ret_code == 0) {
                            switch(response.data.log_data.auth_res) {
                                case 0 :
                                    this.$message.success("用户信息已通过微警认证");
                                    break;
                                case 4009 :
                                    this.$message.error('帐号校验失败')
                                    break;
                                case 4101 :
                                    this.$message.error('身份认证不匹配，请确认信息输入正确')
                                    break;
                                case 4109 :
                                    this.$message.error('非库内人员；该人员身份信息未收录，无法完成身份认证')
                                    break;
                                case 5204 :
                                    this.$message.error('用户取消认证')
                                    break;
                                default :
                                    this.$message.error('未能成功获取认证结果')
                            }
                            this.certResultBase64 = 'data:image/png;base64,'+response.data.certURL;
                            var doc = document.getElementById("certResultIframe").contentDocument || document.frames["certResultIframe"].document;
                            doc.body.innerHTML = '<html><body style="text-align:center"><img src="'+this.certResultBase64+'"/></body></html>'; //进入可编辑模式前存好
                        }else{
                            this.$message.error(response.data.error_msg)
                        }
                    })
                } else {
                    this.$message.warning('请先填写信息并请求认证')
                }
            },
            printCertResult(){
                document.getElementById("certResultIframe").contentWindow.print()
            }
        },
        mounted() {
            this.getAccessToken();
            this.qrcode = new QRCode('qrcode', {
                width: 150,
                height: 150,
            });
        }
    }
</script>
<style scoped="scoped">
    .el-row {
        margin-bottom: 20px;
        :last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
        line-height: 40px;
    }
    .ewm img {
        width: 150px;
    }


</style>