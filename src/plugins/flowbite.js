import { initFlowbite } from 'flowbite';

export default {
  install(app) {
    app.mixin({
      mounted() {
        initFlowbite();
      }
    });
  }
};