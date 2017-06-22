<template>
    <div class="app-container calendar-list-container">
        <tree-grid :columns="columns" :tree-structure="true" :data-source="list" :list-loading="listLoading"
                   :handle-toggle="handleToggle" :handle-create="handleCreate"
                   :handle-update="handleUpdate" :handle-delete="handleDelete"></tree-grid>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form class="small-space" :model="temp" label-position="left" label-width="70px"
                     style='width: 80%; margin-left:10%;'>
                <el-form-item label="上级菜单">

                    <el-input v-model="temp.parentId"></el-input>
                </el-form-item>
                <el-form-item label="菜单名称">
                    <el-input v-model="temp.menuName"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型">
                    <el-input v-model="temp.menuType"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标">
                    <el-input v-model="temp.iconcls"></el-input>
                </el-form-item>
                <el-form-item label="请求地址">
                    <el-input v-model="temp.request"></el-input>
                </el-form-item>
                <el-form-item label="权限标识">
                    <el-input v-model="temp.permission"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="temp.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeGrid from 'components/TreeGrid'
    import app from 'store/modules/app';
    import {getMenuList} from 'api/org/menu';
    import {parseTime} from 'utils';
    export default {
        name: 'menu_table',
        data () {
            return {
                itemList: [],
                listLoading: true,
                temp: {
                    id: undefined,
                    menuName: 0,
                    menuType: 0,
                    iconcls: '',
                    parentId: 0,
                    request: '',
                    expand: 0,
                    sortNo: 0,
                    permission: '',
                    status: 1
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '添加'
                },
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'id'
                    },
                    {
                        text: '菜单名称',
                        dataIndex: 'menuName',
                        editAble: true
                    },
                    {
                        text: '菜单类型',
                        dataIndex: 'menuType',
                        enums:'MenuType'
                    },
                    {
                        text: '请求地址',
                        dataIndex: 'request'
                    }
                    ,
                    {
                        text: '权限标识',
                        dataIndex: 'permission'
                    }
                ]
            }
        },
        computed:{
            list: function(){
                return this.itemList;
            }
        },
        components: {
            TreeGrid
        },
        methods: {
            getList() {
                this.listLoading = true;
                getMenuList(this.listQuery).then(response => {
                    this.itemList = response.data;
                    this.listLoading = false;
                })
            },
            handleToggle(row){
                row._expanded = !row._expanded;
//                this.listQuery.parentId = row.id;
//                let children = [];
//                getMenuList(this.listQuery).then(response => {
//                    children = response.data.list;
//                    if(children.length > 0){
//                        row.children = children;
//                    }else{
//                        row.isLeaf = 0;
//                    }
//                    this.listLoading = false;
//                })
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.temp = Object.assign({}, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
            },
            create() {
                this.temp.id = parseInt(Math.random() * 100) + 1024;
                this.temp.timestamp = +new Date();
                this.temp.author = '原创作者';
                this.list.unshift(this.temp);
                this.dialogFormVisible = false;
                this.$message.success('创建成功');
            },
            update() {
                this.temp.timestamp = +this.temp.timestamp;
                for (const v of this.list) {
                    if (v.id === this.temp.id) {
                        const index = this.list.indexOf(v);
                        this.list.splice(index, 1, this.temp);
                        break;
                    }
                }
                this.dialogFormVisible = false;
                this.$message.success('更新成功');
            },
            resetTemp() {
                this.temp = {
                    id: undefined,
                    importance: 0,
                    remark: '',
                    timestamp: 0,
                    title: '',
                    status: 'published',
                    type: ''
                };
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>