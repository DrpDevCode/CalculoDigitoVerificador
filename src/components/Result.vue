<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Download } from '@element-plus/icons-vue';
import type { FormConfig, Weights } from '@/composables/interfaces';
import { generateNumbers, downloadTxtFile, downloadTxtFileSimple, downloadJsonFile } from '@/functions';

const props = defineProps<{
    formConfig: FormConfig | null;
    weights: Weights[] | null;
}>();

const serialNumbers = ref<any[]>([]);

watch(() => [props.formConfig || null, props.weights || null], (newVal) => {
    if (newVal[0] && newVal[1]) {
        serialNumbers.value = generateNumbers(newVal[0] as FormConfig, newVal[1] as Weights[]);
    }
}, { immediate: false, deep: true });

const downloadTxt = () => {
    if (serialNumbers.value.length === 0) {
        ElMessage.warning('Não há dados para exportar');
        return;
    }

    downloadTxtFile(serialNumbers.value);
    ElMessage.success('Arquivo TXT gerado com sucesso!');
};

const downloadTxtSimple = () => {
    if (serialNumbers.value.length === 0) {
        ElMessage.warning('Não há dados para exportar');
        return;
    }
    downloadTxtFileSimple(serialNumbers.value);
    ElMessage.success('Arquivo TXT gerado com sucesso!');
};

const downloadJson = () => {
    if (serialNumbers.value.length === 0) {
        ElMessage.warning('Não há dados para exportar');
        return;
    }
    downloadJsonFile(serialNumbers.value);
    ElMessage.success('Arquivo JSON gerado com sucesso!');
};
</script>

<template>
    <el-card shadow="hover" class="result-card h-full flex flex-col">
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="w-1 h-6 bg-green-500 rounded-full"></span>
                    <span class="text-xl font-semibold text-gray-800">Resultado</span>
                </div>
                <el-dropdown split-button type="primary" :icon="Download" @click="downloadTxtSimple"
                    :disabled="serialNumbers.length === 0" size="default">
                    Baixar TXT
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="downloadTxt">Baixar TXT Completo</el-dropdown-item>
                            <el-dropdown-item @click="downloadJson">Baixar JSON</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </template>
        <div class="w-full flex-1 overflow-hidden" v-if="serialNumbers.length > 0">
            <el-table :data="serialNumbers" stripe class="modern-table w-full"
                :empty-text="'Nenhum número gerado ainda'" height="100%">
                <el-table-column prop="ordem" label="Ordem" align="left" header-align="left">
                    <template #default="{ row }">
                        <span class="font-semibold text-gray-700">#{{ row.order }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="numeroSerie" label="Número de Série">
                    <template #default="{ row }">
                        <span class="font-mono text-gray-800">{{ row.serialNumber }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="digitVerifier" label="Dígito Verificador">
                    <template #default="{ row }">
                        <span class="font-mono text-gray-800">{{ row.digitVerifier }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="serialNumberWithDigitVerifier" label="Número de Série com Dígito Verificador">
                    <template #default="{ row }">
                        <span class="font-mono text-gray-800">{{ row.serialNumberWithDigitVerifier }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-else class="text-center text-gray-500 py-12 flex items-center justify-center h-full">
            <div>
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                </svg>
                <p class="text-gray-500">Preencha os campos acima para gerar os números de série</p>
            </div>
        </div>
    </el-card>
</template>

<style scoped>
.result-card {
    display: flex;
    flex-direction: column;
}

.result-card :deep(.el-card__header) {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
}

.result-card :deep(.el-card__body) {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.grid-table {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.modern-table :deep(.el-table__header) {
    background-color: #f8fafc;
}

.modern-table :deep(.el-table__header th) {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    border-bottom: 2px solid #e2e8f0;
}

.modern-table :deep(.el-table__row:hover) {
    background-color: #f1f5f9;
}

.modern-table :deep(.el-table__row--striped) {
    background-color: #fafbfc;
}

.modern-table :deep(.el-table__row--striped:hover) {
    background-color: #f1f5f9;
}

.modern-table :deep(.el-table td) {
    border-bottom: 1px solid #f1f5f9;
}
</style>