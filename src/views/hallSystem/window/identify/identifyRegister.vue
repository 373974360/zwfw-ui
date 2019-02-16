<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input style="width: 230px;" class="filter-item" placeholder="流水号"
                      v-model="certResultParams.authId">
            </el-input>
            <el-input style="width: 230px;" class="filter-item" placeholder="公司名称"
                      v-model="certResultParams.companyName">
            </el-input>
            <el-button style="margin-left: 10px;" class="filter-item" type="primary" v-waves icon="search"
                       @click="getCertResult">查询
            </el-button>
        </div>
        <el-table :data="list" border fit highlight-current-row
                  style="width: 100%" v-show="showTable">
            <el-table-column width="250px" align="center" label="流水号">
                <template slot-scope="scope">
                    <span>{{scope.row.authId}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="认证结果">
                <template slot-scope="scope">
                    <span>{{scope.row.certRes}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="cert_token">
                <template slot-scope="scope">
                    <span>{{scope.row.certToken}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="姓名">
                <template slot-scope="scope">
                    <span class="link-type" @click='handleUpdate(scope.row)'>{{scope.row.fullName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="身份证号">
                <template slot-scope="scope">
                    <span>{{scope.row.idNum}}</span>
                </template>
            </el-table-column>
            <el-table-column width="250px" align="center" label="公司名称">
                <template slot-scope="scope">
                    <span>{{scope.row.company}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {
        getIdentifyAccessToken,
        getIdentifyCertResult
    } from '../../../../api/hallSystem/window/identification';

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
                }
            }
        },
        methods: {
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
                                                    response.data[n].certRes = '认证成功'
                                                } else {
                                                    response.data[n].certRes = '认证失败'
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