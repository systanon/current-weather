<script lang="ts" setup>
import { formatDate } from "../utils/formatDate"
import { WeatherData } from "../types/weather"

interface Props {
  data: WeatherData;
}
const props = defineProps<Props>();


function defineProps<T>() {
  throw new Error("Function not implemented.");
}


</script>
<template>
  <div>
    <article
      v-if="data && data.current"
      class="max-w-md w-96 rounded-lg shadow-lg p-4 flex bg-white text-black"
    >
      <div class="basis-1/4 text-left">
        <img :src="data.current.condition.icon" class="h-16 w-16" />
      </div>
      <div class="basis-3/4 text-left">
        <h1 class="text-3xl font-bold">
          {{ data.current.condition.text }}
          <span class="text-2xl block">{{ data.current.temp_c }}&#8451;</span>
        </h1>
        <p>{{ data.location.name }} {{ data.location.region }}</p>
        <p>Precipitation: {{ data.current.precip_mm }}mm</p>
        <p data-testid="localtime">{{ formatDate(data.location.localtime) }}</p>
        <p>
          Wind: {{ data.current.wind_kph }} kph
          <wind-direction :degrees="data.current.wind_degree" />
        </p>
      </div>
    </article>
    <div v-else>Loading...</div>
  </div>
</template>
