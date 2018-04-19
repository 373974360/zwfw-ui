<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="6">
            </el-col>
            <el-col :span="18">
                默认尺寸：
                <el-input-number v-model="defualtSize" value="6" :min="1" :max="24">

                </el-input-number>

                <el-button type="primary" @click="addNewField">添加字段</el-button>
                <el-button type="primary" @click="testRegex">测试正则</el-button>
            </el-col>
        </el-row>
        <el-table
                :data="pretrialForm.fields"
                style="width: 100%"
        >
            <el-table-column
                    type="index"
                    width="60">
            </el-table-column>
            <el-table-column
                    prop="label"
                    label="表单域"
                    width="180"
            >
                <template scope="scope">
                    <el-select v-model="scope.row.field" remote filterable placeholder="请选择"
                               :remote-method="remoteSelect" @change="value=>{setLabel(value,scope.row)}" value-key="id"
                               :default-first-option="true">
                        <el-option
                                v-for="field in fields"
                                :label="field.label"
                                :value="field"
                                :key="field.id"
                                :disabled="pretrialForm.fields.filter(f => f.fieldId === field.id ).length > 0">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                    prop="labelAlias"
                    label="别名"
                    width="180">
                <template scope="scope">
                    <el-input :disabled="!scope.row.fieldId" v-model="scope.row.labelAlias"
                              placeholder="留空不变"></el-input>
                </template>
            </el-table-column>
            <!--<el-table-column-->
            <!--prop="inputType"-->
            <!--label="类型"-->
            <!--width="180">-->
            <!--<template scope="scope">-->
            <!--<span v-if="scope.row.inputType">-->
            <!--{{scope.row.inputType | enums('InputType')}}-->
            <!--</span>-->
            <!--<span v-else>-->
            <!-- - -->
            <!--</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="require"
                    label="必填" width="70">
                <template scope="scope">
                    <el-checkbox v-model="scope.row.require" :disabled="!scope.row.fieldId" true-label="1"
                                 false-label="0"/>
                </template>
            </el-table-column>
            <!--<el-table-column-->
            <!--prop="position"-->
            <!--label="位置">-->
            <!--<template scope="scope">-->
            <!--<el-input v-model="scope.row.position"></el-input>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="size"
                    label="尺寸" width="80">
                <template scope="scope">
                    <el-input-number style="width:100%" v-model="scope.row.size" :controls="false" :value="1" :min="1"
                                     :max="24" :disabled="!scope.row.fieldId">

                    </el-input-number>
                </template>
            </el-table-column>
            <el-table-column
                    prop="regex"
                    label="正则">
                <template scope="scope">
                    <!--<el-input v-model="scope.row.regex" placeholder="留空不验证" :disabled="!scope.row.fieldId">-->
                    <!--</el-input>-->
                    {{scope.row.regex}}
                </template>
            </el-table-column>
            <!--<el-table-column-->
            <!--prop="regexError"-->
            <!--label="正则错误">-->
            <!--<template scope="scope">-->
            <!--<el-input v-model="scope.row.regexError" placeholder="正则不匹配时的提示" :disabled="!scope.row.fieldId">-->

            <!--</el-input>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" width="160">
                <template scope="scope">
                    <el-button size="small"
                               @click="fieldUp(scope.row)" icon="arrow-up">
                    </el-button>
                    <el-button size="small"
                               @click="fieldDown(scope.row)" icon="arrow-down">
                    </el-button>
                    <el-button size="small"
                               type="danger"
                               @click="fieldDel(scope.row)" icon="delete">

                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <h1>预览区域：</h1>
        <el-form ref="previewForm" :model="previewFormModel" label-position="top" label-width="80px" label-suffix=":">
            <el-row :gutter="10">
                <el-col v-for="(field,index) in pretrialForm.fields" v-if="!!field.fieldId"
                        :span="field.size"
                        :key="field.id">
                    <el-form-item :label="smartLabel(field)"
                                  :rules="fieldRule(field)"
                                  :key="field.id+'_input'"
                                  :prop="'fields.'+index+'.value'">
                        <el-input v-model="previewFormModel.fields[index].value"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>

</template>

