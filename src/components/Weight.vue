<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { Weights } from '@/composables/interfaces';

const props = defineProps<{
    qtdNumbers: number;
    modelValue?: Weights[];
}>();

const Weights = ref<Weights[]>([]);
const isUpdatingFromParent = ref(false);

const emit = defineEmits<{
    'update:modelValue': [Weights[]]
}>();

// Função para comparar se dois arrays de Weights são iguais
const isEqual = (a: Weights[], b: Weights[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((w, i) => {
        const bItem = b[i];
        if (!bItem) return false;
        return w.position === bItem.position && w.weight === bItem.weight;
    });
};

// Função para atualizar os pesos
const updateWeights = async () => {
    // Se temos valores do pai com a quantidade correta, usar eles
    if (props.modelValue && props.modelValue.length === props.qtdNumbers && props.qtdNumbers > 0) {
        const newWeights = props.modelValue.map(w => ({ ...w }));
        if (!isEqual(Weights.value, newWeights)) {
            isUpdatingFromParent.value = true;
            Weights.value = newWeights;
            await nextTick();
            isUpdatingFromParent.value = false;
        }
    } else if (props.qtdNumbers > 0) {
        // Caso contrário, criar novos pesos baseados na quantidade
        const newWeights = Array.from({ length: props.qtdNumbers }, (_, i) => {
            // Tentar manter o peso existente se houver
            const existingWeight = props.modelValue?.[i] ?? Weights.value[i];
            return {
                position: i + 1,
                weight: existingWeight?.weight ?? 1
            };
        });
        if (!isEqual(Weights.value, newWeights)) {
            isUpdatingFromParent.value = true;
            Weights.value = newWeights;
            await nextTick();
            isUpdatingFromParent.value = false;
        }
    } else {
        if (Weights.value.length > 0) {
            isUpdatingFromParent.value = true;
            Weights.value = [];
            await nextTick();
            isUpdatingFromParent.value = false;
        }
    }
};

// Sincronizar com o valor do pai quando mudar
watch(() => props.modelValue, async (newVal) => {
    if (newVal && newVal.length > 0 && newVal.length === props.qtdNumbers) {
        const newWeights = newVal.map(w => ({ ...w }));
        if (!isEqual(Weights.value, newWeights)) {
            isUpdatingFromParent.value = true;
            Weights.value = newWeights;
            await nextTick();
            isUpdatingFromParent.value = false;
        }
    } else {
        await updateWeights();
    }
}, { immediate: true, deep: true });

// Atualizar quando a quantidade de números mudar
watch(() => props.qtdNumbers, () => {
    if (!isUpdatingFromParent.value) {
        updateWeights();
    }
}, { immediate: true });

// Emitir mudanças apenas quando não for atualização do pai
watch(() => Weights.value, (newVal) => {
    if (!isUpdatingFromParent.value) {
        // Sempre emitir quando o usuário faz mudanças
        // A comparação com modelValue é feita no watch do modelValue para evitar loops
        emit('update:modelValue', newVal.map(w => ({ ...w })));
    }
}, { deep: true });

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