<script setup lang="ts">
import { ref } from 'vue'
import type { FormConfig, Weights } from '@/composables/interfaces';

import Navbar from '@/components/Navbar.vue';
import Config from '@/components/Config.vue';
import Weight from '@/components/Weight.vue';
import Result from '@/components/Result.vue';
import Footer from '@/components/Footer.vue';
import SavedConfig from '@/components/SavedConfig.vue';

const formConfig = ref<FormConfig | null>(null);
const weights = ref<Weights[]>([]);
const isLoggedIn = ref(false);
const showSavedConfig = ref(false);

const handleLoadConfig = (config: { formConfig: FormConfig; weights: Weights[] }) => {
    // Criar novos objetos para garantir reatividade
    formConfig.value = { ...config.formConfig };
    weights.value = config.weights.map(w => ({ ...w }));
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <!-- Navbar -->
    <Navbar @login-success="isLoggedIn = true" @logout="isLoggedIn = false" />

    <div class="content-wrapper py-8 px-6 mt-16">
      <div class="w-full mx-auto">
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <!-- Left Column: Config and Weights -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Seção: Configurações -->
            <Config 
              :isLoggedIn="isLoggedIn" 
              :modelValue="formConfig"
              @update:modelValue="formConfig = $event" 
              @open-saved-config="showSavedConfig = true" 
              class="config-section" 
            />

            <!-- Seção: Pesos -->
            <Weight 
              :qtdNumbers="formConfig?.qtdNumbers || 0" 
              :modelValue="weights"
              @update:modelValue="weights = $event"
              class="weight-section" 
            />
          </div>

          <!-- Right Column: Results -->
          <div class="lg:col-span-9">
            <Result :formConfig="formConfig" :weights="weights" class="result-section" />
          </div>
        </div>
      </div>
      <Footer />
    </div>

    <!-- Popup de Configurações Salvas -->
    <SavedConfig 
      v-model="showSavedConfig"
      :formConfig="formConfig"
      :weights="weights"
      @load-config="handleLoadConfig"
    />
  </div>
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