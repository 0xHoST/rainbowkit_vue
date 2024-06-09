import { defineComponent, h } from "vue";

export const DropdownIcon = defineComponent({
    setup() {
        return () => {
            return h('svg', {
                'aria-hidden': true,
                fill: 'none',
                height: '7',
                width: '14',
                xmlns: "http://www.w3.org/2000/svg",
                innerHTML: `
                        <title>Dropdown</title>
                        <path d="M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001" 
                            stroke="currentColor",
                            strokeLinecap="round",
                            strokeLinejoin="round",
                            strokeWidth="2.5" />
                    `
            })
        }
    },
});