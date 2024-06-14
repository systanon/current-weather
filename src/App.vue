<template>
  <WeatherReport :data="weather.data"/>
</template>

<script setup lang="ts">
import { weather } from './application/index'
import WeatherReport from './components/WeatherReport.vue'

</script>

