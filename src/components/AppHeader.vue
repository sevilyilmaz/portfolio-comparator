<template>
  <header class="bg-dark text-light">
    <div class="container py-3 mb-3">
      <div class="row">
        <div class="col-9">
          <h4>Simple Portfolio Comparator</h4>
        </div>
        <div class="col-3 text-end">
          <a
            href="https://github.com/sevilyilmaz/portfolio-comparator"
            target="_blank"
            class="btn btn-light text-decoration-none"
          >
            View on Github
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppHeader',
});
</script>
