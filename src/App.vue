<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-3">
        <div class="mb-3">
          <label
            for="deposit"
            class="form-label"
          >
            Monthly Deposit
          </label>
          <input
            id="deposit"
            v-model.number="deposit"
            type="text"
            class="form-control"
          >
        </div>

        <div class="mb-3">
          <label
            for="initial-deposit"
            class="form-label"
          >
            Initial Deposit
          </label>
          <input
            id="initial-deposit"
            v-model.number="initialDeposit"
            type="text"
            class="form-control"
          >
        </div>

        <div class="mb-3">
          <label
            for="duration"
            class="form-label"
          >
            Duration (years)
          </label>
          <input
            id="duration"
            v-model.number="duration"
            type="text"
            class="form-control"
          >
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input
              id="include-wealth-tax"
              v-model="includeWealthTax"
              type="checkbox"
              class="form-check-input"
            >
            <label
              class="form-check-label"
              for="include-wealth-tax"
            >
              Include wealth tax
            </label>
          </div>

          <template v-if="includeWealthTax">
            <div class="form-check form-check-inline">
              <input
                id="single"
                v-model="fiscalStatus"
                class="form-check-input"
                type="radio"
                value="1"
              >
              <label
                class="form-check-label"
                for="single"
              >
                Single
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                id="couple"
                v-model="fiscalStatus"
                class="form-check-input"
                type="radio"
                value="2"
              >
              <label
                class="form-check-label"
                for="couple"
              >
                Couple <span title="Assumes 50%/50% split between fiscal partner">(?)</span>
              </label>
            </div>
          </template>
        </div>

        <BrokerForm @broker-added="addBroker" />
      </div>

      <div class="col-sm-9">
        <PortfoliosTable :portfolios="portfolios" />

        <h3>Portfolio Settings</h3>

        <div class="accordion">
          <BrokerDetails
            v-for="broker in brokers"
            :id="broker.id"
            :key="broker.id"
            v-model:serviceFee="broker.serviceFee"
            v-model:securities="broker.securities"
            :name="broker.name"
            :deposit="deposit"
            :duration="duration"
            :initial-deposit="initialDeposit"
            :include-wealth-tax="includeWealthTax"
            @portfolio-updated="onPortfolioUpdate"
            @portfolio-created="onPortfolioCreated"
            @remove-broker="onBrokerRemove"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, provide } from 'vue';
import BrokerDetails from './components/BrokerDetails.vue';
import BrokerForm from './components/BrokerForm.vue';
import PortfoliosTable from './components/PortfoliosTable.vue';
import { useState } from './composables/use-store';
import { getWealthTax } from './composables/use-wealth-tax';
import { App, Broker, Portfolio } from './types';

export default defineComponent({
  name: 'App',

  components: { BrokerDetails, BrokerForm, PortfoliosTable },

  setup() {
    const state = useState();

    function addBroker(broker: Broker): number {
      return state.brokers.push(broker);
    }

    function substractWealthTax(amount: number): number {
      const amountPerPerson = amount / state.fiscalStatus;
      const tax = getWealthTax(amountPerPerson) * state.fiscalStatus;
      return amount - tax;
    }
    provide('substractWealthTax', substractWealthTax);

    function getPortfolioIndex(id: string) {
      return state.portfolios.findIndex((v) => v.id === id);
    }

    function onPortfolioCreated(portfolio: Portfolio): void {
      const portfolioIndex = getPortfolioIndex(portfolio.id);

      if (portfolioIndex === -1) {
        state.portfolios.push(portfolio);
      }
    }

    function onPortfolioUpdate(portfolio: Portfolio): void {
      const portfolioIndex = getPortfolioIndex(portfolio.id);

      state.portfolios[portfolioIndex] = portfolio;
    }

    function onBrokerRemove(id: string): void {
      const brokerIndex = state.brokers.findIndex((v) => v.id === id);
      const portfolioIndex = state.portfolios.findIndex((v) => v.id === id);

      state.brokers.splice(brokerIndex, 1);
      state.portfolios.splice(portfolioIndex, 1);
    }

    return {
      ...toRefs<App>(state),
      addBroker,
      onPortfolioCreated,
      onPortfolioUpdate,
      onBrokerRemove,
    };
  },
});
</script>
