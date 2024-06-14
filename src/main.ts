import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { weather } from "./application";
import { getGeolocation } from './utils/geolocation'

const apiKey = import.meta.env.VITE_APP_WEATHER_API_KEY;

const params = {
  url: 'current.json',
  apiKey,
  lang: 'nl'
}

getGeolocation(weather, params).then((res) => {
  createApp(App).mount('#app')
  console.log("res", res)
})


// const app = createApp(App, {
//   title: 'My Awesome App'
// });

// createApp(App).mount('#app')
