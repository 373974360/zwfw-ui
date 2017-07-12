<template>
    <div class="app-container calendar-list-container">
        <div style="width:85%;margin: 0 auto;">
            <div class="filter-container">
                <el-select class="filter-item" v-model="year" placeholder="选择年份">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button class="filter-item" type="primary" v-waves icon="circle-check">保存</el-button>
            </div>
            <date-picker v-model="value" :year="year" :month="1" :weekends="true" :isShow="true" ></date-picker>
            <date-picker v-model="value" :year="year" :month="2" :weekends="true" :isShow="true" ></date-picker>
            <date-picker v-model="value" :year="year" :month="3" :weekends="true" :isShow="true" ></date-picker>
            <date-picker v-model="value" :year="year" :month="4" :weekends="true" :isShow="true" ></date-picker>
            <date-picker v-model="value" :year="year" :month="5" :weekends="true" :isShow="true" ></date-picker>
            <date-picker v-model="value" :year="year" :month="6" :weekends="true" :isShow="true" ></date-picker>
            <date-picker v-model="value" :year="year" :month="7" :weekends="true" :isShow="true" ></date-picker>
            <date-picker v-model="value" :year="year" :month="8" :weekends="true" :isShow="true" ></date-picker>
            <date-picker v-model="value" :year="year" :month="9" :weekends="true" :isShow="true" ></date-picker>
            <date-picker v-model="value" :year="year" :month="10" :weekends="true" :isShow="true"></date-picker>
            <date-picker v-model="value" :year="year" :month="11" :weekends="true" :isShow="true"></date-picker>
            <date-picker v-model="value" :year="year" :month="12" :weekends="true" :isShow="true"></date-picker>
        </div>
    </div>
</template>
<script>
    import DatePicker from 'components/DatePicker';
    import moment from 'moment';
    export default {
        name: 'date',
        data() {
            return {
                year: moment().year(),
                value: []
            }
        },
        watch: {
            value(){
                console.dir(this.value)
            }
        },
        computed: {
            options: function () {
                const year = moment().year();
                return [{label: year, value: year}, {label: year + 1, value: year + 1}];
            },
        },
        components: {
            DatePicker
        }
    }
</script>
