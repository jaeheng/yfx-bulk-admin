<template>
  <tool-list :platform="SINGLE_CELL_DATA"></tool-list>
</template>
<script setup>
import ToolList from './main.vue'
import {SINGLE_CELL_DATA} from "@/config/app";
</script>
