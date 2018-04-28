<template>
    <div v-loading="loading"
         element-loading-text="拼命加载中">
        <el-row :gutter="10">
            <el-col :span="14">
                默认尺寸：
                <el-input-number v-model="defualtSize" value="6" :min="1" :max="24">

                </el-input-number>
                <el-button type="primary" @click="addNewField">添加字段</el-button>
            </el-col>
            <el-col :span="2">
                <div style="text-align: right">版本：</div>
            </el-col>
            <el-col :span="5">
                <el-select v-model="selectFormId" placeholder="请选择" style="width:100%" @change="changeVersion">
                    <el-option
                            v-for="version in versions"
                            :key="version.id"
                            :label="getVersionName(version)"
                            :value="version.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" @click="addNewVersion">创建新版本</el-button>
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
                    <el-checkbox v-model="scope.row.require" :disabled="!scope.row.fieldId"/>
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
        <el-form ref="previewForm" :model="pretrialForm" label-position="top" label-width="80px" label-suffix=":">
            <el-row :gutter="10">
                <el-col v-for="(field,index) in pretrialForm.fields" v-if="!!field.fieldId"
                        :span="field.size"
                        :key="field.id">
                    <el-form-item :label="smartLabel(field)"
                                  :rules="fieldRule(field)"
                                  :key="field.id+'_input'"
                                  :prop="'fields.'+index+'.value'">
                        <el-input v-model="pretrialForm.fields[index].value"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <p>
            每行宽度平均分成24等分，尺寸表示24等分中占几个等分。
        </p>
    </div>

</template>

<script>
    import {enums} from '../../../filters';
    import {
        getFormByMaterialId,
        updateForm,
        suggestField
    } from '../../../api/zwfwSystem/business/itemPretrialForm';

    import {mapGetters} from 'vuex';

    export default {
        name: 'item-pretrial-form',
        data() {
            return {
                itemVo: undefined,
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
                rules: {},
                versions: [],
                newForm: undefined,
                selectFormId:undefined
            }
        },
        computed: {
            ...mapGetters([
                'enums',
                'dics'
            ])
        },
        methods: {
            // checkFieldExist(fieldId) {
            //     return this.pretrialForm.fields.filter(f => f.fieldId === fieldId).length > 0;
            // },
            getVersionName(version) {
                return '[' + enums(version.status, 'ItemPretrialFormStatus') + '] ' + version.version;
            },
            fieldRule(field) {
                const rules = [];
                if (field.require) {
                    const rule = {
                        trigger: 'blur,change'
                    };
                    rule.required = true;
                    rule.message = '此项为必填项';
                    rules.push(rule);
                }
                if (field.regex) {
                    const rule = {
                        trigger: 'blur,change'
                    };
                    rule.pattern = new RegExp(field.regex);
                    rule.message = field.regexError || '格式不正确';
                    rules.push(rule);
                }
                return rules;
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
            loadPretrialForm(zwfwMaterial) {
                this.zwfwMaterial = zwfwMaterial;
                this.newForm = undefined; // 删除新增 form
                getFormByMaterialId(this.zwfwMaterial.id).then(response => {
                    if (response.httpCode === 200) {
                        const allVersions = this.versions = response.data;
                        const data = allVersions.length > 0 ? allVersions[0] : null;
                        if (data) {
                            this.selectFormId = data.id;
                        } else {
                            this.addNewVersion();
                        }
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e => {
                    console.log(e);
                    this.$message.error('查询失败，请重新打开窗口尝试');
                });
            },
            changeVersion(id) {
                let data = this.versions.filter(form => form.id === id)[0];
                console.log(id);
                // if (this.pretrialForm != null && data.id === this.pretrialForm.id) {
                //     return;
                // }
                this.previewFormModel.fields = [];
                this.fields = [];
                this.pretrialForm = {};
                for (const field of data.fields) {
                    // select 组件中的选中项的信息
                    field.field = {
                        id: field.fieldId,
                        key: field.key,
                        label: field.label,
                        require: field.require,
                        regex: field.regex,
                        regexError: field.regexError
                    };
                    // 添加到 select 组件中的待选项
                    this.fields.push({
                        id: field.fieldId,
                        key: field.key,
                        label: field.label,
                        require: field.require,
                        regex: field.regex,
                        regexError: field.regexError
                    });
                    // 预览区域的数据
                    this.previewFormModel.fields.push({value: ''});
                }
                // 返回的数据，修改后用户界面还原显示编辑行
                this.pretrialForm = data;
                this.$emit('changeVersion', data);
            },
            addNewVersion() {
                if (this.newForm != null) {
                    this.$message.error('已有尚未保存的新版本');
                    return false;
                }
                const newForm = this.newForm = {
                    id: 'new_' + new Date().getTime(),
                    title: this.zwfwMaterial.name,
                    materialId: this.zwfwMaterial.id,
                    version: 1,
                    tplId: 0,
                    fields: [],
                    status: 1
                };
                this.versions.unshift(newForm);
                this.changeVersion(newForm);
            },
            /**
             * 提交修改
             */
            submitItemPretrialForm() {
                const {id, title, version, tplId, status, materialId} = this.pretrialForm;
                for (const field of this.pretrialForm.fields) {
                    field.createTime = null;// 提交上去转换 Date 类型会报错，所以不传
                    field.updateTime = null;// 提交上去转换 Date 类型会报错，所以不传
                }
                updateForm(Object.assign({
                    id, version, tplId, status, title, materialId,
                    itemPretrialFormFieldsJson: encodeURIComponent(encodeURIComponent(JSON.stringify(this.pretrialForm.fields.filter(f => !!f.fieldId))))
                })).then(response => {
                    if (response.httpCode == 200) {
                        this.$message.success('提交成功');
                    } else {
                        this.$message.error(response.msg);
                    }
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                    this.$message.error('提交失败');
                });
            },
            remoteSelect(query) {
                if (query !== '') {
                    this.loading = true;
                    this.fields = [];
                    suggestField({
                        keywords: query,
                        formId: this.pretrialForm.id
                    }).then(response => {
                        this.loading = false;
                        if (response.httpCode === 200) {
                            this.fields = response.data;
                        } else {
                            this.$message.error(response.msg);
                        }
                    }).catch(e => {
                        this.loading = false;
                        console.error(e);
                    });
                }
            },
            addNewField() {
                const newField = {
                    id: 'new_' + new Date().getTime(),
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
                this.pretrialForm.fields.push(newField);
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