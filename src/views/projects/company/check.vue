<template>
  <div>
    <template v-if="checking"><i class="el-icon-loading"></i> 正在检查</template>
    <template v-else>
      <i class="iconfont icon-success" title="正常" v-if="state"></i>
      <i class="iconfont icon-warning" title="访问异常" v-else></i>
    </template>
  </div>
</template>
<style scoped>
.icon-warning,
.icon-success {
  font-size: 24px;
}
.icon-success {
  color: #13ce66;
}
.icon-warning {
  color: #ffb81f;
}
</style>
<script>
import { checkCompanySld } from '@/request/modules/company'

export default {
  props: ['id'],
  data () {
    return {
      state: true,
      checking: false
    }
  },
  methods: {
    checkCompanySld () {
      this.checking = true
      checkCompanySld({ id: this.id }).then(resp => {
        this.state = resp.state
        this.checking = false
      }).catch(() => {
        this.checking = false
      })
    }
  },
  mounted () {
    this.checkCompanySld()
  }
}
</script>
