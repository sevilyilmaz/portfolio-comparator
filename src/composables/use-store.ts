import { inject, provide, reactive } from 'vue';
import { useId } from './use-id';
import { App } from '../types';

export const stateSymbol = Symbol('state');
export const createState = (): App => {
  return reactive({
    deposit: 1500,
    initialDeposit: 1000,
    duration: 15,
    includeWealthTax: true,
    fiscalStatus: 1,
    portfolios: [],
    brokers: [
      {
        id: useId(),
        name: 'Degiro Basic',
        serviceFee: '0',
        securities: [
          {
            id: useId(),
            name: 'VWRL',
            tertd: 0.56,
            dividend: 0,
            annualReturn: 6.8,
            fixedTransactionCost: 0,
            variableTransactionCost: 0,
            exitCost: 0,
            allocation: 100,
          },
        ],
      },
      {
        id: useId(),
        name: 'ABN Amro Self Directed Investing Basic',
        serviceFee: '0:0.2;100000:0.12;400000:0.06',
        securities: [
          {
            id: useId(),
            name: 'NT World',
            tertd: 0.2,
            dividend: 0,
            annualReturn: 6.4,
            fixedTransactionCost: 0,
            variableTransactionCost: 0,
            exitCost: 0.1,
            allocation: 87,
          },
          {
            id: useId(),
            name: 'NT EM',
            tertd: 0.37,
            dividend: 0,
            annualReturn: 9.7,
            fixedTransactionCost: 0,
            variableTransactionCost: 0,
            exitCost: 0.2,
            allocation: 13,
          },
        ],
      },
    ],
  });
};

export const useState = () => inject<App>(stateSymbol, createState());
export const provideState = () => provide(stateSymbol, useState());
