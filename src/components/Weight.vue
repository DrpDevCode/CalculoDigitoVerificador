<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Weights } from '@/composables/interfaces';

const props = defineProps<{
    qtdNumbers: number;
}>();

const Weights = ref<Weights[]>([]);

const emit = defineEmits<{
    'update:modelValue': [Weights[]]
}>();

watch(Weights, (newVal) => {
    emit('update:modelValue', newVal);
}, { deep: true });

watch(() => props.qtdNumbers, (newVal) => {
    Weights.value = Array.from({ length: newVal }, (_, i) => ({
        position: i + 1,
        weight: 1
    }));
}, { immediate: true });

const updateWeight = (index: number, value: number) => {
    const weight = Weights.value[index];
    if (weight) {
        weight.weight = value;
    }
};

</script>

<template>
    <el-card shadow="hover" class="weight-card">
        <template #header>
            <div class="flex items-center gap-2">
                <span class="w-1 h-6 bg-indigo-500 rounded-full"></span>
                <span class="text-xl font-semibold text-gray-800">Pesos</span>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4"
            v-if="props.qtdNumbers && props.qtdNumbers > 0 && Weights.length >= props.qtdNumbers">
            <div v-for="i in props.qtdNumbers" :key="i" class="flex flex-col gap-2">
                <el-input-number :model-value="Weights[i - 1]?.weight ?? 0"
                    @update:model-value="(val: number) => updateWeight(i - 1, val)" :min="0" class="input-number w-full"
                    controls-position="right" :step="1" :precision="0" size="small">
                    <template #prefix>
                        <span class="text-sm font-medium text-gray-600">{{ i }}</span>
                    </template>
                </el-input-number>
            </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4">
                </path>
            </svg>
            <p>Informe o número de série inicial para configurar os pesos</p>
        </div>
    </el-card>
</template>

<style scoped>
.input-number {
    width: 100%;
}

.weight-card :deep(.el-card__header) {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
}

.weight-card :deep(.el-card__body) {
    padding: 20px;
}
</style>