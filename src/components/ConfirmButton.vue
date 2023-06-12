<template>
  <el-button :loading="loading" type="primary" @click="submit"><slot>操作</slot></el-button>
</template>

<script>
export default {
  emits: ['success'],
  props: {
    request: {
      type: Function
    },
    params: {
      default: ''
    },
    message: {
      default: '确认要进行该操作？',
      type: String
    },
    successMessage: {
      default: '操作成功!',
      type: String
    },
    title: {
      default: '请确认',
      type: String
    },
    confirmType: {
      default: 'warning',
      validate: (a) => {
        return ['', 'success', 'warning', 'info', 'error'].includes(a)
      }
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    submit () {
      this.$confirm(this.message, this.title, {
        type: this.confirmType
      }).then(() => {
        this.loading = true
        this.request(this.params).then(() => {
          this.$message.success(this.successMessage)
          this.loading = false
          this.$emit('success')
        }).catch(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>
