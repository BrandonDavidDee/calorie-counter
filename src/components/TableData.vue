<template>
  <span>
    <span class="cursor-pointer">{{ value }}</span>
    <q-popup-edit
      v-slot="scope"
      v-model="internalValue"
      :validate="val => !!val"
    >
      <q-input
        v-model="scope.value"
        autofocus
        dense
        :hint="label"
        :rules="[
          val => scope.validate(val) || 'Required'
        ]"
        color="black"
      >
        <template #after>
          <q-btn
            flat
            dense
            color="negative"
            icon="cancel"
            @click.stop.prevent="scope.cancel"
          />

          <q-btn
            flat
            dense
            color="positive"
            icon="check_circle"
            :disable="
              scope.validate(scope.value) === false || scope.initialValue === scope.value
            "
            @click.stop.prevent="scope.set"
          />
        </template>
      </q-input>
    </q-popup-edit>
  </span>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const internalValue = ref(props.value);

    watch(internalValue, (newValue) => {
      emit('update:value', newValue);
    });

    return {
      internalValue,
    };
  },
});
</script>
