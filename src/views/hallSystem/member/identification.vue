<template>



    <div  class="app-container calendar-list-container">

        <div style="margin-top: 35px;">

           <span style="font-size: large">
               欢迎进入身份验证页面，请按照如下步骤操作，感谢您的配合！
           </span>

            <hr>

        </div>
        <div>
            <span> 1.请填写身份信息，确定正确后 点击请求认证按钮 <span style="color: red">(需要注意每次提交认证，身份信息的有效期为2小时，请在2小时内完成所有验证 ,如果身份信息过期，请重新&nbsp;请求认证&nbsp;）。</span></span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <br><br>
            <span>2.请使用微警APP或微信小程序“网证CTID”扫描页面生成的二维码。若二维码失效，请重新 请求认证</span><br><br>
            <span>3.完成所有认证操作后，可点击 认证结果 来确认认证是否成功</span>
        </div>
        <div>
            <br><br>

            <el-form  id="checkboxTable" class="small-space"  label-position="right"
                      label-width="100px" ref="zwfwidentificationForm" :model="listQuery3" :rules="certtokenrules"
                       >
                <el-form-item label="姓名" prop="full_name">
                    <el-input style="width: 310px;" v-model="listQuery3.full_name"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="id_num">
                    <el-input   style="width: 310px;"  v-model="listQuery3.id_num"></el-input>
                </el-form-item>
               <!-- <el-form-item label="身份证起始日期（yyyymmdd)：" prop="id_start_date">
                    <el-input  style="width: 320px;" v-model="listQuery3.id_start_date"></el-input>
                </el-form-item>
                <el-form-item label="身份证结束日期（yyyymmdd)：" prop="id_end_date">
                    <el-input  style="width: 320px;"  v-model="listQuery3.id_end_date"></el-input>
                </el-form-item>-->

            </el-form>
        </div>



        <div style="margin-top: 50px;">

            <el-row :gutter="10">
                <el-col :span="6"> <div class="grid-content bg-purple" >第一步：请求认证，获取二维码;若失效，请重新认证</div></el-col>

                <el-col :span="4">
                    <div class="grid-content " >
                        <el-button type="primary" style="font-size: medium;height:60px; width: 150px; " @click="getaccesstoken()">请求认证</el-button>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content " >
                        <div id="qrcode" v-model="this.certtokeninfo.img" style="width:150px; height:150px; " ></div>
                    </div>
                </el-col>

            </el-row>






            <div style="height: 10px;"></div>






            <el-row :gutter="10">
                <el-col :span="6"><div class="grid-content bg-purple" style="text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第二步：查看认证结果</div></el-col>

                <!--   <el-col :span="6"><div class="grid-content ">
                       <el-button  type="primary" style="font-size: medium;"   @click="getcerttoken()">提交信息</el-button>
                   </div>
                   </el-col>-->

                <!-- <el-col :span="6"><div class="grid-content ">
                     <el-button  type="primary" style="font-size: medium;"   @click="test()">获取二维码</el-button>
                     <el-button  type="primary" style="font-size: medium;"   @click="getcerttokencopy()">重新获取</el-button>
                 </div>
                 </el-col>-->

                <el-col :span="4"><div class="grid-content ">
                    <el-button  type="primary" style="font-size: medium;height:60px; width: 150px; "  @click="getcertresult()">查看结果</el-button>
                </div>
                </el-col>

            </el-row>

        </div>
        <br><br>



    </div>
</template>

<script>
    import resetForm from 'utils';
    import  {gettoken,refreshtoken,gettingcerttoken,certtokenresult} from   '../../../api/hallSystem/member/identification';
    import {isIdCardNo,} from 'utils/validate';
    import SplitPane from "../../../components/SplitPane/index.vue";
    import Authredirect from "../../common/login/authredirect.vue";
    import ErrLog from "../../../components/ErrLog/index.vue";
    import QRCode from 'qrcodejs2'

    export default {
        components: {
            ErrLog,
            Authredirect,
            SplitPane
        },
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
                innerVisible:false,
                listQuery: {
                    client_id: 'xa_gjgwqzwzx_prod',
                    client_secret: 'e16406db-69f9-4e1c-b3b1-ea0027ce7b83'

                },
                listQuery2: {
                    access_token: ''
                },
                tookeninfo: {
                    access_token: '',
                    expire_seconds: '',
                    ret_code: '',
                    message: '',
                    error_msg:''
                },
                tookeninforefresh: {
                    access_token: '',
                    access_token_refresh: '',
                    message: ''

                },
                listQuery3: {
                    access_token: '',
                    with_id_info: '1',
                    full_name: '',
                    id_num: '',
                    id_start_date: '',
                    id_end_date: '',
                    mode: '0X42',
                    notification:'1'

                },
                certtokenrules: {
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
                certtokeninfo: {
                    message: '',
                    qrcode_content: '',
                    img:'',
                    ret_code: ''
                },
                certresult: {
                    message: ''
                },
                listQuery4: {
                    access_token: '',
                    cert_token: ''
                },
                certtokenresult: {
                    message: '',
                    ret_code:'',
                    error_msg:''
                },
                copycertoken: {
                    access_token: '',
                    with_id_info: '1',
                    full_name: '窦康',
                    id_num: '342601199311014355',
                    id_start_date: '20141006',
                    id_end_date: '20241006',
                    mode: '0X42',
                    notification:'1'
                }
            }

        },
        methods: {

            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            getaccesstoken() {

                this.$refs['zwfwidentificationForm'].validate(valid => {
                    if (valid) {

                document.getElementById("qrcode").innerHTML="";
                gettoken(this.listQuery).then(response => {

                    // alert("come in...");
                    if (response.httpCode === 200) {
                        // alert(response.data);
                        const token = JSON.parse(response.data);

                        this.tookeninfo.message = JSON.stringify(token);
                        this.tookeninfo.ret_code =JSON.parse(response.data).ret_code;
                        this.tookeninfo.error_msg =JSON.parse(response.data).error_msg;
                        if (this.tookeninfo.ret_code !== 0) {
                            this.$message.warning('身份验证失败，'+this.tookeninfo.error_msg);
                        } else {

                            this.listQuery2.access_token = JSON.parse(response.data).access_token;
                            this.listQuery3.access_token = JSON.parse(response.data).access_token;
                            this.listQuery4.access_token = JSON.parse(response.data).access_token;

                            this.tookeninforefresh.access_token = token.access_token;
                            this.tookeninfo.access_token = token.access_token;
                            this.tookeninfo.expire_seconds = token.expire_seconds;
                            this.tookeninfo.ret_code = token.ret_code;

                            // this.listQuery2= response.data;
                            //this.$message.success('请求成功');
                            //this.getcerttoken();
                            //alert(this.tookeninfo.message);
                            //第二步：根据access_token请求cert_token
                            this.getcerttoken();
                        }
                    }else {
                        this.$message.error('获取身份认证失败，请稍后重试..')
                    }
                })
                    }else {
                        return false;
                    }
                });
            },
            refreshaccesstoken() {
                document.getElementById("qrcode").innerHTML="";
                if (this.tookeninfo.ret_code !== 0){
                    this.$message.warning('身份验证失败，'+this.tookeninfo.error_msg);

                }else {

                    refreshtoken(this.listQuery2.access_token).then(response => {

                        // alert("come in...");
                        if (response.httpCode === 200) {
                            const token = JSON.parse(response.data);
                            this.tookeninforefresh.access_token_refresh = JSON.parse(response.data).access_token;
                            this.listQuery3.access_token = JSON.parse(response.data).access_token;
                            this.listQuery4.access_token = JSON.parse(response.data).access_token;
                            this.listQuery2.access_token = JSON.parse(response.data).access_token;
                            this.tookeninforefresh.message = JSON.stringify(token);
                            //alert(JSON.stringify(token));

                            this.$message.success('请求成功');
                        } else {

                            this.$message.error('请求失败..')
                        }
                    })
                }

            },
            getcerttoken() {
                document.getElementById("qrcode").innerHTML="";

                if (this.tookeninfo.ret_code !== 0){
                    this.$message.warning('身份验证失败，'+this.tookeninfo.error_msg);
                }else {

                    gettingcerttoken(this.listQuery3).then(response => {
                        this.copycertoken.notification = this.listQuery3.notification;
                        this.copycertoken.id_end_date = this.listQuery3.id_end_date;
                        this.copycertoken.id_num = this.listQuery3.id_num;
                        this.copycertoken.full_name = this.listQuery3.full_name;
                        this.copycertoken.id_start_date = this.listQuery3.id_start_date;
                        this.copycertoken.access_token = this.listQuery3.access_token;
                        this.copycertoken.with_id_info = this.listQuery3.with_id_info;
                        this.copycertoken.mode = this.listQuery3.mode;


                        this.dialogLoading = false;
                        if (response.httpCode === 200) {
                            const token = JSON.parse(response.data);
                            this.certtokeninfo.message = JSON.stringify(token);
                            this.certtokeninfo.ret_code = JSON.parse(response.data).ret_code;
                            this.certtokeninfo.error_msg = JSON.parse(response.data).error_msg;
                            if (this.certtokeninfo.ret_code !== 0) {
                                this.$message.warning('请求失败，'+this.certtokeninfo.error_msg);

                            }else{
                                this.certtokeninfo.qrcode_content = JSON.parse(response.data).qrcode_content;
                                this.listQuery4.cert_token = JSON.parse(response.data).cert_token;
                                this.test();
                                // this.$message.success('请求成功');
                                // this.test();
                                // this.dialogDesciption= false;
                            } } else {

                            this.$message.error('请求失败，请重新提交身份认证或联系管理员...')
                        }
                    })
                }


            },
            getcertresult() {
                document.getElementById("qrcode").innerHTML="";
                if (this.tookeninfo.ret_code !== 0) {
                    this.$message.warning('请先完成身份验证...');

                }else {
                    certtokenresult(this.listQuery4.access_token, this.listQuery4.cert_token).then(response => {

                        if (response.httpCode === 200) {

                            const data = JSON.parse(response.data);
                            this.certtokenresult.message = JSON.stringify(data);
                            this.certtokenresult.ret_code=JSON.parse(response.data).ret_code;
                            this.certtokenresult.error_msg=JSON.parse(response.data).error_msg;

                           // alert(this.certtokenresult.message);
                            if(this.certtokenresult.ret_code !=0){
                                this.$message.warning("认证失败"+ this.certtokenresult.error_msg);
                            }else if(this.certtokenresult.error_msg !="成功"){
                                this.$message.warning(this.certtokenresult.error_msg);
                            }else{
                                this.$message.success('认证成功');
                            }
                        } else {
                            this.$message.error('请求失败..')
                        }

                    })
                }
            },
            test() {

                document.getElementById("qrcode").innerHTML="";
                if (this.tookeninfo.message ==="") {
                    this.$message.warning('请先完成身份验证...');
                }else{
                    var qrcode = new QRCode("qrcode", {
                        width: 230,
                        height: 230
                    });
                    this.certtokeninfo.img=  qrcode.makeCode(this.certtokeninfo.qrcode_content);
                }
            },
            resetzwfwIdentificForm() {
                this.dialogVisible = false;
                this.resetTemp();
                resetForm(this, 'listQuery');
            },


            resetTemp() {
                this.listQuery = {
                    id: '',
                    secret: ''
                }
            },


            getcerttokencopy() {
                document.getElementById("qrcode").innerHTML="";

                //this.dialogLoading = true;
                if (this.tookeninfo.message ==="") {
                    this.$message.warning('请先完成身份验证...');
                }else {

                    gettingcerttoken(this.copycertoken).then(response => {
                        // this.dialogLoading = false;
                        if (response.httpCode === 200) {
                            const token = JSON.parse(response.data);
                            this.certtokeninfo.message = JSON.stringify(token);
                            if(this.certtokeninfo.ret_code != 0){
                                this.$message.warning('获取二维码失败，请重新提交身份认证后再次获取...');

                            }else{
                                this.certtokeninfo.qrcode_content = JSON.parse(response.data).qrcode_content;
                                this.listQuery4.cert_token = JSON.parse(response.data).cert_token;

                                this.$message.success('请求成功');
                                this.test();
                                //this.dialogFormVisible= false;
                            } }else {

                            this.$message.error('获取二维码失败，请重新提交身份认证后再次获取或联系管理员...')
                        }
                    })
                }
            }
        },
    }
</script>
<style>
    .el-row {
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
        text-align:center;
        line-height:60px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;

    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>