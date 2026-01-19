<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormConfig, Weights } from '@/composables/interfaces';

import Config from '@/components/Config.vue';
import Weight from '@/components/Weight.vue';
import Result from '@/components/Result.vue';

const formConfig = ref<FormConfig | null>(null);
const weights = ref<Weights[]>([]);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-6">
    <div class="w-full mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-block mb-4">
          <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>
        <h1 class="text-5xl font-bold text-gray-800 mb-3 tracking-tight">
          Cálculo de Dígito Verificador
        </h1>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <!-- Left Column: Config and Weights -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Seção: Configurações -->
          <Config @update:modelValue="formConfig = $event" class="config-section"/>

          <!-- Seção: Pesos -->
          <Weight :qtdNumbers="formConfig?.qtdNumbers || 0" @update:modelValue="weights = $event" class="weight-section"/>
        </div>

        <!-- Right Column: Results -->
        <div class="lg:col-span-10">
          <Result :formConfig="formConfig" :weights="weights" class="result-section"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-section {
  height: 450px !important;
  overflow-y: auto;
}

.weight-section {
  height: 400px !important;
  overflow-y: auto;
}

.result-section {
  height: 875px !important;
  overflow-y: auto;
}

</style>