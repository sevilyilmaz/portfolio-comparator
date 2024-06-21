<template>
  <AppHeader />

  <div class="container">
    <div class="row">
      <div class="col-sm-3">
        <div class="mb-3">
          <label for="deposit" class="form-label"> Monthly Deposit </label>
          <input
            id="deposit"
            v-model.number="deposit"
            type="text"
            class="form-control"
          />
        </div>

        <div class="mb-3">
          <label for="initial-deposit" class="form-label">
            Initial Deposit
          </label>
          <input
            id="initial-deposit"
            v-model.number="initialDeposit"
            type="text"
            class="form-control"
          />
        </div>

        <div class="mb-3">
          <label for="duration" class="form-label"> Duration (years) </label>
          <input
            id="duration"
            v-model.number="duration"
            type="text"
            class="form-control"
          />
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input
              id="include-wealth-tax"
              v-model="includeWealthTax"
              type="checkbox"
              class="form-check-input"
            />
            <label class="form-check-label" for="include-wealth-tax">
              Include wealth tax
            </label>
          </div>

          <template v-if="includeWealthTax">
            <div class="form-check form-check-inline">
              <input
                id="single"
                v-model.number="fiscalStatus"
                :value="1"
                class="form-check-input"
                type="radio"
              />
              <label class="form-check-label" for="single"> Single </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                id="couple"
                v-model.number="fiscalStatus"
                :value="2"
                class="form-check-input"
                type="radio"
              />
              <label class="form-check-label" for="couple">
                Couple
                <span title="Assumes 50%/50% split between fiscal partner"
                  >(?)</span
                >
              </label>
            </div>
          </template>
        </div>

        <BrokerForm @broker-added="addBroker" />
      </div>

      <div class="col-sm-9">
        <PortfoliosTable :portfolios="portfolios" />

        <h3>Portfolio Settings</h3>

        <p>
          Morningstar is a great source for security data. Here is an example
          for
          <a
            href="https://www.morningstar.nl/nl/etf/snapshot/snapshot.aspx?id=0P0000YXJO"
            target="_blank"
            >VWRL</a
          >. You can also use
          <a
            href="https://www.reddit.com/r/DutchFIRE/comments/flchg4/voorbeeld_all_world_index_portfolios_2020/"
            target="_blank"
            >this post</a
          >
          as a rough reference for tracking differences. Make sure you use same
          type of data for more accurate comparison.
          <a
            href="https://www.justetf.com/en/news/etf/avoiding-etf-performance-pitfalls.html"
            target="_blank"
            >This post</a
          >
          explains what to look at.
        </p>

        <div class="accordion">
          <BrokerDetails
            v-for="broker in brokers"
            :id="broker.id"
            :key="broker.id"
            v-model:serviceFee="broker.serviceFee"
            v-model:securities="broker.securities"
            :name="broker.name"
            @portfolio-updated="onPortfolioUpdate"
            @portfolio-created="onPortfolioCreated"
            @remove-broker="onBrokerRemove"
          />
        </div>
      </div>
    </div>
  </div>

  <AppFooter />
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import BrokerDetails from './components/BrokerDetails.vue';
import BrokerForm from './components/BrokerForm.vue';
import PortfoliosTable from './components/PortfoliosTable.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import { useState } from './composables/use-store';
import type { App, Broker, Portfolio } from './types';

export default defineComponent({
  name: 'App',

  components: {
    AppHeader,
    AppFooter,
    BrokerDetails,
    BrokerForm,
    PortfoliosTable,
  },

  setup() {
    const state = useState();

    function addBroker(broker: Broker): number {
      return state.brokers.push(broker);
    }

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
