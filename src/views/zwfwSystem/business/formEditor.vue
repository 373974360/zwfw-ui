<template>
    <div class="app-container calendar-list-container">

    </div>
</template>
<style>

</style>
<script>
    import draggable from 'vuedraggable';

    export default {

        data() {
            return {
                content: ''
            }
        },
        components: {draggable},
        name: 'formEditor',
        methods: {

            drag(ev) {
                // 开始拖动的时候，设置一个内容到传输对象中
                ev.dataTransfer.setData('type', ev.target.dataset.type);
            },

            selectstart() {
                // 防止框选内容
                return false;
            }
        },
        mounted() {

        }
    }
</script>
