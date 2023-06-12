<template>
  <div class="s404">
    <el-empty description="Sorry, Request error">
      <p>抱歉，请求错误</p>
      <router-link to="/">
        <el-button type="primary"> <i class="iconfont icon-left"></i> 回到首页</el-button>
      </router-link>
    </el-empty>
    
  </div>
</template>

<style>
  .s404 {
    text-align: center;
    padding-top: 100px;
  }
  .s404 p {
    font-size: 18px;
    color:var(--el-text-color-secondary);
  }
</style>
