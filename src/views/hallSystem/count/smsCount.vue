<template>
    <div class="app-container calendar-list-container">
        <div class="row">
            <div>
                <span>每日统计短信发送设置</span>
            </div>
            <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
            <div class="filter-container">
                <div>自定义内容：</div>
                <el-input type="textarea" v-model="text"></el-input>

                <div>以下内容为系统默认内容：</div>
                <el-input type="textarea" v-model="newText" :disabled="true"></el-input>

                <el-button class="filter-item" type="primary" v-waves icon="search" @click="flushCount">
                    刷新统计
                </el-button>
                <el-button class="filter-item" type="primary" v-waves  @click="updateSetting">
                    保存设置
                </el-button>
            </div>
            <div class="className" id="plotbyCategory"></div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getHallCountMsg,updateHallCountMsg} from '../../../api/hallSystem/count/sms';

    export default {
        name: 'table_demo',
        data() {
            return {
                text: '',
                newText:''
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        mounted() {
            this.getSetting();
        },
        methods: {
            flushCount() {
                getHallCountMsg().then(response => {
                        if (response.httpCode === 200) {
                            this.newText = response.data.newText;
                        } else {
                            this.$message.error('信息加载失败')
                        }
                    }
                );
            },
            getSetting() {
                getHallCountMsg().then(response => {
                        if (response.httpCode === 200) {
                            this.text = response.data.settingText;
                            this.newText = response.data.newText;
                        } else {
                            this.$message.error('信息加载失败')
                        }
                    }
                );
            },
            updateSetting() {
                updateHallCountMsg(this.text).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('设置成功');
                    } else {
                        this.$message.error('设置失败');
                    }
                });

            }
        }
    }
</script>
<style>
    .row {
        margin-right: -15px;
        margin-left: -15px;
    }

    .className {
        width: 100%;
        height: 420px;
    }

</style>