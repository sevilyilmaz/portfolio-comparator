<template>
  <h4>Securities</h4>
  <p>Change the values in the table to adjust your portfolio</p>

  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Security</th>
          <th>TER/TD (%)</th>
          <th>Annual return (%)</th>
          <!-- <th>Dividend</th> -->
          <th>Fixed transaction cost</th>
          <th>Variable transaction cost (%)</th>
          <th>Exit cost (%)</th>
          <th>Allocation (%)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(security, index) in securities" :key="security.id">
          <td>
            <input v-model="security.name" type="text" class="form-control" />
          </td>
          <td>
            <input
              v-model.number="security.tertd"
              type="text"
              class="form-control"
            />
          </td>
          <td>
            <input
              v-model.number="security.annualReturn"
              type="text"
              class="form-control"
            />
          </td>
          <!-- <td>
            <input
              v-model.number="security.dividend"
              type="text"
              class="form-control"
            >
          </td> -->
          <td>
            <input
              v-model.number="security.fixedTransactionCost"
              type="text"
              class="form-control"
            />
          </td>
          <td>
            <input
              v-model.number="security.variableTransactionCost"
              type="text"
              class="form-control"
            />
          </td>
          <td>
            <input
              v-model.number="security.exitCost"
              type="text"
              class="form-control"
            />
          </td>
          <td>
            <input
              v-model.number="security.allocation"
              type="text"
              class="form-control"
            />
          </td>
          <td>
            <button
              type="button"
              class="btn btn-danger"
              @click="removeSecurity(Number(index))"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, toRefs } from 'vue';
import type { Security } from '../types';

export default defineComponent({
  props: {
    securities: {
      type: Array as PropType<Security[]>,
      required: true,
    },
  },
  setup(props) {
    const { securities } = toRefs(props);

    function removeSecurity(index: number): void {
      securities.value.splice(index, 1);
    }

    return {
      removeSecurity,
    };
  },
});
</script>
