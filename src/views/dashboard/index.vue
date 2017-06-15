<template>
    <div class="dashboard-container">
        <component v-bind:is="currentRole"></component>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import EditorDashboard from './editor/index';
    import DefaultDashboard from './default/index';
    export default {
        name: 'dashboard',
        components: {EditorDashboard, DefaultDashboard},
        data() {
            return {
                currentRole: 'EditorDashboard'
            }
        },
        computed: {
            ...mapGetters([
                'name',
                'avatar',
                'account',
                'introduction',
                'permission'
            ])
        },
        created() {
            if (this.permission.indexOf('admin') >= 0) {
                return;
            }
            // const isEditor = this.permission.some(v => v.indexOf('editor') >= 0)
            // if (!isEditor) {
            //   this.currentRole = 'DefaultDashboard';
            // }
            this.currentRole = 'DefaultDashboard';
        }
    }
</script>
