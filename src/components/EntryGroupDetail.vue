<template>
  <div v-if="data">
    <q-card-section class="text-subtitle2">
      <TableData
        v-model:value="data.name"
        label="Name"
      />
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
              Name
            </th>
            <th class="text-left">
              Quantity
            </th>
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
            <th class="text-left">
              <q-btn
                size="sm"
                icon="add"
                flat
                round
                @click="addNew"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(e, index) in data.entries"
            :key="index"
            :class="getRowClass(e)"
          >
            <td>
              <q-input
                v-model="e.name"
                dense
                color="black"
                filled
                square
              />
            </td>
            <td>
              <q-input
                v-model.number="e.quantity"
                dense
                color="black"
                filled
                square
              />
            </td>
            <td>
              <q-input
                v-model.number="e.calories"
                dense
                color="black"
                filled
                square
              />
            </td>
            <td v-if="showProtein">
              <q-input
                v-model.number="e.protein"
                dense
                color="black"
                filled
                square
              />
            </td>
            <td v-if="showCarbs">
              <q-input
                v-model.number="e.carbs"
                dense
                color="black"
                filled
                square
              />
            </td>
            <td v-if="showFat">
              <q-input
                v-model.number="e.fat"
                dense
                color="black"
                filled
                square
              />
            </td>
            <td>
              <q-btn
                icon="delete"
                size="sm"
                flat
                round
                @click="removeItem(index)"
              />
            </td>
          </tr>
          <tr :class="isDark ? 'bg-grey-9' : 'bg-grey-2'">
            <td colspan="2">
              {{ parseTotalItems(data.entries) }}
            </td>
            <td>
              {{ totalGroupProperty(data.entries, 'calories') }}
            </td>
            <td v-if="showProtein">
              {{ totalGroupProperty(data.entries, 'protein') }}
            </td>
            <td v-if="showCarbs">
              {{ totalGroupProperty(data.entries, 'carbs') }}
            </td>
            <td v-if="showFat">
              {{ totalGroupProperty(data.entries, 'fat') }}
            </td>
            <td />
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-card-actions
      align="right"
    >
      <q-btn
        icon="delete"
        size="sm"
        flat
        round
        @click="$emit('deleteSection')"
      />
    </q-card-actions>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, watch,
} from 'vue';
import { EntryGroup, LogEntry } from 'src/models';
import TableData from 'src/components/TableData.vue';

export default defineComponent({
  components: { TableData },
  props: {
    groupDetail: {
      type: Object as PropType<EntryGroup>,
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
  emits: ['deleteSection'],
  setup(props) {
    const data = ref<EntryGroup>();

    watch(() => props.groupDetail, (val) => {
      data.value = val;
    }, { immediate: true });

    function parseTotalItems(entries: LogEntry[]) {
      return `${entries.length} ${entries.length === 1 ? 'Item' : 'Items'}`;
    }

    function enforceNumber(value: number | undefined) {
      if (!value) { return 0; }
      if (typeof value === 'number') { return value; }
      return 0;
    }

    function totalGroupProperty(entries: LogEntry[], propertyName: keyof LogEntry): number {
      // eslint-disable-next-line max-len
      return entries.reduce((acc, obj) => acc + ((obj[propertyName] as number || 0) * enforceNumber(obj.quantity)), 0);
    }
    function addNew() {
      const newEntry: LogEntry = {
        name: 'New Item',
        quantity: 1,
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
      };
      data.value?.entries.push(newEntry);
    }

    function removeItem(index: number) {
      data.value?.entries.splice(index, 1);
    }

    function getRowClass(row: LogEntry) {
      const noValue = typeof row.quantity !== 'number' || !row.quantity;
      const light = noValue ? 'bg-grey-4' : '';
      const dark = noValue ? 'bg-grey-8' : '';
      return props.isDark ? dark : light;
    }
    return {
      data,
      parseTotalItems,
      totalGroupProperty,
      addNew,
      removeItem,
      getRowClass,
    };
  },
});
</script>
