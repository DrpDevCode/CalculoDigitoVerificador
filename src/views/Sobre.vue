<script setup lang="ts">
defineProps<{ isLoggedIn?: boolean }>();
</script>

<template>
  <div class="page-wrapper py-8 px-6 mt-16">
    <div class="max-w-3xl mx-auto">
      <el-card shadow="hover" class="page-card">
        <template #header>
          <span class="page-card__title">Sobre</span>
        </template>
        <div class="prose prose-slate">
          <p class="text-gray-600 leading-relaxed mb-4">
            O <strong>Cálculo de Dígito Verificador</strong> é uma ferramenta online para gerar e validar
            dígitos verificadores em números, como os usados em documentos, códigos de barras e
            identificadores.
          </p>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Objetivo</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Facilitar o cálculo de dígitos verificadores por módulo (Módulo 10, Módulo 11, etc.),
            permitindo configurar a quantidade de dígitos, os pesos de cada posição e visualizar o
            resultado em tempo real.
          </p>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Funcionalidades</h2>
          <ul class="list-disc pl-6 text-gray-600 space-y-2 mb-4">
            <li>Configuração flexível de quantidade de dígitos e tipo de módulo</li>
            <li>Definição de pesos por posição</li>
            <li>Geração do dígito verificador a partir do número base</li>
            <li>Validação de números já com dígito verificador</li>
            <li>Salvamento de configurações (com login) para reutilização</li>
          </ul>

          <p class="text-gray-600 leading-relaxed mt-6">
            Desenvolvido com Vue.js e Firebase. Para dúvidas de uso, consulte a página
            <router-link to="/como-usar" class="text-blue-600 hover:underline">Como Usar</router-link>.
          </p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: calc(100vh - 64px);
}

.page-card :deep(.el-card__header) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.page-card :deep(.el-card__body) {
  padding: 1.5rem 1.25rem;
}
</style>
