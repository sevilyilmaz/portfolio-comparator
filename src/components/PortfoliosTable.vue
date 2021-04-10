<template>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th
          v-for="title in portfolioTable.titles"
          :key="title"
        >
          {{ title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(values, index) in portfolioTable.values"
        :key="`year-row-${index}`"
      >
        <td
          v-for="value in values"
          :key="`column-${value}`"
        >
          {{ value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs, PropType } from 'vue';
import { Portfolio } from '../types';
import { getDisplayValue } from '../composables/use-display-value';

export default defineComponent({
  props: {
    portfolios: {
      type: Array as PropType<Portfolio[]>,
      required: true,
    },
  },
  setup(props) {
    const { portfolios } = toRefs(props);

    const portfolioTable = computed(() => {
      return portfolios.value.reduce(
        (acc, curr, idx) => {
          acc.titles.push(curr.name);

          if (idx === 0) {
            acc.values = curr.values.map((v, i) => {
              // Adds years to the first row. The last value is Exit
              const year = i <= curr.values.length - 2 ? i + 1 : 'Exit';
              return [year, getDisplayValue(v)];
            });
          } else {
            acc.values = acc.values.map((v, i) => {
              return [...v, getDisplayValue(curr.values[i])];
            });
          }

          return acc;
        },
        {
          titles: [''],
          values: [] as Array<(string | number)[]>,
        }
      );
    });

    return {
      portfolioTable,
    };
  },
});
</script>
