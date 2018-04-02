<template>
    <div class="app-container">
        <div class="controls">
            <input type="checkbox" v-model="layoutManager.editMode" id="edit-mode" />
            实时受理数据可视化
        </div>
        <grid-layout :layout-manager="layoutManager" >
            <grid-item ref="jinri" :item="jinriconfig">
                fdvfvgfgvgfvgfvfvf
            </grid-item>
            <grid-item ref="jinri2" :item="jinriconfig2">
                fdvfvgfgvgfvgfvfvf
            </grid-item>
            <grid-item ref="jinri3" :item="jinriconfig3">
                fdvfvgfgvgfvgfvfvf
            </grid-item>
            <grid-item ref="jinri4" :item="jinriconfig4">
                fdvfvgfgvgfvgfvfvf
            </grid-item>
            <grid-item ref="jinri5" :item="jinriconfig5">
                fdvfvgfgvgfvgfvfvf
            </grid-item>
            <grid-item ref="jinri6" :item="jinriconfig6">
                fdvfvgfgvgfvgfvfvf
            </grid-item>
            <grid-item ref="jinri7" :item="jinriconfig7">
                fdvfvgfgvgfvgfvfvf
            </grid-item>
            <grid-item ref="jinri8" :item="jinriconfig8">
                fdvfvgfgvgfvgfvfvf
            </grid-item>
            <grid-item ref="jinri9" :item="jinriconfig9">
                fdvfvgfgvgfvgfvfvf
            </grid-item>
        </grid-layout>
    </div>
</template>

<script>
    // import LayoutManager from '../../../components/GridLayout/layout_manager';
    import {LayoutManager,gridLayout,gridItem} from './dashboard';

    export default {
        name: 'app',
        components: {
            gridLayout,
            gridItem
        },
        data() {
            return {
                items: [],
                layoutManager: null,
                jinriconfig: {
                    id: Date.now(),
                    x: 0,
                    y: 0,
                    w: 5,
                    h: 4
                },
                jinriconfig2:{
                    id: '123',
                    x: 5,
                    y: 0,
                    w: 5,
                    h: 2
                },
                jinriconfig3:{
                    id: '1234',
                    x: 5,
                    y: 2,
                    w: 5,
                    h: 2
                },
                jinriconfig4:{
                    id: '12345',
                    x: 0,
                    y: 4,
                    w: 10,
                    h: 8
                },
                jinriconfig5:{
                    id: '123456',
                    x: 10,
                    y: 0,
                    w: 10,
                    h: 3
                },
                jinriconfig6:{
                    id: '123457',
                    x: 10,
                    y: 3,
                    w: 10,
                    h: 3
                },
                jinriconfig7:{
                    id: '123458',
                    x: 10,
                    y: 6,
                    w: 5,
                    h: 6
                },
                jinriconfig8:{
                    id: '123459',
                    x: 15,
                    y: 6,
                    w: 5,
                    h: 6
                },
                jinriconfig9:{
                    id: '1234510',
                    x: 20,
                    y: 0,
                    w: 4,
                    h: 12
                }
            }
        },
        methods: {
            changes(){
                console.log(this.layoutManager.editMode)
            }
        },
        created() {
            this.layoutManager = new LayoutManager(this.items, {
                cols: 24,
                minW: 3,
                minH: 2,
                hideOnWork: true
            });
        }
    }
</script>

<style scoped lang="scss">
    .controls {
        margin: 15px;
    }
</style>
