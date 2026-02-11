<script setup lang="ts">
import { ref } from 'vue';

import Navbar from '@/components/Navbar.vue';

const isLoggedIn = ref(false);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <Navbar @login-success="isLoggedIn = true" @logout="isLoggedIn = false" />

    <router-view v-slot="{ Component }">
      <component :is="Component" :isLoggedIn="isLoggedIn" />
    </router-view>
  </div>
</template>
