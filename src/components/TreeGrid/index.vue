<template>
    <el-table border fit highlight-current-row
              style="width: 100%"
              :data="data"
              :row-style="showTr" v-loading.body="listLoading">
        <el-table-column v-for="(column, index) in columns" :key="column.dataIndex"
                         :label="column.text" :width="column.width">
            <template scope="scope">
                <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level"
                      class="ms-tree-space"></span>
                <template v-if="toggleIconShow(index,scope.row)">
                    <span @click="onToggle(scope.row)" v-if="!scope.row._expanded" class="svg-container"><wscn-icon-svg
                            icon-class="jiahao"/></span>
                    <span @click="onToggle(scope.row)" v-if="scope.row._expanded" class="svg-container"><wscn-icon-svg
                            icon-class="jianhao"/></span>
                </template>
                <span v-else-if="index===0" class="ms-tree-space"></span>
                <span v-if="column.editAble">
                    <el-tooltip content="点击编辑" placement="right" effect="dark">
                        <span class="link-type" @click="handleUpdate(scope.row)">
                            <el-tag :type="scope.row[column.dataIndex] | enums(column.enums)| statusFilter"
                                    v-if="column.enums">{{scope.row[column.dataIndex] | enums(column.enums)}}</el-tag>
                            <span v-else>
                                <span v-if="column.dateformart">{{scope.row[column.dataIndex] | date(column.dateformart)}}</span>
                                <span v-else>{{scope.row[column.dataIndex]}}</span>
                            </span>
                        </span>
                    </el-tooltip>
                </span>
                <span v-else>
                        <el-tag :type="scope.row[column.dataIndex] | enums(column.enums)| statusFilter"
                                v-if="column.enums">{{scope.row[column.dataIndex] | enums(column.enums)}}</el-tag>
                    <span v-else>
                        <span v-if="column.dateformart">{{scope.row[column.dataIndex] | date(column.dateformart)}}</span>
                        <span v-else>{{scope.row[column.dataIndex]}}</span>
                    </span>
                </span>
            </template>
        </el-table-column>
        <el-table-column label="操作" v-if="treeType === 'normal'" width="300" align="center">
            <template scope="scope"  >
                <el-button  style="margin: 10px 0px;" type="primary" size="small" @click="onHandleAdd(scope.row)">添加</el-button>
                <el-button style="margin: 10px 0px;"class="item" type="danger" size="small" @click="onHandleDelete(scope.row)">删除</el-button>
                <el-badge v-show="assoicateItem" :value="scope.row.categoryItemCount" class="item" style="margin-top: 0px;">
                    <el-button type="primary" size="small" @click="onHandleAssoicate(scope.row)">关联事项</el-button>
                </el-badge>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
    import TreeUtil from 'utils/TreeUtil.js'
    //  import Vue from 'vue'
    export default {
        name: 'tree-grid',
        props: {
            // 这是相应的字段展示
            columns: {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 这是数据源
            dataSource: {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 这个是是否展示操作列
            treeType: {
                type: String,
                default: function () {
                    return 'normal'
                }
            },
            // 是否默认展开所有树
            defaultExpandAll: {
                type: Boolean,
                default: function () {
                    return true
                }
            },
            listLoading: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
            handleToggle: {
                type: Function,
                default: function () {
                    return null
                }
            },
            handleCreate: {
                type: Function,
                default: function () {
                    return null
                }
            },
            handleUpdate: {
                type: Function,
                default: function () {
                    return null
                }
            },
            handleDelete: {
                type: Function,
                default: function () {
                    return null
                }
            },
            assoicateItem: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
            handleItem: {
                type: Function,
                default: function () {
                    return null
                }
            }
        },
        data() {
            return {
                associate: true
            }
        },
        computed: {
            // 格式化数据源
            data: function () {
                let me = this
                return TreeUtil.treeToArray(me.dataSource, null, null, me.defaultExpandAll);
            }
        },
        methods: {
            // 显示行
            showTr: function (row, index) {
                let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
                row._show = show
                return show ? '' : 'display:none;'
            },
            // 显示层级关系的空格和图标
            spaceIconShow(index) {
                if (index === 0 || index === 1) {
                    return true
                }
                return false
            },
            // 点击展开和关闭的时候，图标的切换
            toggleIconShow(index, record) {
                if (index === 0 && record.children && record.children.length > 0) {
                    return true
                }
                return false
            },
            onToggle(trIndex) {
                if (this.handleToggle) {
                    this.handleToggle(trIndex);
                }
            },
            onHandleAdd(data) {
                if (this.handleCreate) {
                    this.handleCreate(data);
                }
            },
            onHandleUpdate(data) {
                if (this.handleUpdate) {
                    this.handleUpdate(data);
                }
            },
            onHandleDelete(data) {
                if (this.handleDelete) {
                    this.handleDelete(data);
                }
            },
            onHandleAssoicate(data) {
                if (this.handleItem) {
                    this.handleItem(data);
                }
            }
        }
    }
</script>
<style scoped>
    .ms-tree-space {
        position: relative;
        top: 1px;
        display: inline-block;
        font-family: 'Glyphicons Halflings';
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        width: 18px;
        height: 14px;
    }
    .ms-tree-space::before {
        content: ""
    }
</style>
