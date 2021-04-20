<template>
  <div class="accordion-item">
    <h2
      class="accordion-header"
    >
      <button
        :class="headerButtonClasses"
        type="button"
        @click="toggleActive"
      >
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
            >
          </div>

          <div class="col-sm-4 text-end">
            <input
              type="button"
              class="btn btn-danger"
              value="Remove Broker"
              @click="removeBroker"
            >
          </div>
        </div>

        <SecurityList
          v-if="internalSecurities.length"
          :securities="internalSecurities"
        />

        <button
          type="submit"
          class="btn btn-primary"
          @click="addSecurity"
        >
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
  PropType,
  ref,
  SetupContext,
  toRefs,
} from 'vue';
import SecurityList from './SecurityList.vue';
import { useId } from '../composables/use-id';
import { substractWealthTax } from '../composables/use-wealth-tax';
import { substractPercentage } from '../composables/use-substract-percentage';
import { substractServiceFee } from '../composables/use-service-fee';
import {
  addSecurityValues,
  substractSecurityExitCost,
} from '../composables/use-securities';
import { Security } from '../types';
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
    deposit: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    initialDeposit: {
      type: Number,
      required: true,
    },
    includeWealthTax: {
      type: Boolean,
      required: true,
    },
    fiscalStatus: {
      type: Number,
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
    const {
      id,
      name,
      serviceFee,
      securities,
      duration,
      deposit,
      initialDeposit,
      includeWealthTax,
      fiscalStatus,
    } = toRefs(props);

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
        return serviceFee.value;
      },
      set(value) {
        emit('update:serviceFee', value);
      },
    });

    const internalSecurities = computed<Security[]>({
      get() {
        return securities.value;
      },
      set(value) {
        emit('update:securities', value);
      },
    });

    const hasServiceFee = computed(() => {
      return internalServiceFee.value;
    });

    const portfolioTable = computed(() => {
      const arr = new Array(duration.value).fill(0).map((_, i) => i);

      const accumulation = arr.reduce((acc, curr) => {
        let currentAccumulation = 0;
        let yearlyDeposit = deposit.value * 12;

        if (curr === 0) {
          currentAccumulation = initialDeposit.value + yearlyDeposit;
        } else {
          currentAccumulation = yearlyDeposit + acc[curr - 1];
        }

        if (hasServiceFee.value) {
          currentAccumulation = substractServiceFee(
            currentAccumulation,
            internalServiceFee.value
          );
        }

        currentAccumulation = addSecurityValues(
          currentAccumulation,
          internalSecurities.value
        );

        if (includeWealthTax.value) {
          currentAccumulation = substractWealthTax(
            currentAccumulation,
            fiscalStatus.value
          );
        }

        acc.push(currentAccumulation);

        return acc;
      }, [] as number[]);

      const lastItem = accumulation[accumulation.length - 1];
      const exitValue = substractSecurityExitCost(
        lastItem,
        internalSecurities.value
      );

      accumulation.push(exitValue);

      return accumulation;
    });

    emit('portfolioCreated', {
      id: id.value,
      name: name.value,
      values: portfolioTable,
    });

    onUpdated(() => {
      emit('portfolioUpdated', {
        id: id.value,
        name: name.value,
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
      emit('removeBroker', id.value);
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
