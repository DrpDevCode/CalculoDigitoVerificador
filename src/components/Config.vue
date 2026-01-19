<script setup lang="ts">

import { ref, watch } from 'vue';
import { onlyNumbers } from '@/functions';
import type { FormConfig } from '@/composables/interfaces';

const form = ref<FormConfig>({
  serialNumber: '',
  qtdNumbers: 0,
  qtdRegisters: 1,
  divider: 1,
  hasHyphen: false,
});

const emit = defineEmits<{
  'update:modelValue': [FormConfig]
}>();

watch(() => form.value.serialNumber, (newVal) => {
  form.value.qtdNumbers = onlyNumbers(newVal).length || 0;
  form.value.divider = form.value.qtdNumbers + 2;
}, { immediate: false });

watch(form.value, (newVal) => {
  emit('update:modelValue', newVal);
}, { immediate: false });
</script>

<template>
  <el-card shadow="hover" class="config-card">
    <template #header>
      <div class="flex items-center gap-2">
        <span class="w-1 h-6 bg-blue-500 rounded-full"></span>
        <span class="text-xl font-semibold text-gray-800">Configurações</span>
      </div>
    </template>

    <el-form label-position="top">
      <div class="grid grid-cols-1 sm:grid-cols-1">
        <!-- Serial Number -->
        <el-form-item label="Número de série Inicial" class="mb-0 font-bold">
          <el-input v-model="form.serialNumber" class="w-full" maxlength="15" placeholder="Digite o número de série"
            size="small" :formatter="onlyNumbers" :parser="onlyNumbers"/>
        </el-form-item>

        <!-- Qtd Registers -->
        <el-form-item label="Quantidade de registros" class="mb-0 font-bold">
          <el-input-number v-model="form.qtdRegisters" :min="1" :max="300" class="input-number w-full"
            controls-position="right" placeholder="Digite a quantidade de registros" size="small" />
        </el-form-item>

        <!-- Qtd Numbers -->
        <el-form-item label="Quantidade de números" class="mb-0 font-bold">
          <el-input-number v-model="form.qtdNumbers" :min="0" class="input-number w-full" controls-position="right"
            :disabled="true" size="small" />
        </el-form-item>

        <!-- Divider -->
        <el-form-item label="Número divisor" class="mb-0 font-bold">
          <el-input-number v-model="form.divider" :min="1" class="input-number w-full" controls-position="right"
            :disabled="true" size="small" />
        </el-form-item>

        <!-- Has Hyphen -->
        <el-form-item label="Incluir hífen" class="mb-0 font-bold">
          <el-switch v-model="form.hasHyphen" size="small" />
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>

<style scoped>
.input-number {
  width: 100%;
}

.config-card :deep(.el-card__header) {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.config-card :deep(.el-card__body) {
  padding: 20px;
}
</style>