<script setup lang="ts">
import { ref } from 'vue'
import type { FormConfig, Weights } from '@/composables/interfaces';

import Navbar from '@/components/Navbar.vue';
import Config from '@/components/Config.vue';
import Weight from '@/components/Weight.vue';
import Result from '@/components/Result.vue';
import Footer from '@/components/Footer.vue';

const formConfig = ref<FormConfig | null>(null);
const weights = ref<Weights[]>([]);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <!-- Navbar -->
    <Navbar />

    <div class="content-wrapper py-8 px-6 mt-16">
      <div class="w-full mx-auto">
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <!-- Left Column: Config and Weights -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Seção: Configurações -->
            <Config @update:modelValue="formConfig = $event" class="config-section" />

            <!-- Seção: Pesos -->
            <Weight :qtdNumbers="formConfig?.qtdNumbers || 0" @update:modelValue="weights = $event"
              class="weight-section" />
          </div>

          <!-- Right Column: Results -->
          <div class="lg:col-span-10">
            <Result :formConfig="formConfig" :weights="weights" class="result-section" />
          </div>
        </div>
      </div>
      <Footer />
    </div>

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