<script>

    import {
        getFormByItemId,
        updateForm,
        suggestField
    } from '../../../api/zwfwSystem/business/itemPretrialForm';

    export default {
        name: 'item-pretrial-form',
        props: {
            itemVo: {
                type: Object,
                default: undefined,
                required: true
            }
        },
        data() {
            return {
                defualtSize: 6,
                pretrialForm: {
                    fields: []
                },
                listQuery: {
                    label: ''
                },
                fields: [],
                loading: false,
                previewFormModel: {
                    fields: []
                },
                rules: {}
            }
        },

        methods: {
            // checkFieldExist(fieldId) {
            //     return this.pretrialForm.fields.filter(f => f.fieldId === fieldId).length > 0;
            // },
            fieldRule(field) {
                const rule = {
                    trigger: 'blur,change'
                };
                if (field.require) {
                    rule.required = true;
                }
                if (field.regex) {
                    rule.pattern = new RegExp(field.regex);
                    rule.message = field.regexError;
                }
                if (Object.keys(rule).length > 0 && !(field.key in this.rules)) {
                    // console.log('添加验证规则 for ' + field.key);
                    // this.$set(this.rules, field.key, [rule]);
                }
                // console.log(field.label,rule);
                return rule;
            },
            testRegex() {
                this.$refs.previewForm.validate(result => {
                    if (!result) {
                        this.$message.error('验证不通过');
                    } else {
                        this.$message.success('验证通过');
                    }
                });
            },
            smartSize() {
                let cols = 0;
                for (const field of this.pretrialForm.fields) {
                    cols += field.size;
                }
                let size = 24 - ((cols - 1) % 24);
                if (size < 6) {
                    size = 6;
                }
                return size;
            },
            smartLabel(field) {
                if (field.labelAlias && field.labelAlias.length > 0) {
                    return field.labelAlias;
                }
                return field.label;
            },
            setLabel(field, pretrialFormField) {
                pretrialFormField.fieldId = field.id;
                pretrialFormField.id = null;
                pretrialFormField.key = field.key;
                pretrialFormField.label = field.label;
                pretrialFormField.labelAlias = field.label;
                pretrialFormField.require = field.require;
                pretrialFormField.regex = field.regex;
                pretrialFormField.regexError = field.regexError;
                if (!pretrialFormField.size) {
                    pretrialFormField.size = this.smartSize();
                }
                // 清空候选列表
                this.fields = [];
            },
            /**
             * 加载现有的配置
             * */
            loadPretrialFormByItemId() {
                getFormByItemId(this.itemVo.id).then(response => {
                    if (response.data) {
                        const i = 0;
                        for (const field of response.data.fields) {
                            field.field = {
                                id: field.fieldId,
                                key: field.key,
                                label: field.label,
                                require: field.require,
                                regex: field.regex,
                                regexError: field.regexError
                            };
                            this.fields.push({
                                id: field.fieldId,
                                key: field.key,
                                label: field.label,
                                require: field.require,
                                regex: field.regex,
                                regexError: field.regexError
                            });
                        }
                        this.pretrialForm = response.data;
                    } else {
                        this.pretrialForm = {
                            title: this.itemVo.name + '预审表单',
                            itemId: this.itemVo.id,
                            version: 1,
                            tplId: 0,
                            fields: [],
                            status: 1
                        }
                    }
                }).catch(e => {
                    console.log(e);
                    this.$message.error('查询失败，请重新打开窗口尝试');
                });
            },
            /**
             * 提交修改
             */
            submitItemPretrialForm() {
                const {id, title, itemId, version, tplId, status} = this.pretrialForm;
                for (const field of this.pretrialForm.fields) {
                    field.createTime = null;// 提交上去转换 Date 类型会报错，所以不传
                    field.updateTime = null;// 提交上去转换 Date 类型会报错，所以不传
                }
                updateForm(Object.assign({
                    id, itemId, version, tplId, status, title,
                    itemPretrialFormFieldsJson: encodeURIComponent(encodeURIComponent(JSON.stringify(this.pretrialForm.fields.filter(f => !!f.fieldId))))
                })).then(response => {
                    console.log(response);
                    this.$message.success('提交成功');
                }).catch(e => {
                    console.log(e);
                    this.$message.error('提交失败');
                });
            },
            remoteSelect(query) {
                if (query !== '') {
                    this.loading = true;
                    suggestField({
                        keywords: query,
                        formId: this.pretrialForm.id
                    }).then(response => {
                        this.loading = false;
                        this.fields = response.data;
                    }).catch(e => {
                        this.loading = false;
                    });
                } else {
                    this.fields = [];
                }
            },
            addNewField() {
                const items = {
                    id: new Date().getTime() + '',
                    formId: this.formId,
                    fieldId: undefined,
                    key: undefined,
                    label: '',
                    labelAlias: '',
                    position: 0,
                    size: this.defualtSize,
                    require: true,
                    field: {}
                };
                this.pretrialForm.fields.push(items);
                this.previewFormModel.fields.push({value: ''});
                /* 清空自动完成 */
                this.fields = [];
            },
            fieldDel(field) {
                this.pretrialForm.fields.splice(this.pretrialForm.fields.indexOf(field), 1);
            },
            fieldUp(field) {
                const index = this.pretrialForm.fields.indexOf(field);
                console.log(index);
                if (index === 0) {
                    return;
                }
                const prev = this.pretrialForm.fields[index - 1];
                const curr = this.pretrialForm.fields[index];
                this.$set(this.pretrialForm.fields, index - 1, curr);
                this.$set(this.pretrialForm.fields, index, prev);
            },
            fieldDown(field) {
                const index = this.pretrialForm.fields.indexOf(field);
                console.log(index);
                if (index === this.pretrialForm.fields.length - 1) {
                    return;
                }
                const next = this.pretrialForm.fields[index + 1];
                const curr = this.pretrialForm.fields[index];
                this.$set(this.pretrialForm.fields, index + 1, curr);
                this.$set(this.pretrialForm.fields, index, next);
            }
        }
    }
</script>

<style scoped>

</style>