<template>
  <q-card
    flat
    bordered
    square
    class="q-mt-sm q-mb-sm"
  >
    <q-card-section class="text-subtitle2">
      Totals
    </q-card-section>
    <q-card-section>
      <q-markup-table
        square
        dense
        flat
        bordered
        separator="cell"
      >
        <thead>
          <tr :class="isDark ? 'bg-grey-9' : 'bg-grey-2'">
            <th class="text-left">
              Calories
            </th>
            <th
              v-if="showProtein"
              class="text-left"
            >
              Protein Grams
            </th>
            <th
              v-if="showCarbs"
              class="text-left"
            >
              Carb Grams
            </th>
            <th
              v-if="showFat"
              class="text-left"
            >
              Fat Grams
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {{ totalCalories }}
            </td>
            <td v-if="showProtein">
              {{ totalProtein }} ({{ proteinPercentage }}%)
            </td>
            <td v-if="showCarbs">
              {{ totalCarbs }} ({{ carbsPercentage }}%)
            </td>
            <td v-if="showFat">
              {{ totalFat }} ({{ fatPercentage }}%)
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { EntryGroup, LogEntry } from 'src/models';

export default defineComponent({
  props: {
    groups: {
      type: Array as PropType<EntryGroup[]>,
      required: true,
    },
    isDark: {
      type: Boolean,
      required: true,
    },
    showProtein: {
      type: Boolean,
      required: true,
    },
    showCarbs: {
      type: Boolean,
      required: true,
    },
    showFat: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const calculateTotal = (key: keyof LogEntry) => props.groups.reduce((groupAcc, group) => {
      // eslint-disable-next-line max-len
      const groupTotal = group.entries.reduce((acc, entry) => acc + (entry[key] as number * entry.quantity), 0);
      return groupAcc + groupTotal;
    }, 0);

    const totalCalories = computed(() => calculateTotal('calories'));
    const totalProtein = computed(() => calculateTotal('protein'));
    const totalCarbs = computed(() => calculateTotal('carbs'));
    const totalFat = computed(() => calculateTotal('fat'));

    const proteinCalories = computed(() => totalProtein.value * 4);
    const carbsCalories = computed(() => totalCarbs.value * 4);
    const fatCalories = computed(() => totalFat.value * 9);

    const proteinPercentage = computed(() => {
      const total = totalCalories.value;
      return total > 0 ? ((proteinCalories.value / total) * 100).toFixed(2) : 0;
    });

    const carbsPercentage = computed(() => {
      const total = totalCalories.value;
      return total > 0 ? ((carbsCalories.value / total) * 100).toFixed(2) : 0;
    });

    const fatPercentage = computed(() => {
      const total = totalCalories.value;
      return total > 0 ? ((fatCalories.value / total) * 100).toFixed(2) : 0;
    });

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      proteinPercentage,
      carbsPercentage,
      fatPercentage,
    };
  },
});
</script>
