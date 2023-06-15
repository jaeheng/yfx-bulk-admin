<template>
    <span>
        <template v-if="isPaid === 'T'">已付费 ({{ dueDate }}到期)</template>
        <template v-else>未付费</template>
    </span>
</template>
<script>
export default {
    props: {
        isPaid: {
            default: 'F',
            validate: (a) => {
                return ['T', 'F'].includes(a)
            }
        },
        dueDate: {
            default: '',
            type: String
        }
    }
}
</script>
