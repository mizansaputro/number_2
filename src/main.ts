import { createApp } from "vue";
import { VueQueryPlugin, VueQueryPluginOptions } from "@tanstack/vue-query";
import App from "./App.vue";
import "./style.css";

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
};
const app = createApp(App);

app.use(VueQueryPlugin, vueQueryPluginOptions);
app.mount("#app");
