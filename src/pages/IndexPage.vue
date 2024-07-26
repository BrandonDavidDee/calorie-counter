<template>
  <q-page class="items-center justify-evenly">
    <SiteSettings
      @export="onExport"
      @import="triggerFileInput"
    />
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
              @click="dialog = true"
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
    <q-dialog v-model="dialog">
      <q-card style="width: 500px; max-width: 60vw;">
        <q-card-section>Are you sure? This will wipe everything out permanently?</q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="Cancel"
            flat
          />
          <q-btn
            label="Clear Data"
            color="red"
            @click="clearData"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <input
      ref="fileInput"
      type="file"
      style="display: none;"
      @change="handleFileChange"
    >
  </q-page>
</template>

<script lang="ts">
import { EntryGroup, ExportedData } from 'src/models';
import {
  defineComponent, ref, computed, onMounted,
} from 'vue';
import { useRoute } from 'vue-router';
import SiteSettings from 'src/components/SiteSettings.vue';
import { useQuasar, exportFile } from 'quasar';
import EntryGroupDetail from 'src/components/EntryGroupDetail.vue';
import GrandTotals from 'src/components/GrandTotals.vue';
import sampleData from './sample-data';

export default defineComponent({
  components: { SiteSettings, EntryGroupDetail, GrandTotals },
  setup() {
    const $q = useQuasar();
    const dialog = ref(false);
    const fileInput = ref();
    const groups = ref<EntryGroup[]>([]);
    const isDark = computed(() => $q.dark.isActive);
    const showCarbs = ref(true);
    const showFat = ref(true);
    const showProtein = ref(true);
    const route = useRoute();

    function makeNotifyMessage(type: string, message: string) {
      $q.notify({ type, message });
    }

    function loadSampleData() {
      groups.value = sampleData;
    }

    function clearData() {
      groups.value = [];
      dialog.value = false;
    }

    function addNewGroup() {
      const newGroup: EntryGroup = {
        name: 'New Group Name',
        entries: [],
      };
      groups.value.push(newGroup);
    }

    function onExport() {
      const exportedData: ExportedData = {
        application: 'calorie-counter',
        timestamp: new Date(),
        data: groups.value,
      };
      const jsonData = JSON.stringify(exportedData, null, 2);
      const status = exportFile('calorie-counter-export.json', jsonData, {
        mimeType: 'application/json',
        encoding: 'utf-8',
      });
      if (status === true) {
        makeNotifyMessage('positive', 'File has been downloaded');
      } else {
        makeNotifyMessage('negative', 'Browser Blocked Download');
      }
    }

    function triggerFileInput() {
      fileInput.value.click();
    }

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData: ExportedData = JSON.parse(e.target?.result as string);
            groups.value = importedData.data;
            makeNotifyMessage('positive', 'Import Success');
          } catch (error) {
            makeNotifyMessage('negative', 'Error Importing FIle');
          }
        };
        reader.readAsText(file);
      }
    };

    onMounted(() => {
      if (route.query.demo) {
        loadSampleData();
      }
    });

    return {
      dialog,
      groups,
      isDark,
      showProtein,
      showFat,
      showCarbs,
      loadSampleData,
      clearData,
      addNewGroup,
      onExport,
      fileInput,
      handleFileChange,
      triggerFileInput,
    };
  },
});
</script>
