<template>
  <q-page class="items-center justify-evenly">
    <SiteSettings />
    <div class="q-ml-lg q-mr-lg">
      <div class="row q-mt-sm">
        <div class="col">
          <q-checkbox
            v-model="showProtein"
            label="Protein"
            color="grey-9"
            :disable="!groups.length"
          />
          <q-checkbox
            v-model="showCarbs"
            label="Carbs"
            color="grey-9"
            :disable="!groups.length"
          />
          <q-checkbox
            v-model="showFat"
            label="Fat"
            color="grey-9"
            :disable="!groups.length"
          />
        </div>
        <div class="col text-right">
          <q-btn-group>
            <q-btn
              outline
              label="Add Group"
              @click="addNewGroup"
            />
            <q-btn
              outline
              label="Clear Data"
              :disable="!groups.length"
              @click="clearData"
            />
          </q-btn-group>
        </div>
      </div>
      <q-banner
        v-show="!groups.length"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
        class="q-mt-md"
      >
        <template #avatar>
          <q-icon
            name="help"
            :color="$q.dark.isActive ? 'white' : 'grey-9'"
          />
        </template>
        What is this?
        <template #action>
          <q-btn
            label="Load Sample Data"
            class="full-width"
            @click="loadSampleData"
          />
        </template>
      </q-banner>
      <GrandTotals
        :groups="groups"
        :is-dark="isDark"
        :show-carbs="showCarbs"
        :show-fat="showFat"
        :show-protein="showProtein"
      />
      <q-card
        v-for="(g, ii) in groups"
        :key="ii"
        flat
        square
        bordered
        class="q-mb-xs"
      >
        <EntryGroupDetail
          :group-detail="g"
          :is-dark="isDark"
          :show-carbs="showCarbs"
          :show-fat="showFat"
          :show-protein="showProtein"
        />
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { EntryGroup } from 'src/models';
import { defineComponent, ref, computed } from 'vue';
import SiteSettings from 'src/components/SiteSettings.vue';
import { useQuasar } from 'quasar';
import EntryGroupDetail from 'src/components/EntryGroupDetail.vue';
import GrandTotals from 'src/components/GrandTotals.vue';
import sampleData from './sample-data';

export default defineComponent({
  components: { SiteSettings, EntryGroupDetail, GrandTotals },
  setup() {
    const $q = useQuasar();
    const isDark = computed(() => $q.dark.isActive);

    const showProtein = ref(true);
    const showFat = ref(true);
    const showCarbs = ref(true);

    const groups = ref<EntryGroup[]>([]);

    function loadSampleData() {
      groups.value = sampleData;
    }

    function clearData() {
      groups.value = [];
    }

    function addNewGroup() {
      const newGroup: EntryGroup = {
        name: 'New Group Name',
        entries: [],
      };
      groups.value.push(newGroup);
    }

    return {
      groups,
      isDark,
      showProtein,
      showFat,
      showCarbs,
      loadSampleData,
      clearData,
      addNewGroup,
    };
  },
});
</script>
