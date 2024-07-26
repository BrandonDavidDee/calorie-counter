<template>
  <q-bar>
    <q-btn
      label="Import"
      flat
      dense
    />
    <q-btn
      label="Export"
      flat
      dense
    />
    <div class="col text-center text-weight-bold">
      Calorie Counter
    </div>
    <q-space />
    <q-btn
      :label="isDark ? 'Dark Mode' : 'Light Mode'"
      flat
      dense
      @click="toggleDark"
    />
  </q-bar>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const isDark = computed(() => $q.dark.isActive);
    function toggleDark() {
      $q.dark.toggle();
    }
    return {
      toggleDark,
      isDark,
    };
  },
});
</script>
