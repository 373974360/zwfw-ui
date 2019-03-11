<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select
                    v-model="certResultParams.companyName"
                    filterable
                    remote
                    placeholder="请输入公司名称"
                    :remote-method="getCompanyList"
                    @change="companyChange" style="width: 300px">
                <el-option
                        v-for="item in optionsCompanyName"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>

            <el-select
                    v-model="certResultParams.authId"
                    filterable
                    remote
                    placeholder="选择流水号"
                    style="width: 400px">
                <el-option
                        v-for="item in optionsAuthIdName"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button style="margin-left: 10px;" class="filter-item" type="primary" v-waves icon="search"
                       @click="getCertResult">查询
            </el-button>
        </div>
        <el-table :data="list" border fit highlight-current-row
                  style="width: 100%" v-show="showTable">
            <el-table-column  align="center" label="公司名称">
                <template slot-scope="scope">
                    <span>{{scope.row.companyName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="150px" align="center" label="姓名">
                <template slot-scope="scope">
                    <span>{{scope.row.fullName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="250px" align="center" label="身份证号">
                <template slot-scope="scope">
                    <span>{{scope.row.idNum}}</span>
                </template>
            </el-table-column>
            <el-table-column width="150px" align="center" label="身份">
                <template slot-scope="scope">
                    <span v-if="scope.row.identityStatus == 2">股东</span>
                    <span v-if="scope.row.identityStatus == 1">经办人</span>
                    <span v-if="scope.row.identityStatus == 3">法人</span>
                    <span v-if="scope.row.identityStatus == 4">法人兼股东</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="认证结果">
                <template slot-scope="scope">
                    <span>{{scope.row.certRes}}</span>
                </template>
            </el-table-column>
            <el-table-column width="350px" align="center" label="认证凭证">
                <template slot-scope="scope">
                    <span>{{scope.row.certToken}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="认证时间">
                <template slot-scope="scope">
                    <span>{{scope.row.authTime}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {
        getIdentifyAccessToken,
        getIdentifyCertResult,
        getAuthIdByCompanyName,
        getCompanyName
    } from '../../../../api/hallSystem/window/identification';
    import {validateQueryStr} from 'utils';

    export default {
        data() {
            return {
                list: null,
                showTable: false,
                getGzhAccessTokenTime: 0,
                gzhAccessTokenExpireSecond: 0,
                getAppAccessTokenTime: 0,
                appAccessTokenExpireSecond: 0,
                certResultParams: {
                    gzhAccessToken: '',//公众号access_token
                    appAccessToken: '',//app的access_token
                    authId: '',
                    companyName: ''
                },
                optionsCompanyName: [],
                optionsAuthIdName: []
            }
        },
        methods: {
            companyChange(value) {
                this.certResultParams.authId = '';
                getAuthIdByCompanyName(value).then(response => {
                    if (response.httpCode === 200) {
                        let reverse = response.data.reverse();
                        this.optionsAuthIdName = reverse;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getCompanyList(query) {
                let companyName;
                this.certResultParams.authId = '';
                if (query !== '') {
                    let valid = validateQueryStr(query);
                    if (valid) {
                        this.$message.error(`输入中包含非法字符 ${valid}`)
                        return
                    }
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(query)) {
                        companyName = query;
                    }
                    getCompanyName(companyName).then(response => {
                        if (response.httpCode === 200) {
                            this.optionsCompanyName = response.data;
                        } else {
                            this.$message.error('数据加载失败')
                        }
                    })
                } else {
                    this.optionsCompanyName = [];
                }
            },
            getGzhAccessToken() {
                return new Promise((resolve) => {
                    getIdentifyAccessToken({authType: 'GzhRegular'}).then(response => {
                        if (response.data.retCode === 0) {
                            this.getGzhAccessTokenTime = Number(new Date());
                            this.gzhAccessTokenExpireSecond = response.data.expireSeconds;
                            this.certResultParams.gzhAccessToken = response.data.accessToken;
                            resolve(0);
                        } else {
                            this.$message.error('初始化微警认证失败(' + response.data.error_msg + ')')
                        }
                    })
                })
            },
            getAppAccessToken() {
                return new Promise((resolve) => {
                    getIdentifyAccessToken({authType: 'AppRegular'}).then(response => {
                        if (response.data.retCode === 0) {
                            this.getAppAccessTokenTime = Number(new Date());
                            this.appAccessTokenExpireSecond = response.data.expireSeconds;
                            this.certResultParams.appAccessToken = response.data.accessToken;
                            resolve(0);
                        } else {
                            this.$message.error('初始化微警认证失败(' + response.data.error_msg + ')')
                        }
                    })
                })
            },
            refreshGzhAccessToken() {
                return new Promise((resolve) => {
                    const now = Number(new Date());
                    if (this.certResultParams.gzhAccessToken != '') {
                        if ((now - this.getGzhAccessTokenTime) > this.gzhAccessTokenExpireSecond * 1000) {
                            this.getGzhAccessToken().then(result => {
                                resolve(result);
                            });
                        } else {
                            resolve(0);
                        }
                    } else {
                        this.getGzhAccessToken().then(result => {
                            resolve(result);
                        });
                    }
                })
            },
            refreshAppAccessToken() {
                return new Promise((resolve) => {
                    const now = Number(new Date());
                    if (this.certResultParams.appAccessToken != '') {
                        if ((now - this.getAppAccessTokenTime) > this.appAccessTokenExpireSecond * 1000) {
                            this.getAppAccessToken().then(result => {
                                resolve(result);
                            });
                        } else {
                            resolve(0);
                        }
                    } else {
                        this.getAppAccessToken().then(result => {
                            resolve(result);
                        });
                    }
                })
            },
            getCertResult() {
                if (this.certResultParams.authId == '') {
                    this.$message.error('请填写流水号')
                }else if (this.certResultParams.companyName == '') {
                    this.$message.error('请填写公司名称')
                } else {
                    this.refreshGzhAccessToken().then(resultGzh => {
                        if (resultGzh == 0) {
                            this.refreshAppAccessToken().then(resultApp => {
                                if (resultApp == 0) {
                                    getIdentifyCertResult(this.certResultParams).then(response => {
                                        if (response.httpCode == 200) {
                                            this.showTable = true;
                                            $.each(response.data, function (n) {
                                                let certRes = response.data[n].certRes;
                                                if (certRes == 0) {
                                                    response.data[n].certRes = '认证成功';
                                                } else {
                                                    response.data[n].certRes = '认证失败';
                                                    response.data[n].authTime = '-';
                                                }
                                            })
                                            this.list = response.data;
                                            console.log(this.list);
                                        }
                                    })
                                }
                            });
                        }
                    });
                }

            }
        },
        mounted() {
            this.getGzhAccessToken();
            this.getAppAccessToken();
        }
    }
</script>
<style scoped="scoped">


</style>