<script setup lang="ts">

import { ref, watch, nextTick } from 'vue';
import { onlyNumbers } from '@/functions';
import type { FormConfig, Config } from '@/composables/interfaces';
import { Notebook } from '@element-plus/icons-vue';

const props = defineProps<{
  isLoggedIn: Boolean;
  modelValue?: FormConfig | null;
}>();

const form = ref<FormConfig>({
  serialNumber: '',
  qtdNumbers: 0,
  qtdRegisters: 1,
  divider: 1,
  hasHyphen: false,
});

const configsSaved = ref<Config[]>([]);

const emit = defineEmits<{
  'update:modelValue': [FormConfig];
  'open-saved-config': [];
}>();

const isUpdatingFromParent = ref(false);

// Função para comparar se dois objetos FormConfig são iguais
const isEqual = (a: FormConfig, b: FormConfig): boolean => {
  return a.serialNumber === b.serialNumber &&
         a.qtdRegisters === b.qtdRegisters &&
         a.qtdNumbers === b.qtdNumbers &&
         a.divider === b.divider &&
         a.hasHyphen === b.hasHyphen;
};

// Sincronizar com o valor do pai quando mudar
watch(() => props.modelValue, async (newVal, oldVal) => {
  // Se o valor mudou e é diferente do atual, atualizar
  if (newVal) {
    // Se não temos form.value ou se é diferente, atualizar
    if (!form.value || !isEqual(form.value, newVal)) {
      isUpdatingFromParent.value = true;
      form.value = { ...newVal };
      // Usar nextTick para garantir que a flag seja resetada após todas as atualizações
      await nextTick();
      isUpdatingFromParent.value = false;
    }
  } else if (oldVal !== undefined && !newVal) {
    // Se modelValue foi limpo (mudou de algo para null), não fazer nada
    // O usuário pode estar começando uma nova entrada
  }
}, { immediate: true, deep: true });

// Recalcular qtdNumbers e divider apenas quando o usuário digita (não quando vem do pai)
watch(() => form.value.serialNumber, (newVal, oldVal) => {
  // Só recalcular se não estiver atualizando do pai e se realmente mudou
  if (!isUpdatingFromParent.value && newVal !== oldVal && oldVal !== undefined) {
    form.value.qtdNumbers = onlyNumbers(newVal).length || 0;
    form.value.divider = form.value.qtdNumbers + 2;
  }
}, { immediate: false });

// Emitir mudanças apenas quando não for atualização do pai
watch(() => form.value, (newVal) => {
  if (!isUpdatingFromParent.value) {
    // Sempre emitir quando o usuário faz mudanças
    // A comparação com modelValue é feita no watch do modelValue para evitar loops
    emit('update:modelValue', { ...newVal });
  }
}, { immediate: false, deep: true });
</script>

<template>
  <el-card shadow="hover" class="config-card">
    <template #header>
      <div class="flex items-center gap-2">
        <span class="w-1 h-6 bg-blue-500 rounded-full"></span>
        <span class="text-xl font-semibold text-gray-800">Configurações</span>
        <div class="ml-auto">
          <el-button type="primary" :disabled="!isLoggedIn" size="small" @click="$emit('open-saved-config')">
            <el-icon><Notebook /></el-icon>
          </el-button>
        </div>
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