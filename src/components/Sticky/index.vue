<template>
    <div :style="{ height:height+'px',zIndex:zIndex,overflow:'scroll',top:stickyTop+'px',zIndex:zIndex,position:position}">
        <slot>
            <div>sticky</div>
        </slot>
    </div>
</template>
<script>
    export default {
        name: 'Sticky',
        props: {
            stickyTop: {
                type: Number,
                default: 0
            },
            zIndex: {
                type: Number,
                default: 1
            },
            className: {
                type: String
            },
            height: {
                type: String,
                default:'auto'
            }
        },
        data() {
            return {
                active: false,
                position: '',
                currentTop: '',
                width: undefined,
                height: undefined,
                child: null,
                stickyHeight: 0

            };
        },
        methods: {
            sticky() {
                if (this.active) {
                    return
                }
                this.position = 'fixed';
                this.active = true;
                this.width = this.width + 'px';
            },
            reset() {
                if (!this.active) {
                    return
                }
                this.position = '';
                this.width = 'auto'
                this.active = false
            },
            handleScroll() {
                this.width = this.$el.getBoundingClientRect().width;
                const offsetTop = this.$el.getBoundingClientRect().top;
                if (offsetTop <= this.stickyTop) {
                    this.sticky();
                    return
                }
                this.reset()
            }
        },
        mounted() {
//        this.height = this.$el.getBoundingClientRect().height;
//          console.log(this.height);
            window.addEventListener('scroll', this.handleScroll);
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll);
        }
    };
</script>
