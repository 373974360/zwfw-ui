<template>

</template>
<script>
    import {
        getZwfwProcessDefinitionList,
        createZwfwProcessDefinition,
        suspendZwfwProcessDefinition,
        activeZwfwProcessDefinition
    } from 'api/zwfw/zwfwActiviti';
    import {copyProperties} from 'utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'table_demo',
        data() {
            return {}
        },
        methods: {
            /**
             * 保存其他设置
             */
            saveOtherSetting() {
                $.post('/admin/item/process/saveOtherSetting', {
                    processDefinitionId: this.processDefinitionId,
                    taskDefinitionKey: this.taskDefinitionKey,
                    defaultTimeLimit: this.defaultTimeLimit,
                    frontName: this.frontName,
                    beginNotifyTemplate: this.beginNotifyTemplate,
                    beginNotifyTarget: this.beginNotifyTarget,
                    completeNotifyTemplate: this.completeNotifyTemplate,
                    completeNotifyTarget: this.completeNotifyTarget,
                    supportCorrection: this.supportCorrection,
                    supportExtendTime: this.supportExtendTime,
                    supportClose: this.supportClose
                }, function (data) {
                    if (data.status == 200) {
                        info("保存成功");
                    } else {
                        error("设置失败");
                    }
                });
            }

        },
        mounted() {
            //
        }
    }
</script>
<style>

</style>
