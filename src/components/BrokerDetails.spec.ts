import { mount, shallowMount } from '@vue/test-utils';
import BrokerDetails from './BrokerDetails.vue';

export function createWrapper({ props = {}, shallow = true } = {}) {
  const _mount = shallow ? shallowMount : mount;

  return _mount(BrokerDetails, {
    props: {
      id: 'test-id',
      name: 'Test',
      deposit: 1500,
      initialDeposit: 10000,
      duration: 20,
      includeWealthTax: true,
      fiscalStatus: 1,
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
        props: {
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
        props: {
          fiscalStatus: 2,
        },
      });

      expect(wrapper.vm.portfolioTable).toMatchSnapshot();
    });
  });
});
