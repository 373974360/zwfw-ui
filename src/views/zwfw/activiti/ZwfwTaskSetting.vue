<template>
    <el-row :gutter="20">
        <el-col :span="16">
            <div class="grid-content">
                <!--流程选择和流程的显示区域-->
                <el-form :inline="true" ref="searchForm" :model="search" label-width="80px">
                    <el-form-item label="流程:">
                        <el-select v-model="search.processDefinitionKey" placeholder="请选择流程">
                            <el-option label="区域一" value=""></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="版本:">
                        <el-select v-model="search.processDefinitionVersion" placeholder="请选择流程">
                            <el-option label="13" value="13"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="flush('JS017:1:52506')">确定</el-button>
                </el-form>
                <div id="pb1">

                </div>
                <div id="overlayBox">
                    <div id="diagramBreadCrumbs" class="diagramBreadCrumbs" onmousedown="return false"
                         onselectstart="return false">
                    </div>

                    <div style="overflow-x:auto ">

                        <div id="diagramHolder" class="diagramHolder"
                             style="margin-left:auto;margin-right:auto"></div>
                    </div>

                </div>

            </div>
        </el-col>
        <el-col :span="8">
            <div class="grid-content">
                <!--用户任务的设置区域-->
                <h2>{{task.name}}</h2>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import {
        getZwfwProcessDefinitionList,
        createZwfwProcessDefinition,
        suspendZwfwProcessDefinition,
        activeZwfwProcessDefinition
    } from 'api/zwfw/zwfwActiviti';

    export default {
        name: 'table_demo',
        data() {
            return {
                search: {
                    processDefinitionId: 0
                },
                task: {
                    name: '审核申报材料，出具单',
                    id: 'ziliao_shenhe',
                    type: 1,
                    taskAssigmentUser: 1,
                    taskCandidateUsers: [1, 2, 3, 4, 5],
                    taskCandidateGroup: [],
                    supportCorrection: true,
                    supportExtendTime: true,
                    supportClose: true,
                    frontName: '',
                    defaultTimeLimit: 1,
                    completeNotifyTemplate: 1,
                    completeNotifyTarget: 1,
                    beginNotifyTemplate: 1,
                    beginNotifyTarget: 1

                }
            }
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

            var DiagramGenerator = {};
            var pb1;
            ProcessDiagramGenerator.options = {
                diagramBreadCrumbsId: "diagramBreadCrumbs",
                diagramHolderId: "diagramHolder",
                diagramInfoId: "diagramInfo",
                on: {
                    click: function (canvas, element, contextObject) {
                        var mouseEvent = this;
                        console.log("[CLICK] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
                        ProcessDiagramGenerator.hideInfo();
                        //隐藏人员列表
                        $('#taskUserEditor').hide();
                        $('#taskUserInfo').hide();
                        //隐藏时限设置

                        userTaskSetting.$data = {};


                        if (contextObject.flow) {
                            ProcessDiagramGenerator.showFlowInfo(contextObject);
                        } else {
                            ProcessDiagramGenerator.showActivityInfo(contextObject);
                            var type = contextObject.getProperty("type");
                            if (type == "userTask") {
                                var name = contextObject.getProperty('name');
                                var doc = contextObject.getProperty("documentation");
                                var assignee = contextObject.getProperty("assignee");
                                candidateUsersTable
                                    .data(
                                        'processDefinitionId', canvas.processDefinitionId
                                    ).data(
                                    'taskDefinitionKey', contextObject.getId()
                                );
                                if (assignee) {
                                    //有设置办理人员
                                    candidateUsersTable.bootstrapTable('removeAll');
                                    $('#taskUserInfo').show().find('.assignee').text('流程中锁定为' + assignee + "(变量)所代表的用户");
                                    $('#taskUserEditor').hide();
                                } else {
                                    //显示人员列表
                                    $('#taskUserEditor').show();
                                    $('#taskUserInfo').hide();

                                    candidateUsersTable.bootstrapTable('refresh', {
                                        query: {
                                            processDefinitionId: canvas.processDefinitionId,
                                            taskDefinitionKey: contextObject.getId()
                                        },
                                        url: '/admin/item/process/getTaskUsers'
                                    });
                                }
//                        $('#userTaskSetting').data({
//                            taskDefinitionKey: contextObject.id,
//                            name: contextObject.getProperty('name'),
//                            processDefinitionId: canvas.processDefinitionId
//                        }).show();
//
//
//
//

                                userTaskSetting.$set("taskDefinitionKey", contextObject.id);
                                userTaskSetting.$set("name", contextObject.getProperty('name'));
                                userTaskSetting.$set("processDefinitionId", canvas.processDefinitionId);


                                //发请求查询当前设置的默认时限
//                                $.post('/admin/item/process/getOtherSetting', {
//                                    processDefinitionId: canvas.processDefinitionId,
//                                    taskDefinitionKey: contextObject.id
//                                }, function (data) {
//                                    if (data.status == 200) {
//                                        if (data.data != null) {
//                                            var c = data.data.setting;
//                                            if (c) {
//                                                userTaskSetting.$set('beginNotifyTarget', c.beginNotifyTarget);
//                                                userTaskSetting.$set('beginNotifyTemplate', c.beginNotifyTemplate);
//                                                userTaskSetting.$set('completeNotifyTarget', c.completeNotifyTarget);
//                                                userTaskSetting.$set('completeNotifyTemplate', c.completeNotifyTemplate);
//                                                userTaskSetting.$set('defaultTimeLimit', c.defaultTimeLimit);
//                                                userTaskSetting.$set('supportClose', c.supportClose);
//                                                userTaskSetting.$set('frontName', c.frontName);
//                                                userTaskSetting.$set('supportCorrection', c.supportCorrection);
//                                                userTaskSetting.$set('supportExtendTime', c.supportExtendTime);
//                                            }
//                                            //设置可选模板列表
//                                            if (data.data.messageTemplate) {
//                                                userTaskSetting.$set('messageTemplate', data.data.messageTemplate);
//                                            }
//                                        }
//                                    }
//                                });
                            } else if (type == 'boundaryTimer') {

                            } else if (type == 'callActivity') {
                                var processDefinitonKey = contextObject.getProperty("processDefinitonKey");
                                var processDefinitons = contextObject.getProperty("processDefinitons");
                                var processDefiniton = processDefinitons[0];
                                console.log("Load callActivity '" + processDefiniton.processDefinitionKey + "', contextObject: ", contextObject);

                                // Load processDefinition
                                ProcessDiagramGenerator.drawDiagram(processDefiniton.processDefinitionId);
                            }
                        }
                    },
                    rightClick: function (canvas, element, contextObject) {
                        var mouseEvent = this;
                        console.log("[RIGHTCLICK] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
                    },
                    over: function (canvas, element, contextObject) {
                        var mouseEvent = this;
                        //console.log("[OVER] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
                        // TODO: show tooltip-window with contextObject info
                        // ProcessDiagramGenerator.showActivityInfo(contextObject);
                    },
                    out: function (canvas, element, contextObject) {
                        var mouseEvent = this;
                        //console.log("[OUT] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
                        // ProcessDiagramGenerator.hideInfo();
                    }
                }
            };

            ActivitiRest.options = {
                processInstanceHighLightsUrl: "http://localhost:9999/zwfw/activiti/service/process-instance/{processInstanceId}/highlights?callback=?",
                processDefinitionUrl: "http://localhost:9999/zwfw/activiti/service/process-definition/{processDefinitionId}/diagram-layout?callback=?",
                processDefinitionByKeyUrl: "http://localhost:9999/zwfw/activiti/service/process-definition/{processDefinitionKey}/diagram-layout?callback=?"
            };


            this.flush = function (processDefinitionId, processInstanceId) {
                if (processDefinitionId) {
                    ProcessDiagramGenerator.drawDiagram(processDefinitionId);
//            ProcessDiagramGenerator.addBreadCrumbsItem()1

                } else {
                    alert("processDefinitionId parameter is required");
                }
                if (pb1 == null) {
                    pb1 = new $.ProgressBar({
                        boundingBox: '#pb1',
                        label: 'Progressbar!',
                        on: {
                            complete: function () {
                                console.log("Progress Bar COMPLETE");
                                this.set('label', 'complete!');
                                if (processInstanceId) {
                                    ProcessDiagramGenerator.drawHighLights(processInstanceId);
                                }
                            },
                            valueChange: function (e) {
                                this.set('label', e.newVal + '%');
                            }
                        },
                        value: 0
                    });
                } else {
                    //pb1.set('value', 0);
                }

                console.log("Progress bar inited");

            }

        }
    }
</script>
<style>

</style>
