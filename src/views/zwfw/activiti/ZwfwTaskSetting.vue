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
                <div id="pb1_div">

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

                <!--<div class="affix" id="diagramInfo" style="z-index:99999;background:#fff;margin:auto;left:0; right:0; top:0;width:50%;">-->
                <div id="diagramInfo">

                </div>

                <div id="taskUserInfo" style="display: none">
                    <h3>人员安排</h3>
                    <label class="assignee"></label>
                </div>
                <div id="taskUserEditor" style="display: none">
                    <form method="post" onsubmit="return false;">
                        <h3>人员安排设置(点击保存生效):</h3>
                        <div class="full-height-scroll" style="margin-top: 14px;">
                            <div class="form-group">
                                <div class="input-group">
                                    <input type="text" class="form-control" id="userSearch"
                                           name="userSearch" value="" placeholder="添加人员">
                                    <div class="input-group-btn">
                                        <button type="button"
                                                class="btn btn-default dropdown-toggle"
                                                data-toggle="dropdown">
                                            <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-right"
                                            role="menu">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!--<div class="form-group">
                                <select class="form-control" id="userSearch" name="name"
                                ></select>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="userSearch" name="name"
                                           placeholder="添加人员">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-primary dropdown-toggle"
                                                data-toggle="dropdown">
                                            <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-right" role="menu">
                                        </ul>
                                    </div>
                                </div>
                            </div>-->
                        </div>
                        <div class="table-responsive">
                            <table id="candidateUsersTable" class="table table-striped table-hover">

                            </table>
                        </div>
                        <div class="form-group" style="margin-top: 14px;">
                            <button class="btn btn-primary btn-block " onclick="saveCandidateUser()">
                                保存人员设置
                            </button>
                        </div>
                    </form>
                </div>
                <div id="userTaskSetting" v-show="task.taskDefinitionKey" class="m-t-sm">
                    <form method="post" onsubmit="return false;">
                        <h3>用户任务其他设置(点击保存生效):</h3>
                        <div class="form-group">
                            <div class="checkbox-inline">
                                <label>
                                    <input type="checkbox" name="supportCorrection" v-model="task.supportCorrection"
                                           value="1">允许整改</label>
                            </div>
                            <div class="checkbox-inline">
                                <label>
                                    <input type="checkbox" name="supportExtendTime"
                                           v-model="task.supportExtendTime">允许申请延期</label>
                            </div>
                            <div class="checkbox-inline">
                                <label>
                                    <input type="checkbox" name="supportClose" v-model="task.supportClose"
                                           value="1">允许不予受理</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="timerInput">前台步骤名称:</label>
                            <input type="text" class="form-control" id="frontName"
                                   name="frontName"
                                   placeholder="" v-model="task.frontName">
                        </div>
                        <div class="form-group">
                            <label for="timerInput">任务默认时限天数:</label>
                            <input type="number" min="0" max="999" class="form-control" id="timerInput"
                                   name="defaultTimeLimit"
                                   placeholder="设置时限天数，0表是不限制" v-model="task.defaultTimeLimit">
                        </div>
                        <div class="form-group">
                            <label for="beginNotifyTemplate">任务开始时通知模板:</label>
                            <select class="form-control" id="beginNotifyTemplate"
                                    name="beginNotifyTemplate" v-model="task.beginNotifyTemplate">
                                <option value="">不通知</option>
                                <option v-for="t in messageTemplate" :value="t.template_id" :title="t.sms_content">
                                    {{t.sms_title}}
                                </option>

                            </select>
                        </div>
                        <div class="form-group">
                            <label for="notifyTarget">任务开始时通知对象:</label>
                            <select class="form-control"
                                    name="beginNotifyTarget" id="beginNotifyTarget" v-model="task.beginNotifyTarget">
                                <option value="0">不通知</option>
                                <option value="1">申请办件的注册用户</option>
                                <option value="2">下一个步骤的工作人员</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="completeNotifyTemplate">任务完成时通知模板:</label>
                            <select class="form-control" id="completeNotifyTemplate"
                                    name="completeNotifyTemplate" v-model="task.completeNotifyTemplate">
                                <option value="">不通知</option>
                                <option v-for="t in messageTemplate" :value="t.template_id" :title="t.sms_content">
                                    {{t.sms_title}}
                                </option>

                            </select>
                        </div>
                        <div class="form-group">
                            <label for="notifyTarget">任务完成时通知对象:</label>
                            <select class="form-control"
                                    name="completeNotifyTarget" id="notifyTarget" v-model="task.completeNotifyTarget">
                                <option value="0">不通知</option>
                                <option value="1">申请办件的注册用户</option>
                                <option value="2">下一个步骤的工作人员</option>
                            </select>
                        </div>
                        <button class="btn btn-primary btn-block " type="button" v-on:click="saveOtherSetting">
                            保存其他设置
                        </button>
                    </form>
                </div>

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
                messageTemplate: [],
                processDefinitionId: 0,
                task: {
                    name: '审核申报材料，出具单',
                    taskDefinitionKey: '',
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
                    taskDefinitionKey: this.task.taskDefinitionKey,
                    defaultTimeLimit: this.task.defaultTimeLimit,
                    frontName: this.task.frontName,
                    beginNotifyTemplate: this.task.beginNotifyTemplate,
                    beginNotifyTarget: this.task.beginNotifyTarget,
                    completeNotifyTemplate: this.task.completeNotifyTemplate,
                    completeNotifyTarget: this.task.completeNotifyTarget,
                    supportCorrection: this.task.supportCorrection,
                    supportExtendTime: this.supportExtendTime,
                    supportClose: this.task.supportClose
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


            var _this = this;

            var DiagramGenerator = {};
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

                        _this.data = {};


                        if (contextObject.flow) {
                            ProcessDiagramGenerator.showFlowInfo(contextObject);
                        } else {
                            ProcessDiagramGenerator.showActivityInfo(contextObject);
                            var type = contextObject.getProperty("type");
                            if (type == "userTask") {
                                var name = contextObject.getProperty('name');
                                var doc = contextObject.getProperty("documentation");
                                var assignee = contextObject.getProperty("assignee");
//                                candidateUsersTable.data('processDefinitionId', canvas.processDefinitionId).data('taskDefinitionKey', contextObject.getId());
                                if (assignee) {
                                    //有设置办理人员
//                                    candidateUsersTable.bootstrapTable('removeAll');
                                    $('#taskUserInfo').show().find('.assignee').text('流程中锁定为' + assignee + "(变量)所代表的用户");
                                    $('#taskUserEditor').hide();
                                } else {
                                    //显示人员列表
                                    $('#taskUserEditor').show();
                                    $('#taskUserInfo').hide();

//                                    candidateUsersTable.bootstrapTable('refresh', {
//                                        query: {
//                                            processDefinitionId: canvas.processDefinitionId,
//                                            taskDefinitionKey: contextObject.getId()
//                                        },
//                                        url: '/admin/item/process/getTaskUsers'
//                                    });
                                }
                                $('#userTaskSetting').data({
                                    taskDefinitionKey: contextObject.id,
                                    name: contextObject.getProperty('name'),
                                    processDefinitionId: canvas.processDefinitionId
                                }).show();
//
//
//
//

                                _this.task.taskDefinitionKey = contextObject.id;
                                _this.task.name = contextObject.getProperty('name');
                                _this.processDefinitionId = canvas.processDefinitionId;


//                                发请求查询当前设置的默认时限
                                $.post('/admin/item/process/getOtherSetting', {
                                    processDefinitionId: canvas.processDefinitionId,
                                    taskDefinitionKey: contextObject.id
                                }, function (data) {
                                    if (data.status == 200) {
                                        if (data.data != null) {
                                            var c = data.data.setting;
                                            if (c) {
                                                _this.task.beginNotifyTarget = c.beginNotifyTarget;
                                                _this.task.beginNotifyTemplate = c.beginNotifyTemplate;
                                                _this.task.completeNotifyTarget = c.completeNotifyTarget;
                                                _this.task.completeNotifyTemplate = c.completeNotifyTemplate;
                                                _this.task.defaultTimeLimit = c.defaultTimeLimit;
                                                _this.task.supportClose = c.supportClose;
                                                _this.task.frontName = c.frontName;
                                                _this.task.supportCorrection = c.supportCorrection;
                                                _this.task.supportExtendTime = c.supportExtendTime;
                                            }
                                            //设置可选模板列表
                                            if (data.data.messageTemplate) {
                                                _this.messageTemplate = data.data.messageTemplate;
                                            }
                                        }
                                    }
                                });
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
                if (window.pb1 == null) {
                    window.pb1 = new $.ProgressBar({
                        boundingBox: '#pb1_div',
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
                    console.log(window.pb1)
                    window.pb1.set('value', 0);
                }

                console.log("Progress bar inited");

            }

        }
    }
</script>
<style>

</style>
