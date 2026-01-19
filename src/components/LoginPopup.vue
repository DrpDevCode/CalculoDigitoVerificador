<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';

const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    'login-success': [];
}>();

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const isLoginMode = ref(true);
const loading = ref(false);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const switchMode = () => {
    isLoginMode.value = !isLoginMode.value;
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
};

const handleSubmit = async () => {
    if (!email.value || !password.value) {
        ElMessage.warning('Por favor, preencha todos os campos');
        return;
    }

    if (!isLoginMode.value && password.value !== confirmPassword.value) {
        ElMessage.error('As senhas não coincidem');
        return;
    }

    if (!isLoginMode.value && password.value.length < 6) {
        ElMessage.error('A senha deve ter pelo menos 6 caracteres');
        return;
    }

    loading.value = true;

    try {
        if (isLoginMode.value) {
            // Login
            await signInWithEmailAndPassword(auth, email.value, password.value);
            ElMessage.success('Login realizado com sucesso!');
            emit('login-success');
            dialogVisible.value = false;
        } else {
            // Registro
            await createUserWithEmailAndPassword(auth, email.value, password.value);
            ElMessage.success('Conta criada com sucesso!');
            emit('login-success');
            dialogVisible.value = false;
        }
    } catch (error: any) {
        let errorMessage = 'Erro ao realizar operação';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Usuário não encontrado';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Senha incorreta';
        } else if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Este email já está em uso';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email inválido';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Senha muito fraca';
        }
        
        ElMessage.error(errorMessage);
    } finally {
        loading.value = false;
    }
};

const handleClose = () => {
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    dialogVisible.value = false;
};
</script>

<template>
    <el-dialog
        v-model="dialogVisible"
        :title="isLoginMode ? 'Entrar' : 'Criar Conta'"
        width="400px"
        :close-on-click-modal="false"
        :close-on-press-escape="true"
        @close="handleClose"
        class="login-dialog"
    >
        <div class="login-form">
            <el-form @submit.prevent="handleSubmit" label-position="top">
                <el-form-item label="Email">
                    <el-input
                        v-model="email"
                        type="email"
                        placeholder="seu@email.com"
                        :disabled="loading"
                        size="small"
                    />
                </el-form-item>

                <el-form-item label="Senha">
                    <el-input
                        v-model="password"
                        type="password"
                        placeholder="Digite sua senha"
                        :disabled="loading"
                        size="small"
                        show-password
                    />
                </el-form-item>

                <el-form-item v-if="!isLoginMode" label="Confirmar Senha">
                    <el-input
                        v-model="confirmPassword"
                        type="password"
                        placeholder="Confirme sua senha"
                        :disabled="loading"
                        size="small"
                        show-password
                    />
                </el-form-item>

                <el-form-item>
                    <el-button
                        :type="isLoginMode ? 'primary' : 'success'"
                        :loading="loading"
                        @click="handleSubmit"
                        size="small"
                        class="w-full"
                    >
                        {{ isLoginMode ? 'Entrar' : 'Criar Conta' }}
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="switch-mode">
                <span class="text-sm text-gray-600">
                    {{ isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
                </span>
                <el-button
                    type="primary"
                    link
                    @click="switchMode"
                    :disabled="loading"
                >
                    {{ isLoginMode ? 'Criar conta' : 'Fazer login' }}
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<style scoped>
.login-dialog :deep(.el-dialog__body) {
    padding: 20px 24px;
}

.login-form {
    padding: 10px 0;
}

.login-form :deep(.el-form-item) {
    margin-bottom: 20px;
}

.login-form :deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
    margin-bottom: 8px;
}

.login-form :deep(.el-input__wrapper) {
    border-radius: 8px;
}

.w-full {
    width: 100%;
}

.switch-mode {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e4e7ed;
}
</style>
