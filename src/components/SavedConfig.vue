<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy,
    Timestamp 
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { auth } from '@/services/firebase';
import type { FormConfig, Weights, Config } from '@/composables/interfaces';
import { Delete, Download, Plus, Folder, Search, Clock, Document, Edit } from '@element-plus/icons-vue';

const props = defineProps<{
    modelValue: boolean;
    formConfig: FormConfig | null;
    weights: Weights[];
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    'load-config': [config: { formConfig: FormConfig; weights: Weights[] }];
}>();

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const loading = ref(false);
const saving = ref(false);
const configs = ref<Config[]>([]);
const filteredConfigs = ref<Config[]>([]);
const showSaveDialog = ref(false);
const configName = ref('');
const searchQuery = ref('');
const selectedConfig = ref<Config | null>(null);
const showPreview = ref(false);

const loadConfigs = async () => {
    if (!auth.currentUser) {
        ElMessage.warning('Você precisa estar logado para ver as configurações salvas');
        return;
    }

    loading.value = true;
    try {
        const q = query(
            collection(db, 'configs'),
            where('userId', '==', auth.currentUser.uid),
            orderBy('updatedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        configs.value = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                formConfig: data.formConfig,
                weights: data.weights,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate()
            } as Config;
        });
        filterConfigs();
    } catch (error: any) {
        console.error('Erro ao carregar configurações:', error);
        if (error.code === 'permission-denied') {
            ElMessage.error('Permissão negada. Verifique as regras de segurança do Firestore.');
        } else if (error.code === 'failed-precondition') {
            ElMessage.warning('É necessário criar um índice composto. Verifique o console do navegador para o link.');
            console.log('Link para criar índice:', error.message);
        } else {
            ElMessage.error('Erro ao carregar configurações salvas');
        }
    } finally {
        loading.value = false;
    }
};

const handleSave = async () => {
    if (!auth.currentUser) {
        ElMessage.warning('Você precisa estar logado para salvar configurações');
        return;
    }

    if (!configName.value.trim()) {
        ElMessage.warning('Por favor, informe um nome para a configuração');
        return;
    }

    if (!props.formConfig || !props.weights.length) {
        ElMessage.warning('Não há configuração para salvar');
        return;
    }

    saving.value = true;
    try {
        await addDoc(collection(db, 'configs'), {
            userId: auth.currentUser.uid,
            name: configName.value.trim(),
            formConfig: props.formConfig,
            weights: props.weights,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        ElMessage.success('Configuração salva com sucesso!');
        configName.value = '';
        showSaveDialog.value = false;
        await loadConfigs();
    } catch (error: any) {
        console.error('Erro ao salvar configuração:', error);
        if (error.code === 'permission-denied') {
            ElMessage.error('Permissão negada. Verifique as regras de segurança do Firestore. Consulte o arquivo FIRESTORE_SETUP.md para mais informações.');
        } else {
            ElMessage.error('Erro ao salvar configuração: ' + (error.message || 'Erro desconhecido'));
        }
    } finally {
        saving.value = false;
    }
};

const handleLoad = (config: Config) => {
    emit('load-config', {
        formConfig: config.formConfig,
        weights: config.weights
    });
    ElMessage.success(`Configuração "${config.name}" carregada com sucesso!`);
    dialogVisible.value = false;
};

const handleDelete = async (config: Config) => {
    try {
        await ElMessageBox.confirm(
            `Tem certeza que deseja excluir a configuração "${config.name}"?`,
            'Confirmar exclusão',
            {
                confirmButtonText: 'Excluir',
                cancelButtonText: 'Cancelar',
                type: 'warning',
            }
        );

        await deleteDoc(doc(db, 'configs', config.id));
        ElMessage.success('Configuração excluída com sucesso!');
        await loadConfigs();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('Erro ao excluir configuração:', error);
            if (error.code === 'permission-denied') {
                ElMessage.error('Permissão negada. Verifique as regras de segurança do Firestore.');
            } else {
                ElMessage.error('Erro ao excluir configuração');
            }
        }
    }
};

const openSaveDialog = () => {
    if (!auth.currentUser) {
        ElMessage.warning('Você precisa estar logado para salvar configurações');
        return;
    }
    configName.value = '';
    showSaveDialog.value = true;
};

onMounted(() => {
    if (dialogVisible.value && auth.currentUser) {
        loadConfigs();
    }
});

// Recarregar quando o dialog abrir
const handleDialogOpen = () => {
    if (auth.currentUser) {
        loadConfigs();
    }
};

// Filtrar configurações pela busca
const filterConfigs = () => {
    if (!searchQuery.value.trim()) {
        filteredConfigs.value = configs.value;
        return;
    }
    
    const query = searchQuery.value.toLowerCase().trim();
    filteredConfigs.value = configs.value.filter(config => 
        config.name.toLowerCase().includes(query) ||
        config.formConfig.serialNumber.toLowerCase().includes(query)
    );
};

// Watch para filtrar quando a busca mudar
watch(searchQuery, () => {
    filterConfigs();
});

// Watch para atualizar filtro quando configs mudarem
watch(configs, () => {
    filterConfigs();
}, { deep: true });

// Formatar data relativa
const formatRelativeDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
    if (days < 365) return `${Math.floor(days / 30)} meses atrás`;
    return `${Math.floor(days / 365)} anos atrás`;
};

