<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import LoginPopup from "./LoginPopup.vue";

const isLoggedIn = ref(false);
const showLoginPopup = ref(false);
const userEmail = ref("");

const emit = defineEmits<{
  "login-success": [];
  logout: [];
}>();

const handleLoginClick = () => {
  if (isLoggedIn.value) {
    handleLogout();
  } else {
    showLoginPopup.value = true;
  }
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    isLoggedIn.value = false;
    userEmail.value = "";
    ElMessage.success("Logout realizado com sucesso");
  } catch (error) {
    ElMessage.error("Erro ao fazer logout");
  }
};

const handleLoginSuccess = () => {
  // O estado de autenticação será atualizado pelo onAuthStateChanged
  emit("login-success");
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      userEmail.value = user.email || "";
      emit("login-success");
    } else {
      isLoggedIn.value = false;
      userEmail.value = "";
      emit("logout");
    }
  });
});
</script>

<template>
  <nav class="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
    <div class="mx-auto px-6">
      <div class="flex h-16 items-center justify-between">
        <!-- Nome do site e links -->
        <div class="flex items-center gap-6">
          <router-link
            to="/"
            class="text-xl font-semibold text-gray-800 hover:text-gray-600"
            active-class=""
            exact-active-class=""
          >
            Cálculo de Dígito Verificador
          </router-link>
          <div class="hidden sm:flex items-center gap-1">
            <router-link
              to="/"
              class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
              active-class="!text-blue-600 !bg-blue-50"
            >
              Calculadora
            </router-link>
            <router-link
              to="/como-usar"
              class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
              active-class="!text-blue-600 !bg-blue-50"
            >
              Como Usar
            </router-link>
            <router-link
              to="/sobre"
              class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
              active-class="!text-blue-600 !bg-blue-50"
            >
              Sobre
            </router-link>
            <router-link
              to="/privacidade"
              class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
              active-class="!text-blue-600 !bg-blue-50"
            >
              Privacidade
            </router-link>
          </div>
        </div>

        <!-- Botão de login/logout -->
        <div class="flex items-center gap-3">
          <span v-if="isLoggedIn" class="text-sm text-gray-600">
            {{ userEmail }}
          </span>
          <button
            @click="handleLoginClick"
            :class="[
              'rounded-lg px-4 py-2 text-sm font-medium text-white transition focus:outline-none focus:ring-2',
              isLoggedIn
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            ]"
          >
            {{ isLoggedIn ? "Sair" : "Entrar" }}
          </button>
        </div>

        <!-- Popup de Login -->
        <LoginPopup v-model="showLoginPopup" @login-success="handleLoginSuccess" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-header {
  background: linear-gradient(135deg, #66ea8e 0%, #024302 100%);
  padding: 0;
  height: 64px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 100%;
  padding: 0 24px;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: black;
  margin: 0;
  letter-spacing: -0.5px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar-menu {
  background: transparent;
  border: none;
}

.navbar-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.9);
  border-bottom: none;
}

.navbar-menu :deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.navbar-menu :deep(.el-menu-item.is-active) {
  color: white;
  border-bottom: 2px solid white;
}

.login-button {
  margin-left: 8px;
}
</style>
