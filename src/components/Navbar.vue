<script setup lang="ts">

import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { User, InfoFilled } from '@element-plus/icons-vue';

const activeIndex = ref('1');
const isLoggedIn = ref(false);

const handleSelect = (key: string) => {
    if (key === 'about') {
        ElMessage.info('Sobre: Sistema de cálculo de dígito verificador para números de série');
    }
};

const handleLogin = () => {
    if (isLoggedIn.value) {
        isLoggedIn.value = false;
        ElMessage.success('Logout realizado com sucesso');
    } else {
        isLoggedIn.value = true;
        ElMessage.success('Login realizado com sucesso');
    }
};
</script>

<template>
    <el-header class="navbar-header">
        <div class="navbar-container">
            <div class="navbar-left">
                <h1 class="navbar-title">Cálculo de Dígito Verificador</h1>
            </div>
            <div class="navbar-right">
                <el-menu :default-active="activeIndex" class="navbar-menu" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="about">
                        <el-icon>
                            <InfoFilled />
                        </el-icon>
                        <span>Sobre</span>
                    </el-menu-item>
                </el-menu>
                <el-button :type="isLoggedIn ? 'success' : 'primary'" :icon="User" @click="handleLogin"
                    class="login-button">
                    {{ isLoggedIn ? 'Logout' : 'Login' }}
                </el-button>
            </div>
        </div>
    </el-header>
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