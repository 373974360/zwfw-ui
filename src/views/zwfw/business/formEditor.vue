<template>
    <div class="app-container calendar-list-container">
        <div style="clear:both">
            <div class="formFieldList bg-purple">
                <div data-type="input" draggable="true" @dragstart="drag($event)" @selectstart="selectstart">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-input"></use>
                    </svg>
                    单行文本输入
                </div>
                <div data-type="textarea" draggable="true" @dragstart="drag($event)" @selectstart="selectstart">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-textarea"></use>
                    </svg>
                    多行文本输入
                </div>
                <div data-type="select" draggable="true" @dragstart="drag($event)" @selectstart="selectstart">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-select"></use>
                    </svg>
                    下拉框输入
                </div>
                <div data-type="radiochecked" draggable="true" @dragstart="drag($event)" @selectstart="selectstart">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-radiochecked"></use>
                    </svg>
                    单选输入
                </div>
                <div data-type="date" draggable="true" @dragstart="drag($event)" @selectstart="selectstart">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-date"></use>
                    </svg>
                    日期
                </div>
                <div data-type="baotu" draggable="true" @dragstart="drag($event)" @selectstart="selectstart">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-baotu"></use>
                    </svg>
                    插入图片
                </div>
                <div data-type="text1" draggable="true" @dragstart="drag($event)" @selectstart="selectstart">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-text1"></use>
                    </svg>
                    插入文本
                </div>
            </div>
            <div class="formEditingPanel">
                <textarea ref="editTextArea"></textarea>
            </div>
        </div>
    </div>
</template>
<style>
    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }

    .formFieldList {
        list-style: none;
        margin: 0;
        padding: 0;
        user-select: none;
    }

    .formFieldList > div {
        display:inline-block;
        box-sizing:border-box;
        border: solid 1px #000;
        padding: 0px 4px;
        user-select: none;
        cursor:move;
    }

    .formEditingPanel {
        /*background: #333333;*/
        height: 1000px;
    }

    /*.formFieldTable{*/
        /*width:100%;*/
    /*}*/
    /*.formFieldTable th,td{*/
        /*border:solid 1px #000;*/
        /*line-height:1.5em;*/
    /*}*/

</style>
<script>
    import ElIcon from "element-ui/packages/icon/src/icon.vue";
    import draggable from 'vuedraggable';

    export default {
        data(){
            return {
                content:''
            }
        },
        components: {draggable},
        name: 'formEditor',
        methods: {

            drag(ev) {
                //开始拖动的时候，设置一个内容到传输对象中
                ev.dataTransfer.setData("type", ev.target.dataset.type);
            },

            selectstart() {
                //防止框选内容
                return false;
            }
        },
        mounted:function () {
            tinymce.init({
                selector: 'textarea',
                content_css: [],
                plugins: 'table autoresize code contextmenu nonbreaking paste visualchars',
                menubar: false,
                toolbar: 'newdocument | table tablerowprops tablecellprops tablemergecells | alignnone alignright bold styleselect | nonbreaking visualchars | preparetable code',
                table_toolbar: 'tablerowprops tablecellprops tablemergecells | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol', // below every table
                contextmenu: 'tableprops cell row column', // appears on right click
                autoresize_max_height: 600,
                formats: {
                    alignright: { selector: 'td,th', classes: 'numeric' },
                },
                style_formats: [
                    { title: 'Total row', selector: 'tr', classes: 'total' },
                    { title: 'Subtotal row', selector: 'tr', classes: 'subtotal' },
                    { title: 'Section heading row', selector: 'tr', classes: 'section-heading' },
                    { title: 'Visually hidden text', inline: 'span', classes: 'visuallyhidden' },
                ],
                // only allow table elements, plus a few more useful inline elements
                // br = if added, TinyMCE adds br's all over the place (but they don't get through to the source code to be copied), causing issues with marking of empty header cells
                // class: source-tableeditor = in case we need to do something in slimmer
                valid_elements: 'table[class:financial-data source-tableeditor|id],caption,col,colgroup[span],thead,tbody,tfoot,tr[class],td[scope|colspan|rowspan|class],th[scope|colspan|rowspan|class],strong,span[class],abbr[title],br',
                forced_root_block: false,
                table_grid: false,
                table_advtab: false,
                table_cell_advtab: false,
                table_row_advtab: false,
                init_instance_callback: function (editor) {
                    formEditor.dom.doc.addEventListener('dragover',function (ev) {
                        // prevent default to allow drop
                        ev.preventDefault();
                    });
                    formEditor.dom.doc.addEventListener('drop',function (ev) {
                        // prevent default action (open as link for some elements)
                        ev.preventDefault();
                        var type = ev.dataTransfer.getData("type");
                        var target = ev.target;
                        target.innerHTML = type;
                    });
                    formEditor.on('click', function (e) {
                        console.log('Element clicked:', e.target);
                    });
                }
            });
        }
    }
</script>
