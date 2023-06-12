<template>
  <div>
    <span class="dot" :class="'state-' + state"></span> <slot>{{ stateData.name }}</slot>
  </div>
</template>

<style lang="scss" scoped>
.dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  vertical-align: middle;
  background: #ccc;
  border-radius: 3px;
}
// -2待导入-1排队中 0开始导入 1导入成功 2导入失败 -3 待激活（脚本导入数据成功改为导入成功，页面可登录）
.state--2,
.state--1 {
  background: #ccc;
}
.state-1 {
  background: #67c23a;
}
.state-2 {
  background: #f10505;
}
.state-0,
.state--3,
.state-3 {
  background: #f5b42a;
}
</style>

<script setup>
import {computed} from "vue";

const props = defineProps({
  state: {
    // -2待导入-1排队中 0开始导入 1导入成功 2导入失败 -3 待激活
    default: '-2'
  }
})

const dict = {
  "-2": {
    name: "待导入",
    icon: "",
    type: "info"
  },
  "-1": {
    name: "排队中",
    icon: "",
    type: "info"
  },
  "0": {
    name: "正在导入",
    icon: "",
    type: "info"
  },
  "1": {
    name: "成功",
    icon: "",
    type: "info"
  },
  "2": {
    name: "失败",
    icon: "",
    type: "info"
  },
  "-3": {
    name: "待激活",
    icon: "",
    type: "info"
  }
}

const stateData = computed(() => {
  return dict[props.state]
})

</script>
