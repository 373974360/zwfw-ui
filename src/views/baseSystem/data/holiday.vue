<template>
    <div class="app-container calendar-list-container">
        <div style="width:85%;margin: 0 auto;">
            <div class="filter-container">
                <el-date-picker class="filter-item" v-model="year" align="right" type="year" placeholder="选择年份"
                                @change="handlerChange"
                                style="width:252px">
                </el-date-picker>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" v-waves icon="circle-check"
                           @click="save">保存
                </el-button>
            </div>
            <div v-show="!listLoading">
                <date-picker v-model="value" :list="list" :year="year" :month="1" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="2" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="3" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="4" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="5" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="6" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="7" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="8" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="9" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="10" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="11" :weekends="true"
                             :isShow="true"></date-picker>
                <date-picker v-model="value" :list="list" :year="year" :month="12" :weekends="true"
                             :isShow="true"></date-picker>
            </div>
        </div>
    </div>
</template>
<script>
    import DatePicker from 'components/DatePicker';
    import {createOrUpdateDate, getHoliday} from 'api/baseSystem/data/holiday';
    export default {
        name: 'date',
        data() {
            return {
                year: new Date(),
                value: [],
                list: null,
                listLoading: false
            }
        },
        components: {
            DatePicker
        },
        methods: {
            handlerChange() {
                this.getHoliday();
                this.value = [];
            },
            getHoliday() {
                this.listLoading = true;
                const year = {
                    year: this.year.getFullYear()
                }
                getHoliday(year).then(response => {
                    if (response.httpCode === 200) {
                        this.list = response.data;
                    } else {
                        this.$message.error(response.msg);
                    }
                    this.listLoading = false;
                })
            },
            save() {
                const dataParam = {
                    year: this.year.getFullYear(),
                    value: this.value
                }
                createOrUpdateDate(dataParam).then(response => {
                    if (response.httpCode === 200) {
                        this.$message.success('保存成功！');
                    } else {
                        this.$message.error('保存失败！');
                    }
                })
            }
        },
        created() {
            this.getHoliday();
        }
    }
</script>
