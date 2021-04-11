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
import { getWealthTax } from '../composables/use-wealth-tax';
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

    function getServiceFees() {
      let brackets = internalServiceFee.value.split(';');
      if (brackets.length === 1) {
        return Number(internalServiceFee.value);
      }

      return brackets
        .reduce((acc, curr) => {
          const [amount, fee] = curr.split(':');

          acc.push({
            amount: Number(amount),
            fee: Number(fee),
          });

          return acc;
        }, [] as { amount: number; fee: number }[])
        .sort((a, b) => b.amount - a.amount); // in reverse order
    }

    function substractPercentage(amount: number, percentage: number) {
      return amount - (amount * percentage) / 100;
    }

    function substractServiceFee(amount: number): number {
      if (!hasServiceFee.value) {
        return amount;
      }

      const serviceFee = getServiceFees();

      if (Array.isArray(serviceFee)) {
        const currentBracket = serviceFee.find(
          (bracket) => amount > bracket.amount
        ) || { fee: 0 };

        return substractPercentage(amount, currentBracket.fee);
      }

      return substractPercentage(amount, serviceFee);
    }

    function substractSecurityExitCost(amount: number): number {
      const exitCost = internalSecurities.value.reduce((acc, curr) => {
        acc += (curr.exitCost * curr.allocation) / 100;
        return acc;
      }, 0);

      return substractPercentage(amount, exitCost);
    }

    function addSecurityValues(amount: number): number {
      const {
        variableCost,
        fixedCost,
        annualReturn,
      } = internalSecurities.value.reduce(
        (acc, curr) => {
          acc.variableCost +=
            ((curr.variableTransactionCost + curr.tertd) * curr.allocation) /
            100;
          acc.fixedCost += curr.fixedTransactionCost * 12; // monthly
          acc.annualReturn += curr.annualReturn * (curr.allocation / 100);

          return acc;
        },
        {
          variableCost: 0,
          fixedCost: 0,
          annualReturn: 0,
        }
      );

      const costs = (amount * variableCost) / 100 + fixedCost;
      const growth = (amount * annualReturn) / 100;

      return amount + growth - costs;
    }

    function substractWealthTax(amount: number): number {
      const amountPerPerson = amount / fiscalStatus.value;
      const tax = getWealthTax(amountPerPerson) * fiscalStatus.value;
      return amount - tax;
    }

    const portfolioTable = computed(() => {
      const arr = [...Array(duration.value).keys()];

      const accumulation = arr.reduce((acc, curr) => {
        let currentAccumulation = 0;
        let yearlyDeposit = deposit.value * 12;

        if (curr === 0) {
          currentAccumulation = initialDeposit.value + yearlyDeposit;
        } else {
          currentAccumulation = yearlyDeposit + acc[curr - 1];
        }

        if (hasServiceFee.value) {
          currentAccumulation = substractServiceFee(currentAccumulation);
        }

        currentAccumulation = addSecurityValues(currentAccumulation);

        if (includeWealthTax.value && substractWealthTax) {
          currentAccumulation = substractWealthTax(currentAccumulation);
        }

        acc.push(currentAccumulation);

        return acc;
      }, [] as number[]);

      const lastItem = accumulation[accumulation.length - 1];
      const exitValue = substractSecurityExitCost(lastItem);

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
