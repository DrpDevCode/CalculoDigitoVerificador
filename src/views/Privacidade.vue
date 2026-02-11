<script setup lang="ts">
defineProps<{ isLoggedIn?: boolean }>();
</script>

<template>
  <div class="page-wrapper py-8 px-6 mt-16">
    <div class="max-w-3xl mx-auto">
      <el-card shadow="hover" class="page-card">
        <template #header>
          <span class="page-card__title">Política de Privacidade</span>
        </template>
        <div class="prose prose-slate">
          <p class="text-gray-600 leading-relaxed mb-4">
            Esta política descreve como o <strong>Cálculo de Dígito Verificador</strong> trata os dados
            dos usuários.
          </p>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Dados coletados</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Ao utilizar o login, armazenamos apenas o endereço de e-mail associado à sua conta (Firebase
            Authentication). As configurações salvas (quantidade de dígitos, pesos, etc.) ficam
            vinculadas à sua conta e são armazenadas de forma segura.
          </p>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Uso dos dados</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Os dados são utilizados exclusivamente para autenticação e para permitir que você salve e
            recupere suas configurações. Não vendemos nem compartilhamos seus dados com terceiros para
            fins de marketing.
          </p>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Cookies e armazenamento local</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            O uso de login pode envolver cookies ou armazenamento local para manter sua sessão. Esses
            dados são usados apenas para o funcionamento do serviço.
          </p>

          <h2 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Alterações</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Esta política pode ser atualizada. A data da última alteração será indicada quando
            aplicável. O uso continuado do site após mudanças constitui aceitação da nova versão.
          </p>

          <p class="text-gray-600 leading-relaxed mt-6">
            Em caso de dúvidas, entre em contato através dos canais indicados no site.
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
