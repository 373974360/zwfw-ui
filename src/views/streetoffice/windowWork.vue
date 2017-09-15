<template>
    <div class="info-table">
       <div class="leftSide"> <el-form  labelWidth="200px">

            <el-form-item label="办理事项选择">
                <el-select  placeholder="请选具体办理事项">
                    <el-option label="事项一" value="shanghai"></el-option>
                    <el-option label="事项二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input ></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input ></el-input>
            </el-form-item>
            <el-form-item label="身份证号">
                <el-input ></el-input>
            </el-form-item>
            <el-form-item label="家庭住址">
                <el-input ></el-input>
            </el-form-item>
            <el-form-item label="备注信息">
                <el-input type="textarea" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @="">确认收件办理</el-button>
            </el-form-item>

        </el-form></div>


        <div class="detail">

            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="所需材料" name="materials"><div class="materials">
                    <el-table>
                        <el-table-header >
                            <el-table-clumn prop="id" label="序号" >

                            </el-table-clumn>
                            <el-table-clumn prop="name" label="材料" >

                            </el-table-clumn>
                            <el-table-clumn prop="count" label="份数" >

                            </el-table-clumn>
                            <el-table-clumn prop="type" label="材料形式" >

                            </el-table-clumn>
                        </el-table-header>
                    </el-table>
                </div></el-tab-pane>
                <el-tab-pane label="事项信息" name="itemInfo">  <div class="itemInfo">
                    <el-table>
                        <el-form-item label="办理事项">
                            <el-input ></el-input>
                        </el-form-item>
                        <el-form-item label="办理主体">
                            <el-input ></el-input>
                        </el-form-item>
                        <el-form-item label="事项审批涉及部门">
                            <el-input ></el-input>
                        </el-form-item>
                        <el-form-item label="办件类型">
                            <el-input ></el-input>
                        </el-form-item>
                        <el-form-item label="承诺时限">
                            <el-input ></el-input>
                        </el-form-item>
                        <el-form-item label="法定时限">
                            <el-input ></el-input>
                        </el-form-item>
                        <el-form-item label="核准数量">
                            <el-input ></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <el-input ></el-input>
                        </el-form-item>
                        <el-form-item label="监督电话">
                            <el-input ></el-input>
                        </el-form-item>
                    </el-table>
                </div></el-tab-pane>
            </el-tabs>
        </div>


    </div>
</template>

<script>

</script>
<style>
 .info-table{
     margin-top: 50px;
     width: 1280px;
     min-height:500px;
     background-color: gray;
     margin-left: 105px;


 }
 .leftSide{
     float: left;



 }
 .detail{
     margin-left: 200px;
    float: left;
}

</style>