import { mount, shallowMount } from '@vue/test-utils';
import { useState } from '../composables/use-store';
import BrokerDetails from './BrokerDetails.vue';

jest.mock('../composables/use-store');

export function createWrapper({ props = {}, state = {}, shallow = true } = {}) {
  jest.mocked(useState, true).mockReturnValueOnce({
    initialDeposit: 10000,
    deposit: 1500,
    duration: 20,
    includeWealthTax: true,
    fiscalStatus: 1,
    portfolios: [],
    brokers: [],
    ...state,
  });

  const _mount = shallow ? shallowMount : mount;

  return _mount(BrokerDetails, {
    props: {
      id: 'test-id',
      name: 'Test',
      serviceFee: '0',
      ...props,
    },
  });
}

describe('BrokerDetails', () => {
  it('should trigger portfolioCreated event on created', () => {
    const wrapper = createWrapper();

    expect(wrapper.emitted('portfolioCreated')).toHaveLength(1);
  });

  describe('portfolioTable', () => {
    it('should show accumulated values without any fees', () => {
      const wrapper = createWrapper({
        state: {
          includeWealthTax: false,
        },
      });

      expect(wrapper.vm.portfolioTable).toMatchSnapshot();
    });

    it('should show accumulated values with wealth tax', () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.portfolioTable).toMatchSnapshot();
    });

    it('should show accumulated values with wealth tax for a couple', () => {
      const wrapper = createWrapper({
        state: {
          fiscalStatus: 2,
        },
      });

      expect(wrapper.vm.portfolioTable).toMatchSnapshot();
    });

    it('should show accumulated values with service fees', () => {
      const wrapper = createWrapper({
        props: {
          serviceFee: '0.1',
        },
        state: {
          includeWealthTax: false,
        },
      });

      expect(wrapper.vm.portfolioTable).toMatchSnapshot();
    });

    it('should show accumulated values with service fees', () => {
      const wrapper = createWrapper({
        props: {
          serviceFee: '0:0.2;100000:0.12;400000:0.06',
        },
        state: {
          includeWealthTax: false,
          deposit: 25000,
        },
      });

      expect(wrapper.vm.portfolioTable).toMatchSnapshot();
    });
  });
});