// Mostrar preview da configuração
const showConfigPreview = (config: Config) => {
    selectedConfig.value = config;
    showPreview.value = true;
};
</script>

<template>
    <el-dialog
        v-model="dialogVisible"
        title="Configurações Salvas"
        width="600px"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        @opened="handleDialogOpen"
        class="saved-config-dialog"
    >
        <div class="saved-config-content">
            <!-- Header com botão de salvar e busca -->
            <div class="config-header">
                <el-button 
                    type="primary" 
                    :icon="Plus" 
                    @click="openSaveDialog"
                    size="small"
                    :disabled="!auth.currentUser || !formConfig || !weights.length"
                >
                    Salvar Configuração Atual
                </el-button>
                
                <el-input
                    v-if="auth.currentUser && configs.length > 0"
                    v-model="searchQuery"
                    placeholder="Buscar configurações..."
                    :prefix-icon="Search"
                    size="small"
                    clearable
                    class="search-input"
                />
            </div>

            <!-- Lista de configurações -->
            <div v-loading="loading" class="configs-list">
                <div v-if="!auth.currentUser" class="empty-state">
                    <el-icon :size="48" class="text-gray-400 mb-3">
                        <Folder />
                    </el-icon>
                    <p class="text-gray-500">Faça login para salvar e gerenciar suas configurações</p>
                </div>

                <div v-else-if="configs.length === 0 && !loading" class="empty-state">
                    <el-icon :size="48" class="text-gray-400 mb-3">
                        <Folder />
                    </el-icon>
                    <p class="text-gray-500">Nenhuma configuração salva ainda</p>
                    <p class="text-sm text-gray-400 mt-2">Salve suas configurações para acessá-las depois</p>
                </div>

                <div v-else-if="filteredConfigs.length === 0" class="empty-state">
                    <el-icon :size="48" class="text-gray-400 mb-3">
                        <Search />
                    </el-icon>
                    <p class="text-gray-500">Nenhuma configuração encontrada</p>
                    <p class="text-sm text-gray-400 mt-2">Tente buscar com outros termos</p>
                </div>

                <div v-else class="configs-grid">
                    <el-card 
                        v-for="config in filteredConfigs" 
                        :key="config.id" 
                        shadow="hover" 
                        class="config-card-item"
                    >
                        <div class="config-card-header">
                            <div class="config-info">
                                <div class="config-title-row">
                                    <h3 class="config-name">
                                        <el-icon class="config-icon"><Document /></el-icon>
                                        {{ config.name }}
                                    </h3>
                                    <el-tag v-if="config.updatedAt" type="info" size="small" class="date-tag">
                                        <el-icon><Clock /></el-icon>
                                        {{ formatRelativeDate(config.updatedAt) }}
                                    </el-tag>
                                </div>
                                
                                <div class="config-badges">
                                    <el-tag size="small" effect="plain">
                                        Série: {{ config.formConfig.serialNumber || 'N/A' }}
                                    </el-tag>
                                    <el-tag size="small" effect="plain">
                                        {{ config.formConfig.qtdRegisters }} registro{{ config.formConfig.qtdRegisters !== 1 ? 's' : '' }}
                                    </el-tag>
                                    <el-tag size="small" effect="plain">
                                        {{ config.formConfig.qtdNumbers }} número{{ config.formConfig.qtdNumbers !== 1 ? 's' : '' }}
                                    </el-tag>
                                    <el-tag v-if="config.formConfig.hasHyphen" size="small" type="success" effect="plain">
                                        Com hífen
                                    </el-tag>
                                </div>
                                
                                <p v-if="config.updatedAt" class="config-date">
                                    Atualizado em {{ config.updatedAt.toLocaleDateString('pt-BR', { 
                                        day: '2-digit', 
                                        month: '2-digit', 
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) }}
                                </p>
                            </div>
                        </div>
                        <div class="config-actions">
                            <el-button 
                                type="primary" 
                                :icon="Download" 
                                @click="handleLoad(config)"
                                size="small"
                            >
                                Carregar
                            </el-button>
                            <el-button 
                                :icon="Document" 
                                @click="showConfigPreview(config)"
                                size="small"
                                link
                            >
                                Detalhes
                            </el-button>
                            <el-button 
                                type="danger" 
                                :icon="Delete" 
                                @click="handleDelete(config)"
                                size="small"
                                link
                            >
                                Excluir
                            </el-button>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>

        <!-- Dialog para salvar nova configuração -->
        <el-dialog
            v-model="showSaveDialog"
            title="Salvar Configuração"
            width="450px"
            append-to-body
        >
            <el-form label-position="top">
                <el-form-item label="Nome da Configuração" required>
                    <el-input
                        v-model="configName"
                        placeholder="Ex: Configuração Padrão"
                        :disabled="saving"
                        size="small"
                        maxlength="50"
                        show-word-limit
                        @keyup.enter="handleSave"
                    />
                </el-form-item>
                <el-form-item label="Preview da Configuração">
                    <div class="preview-box">
                        <p><strong>Série:</strong> {{ formConfig?.serialNumber || 'N/A' }}</p>
                        <p><strong>Registros:</strong> {{ formConfig?.qtdRegisters || 0 }}</p>
                        <p><strong>Números:</strong> {{ formConfig?.qtdNumbers || 0 }}</p>
                        <p><strong>Divisor:</strong> {{ formConfig?.divider || 0 }}</p>
                        <p><strong>Hífen:</strong> {{ formConfig?.hasHyphen ? 'Sim' : 'Não' }}</p>
                        <p><strong>Pesos:</strong> {{ weights.length }} configurado{{ weights.length !== 1 ? 's' : '' }}</p>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showSaveDialog = false" :disabled="saving" size="small">
                    Cancelar
                </el-button>
                <el-button 
                    type="primary" 
                    @click="handleSave" 
                    :loading="saving"
                    size="small"
                >
                    Salvar
                </el-button>
            </template>
        </el-dialog>

        <!-- Dialog de preview da configuração -->
        <el-dialog
            v-model="showPreview"
            title="Detalhes da Configuração"
            width="500px"
            append-to-body
            v-if="selectedConfig"
        >
            <div class="preview-details">
                <div class="detail-section">
                    <h4><el-icon><Document /></el-icon> Informações Gerais</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Nome:</span>
                            <span class="detail-value">{{ selectedConfig.name }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Número de Série:</span>
                            <span class="detail-value">{{ selectedConfig.formConfig.serialNumber || 'N/A' }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Quantidade de Registros:</span>
                            <span class="detail-value">{{ selectedConfig.formConfig.qtdRegisters }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Quantidade de Números:</span>
                            <span class="detail-value">{{ selectedConfig.formConfig.qtdNumbers }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Divisor:</span>
                            <span class="detail-value">{{ selectedConfig.formConfig.divider }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Incluir Hífen:</span>
                            <el-tag :type="selectedConfig.formConfig.hasHyphen ? 'success' : 'info'" size="small">
                                {{ selectedConfig.formConfig.hasHyphen ? 'Sim' : 'Não' }}
                            </el-tag>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><el-icon><Edit /></el-icon> Pesos Configurados</h4>
                    <div class="weights-preview">
                        <div 
                            v-for="(weight, index) in selectedConfig.weights" 
                            :key="index"
                            class="weight-item"
                        >
                            <span class="weight-position">Posição {{ weight.position }}:</span>
                            <el-tag size="small" type="primary">{{ weight.weight }}</el-tag>
                        </div>
                    </div>
                </div>

                <div class="detail-section" v-if="selectedConfig.createdAt || selectedConfig.updatedAt">
                    <h4><el-icon><Clock /></el-icon> Datas</h4>
                    <div class="detail-grid">
                        <div class="detail-item" v-if="selectedConfig.createdAt">
                            <span class="detail-label">Criado em:</span>
                            <span class="detail-value">{{ selectedConfig.createdAt.toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) }}</span>
                        </div>
                        <div class="detail-item" v-if="selectedConfig.updatedAt">
                            <span class="detail-label">Atualizado em:</span>
                            <span class="detail-value">{{ selectedConfig.updatedAt.toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <el-button @click="showPreview = false" size="small">
                    Fechar
                </el-button>
                <el-button 
                    type="primary" 
                    :icon="Download"
                    @click="handleLoad(selectedConfig); showPreview = false"
                    size="small"
                >
                    Carregar Configuração
                </el-button>
            </template>
        </el-dialog>
    </el-dialog>
</template>

<style scoped>
.saved-config-dialog :deep(.el-dialog__body) {
    padding: 20px 24px;
}

.saved-config-content {
    min-height: 200px;
}

.config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.search-input {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
}

.configs-list {
    height: 600px;
    overflow-y: auto;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
}

.configs-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    padding-right: 4px;
}

.configs-grid::-webkit-scrollbar {
    width: 6px;
}

.configs-grid::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.configs-grid::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.configs-grid::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

.config-card-item {
    transition: all 0.3s;
    border: 1px solid #ebeef5;
}

.config-card-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #409eff;
}

.config-card-item :deep(.el-card__body) {
    padding: 16px;
}

.config-card-header {
    margin-bottom: 12px;
}

.config-info {
    flex: 1;
}

.config-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    gap: 12px;
}

.config-name {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.config-icon {
    color: #409eff;
}

.date-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    vertical-align: middle;
}

.date-tag :deep(.el-icon) {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    line-height: 1;
}

.config-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
}

.config-date {
    font-size: 12px;
    color: #909399;
    margin: 8px 0 0 0;
}

.config-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
}

.preview-box {
    background: #f5f7fa;
    border-radius: 4px;
    padding: 12px;
    font-size: 13px;
    line-height: 1.8;
}

.preview-box p {
    margin: 4px 0;
    color: #606266;
}

.preview-details {
    max-height: 500px;
    overflow-y: auto;
}

.detail-section {
    margin-bottom: 24px;
}

.detail-section:last-child {
    margin-bottom: 0;
}

.detail-section h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #ebeef5;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-label {
    font-size: 12px;
    color: #909399;
    font-weight: 500;
}

.detail-value {
    font-size: 14px;
    color: #303133;
}

.weights-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 4px;
}

.weight-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 6px 8px;
    background: white;
    border-radius: 4px;
    font-size: 13px;
}

.weight-position {
    color: #606266;
    font-weight: 500;
}

@media (max-width: 768px) {
    .config-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .search-input {
        max-width: 100%;
    }
    
    .config-title-row {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .detail-grid {
        grid-template-columns: 1fr;
    }
}
</style>
