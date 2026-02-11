<script setup lang="ts">
import { ref } from "vue";
import type { FormConfig, Weights } from "@/composables/interfaces";

import Config from "@/components/Config.vue";
import Weight from "@/components/Weight.vue";
import Result from "@/components/Result.vue";
import Footer from "@/components/Footer.vue";
import SavedConfig from "@/components/SavedConfig.vue";

defineProps<{
  isLoggedIn: boolean;
}>();

const formConfig = ref<FormConfig | null>(null);
const weights = ref<Weights[]>([]);
const showSavedConfig = ref(false);

const handleLoadConfig = (config: { formConfig: FormConfig; weights: Weights[] }) => {
  formConfig.value = { ...config.formConfig };
  weights.value = config.weights.map((w) => ({ ...w }));
};
</script>

<template>
  <div class="content-wrapper py-8 px-6 mt-16">
    <div class="w-350 mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div class="lg:col-span-3 space-y-6">
          <Config
            :isLoggedIn="isLoggedIn"
            :modelValue="formConfig"
            @update:modelValue="formConfig = $event"
            @open-saved-config="showSavedConfig = true"
            class="config-section"
          />
          <Weight
            :qtdNumbers="formConfig?.qtdNumbers || 0"
            :modelValue="weights"
            @update:modelValue="weights = $event"
            class="weight-section"
          />
        </div>
        <div class="lg:col-span-9">
          <Result :formConfig="formConfig" :weights="weights" class="result-section" />
        </div>
      </div>
    </div>
    <Footer />
  </div>

  <SavedConfig
    v-model="showSavedConfig"
    :formConfig="formConfig"
    :weights="weights"
    @load-config="handleLoadConfig"
  />
</template>

<style scoped>
.content-wrapper {
  min-height: calc(100vh - 64px);
}

.config-section {
  height: 450px !important;
  overflow-y: auto;
}

.weight-section {
  height: 400px !important;
  overflow-y: auto;
}

.result-section {
  height: 874px !important;
  overflow-y: auto;
}
</style>
