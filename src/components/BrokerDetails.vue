<template>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button :class="headerButtonClasses" type="button" @click="toggleActive">
        {{ name }}
      </button>
    </h2>

    <div :class="contentClasses">
      <div class="accordion-body">
        <div class="row mb-3">
          <label class="col-2 col-form-label">Service Fee:</label>
          <div class="col-sm-6">
            <input
              v-model="internalServiceFee"
              type="text"
              class="form-control"
            />
          </div>

          <div class="col-sm-4 text-end">
            <input
              type="button"
              class="btn btn-danger"
              value="Remove Broker"
              @click="removeBroker"
            />
          </div>
        </div>

        <SecurityList
          v-if="internalSecurities.length"
          :securities="internalSecurities"
        />

        <button type="submit" class="btn btn-primary" @click="addSecurity">
          Add Security
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onUpdated,
  ref,
  type PropType,
  type SetupContext,
} from 'vue';
import SecurityList from './SecurityList.vue';
import { useId } from '../composables/use-id';
import { useState } from '../composables/use-store';
import { subtractWealthTax } from '../composables/use-wealth-tax';
import { subtractServiceFee } from '../composables/use-service-fee';
import {
  addSecurityValues,
  subtractSecurityExitCost,
} from '../composables/use-securities';
import type { Security } from '../types';
type EmitOption =
  | 'portfolioUpdated'
  | 'portfolioCreated'
  | 'update:serviceFee'
  | 'update:securities'
  | 'removeBroker';

export default defineComponent({
  name: 'BrokerDetails',

  components: { SecurityList },

  props: {
    serviceFee: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    securities: {
      type: Array as PropType<Security[]>,
      default: () => [],
    },
  },

  emits: [
    'portfolioUpdated',
    'portfolioCreated',
    'removeBroker',
    'update:serviceFee',
    'update:securities',
  ],

  setup(props, { emit }: SetupContext<EmitOption[]>) {
    const state = useState();
    const active = ref(false);

    const contentClasses = computed(() => ({
      'accordion-collapse': true,
      collapse: true,
      show: active.value,
    }));

    const headerButtonClasses = computed(() => ({
      'accordion-button': true,
      collapsed: !active.value,
    }));

    function toggleActive() {
      active.value = !active.value;
    }

    const internalServiceFee = computed<string>({
      get() {
        return props.serviceFee;
      },
      set(value) {
        emit('update:serviceFee', value);
      },
    });

    const internalSecurities = computed<Security[]>({
      get() {
        return props.securities;
      },
      set(value) {
        emit('update:securities', value);
      },
    });

    const hasServiceFee = computed(() => {
      return internalServiceFee.value;
    });

    const portfolioTable = computed(() => {
      const arr = new Array(state.duration).fill(0).map((_, i) => i);

      const accumulation = arr.reduce((acc, curr) => {
        let currentAccumulation = 0;
        let yearlyDeposit = state.deposit * 12;

        if (curr === 0) {
          currentAccumulation = state.initialDeposit + yearlyDeposit;
        } else {
          currentAccumulation = yearlyDeposit + acc[curr - 1];
        }

        if (hasServiceFee.value) {
          currentAccumulation = subtractServiceFee(
            currentAccumulation,
            internalServiceFee.value
          );
        }

        currentAccumulation = addSecurityValues(
          currentAccumulation,
          internalSecurities.value
        );

        if (state.includeWealthTax) {
          currentAccumulation = subtractWealthTax(
            currentAccumulation,
            state.fiscalStatus
          );
        }

        acc.push(currentAccumulation);

        return acc;
      }, [] as number[]);

      const lastItem = accumulation[accumulation.length - 1];
      const exitValue = subtractSecurityExitCost(
        lastItem,
        internalSecurities.value
      );

      accumulation.push(exitValue);

      return accumulation;
    });

    emit('portfolioCreated', {
      id: props.id,
      name: props.name,
      values: portfolioTable,
    });

    onUpdated(() => {
      emit('portfolioUpdated', {
        id: props.id,
        name: props.name,
        values: portfolioTable,
      });
    });

    function addSecurity() {
      internalSecurities.value.push({
        id: useId(),
        name: '',
        tertd: 0,
        dividend: 0,
        annualReturn: 0,
        fixedTransactionCost: 0,
        variableTransactionCost: 0,
        exitCost: 0,
        allocation: 0,
      });
    }

    function removeBroker() {
      emit('removeBroker', props.id);
    }

    return {
      contentClasses,
      headerButtonClasses,
      toggleActive,
      internalServiceFee,
      internalSecurities,
      portfolioTable,
      addSecurity,
      removeBroker,
    };
  },
});
</script>
