<template>
  <div class="colorbar">
    <div v-for="(item, index) in colors" :style="{ background: item, width: sizeFmt, height: sizeFmt }" :key="index"></div>
  </div>
</template>
<style lang="scss">
.colorbar {
  display: inline-block;
  vertical-align: middle;
  div {
    display: inline-block;
  }
}
</style>
<script>
export default {
  props: ['colors', 'size'],
  computed: {
    sizeFmt () {
      let size = '30px'
      const sizeHash = {
        mini: '20px',
        medium: '40px',
        small: '30px',
        large: '50px'
      }
      if (this.size) {
        size = sizeHash[this.size]
      }
      return size
    }
  }
}
</script>
