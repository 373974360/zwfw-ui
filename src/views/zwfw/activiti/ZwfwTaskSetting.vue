<template>
    <el-row :gutter="20">
        <el-col :span="16">
            <div class="grid-content">
                <!--流程选择和流程的显示区域-->
                <el-form :inline="true" ref="searchForm" :model="search" label-width="80px">
                    <el-form-item label="流程:">
                        <el-select v-model="search.processDefinitionKey" filterable placeholder="请选择流程"
                                   @change="loadProcessDefinitionVersionList">
                            <el-option
                                    v-for="item in processDefinitionList"
                                    :key="item.key"
                                    :label="item.name"
                                    :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="版本:">
                        <el-select v-model="search.processDefinitionId" placeholder="请选择流程">
                            <el-option
                                    v-for="item in processDefinitionVersionList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="flush()" v-bind:disabled="loading">确定</el-button>
                </el-form>
                <div id="pb1_div">

                </div>
                <div id="overlayBox">
                    <div id="diagramBreadCrumbs" class="diagramBreadCrumbs" onmousedown="return false"
                         onselectstart="return false">
                    </div>

                    <div style="overflow:auto ">

                        <div id="diagramHolder" class="diagramHolder"
                             style="margin-left:auto;margin-right:auto"></div>
                    </div>

                </div>

            </div>
        </el-col>
        <el-col :span="8">
            <div class="grid-content">
                <div >
                    <Sticky :sticky-top="0" :height="500"  >
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
                                <el-select v-model="search.searchUser" filterable placeholder="请选择"
                                           @change="chooseAddUser">
                                    <el-option
                                            v-for="item in userList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-button slot="append" @click="addUserToTask">添加</el-button>
                                <el-button class="el-button--primary" @click="saveCandidateUser">
                                    保存人员设置
                                </el-button>

                                <el-table
                                        :data="candidateUserList"
                                        style="width: 100%;margin-top:14px;">
                                    <el-table-column
                                            prop="id"
                                            label="编号"
                                            width="180">
                                    </el-table-column>
                                    <el-table-column
                                            prop="name"
                                            label="姓名"
                                            width="180">
                                    </el-table-column>
                                    <el-table-column
                                            prop="dept"
                                            label="地址">
                                    </el-table-column>
                                </el-table>
                            </form>
                        </div>
                        <div id="userTaskSetting" v-show="task.taskDefinitionKey">
                            <form method="post" onsubmit="return false;">
                                <h3>用户任务其他设置(点击保存生效):</h3>
                                <div class="form-group">
                                    <div class="checkbox-inline">
                                        <el-checkbox v-model="task.supportCorrection">
                                            允许整改
                                        </el-checkbox>
                                    </div>
                                    <div class="checkbox-inline">
                                        <el-checkbox v-model="task.supportExtendTime">
                                            允许申请延期
                                        </el-checkbox>
                                    </div>
                                    <div class="checkbox-inline">
                                        <el-checkbox v-model="task.supportClose">
                                            允许不予受理
                                        </el-checkbox>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>前台步骤名称:</label>
                                    <el-input v-model="task.frontName" placeholder="请输入内容"></el-input>
                                </div>
                                <div class="form-group">
                                    <label>任务默认时限天数:</label>
                                    <el-input-number v-model="task.defaultTimeLimit" :min="1"
                                                     :max="999"></el-input-number>

                                </div>
                                <div class="form-group">
                                    <label>任务开始时通知模板:</label>
                                    <el-select v-model="task.beginNotifyTemplate" placeholder="请选择">
                                        <el-option value="">不通知</el-option>
                                        <el-option
                                                v-for="t in messageTemplate"
                                                :key="t.template_id"
                                                :label="t.sms_title"
                                                :value="t.template_id" :title="t.sms_content">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="form-group">
                                    <label>任务开始时通知对象:</label>
                                    <el-select v-model="task.beginNotifyTarget" placeholder="请选择">
                                        <el-option value="">不通知</el-option>
                                        <el-option value="0">不通知</el-option>
                                        <el-option value="1">申请办件的注册用户</el-option>
                                        <el-option value="2">下一个步骤的工作人员</el-option>
                                    </el-select>
                                </div>
                                <div class="form-group">
                                    <label>任务完成时通知模板:</label>
                                    <el-select v-model="task.completeNotifyTemplate" placeholder="请选择">
                                        <el-option value="">不通知</el-option>
                                        <el-option
                                                v-for="t in messageTemplate"
                                                :key="t.template_id"
                                                :label="t.sms_title"
                                                :value="t.template_id" :title="t.sms_content">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="form-group">
                                    <label>任务完成时通知对象:</label>
                                    <el-select v-model="task.completeNotifyTarget" placeholder="请选择">
                                        <el-option value="">不通知</el-option>
                                        <el-option value="0">不通知</el-option>
                                        <el-option value="1">申请办件的注册用户</el-option>
                                        <el-option value="2">下一个步骤的工作人员</el-option>
                                    </el-select>
                                </div>
                                <el-button @click="saveOtherSetting">保存其他设置</el-button>
                            </form>
                        </div>
                    </Sticky>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>

    import Sticky from 'components/Sticky';

    import {
        getOtherSetting,
        saveOtherSetting,
        getTaskUsers,
        saveCandidateUser,
        getProcessList,
        getProcessVersionList,
        getUserList
    } from 'api/zwfw/zwfwItemProcess';

    export default {
        components: {
            Sticky
        },
        name: 'table_demo',
        computed: {
            mainHeihgt:function(){
                return window.innerHeight - 50;
            },
            candidateUserList: function () {
                let array = [];
                if (this.task && this.task.taskCandidateUsers != '') {
                    var taskCandidateUsersIds = this.task.taskCandidateUsers.split(',');
                    for (let uid of taskCandidateUsersIds) {
                        for (let u of this.userList) {
                            if (!isNaN(uid) && parseInt(uid) == u.id) {
                                array.push(u);
                            }

                        }
                    }
                }
                return array;
            }
        },
        data() {
            return {
                loading: false,
                search: {
                    processDefinitionKey: '',
                    processDefinitionVersion: '',
                    processDefinitionId: '',
                    searchUser: ''
                },
                messageTemplate: [],
                userList: [],
                processDefinitionId: 0,
                processDefinitionList: [],
                processDefinitionVersionList: [],
                task: {
                    name: '审核申报材料，出具单',
                    taskDefinitionKey: '',
                    id: 'ziliao_shenhe',
                    type: 1,
                    taskAssigmentUser: '',
                    taskCandidateUsers: '',
                    taskCandidateGroup: '',
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
             *
             * 加载流程列表
             */
            loadProcessDefinitionList() {
                const _this = this;
                getProcessList().then((response) => {
                    _this.processDefinitionList = response.data;
                })
            },
            /**
             * 加载流程的版本
             */
            loadProcessDefinitionVersionList() {
                const _this = this;
                getProcessVersionList(this.search.processDefinitionKey).then((response) => {
                    _this.processDefinitionVersionList = response.data;
                });
            },
            /**
             * 加载全部用户列表
             */
            loadUserList() {
                const _this = this;
                getUserList().then((response) => {
                    _this.userList = response.data;
                });
            },
            /**
             * 用户下拉菜单选中事件
             **/
            chooseAddUser(value) {
                const _this = this;
                _this.search.userId = value;
            },
            /**
             * 添加选中的用户到用户列表中
             * */
            addUserToTask() {
                const _this = this;
                for (let u of _this.candidateUserList) {
                    if (u.id == _this.search.userId) {
                        // 说明已经在列表中了
                        _this.$message.warning("请勿重复添加");
                        return;
                    }
                }
                // find userInfo in UserList by id
                for (let u2 of _this.userList) {
                    if (u2.id == _this.search.userId) {
                        //如果找到用户信息的话，就保存到变量中
                        _this.candidateUserList.push({
                            id: _this.search.userId,
                            name: u2.name,
                            dept: u2.dept
                        });
                        _this.task.taskCandidateUsers = _this.candidateUserList.map(function (item) {
                            return item.id
                        }).join(',');
                        _this.search.userId = '';
//                        console.log(_this.task.taskCandidateUsers);
                        break;
                    }
                }
            },
            /**
             * 保存节点的用户设置
             */
            saveCandidateUser() {
                var _this = this;
                saveCandidateUser(this.processDefinitionId, this.task.taskDefinitionKey, this.candidateUserList.map(function (item) {
                    return item.id
                })).then(function (response) {
                    _this.$message.success("保存成功")
                }).then(function (response) {
                    _this.$message.error("保存失败");
                });

            },
            /**
             * 保存其他设置
             */
            saveOtherSetting() {
                saveOtherSetting({
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

                }).then(function () {
                    this.$message.success('保存成功');
                }).then(function () {
                    this.$message.error('保存失败');
                });
            }

        },
        mounted() {

            var _this = this;

            // 加载所有流程的列表填充到流程select中
            this.loadProcessDefinitionList();
            // 加载所有的用户列表
            this.loadUserList();

            var DiagramGenerator = {};
            ProcessDiagramGenerator.options = {
                diagramBreadCrumbsId: "diagramBreadCrumbs", //面包屑和进度条的id
                diagramHolderId: "diagramHolder", //显示流程图区域的id
                diagramInfoId: "diagramInfo", //展示节点信息区域的id
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
//                                taskCandidateUsersTable.data('processDefinitionId', canvas.processDefinitionId).data('taskDefinitionKey', contextObject.getId());
                                if (assignee) {
                                    //有设置办理人员
//                                    taskCandidateUsersTable.bootstrapTable('removeAll');
                                    $('#taskUserInfo').show().find('.assignee').text('流程中锁定为' + assignee + "(变量)所代表的用户");
                                    $('#taskUserEditor').hide();
                                } else {
                                    //显示人员列表
                                    $('#taskUserEditor').show();
                                    $('#taskUserInfo').hide();

//                                    taskCandidateUsersTable.bootstrapTable('refresh', {
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

//                                getTaskUsers(canvas.processDefinitionId, contextObject.id).then(response => {
//                                    const data = response.data;
//                                    _this.candidateUserList = data;
//                                });


                                _this.task.taskDefinitionKey = contextObject.id;
                                _this.task.name = contextObject.getProperty('name');
                                _this.processDefinitionId = canvas.processDefinitionId;
                                _this.task.taskCandidateUsers = [];

//                                发请求查询当前设置的默认时限
                                getOtherSetting(canvas.processDefinitionId, contextObject.id).then(response => {
                                    const data = response.data;
                                    const c = data.setting;
                                    console.log(c);
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
                                        _this.task.taskCandidateUsers = c.taskCandidateUsers;
                                    }
                                    // 设置可选模板列表
                                    if (data.messageTemplate) {
                                        _this.messageTemplate = data.messageTemplate;
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
                processInstanceHighLightsUrl: process.env.ZWFW_ACTIVITI_API + "/zwfw/activiti/service/process-instance/{processInstanceId}/highlights?callback=?",
                processDefinitionUrl: process.env.ZWFW_ACTIVITI_API + "/zwfw/activiti/service/process-definition/{processDefinitionId}/diagram-layout?callback=?",
                processDefinitionByKeyUrl: process.env.ZWFW_ACTIVITI_API + "/zwfw/activiti/service/process-definition/{processDefinitionKey}/diagram-layout?callback=?"
            };


            this.flush = function (processDefinitionId, processInstanceId) {
                _this.loading = true;
                processDefinitionId = this.search.processDefinitionId;
                if (this.search.processDefinitionId) {
                    ProcessDiagramGenerator.drawDiagram(processDefinitionId);
                } else {
                    alert("processDefinitionId parameter is required");
                }
                //如果进度条不存在的话，就构建一个进度条
                if (window.pb1 == null) {
                    window.pb1 = new $.ProgressBar({
                        boundingBox: '#pb1_div',
                        label: 'Progressbar!',
                        on: {
                            complete: function () {
                                console.log("Progress Bar COMPLETE");
                                this.set('label', 'complete!');
                                _this.loading = false;

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
