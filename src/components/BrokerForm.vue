<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend>New Broker</legend>

      <div class="mb-3">
        <label for="broker-name" class="form-label"> Name </label>
        <input
          id="broker-name"
          v-model="name"
          type="text"
          class="form-control"
        />
      </div>

      <div class="mb-3">
        <label for="service-fee" class="form-label"> Service Fee (%) </label>
        <input
          id="service-fee"
          v-model="serviceFee"
          type="text"
          class="form-control"
        />
        <div class="form-text">
          Value or fee brackets (e.g 0:0.2;100000:0.12;400000:0.06)
        </div>
      </div>
    </fieldset>

    <button type="submit" class="btn btn-primary">Add Broker</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, type SetupContext, ref, unref } from 'vue';
import { useId } from '../composables/use-id';
type EmitOption = 'broker-added';

export default defineComponent({
  name: 'BrokerFrom',
  emits: ['broker-added'],
  setup(props, { emit }: SetupContext<EmitOption[]>) {
    const name = ref('');
    const serviceFee = ref('0');

    function onSubmit(): void {
      const broker = {
        id: useId(),
        name: unref(name),
        serviceFee: unref(serviceFee),
        securities: [],
      };

      emit('broker-added', broker);

      name.value = '';
      serviceFee.value = '';
    }

    return {
      name,
      serviceFee,
      onSubmit,
    };
  },
});
</script>
