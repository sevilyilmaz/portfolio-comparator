import { createApp } from 'vue';
import App from './App.vue';
import { stateSymbol, createState } from './composables/use-store';

const app = createApp(App);
app.provide(stateSymbol, createState());
app.mount('#app');
