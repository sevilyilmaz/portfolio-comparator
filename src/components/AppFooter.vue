<template>
  <div class="bg-dark text-light mt-4">
    <footer class="container py-3">
      <h5>Disclaimer</h5>
      <p>
        This application does not give any financial advice. You can lose your money by investing. The calculations in this application are focused on investing in the Netherlands and might or might not be fully accurate.
      </p>

      <p>
        The <a
          href="https://github.com/sevilyilmaz/portfolio-comparator"
          target="_blank"
          class="link-light"
        >source code</a> is on Github.
      </p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppFooter',
});
</script>
