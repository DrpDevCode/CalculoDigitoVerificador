<script setup lang="ts">
defineProps<{ isLoggedIn?: boolean }>();
</script>

<template>
  <div class="page-wrapper py-8 px-6 mt-16">
    <div class="max-w-3xl mx-auto">
      <el-card shadow="hover" class="page-card">
        <template #header>
          <span class="page-card__title">Como Usar</span>
        </template>
        <div class="prose prose-slate">
          <p class="text-gray-600 leading-relaxed mb-4">
            Siga os passos abaixo para calcular ou validar dígitos verificadores.
          </p>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">1. Configurações</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Na seção <strong>Configurações</strong>, defina:
          </p>
          <ul class="list-disc pl-6 text-gray-600 space-y-2 mb-4">
            <li><strong>Quantidade de dígitos:</strong> total de dígitos do número (incluindo o dígito verificador, se houver)</li>
            <li><strong>Módulo:</strong> tipo de cálculo (ex.: Módulo 10, Módulo 11)</li>
            <li><strong>Posição do dígito verificador:</strong> em qual posição o dígito aparece (ex.: último)</li>
          </ul>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">2. Pesos</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Na seção <strong>Pesos</strong>, informe o peso de cada posição do número. Os pesos são
            usados no cálculo do dígito verificador (geralmente da direita para a esquerda ou conforme
            a regra do módulo).
          </p>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">3. Calcular dígito verificador</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Digite o número <strong>sem</strong> o dígito verificador no campo indicado. O sistema
            calculará o dígito e exibirá o número completo e o resultado da validação.
          </p>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">4. Validar número</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Para validar um número que já possui dígito verificador, digite o número completo. O
            sistema recalculará o dígito e informará se o número é válido ou não.
          </p>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">5. Salvar configurações (opcional)</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Faça login para salvar suas configurações e pesos. Assim você pode reutilizá-las depois
            sem precisar preencher tudo novamente.
          </p>

          <p class="text-gray-600 leading-relaxed mt-6">
            Para mais informações sobre o projeto, veja a página
            <router-link to="/sobre" class="text-blue-600 hover:underline">Sobre</router-link>.
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
